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
        datasets = await CollectionModel.find({ category });
    } else {
        datasets = await CollectionModel.find();
    }

    const users = await Promise.all(
        datasets.map((dataset) => getUser(dataset.user_id))
    );

    datasets = datasets.map((dataset, index) => {
        const plainDataset = dataset.toObject();

        const fullDataset = {
            ...plainDataset,
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
 * Retrieve a dataset by its name.
 * @param name The name of the dataset to retrieve.
 * @returns The dataset in the format of `DatasetInfo` or `null` if the dataset does not exist.
 */
export async function getDataset(slug: string) {
    await connectToDb();

    const dataset = await CollectionModel.findOne({ slug });

    if (!dataset) return;

    const [sample, totalDocuments] = await Promise.all([
        DocumentModel.find({ collection: dataset._id })
            .limit(20)
            .select({ _id: 0 }),

        DocumentModel.countDocuments({ collection: dataset._id }),
    ]);

    const fullDataset = {
        ...dataset.toJSON(),
        sample,
        _id: dataset.id,
        updated_at: dataset.updatedAt,
        format: ['CSV'],
        total: totalDocuments,
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
    await DatabaseModel.create(data);
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
    data,
}: {
    database: string;
    collection: string;
    data: Record<string, unknown>[];
}) => {
    await connectToDb();

    const user = await currentUser();

    if (!user) return;

    await Promise.all(
        data.map((d) =>
            DocumentModel.findOneAndUpdate(
                d,
                {
                    database,
                    collection,
                    user_id: user.id,
                    data: d,
                },
                { upsert: true }
            )
        )
    );
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
 * @param params.database - The name of the database.
 * @param params.collection - The name of the collection.
 *
 * @returns A promise that resolves when the dataset is deleted.
 */
export const dropDatabase = async (db: string) => {
    await connectToDb();
};

/**
 * Deletes a collection from a specific database.
 *
 * @param params - The parameters for the operation.
 * @param params.database - The name of the database.
 * @param params.collection - The name of the collection.
 *
 * @returns A promise that resolves when the collection is deleted.
 */
export const dropCollection = async (collection: string) => {
    await connectToDb();
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
    page: string
) => {
    await connectToDb();

    const [data, count,] = await Promise.all([
        DocumentModel.find({ database, collection })
            .limit(10)
            .skip(parseInt(page) * 10),
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
export const createCollecion = async (data: CreateCollectionData) => {
    await connectToDb();

    const collection = await CollectionModel.create(data);

    return collection.id;
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
