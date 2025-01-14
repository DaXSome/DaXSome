import mongoose from "mongoose";
import connectToDb from "../config/connectDb";
import { datasetsSchema } from "../models/datasets";
import { categoriesSchema } from "../models/categories";
import { Link, linksSchema } from "../models/links";
import { DatasetMeta } from "@/types";

export class DatasetsService {
  async GetDatasets(category: string | null) {
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
    }));

    const categories = (
      await connection.model("categories", categoriesSchema).find()
    ).map((category) => category.category);

    return { datasets, categories };
  }

  async GetDataset(name: string) {
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

  async getAltLink(id: string) {
    const connection = await connectToDb();

    const link = (await connection
      .model("links", linksSchema)
      .findById(id)) as Link | null;

    return link;
  }
}
