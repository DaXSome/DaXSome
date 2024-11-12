import mongoose from "mongoose";
import connectToDb from "../config/connectDb";
import { datasetsSchema } from "../models/datasets";

export class DatasetsService {
  async GetDatasets() {
    const connection = await connectToDb();

    const datasets = await connection.model("datasets", datasetsSchema).find();

    return datasets;
  }

  async GetDataset(name: string) {
    const datasetsConnection = await connectToDb();

    const dataset = await datasetsConnection
      .model("datasets", datasetsSchema)
      .findOne({ name });

    if (!dataset) return;

    const secondaryDataConn = await connectToDb(dataset.database);

    const metaDataModel = secondaryDataConn.model(
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

    const sampleModel = secondaryDataConn.model(
      dataset.sample_collection,
      new mongoose.Schema(
        {},
        { collection: dataset.sample_collection, strict: false },
      ),
    );

    const [metaData, sample, totalDocuments] = await Promise.all([
      await metaDataModel.findOne(),
      await sampleModel.find().limit(20),
      await sampleModel.countDocuments(),
    ]);

    const fullDataset = {
      ...dataset.toObject(),
      sample,
      updated_at: metaData? metaData.updated_at : "Unknown",
      format: ["CSV", "JSON"],
      total: totalDocuments,
    };

    return fullDataset;
  }
}
