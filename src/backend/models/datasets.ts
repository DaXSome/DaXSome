import mongoose from "mongoose";

export const datasetsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    access_type: {
      type: String,
      enum: ["Free", "Paid"],
      required: true,
    },

    full_description: {
      type: String,
      required: true,
    },

    use_cases: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    database: {
      type: String,
      required: true,
    },

    sample_collection: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type Dataset = mongoose.InferSchemaType<typeof datasetsSchema> & {
  _id: string;
};

export const DatasetModel =
  mongoose.models.datasets || mongoose.model("datasets", datasetsSchema);
