"use server";

import mongoose from "mongoose";
import connectToDb from "@/backend/config/connectDb";
import { datasetsSchema } from "@/backend/models/datasets";
import { categoriesSchema } from "@/backend/models/categories";
import { Link, linksSchema } from "@/backend/models/links";
import { DatasetMeta } from "@/types";
import { parseDatasetSlug } from "@/utils";

export async function getDatasets(category: string | null) {
  const connection = await connectToDb();

  const query = connection.model("datasets", datasetsSchema);

  let datasets: DatasetMeta[];

  if (category && category !== "All" && category !== "undefined") {
    datasets = await query.find({ category });
  } else {
    datasets = await query.find();
  }

  datasets = datasets.map((d) => ({
    ...d.toJSON(),
    _id: d.id,
  } as DatasetMeta));

  const categories = (
    await connection.model("categories", categoriesSchema).find()
  ).map((category) => category.category);

  return { datasets, categories };
}

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

export async function getAltLink(id: string) {
  const connection = await connectToDb();

  const link = (await connection
    .model("links", linksSchema)
    .findById(id)) as Link | null;

  return link;
}

export async function createDataset(name: string) {
  if (!name) return;

  const datasetsConnection = await connectToDb();

  const DatasetModel =
    datasetsConnection.models.datasets ||
    datasetsConnection.model("datasets", datasetsSchema);

  const exists = await DatasetModel.findOne({ name }).collation({
    locale: "en",
    strength: 2,
  });

  if (exists) {
    throw new Error("Dataset already exists");
  }

  await DatasetModel.create({
    name,
  });

  return parseDatasetSlug(name);
}
