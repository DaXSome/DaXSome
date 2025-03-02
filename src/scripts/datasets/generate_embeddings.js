import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

const envPath = '.env.dev';

config({ path: envPath });

const MONGO_URI = process.env.DB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'embedding-001' });

const embeddingSchema = new mongoose.Schema({
    dataset_id: mongoose.Schema.Types.ObjectId,
    model: String,
    embedding: [Number],
    created_at: { type: Date, default: Date.now },
});

const documentSchemaModel = new mongoose.Schema(
    {
        collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    },
    { strict: false }
);

const collectionSchema = new mongoose.Schema({}, { strict: false });

const Embedding = mongoose.model('Embedding', embeddingSchema);
const DocumentSchemaModel = mongoose.model(
    'DocumentSchemaModel',
    documentSchemaModel
);

mongoose.model('Collection', collectionSchema);

async function generateEmbedding(text) {
    try {
        const result = await model.embedContent({
            content: {
                role: 'user',
                parts: [{ text }],
            },
        });

        return result.embedding.values;
    } catch (error) {
        console.error('❌ Error generating embedding:', error);
        return null;
    }
}

async function processDatasets() {
    await mongoose.connect(MONGO_URI, { dbName: 'entries' });

    const datasets = await DocumentSchemaModel.find({}).populate('collection');

    for (const dataset of datasets) {
        if (!dataset.collection) continue;

        const metadata = dataset.collection.metadata;

        const exists = await Embedding.findOne({ dataset_id: dataset._id });

        if (exists) {
            console.log(
                `✅ Dataset '${metadata.title}' already has an embedding. Skipping...`
            );
            continue;
        }

        console.log(`🔹 Generating embedding for: ${metadata.title}`);


        const schemaSummary = dataset.schema
            .map((s) => `${s.name} (${s.type})`)
            .join(', ');

        const textToEmbed = `
            ${metadata.title}.
            ${metadata.description || ''}.
            ${metadata.full_description || ''}.
            Schema: ${schemaSummary}.
            Tags: ${metadata.tags?.join(', ') || ''}.
        `.trim();

        const embedding = await generateEmbedding(textToEmbed);

        if (embedding) {
            await Embedding.create({
                dataset_id: dataset._id,
                model: 'gemini-embedding-001',
                embedding,
            });
            console.log(`✅ Saved embedding for '${dataset.title}'`);
        }
    }

    console.log('🎉 All embeddings generated!');
    await mongoose.disconnect();
}

processDatasets().catch(console.error);
