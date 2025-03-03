'use server';

import mongoose from 'mongoose';
import connectToDb from '@/backend/config/connectDb';
import { CategoriesModel } from '@/backend/models/categories';
import { Link, LinkModel } from '@/backend/models/links';
import { getUser } from './user';
import { DatasetInfo } from '@/types';
import { Collection, CollectionModel } from '@/backend/models/collections';
import { DocumentModel } from '@/backend/models/documents';
import { currentUser } from '@clerk/nextjs/server';
import { Database, DatabaseModel } from '@/backend/models/databases';
import { DocumentSchema, DocumentSchemaModel } from '@/backend/models/schema';
import { jsonToCsv, parseDatasetSlug } from '@/utils';
import { uploadFile } from './storage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingsModel } from '@/backend/models/embedding';

/**
 * Retrieve all datasets, optionally filtered by a category.
 * @param category The category to filter by, or null/undefined for all datasets.
 * @returns An object with two properties: `datasets`, an array of `DatasetMeta`s,
 * and `categories`, an array of strings of all categories.
 */
export async function getDatasets(category: string | null) {
    await connectToDb();

    let datasets;

    if (category && category !== 'All' && category !== 'undefined') {
        datasets = await CollectionModel.find({
            category,
            'metadata.status': 'Published',
        });
    } else {
        datasets = await CollectionModel.find({
            'metadata.status': 'Published',
        });
    }

    const users = await Promise.all(
        datasets.map((dataset) => getUser(dataset.user_id))
    );

    datasets = datasets.map((dataset, index) => {
        const plainDataset = dataset.toObject();

        const fullDataset = {
            ...plainDataset,
            database: plainDataset.database.toString(),
            _id: plainDataset._id.toString(),
            user: users[index],
        };

        return fullDataset as unknown as DatasetInfo;
    });

    const categories = (await CategoriesModel.find()).map(
        (category) => category.category
    );

    return { datasets, categories };
}

/**
 * Retrieve 4 recent datasets as featured datasets
 * @returns An object with two properties: `datasets`, an array of `DatasetMeta`s,
 */
export async function getFeaturedDatasets() {
    await connectToDb();

    let datasets = await CollectionModel.find(
        {
            'metadata.status': 'Published',
        },
        {},
        { limit: 4, sort: { updatedAt: -1 } }
    );

    const users = await Promise.all(
        datasets.map((dataset) => getUser(dataset.user_id))
    );

    datasets = datasets.map((dataset, index) => {
        const plainDataset = dataset.toObject();

        const fullDataset = {
            ...plainDataset,
            database: plainDataset.database.toString(),
            _id: plainDataset._id.toString(),
            user: users[index],
        };

        return fullDataset as unknown as DatasetInfo;
    });

    return datasets;
}

/**
 * Retrieve a dataset by its name.
 * @param name The name of the dataset to retrieve.
 * @returns The dataset in the format of `DatasetInfo` or `null` if the dataset does not exist.
 */
export async function getDataset(slug: string) {
    await connectToDb();

    const dataset = await CollectionModel.findOne<Collection>({ slug });

    if (!dataset) return;

    const [sample, totalDocuments] = await Promise.all([
        DocumentModel.find({ collection: dataset._id })
            .limit(20)
            .select({ _id: 0 }),

        DocumentModel.countDocuments({ collection: dataset._id }),
    ]);

    const fullDataset = {
        ...(dataset.toJSON() as Collection),
        sample: sample.map((s) => s.data),
        database: dataset.database.toString(),
        _id: dataset.id,
        updated_at: dataset.updatedAt,
        format: ['CSV'],
        total: totalDocuments,
        schema: await getDocumentSchema({
            database: dataset.database as unknown as string,
            collection: dataset.id as string,
        }),
    };

    return fullDataset;
}

/**
 * Retrieves an alternative shortened link from the database using the provided link ID.
 *
 * @param id - The ID of the link to retrieve.
 * @returns A Promise that resolves to a Link object if found, or null if not found.
 */
export async function getAltLink(id: string) {
    await connectToDb();

    const link = (await LinkModel.findById(id)) as Link | null;

    return link;
}

/**
 * Create a new database
 *
 * @param data Which contains the user_id, name and metaData from the Database model
 * @returns The slug version of the dataset name.
 */
export async function createDatabase(
    data: Pick<Database, 'user_id' | 'name' | 'metadata'>
) {
    const db = await DatabaseModel.create(data);

    return db.id;
}

export async function updateDatabaseName(id: string, name: string) {
    await DatabaseModel.findOneAndUpdate({ _id: id }, { name });
}

/**
 * Saves the created data to the specified database and column
 *
 * @param db - The name of the database to connect to.
 * @param collection - The name of the collection from which to fetch documents.
 * @param data - the data to save
 */
export const saveData = async ({
    database,
    collection,
    hostname,
    data,
}: {
    database: string;
    collection: string;
    hostname: string;
    data: Record<string, unknown>[];
}) => {
    await connectToDb();

    const user = await currentUser();

    if (!user) return;

    const filename = `${hostname}/${user.id}/${database}/${collection}-${Date.now()}.csv`;

    const sanitizedData = data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ database, collection, user_id, _id, ...rest }) => rest
    );

    await Promise.all([
        ...data.map((d) =>
            DocumentModel.findOneAndUpdate(
                { _id: d._id || new mongoose.Types.ObjectId() },
                {
                    database,
                    collection,
                    user_id: user.id,
                    data: d,
                },
                { upsert: true, strict: false }
            )
        ),
        uploadFile({
            csv: jsonToCsv(sanitizedData),
            filename,
        }),
        CollectionModel.updateOne(
            { _id: collection },
            {
                $set: {
                    asset_url: `https://daxsome.seveightech.com/${filename}`,
                },
            }
        ),
    ]);
};

/**
 * Delete collection row
 *
 * @param database - the current database
 * @param collection - the current collection
 * @param id - the current document id
 *
 */
export const deleteDocument = async (id: string) => {
    await connectToDb();

    await DocumentModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
    });
};

/**
 * Deletes dataset information for a specific database and collection.
 *
 * @param {String} id - The id of the database.
 * @param params.collection - The name of the collection.
 *
 */
export const dropDatabase = async (id: string) => {
    await connectToDb();

    await Promise.all([
        DocumentModel.deleteMany({ database: id }),
        CollectionModel.deleteMany({ database: id }),

        DatabaseModel.findByIdAndDelete(id),
    ]);
};

/**
 * Deletes a collection from a specific database.
 *
 * @param {String} id - The id of the collection
 *
 * @returns A promise that resolves when the collection is deleted.
 */
export const dropCollection = async (id: string) => {
    await connectToDb();

    await Promise.all([
        DocumentModel.deleteMany({ collection: id }),

        CollectionModel.findByIdAndDelete(id),
    ]);
};

/**
 * Given a Clerk user ID, returns a list of databases that belong to that user.
 * @returns An array of objects with `user_id` and `database` properties.
 */
export async function getUserDbs() {
    await connectToDb();

    const user = await currentUser();

    if (!user) return;

    const databases = await DatabaseModel.find<Database>({ user_id: user.id });

    const fmttedDbs = await Promise.all(
        databases.map(async (db) => ({
            id: db.id,
            name: db.name,
            createdAt: db.createdAt,
            collections: (await getCollections(db.id)).map(
                (collection) => collection._id as string
            ),
        }))
    );

    return fmttedDbs;
}

/**
 * Returns an array of strings representing the names of all collections
 * in a given MongoDB database.
 * @param db The name of the database.
 * @returns An array of strings.
 */
export const getCollections = async (db: string) => {
    await connectToDb();

    const collections = await CollectionModel.find<Collection>({
        database: db,
    });

    const fmttedCols = collections.map((col, index) => {
        const plainObj = col.toObject();

        delete plainObj.database;

        return {
            ...plainObj,
            _id: plainObj._id.toString(),
            name: plainObj.name || `Untitled ${index + 1}`,
        };
    });

    return fmttedCols as Collection[];
};

/**
 * Retrieves a limited set of documents from a specified collection within a MongoDB database.
 *
 * @param db - The name of the database to connect to.
 * @param collection - The name of the collection from which to fetch documents.
 * @returns An object containing:
 *  - `data`: An array of documents from the collection, each with its `_id` field converted to a string.
 *  - `count`: The total number of documents in the collection.
 */
export const getData = async (
    database: string,
    collection: string,
    page: number
) => {
    await connectToDb();

    const [data, count] = await Promise.all([
        DocumentModel.find({ database, collection })
            .limit(10)
            .skip(page * 10),
        DocumentModel.countDocuments({ database, collection }),
    ]);

    return {
        data: data.map((document) => ({
            database: document.database.toString(),
            collection: document.database.toString(),
            user_id: document.user_id,
            _id: document._id.toString(),
            ...document.data,
        })) as Record<string, unknown>[],
        count,
    };
};

interface CreateDocumentSchemaData
    extends Omit<
        DocumentSchema,
        'updatedAt' | 'createdAt' | 'database' | 'schema'
    > {
    database: string;
    schema: {
        name: string;
        type: DocumentSchema['schema'][number]['type'];
    }[];
}

/**
 * Returns an array of strings representing the names of all collections
 * in a given MongoDB database.
 * @param db The name of the database.
 * @returns An array of strings.
 */
export const createDocumentSchema = async (data: CreateDocumentSchemaData) => {
    await connectToDb();

    const exists = await DocumentSchemaModel.exists({
        collection: new mongoose.Types.ObjectId(data.collection),
    });

    if (!exists) {
        await DocumentSchemaModel.create(data);
    } else {
        await DocumentSchemaModel.updateOne(
            { _id: exists._id },
            { $set: data }
        );
    }
};

interface CreateCollectionData extends Partial<Omit<Collection, 'database'>> {
    database: string;
}

/**
 * Returns an array of strings representing the names of all collections
 * in a given MongoDB database.
 * @param db The name of the database.
 * @returns An array of strings.
 */
export const createCollecion = async (
    data: CreateCollectionData,
    colId?: string | null
) => {
    const [user] = await Promise.all([
        getUser(data.user_id as string),
        connectToDb(),
    ]);

    const slug = parseDatasetSlug(`${data.metadata?.title} ${user.username}`);

    if (!colId) {
        const collection = await CollectionModel.create({ ...data, slug });

        return collection.id;
    } else {
        await CollectionModel.updateOne(
            { _id: colId },
            { $set: { ...data, slug } }
        );

        return colId;
    }
};

/**
 * Retrieves the schema of a specific collection
 *
 * @param {Object} params - The parameters for retrieving the schema.
 * @param {string} params.database - The name of the database.
 * @param {string} params.collection - The name of the collection.
 * @returns {Array<{ name: string, type: string }> | undefined} An array of schema field definitions or `undefined` if not found.
 */
export const getDocumentSchema = async ({
    database,
    collection,
}: {
    database: string;
    collection: string;
}) => {
    await connectToDb();

    const schema = await DocumentSchemaModel.findOne<DocumentSchema>({
        database,
        collection,
    });

    if (schema) {
        return schema.schema.map(({ name, type }) => ({ name, type }));
    }
};

/**
 * Returns a database based on the id
 *
 * @param {string} id - the id of the database
 * @returns {{name:string}} The database object
 */
export const getDatabase = async (id: string) => {
    await connectToDb();

    const db = await DatabaseModel.findById<Database>(id);

    if (db) {
        return { name: db.name, _id: db.id };
    }
};

/**
 * Return a collection based on the ID
 * @param db The name of the database.
 * @returns An array of strings.
 */
export const getCollection = async (id: string) => {
    await connectToDb();

    const collection = await CollectionModel.findById<Collection>(id);

    if (!collection) return;

    const plainObj = collection.toObject();

    delete plainObj.database;

    return {
        ...plainObj,
        _id: plainObj._id.toString(),
    };
};

/**
 * Performs an NLP-based search using an embedding model.
 *
 * @param {string} prompt - The search query input by the user.
 * @returns {Promise<DatasetInfo[]>} - A promise that resolves to an array of dataset information.
 */
export const NLPSearch = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: 'embedding-001' });

    const result = await model.embedContent({
        content: {
            role: 'user',
            parts: [{ text: prompt }],
        },
    });

    const embedding = result.embedding.values;

    const results = await EmbeddingsModel.aggregate([
        {
            $vectorSearch: {
                index: 'collection_embeddings_index',
                path: 'embedding',
                queryVector: embedding,
                numCandidates: 100,
                limit: 10,
            },
        },
        {
            $lookup: {
                from: 'collections',
                localField: 'collection',
                foreignField: '_id',
                as: 'collection',
            },
        },
        {
            $unwind: '$collection',
        },
    ]);

    const collections = results.map((res) => res.collection);

    const users = await Promise.all(
        collections.map((dataset) => getUser(dataset.user_id))
    );

    const datasets = collections.map((dataset, index) => {
        const fullDataset = {
            ...dataset,
            database: dataset.database.toString(),
            _id: dataset._id.toString(),
            user: users[index],
        };

        return fullDataset as unknown as DatasetInfo;
    });

    return datasets;
};
