"use server";

import mongoose, { InsertManyResult, UpdateResult } from "mongoose";
import connectToDb from "@/backend/config/connectDb";
import { datasetsSchema } from "@/backend/models/datasets";
import { categoriesSchema } from "@/backend/models/categories";
import { Link, linksSchema } from "@/backend/models/links";
import { parseDatasetSlug } from "@/utils";
import { DatasetFormData } from "@/schema";
import { entriesSchema } from "@/backend/models/databases";
import { getUser } from "./user";
import { DatasetInfo } from "@/types";

function getModel({
  connection,
  name,
  schema,
}: {
  connection: mongoose.Connection;
  name: string;
  schema: mongoose.Schema;
}) {
  return connection.models[name] || connection.model(name, schema);
}

/**
 * Retrieve all datasets, optionally filtered by a category.
 * @param category The category to filter by, or null/undefined for all datasets.
 * @returns An object with two properties: `datasets`, an array of `DatasetMeta`s,
 * and `categories`, an array of strings of all categories.
 */
export async function getDatasets(category: string | null) {
  const connection = await connectToDb();

  const query = getModel({
    connection,
    name: "datasets",
    schema: datasetsSchema,
  });

  let datasets;

  if (category && category !== "All" && category !== "undefined") {
    datasets = await query.find({ category });
  } else {
    datasets = await query.find();
  }

  const users = await Promise.all(
    datasets.map((dataset) => getUser(dataset.user_id)),
  );

  datasets = datasets.map((dataset, index) => {
    const plainDataset = dataset.toObject();

    const fullDataset = {
      ...plainDataset,
      _id: plainDataset._id.toString(),
      user: users[index],
    };

    return fullDataset as DatasetInfo;
  });

  const categoriesModel = getModel({
    connection,
    name: "categories",
    schema: categoriesSchema,
  });

  const categories = (await categoriesModel.find()).map(
    (category) => category.category,
  );

  return { datasets, categories };
}

/**
 * Retrieve a dataset by its name.
 * @param name The name of the dataset to retrieve.
 * @returns The dataset in the format of `DatasetInfo` or `null` if the dataset does not exist.
 */
export async function getDataset(name: string) {
  const datasetsConnection = await connectToDb();

  const datasetModel = getModel({
    connection: datasetsConnection,
    name: "datasets",
    schema: datasetsSchema,
  });

  const dataset = await datasetModel.findOne({ name });

  if (!dataset) return;

  const secondaryDataConn = await connectToDb(dataset.database);

  const metaDataModel =
    secondaryDataConn.models.meta_data ||
    secondaryDataConn.model(
      "meta_data",
      new mongoose.Schema(
        {
          updated_at: {
            type: String,
          },
        },
        { collection: "meta_data" },
      ),
    );

  const sampleModel = getModel({
    connection: secondaryDataConn,
    name: dataset.sample_collection,
    schema: new mongoose.Schema(
      {},
      { collection: dataset.sample_collection, strict: false },
    ),
  });

  const [metaData, sample, totalDocuments] = await Promise.all([
    await metaDataModel.findOne(),
    await sampleModel.find().limit(20).select({ _id: 0 }),
    await sampleModel.countDocuments(),
  ]);

  const fullDataset = {
    ...dataset.toJSON(),
    _id: dataset.id,
    sample: sample.map((s) => s.toJSON()),
    updated_at: metaData ? metaData.updated_at : "Unknown",
    format: ["CSV"],
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
  const connection = await connectToDb();

  const linksModel = getModel({
    connection,
    name: "links",
    schema: linksSchema,
  });

  const link = (await linksModel.findById(id)) as Link | null;

  return link;
}

/**
 * Create a new dataset. If the dataset already exists, throw an error.
 *
 * @param name The name of the dataset to create.
 * @returns The slug version of the dataset name.
 * @throws If the dataset already exists.
 */
export async function createDataset(
  user_id: string,
  dsFormData: DatasetFormData,
) {
  if (!user_id) return;

  const { name } = dsFormData;

  const datasetsConnection = await connectToDb();

  const DatasetModel = getModel({
    connection: datasetsConnection,
    name: "datasets",
    schema: datasetsSchema,
  });

  const exists = await DatasetModel.findOne({ name, user_id }).collation({
    locale: "en",
    strength: 2,
  });

  if (exists) {
    await DatasetModel.updateOne(
      { _id: exists._id },

      {
        $set: {
          ...dsFormData,
          status: dsFormData.publish ? "published" : "pending",
        },
      },
    );
  } else {
    await DatasetModel.create({
      ...dsFormData,
      user_id,
      status: dsFormData.publish ? "published" : "pending",
    });
  }

  await createEntry({
    user_id,
    sample_collection: dsFormData.sample_collection,
    database: dsFormData.database,
  });

  return parseDatasetSlug(name);
}

/**
 * Saves the created data to the specified database and column
 *
 * @param db - The name of the database to connect to.
 * @param collection - The name of the collection from which to fetch documents.
 * @param data - the data to save
 */
export const saveData = async ({
  db,
  collection,
  inserts,
  updates,
}: {
  db: string;
  collection: string;
  inserts: Record<string, unknown>[];
  updates: Record<string, unknown>[];
}) => {
  const conn = await connectToDb(db);

  if (!conn.db) throw new Error("Database connection failed");

  const dbCollection = conn.db.collection(collection);

  const queue: Array<
    Promise<InsertManyResult<(typeof inserts)[number]> | UpdateResult>
  > = [];

  if (inserts.length > 0) {
    queue.push(dbCollection.insertMany(inserts));
  }

  for (const doc of updates) {
    const _id = doc._id as string;

    const newData = { ...doc };

    delete newData._id;

    queue.push(
      dbCollection.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        { $set: newData },
      ),
    );
  }

  await Promise.all(queue);
};

/**
 * Adds or updates the database entries for the user
 *
 * @param entries - The entries object to be updated
 */
export const createEntry = async ({
  user_id,
  database,
  sample_collection,
}: Pick<DatasetFormData, "database" | "sample_collection"> & {
  user_id: string;
}) => {
  const entriesConnection = await connectToDb("databases");

  const EntriesModel = getModel({
    connection: entriesConnection,
    name: "entries",
    schema: entriesSchema,
  });

  const exists = await EntriesModel.findOne({
    user_id,
    database,
  });

  if (exists && !exists.collections.includes(sample_collection)) {
    await EntriesModel.findOneAndUpdate(exists._id, {
      collections: [...exists.collections, sample_collection],
    });
  }

  if (!exists) {
    await EntriesModel.create({
      user_id,
      database,
      collections: [sample_collection],
    });
  }
};

/**
 * Get dataset info from the collection and database
 *
 * @param database - the current database
 * @param collection - the current collection
 *
 * @returns The dataset info
 */
export const getDatasetInfo = async ({
  database,
  collection,
}: {
  database: string;
  collection: string;
}) => {
  const datasetsConnection = await connectToDb("datasets");

  const DatasetModel = getModel({
    connection: datasetsConnection,
    name: "datasets",
    schema: datasetsSchema,
  });

  const info = await DatasetModel.findOne({
    database,
    sample_collection: collection,
  });

  return info ? { ...info.toJSON(), _id: info._id.toString() } : null;
};

/**
 * Delete collection row
 *
 * @param database - the current database
 * @param collection - the current collection
 * @param id - the current document id
 *
 */
export const deleteDocument = async ({
  database,
  collection,
  id,
}: {
  database: string;
  collection: string;
  id: string;
}) => {
  const conn = await connectToDb(database);

  if (!conn.db) throw new Error("Database connection failed");

  await conn.db
    .collection(collection)
    .deleteOne({ _id: new mongoose.Types.ObjectId(id) });
};

/**
 * Deletes dataset information for a specific database and collection.
 *
 * @param params.database - The name of the database.
 * @param params.collection - The name of the collection.
 *
 * @returns A promise that resolves when the dataset is deleted.
 */
export const deleteDataset = async ({
  database,
  collection,
}: {
  database: string;
  collection: string;
}) => {
  const info = await getDatasetInfo({ database, collection });

  if (info) {
    const datasetsConnection = await connectToDb("datasets");

    const DatasetModel = getModel({
      connection: datasetsConnection,
      name: "datasets",
      schema: datasetsSchema,
    });

    await DatasetModel.deleteOne({ _id: info._id });
  }
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
export const deleteCollection = async ({
  database,
  collection,
}: {
  database: string;
  collection: string;
}) => {
  const conn = await connectToDb(database);

  if (!conn.db) throw new Error("Database connection failed");

  await Promise.all([
    deleteDataset({ database, collection }),
    conn.db.collection(collection).drop(),
  ]);
};

/**
 * Deletes an entire database along with associated metadata and collections.
 *
 * @param params - The parameters for the operation.
 * @param params.database - The name of the database.
 * @param params.collection - The name of the collection.
 * @param params.user_id - The ID of the user owning the database.
 *
 * @returns A promise that resolves when the database and associated resources are deleted.
 *
 */
export const deleteDatabase = async ({
  database,
  collection,
  user_id,
}: {
  user_id: string;
  database: string;
  collection: string;
}) => {
  const [mainDbConnection, entriesConnection] = await Promise.all([
    connectToDb(database),
    connectToDb("databases"),
  ]);

  if (!mainDbConnection.db || !entriesConnection.db) {
    throw new Error("Database connection failed");
  }

  const EntriesModel = getModel({
    connection: entriesConnection,
    name: "entries",
    schema: entriesSchema,
  });

  await Promise.all([
    deleteDataset({ database, collection }),
    deleteCollection({ database, collection }),
    mainDbConnection.db.dropDatabase(),
    EntriesModel.findOneAndDelete({
      user_id,
      database,
    }),
  ]);
};
