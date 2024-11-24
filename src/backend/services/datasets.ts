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
      await sampleModel.find().limit(20),
      await sampleModel.countDocuments(),
    ]);

    const fullDataset = {
      ...dataset.toObject(),
      sample,
      updated_at: metaData ? metaData.updated_at : "Unknown",
      format: ["CSV"],
      total: totalDocuments,
    };

    return fullDataset;
  }
}
