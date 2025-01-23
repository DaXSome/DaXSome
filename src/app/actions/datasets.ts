"use server";

import mongoose from "mongoose";
import connectToDb from "@/backend/config/connectDb";
import { datasetsSchema } from "@/backend/models/datasets";
import { categoriesSchema } from "@/backend/models/categories";
import { Link, linksSchema } from "@/backend/models/links";
import { parseDatasetSlug } from "@/utils";
import { DatasetFormData } from "@/schema";
import { entriesSchema } from "@/backend/models/databases";
import { getUser } from "./user";
import { DatasetInfo } from "@/types";

/**
 * Retrieve all datasets, optionally filtered by a category.
 * @param category The category to filter by, or null/undefined for all datasets.
 * @returns An object with two properties: `datasets`, an array of `DatasetMeta`s,
 * and `categories`, an array of strings of all categories.
 */
export async function getDatasets(category: string | null) {
  const connection = await connectToDb();

  const query = connection.model("datasets", datasetsSchema);

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

  const categories = (
    await connection.model("categories", categoriesSchema).find()
  ).map((category) => category.category);

  return { datasets, categories };
}

/**
 * Retrieve a dataset by its name.
 * @param name The name of the dataset to retrieve.
 * @returns The dataset in the format of `DatasetInfo` or `null` if the dataset does not exist.
 */
export async function getDataset(name: string) {
  const datasetsConnection = await connectToDb();

  const datasetModel =
    datasetsConnection.models.datasets ||
    datasetsConnection.model("datasets", datasetsSchema);

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

  const sampleModel =
    secondaryDataConn.models[dataset.sample_collection] ||
    secondaryDataConn.model(
      dataset.sample_collection,
      new mongoose.Schema(
        {},
        { collection: dataset.sample_collection, strict: false },
      ),
    );

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

  const link = (await connection
    .model("links", linksSchema)
    .findById(id)) as Link | null;

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

  const DatasetModel =
    datasetsConnection.models.datasets ||
    datasetsConnection.model("datasets", datasetsSchema);

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
export const saveData = async (
  db: string,
  collection: string,
  data: Record<string, unknown>[],
) => {
  const conn = await connectToDb(db);

  if (!conn.db) throw new Error("Database connection failed");

  await conn.db.collection(collection).insertMany(data);
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

  const EntriesModel =
    entriesConnection.models.entries ||
    entriesConnection.model("entries", entriesSchema);

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

  const DatasetModel =
    datasetsConnection.models.datasets ||
    datasetsConnection.model("datasets", datasetsSchema);

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
