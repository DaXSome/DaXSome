import mongoose from 'mongoose';

const embeddingSchema = new mongoose.Schema(
    {
        collection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection',
        },
        model: {
            type: String,
            required: true,
        },
        embedding: [{ type: Number }],
    },
    { timestamps: true }
);

export const EmbeddingsModel =
    mongoose.models.Embedding || mongoose.model('Embedding', embeddingSchema);
