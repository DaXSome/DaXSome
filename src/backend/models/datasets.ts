import { DatasetInfo } from "@/types";
import mongoose from "mongoose";

export const datasetsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  user_id: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    default: "",
  },

  tags: {
    type: [String],
    default: [],
  },

  access_type: {
    type: String,
    enum: ["Free", "Paid"],
    default: "Free",
  },

  full_description: {
    type: String,
    default: "",
  },

  use_cases: {
    type: [String],
    default: [],
  },

  description: {
    type: String,
    default: "",
  },

  database: {
    type: String,
    default: "",
  },

  sample_collection: {
    type: String,
    default: "",
  },
});

export type Dataset = mongoose.InferSchemaType<typeof datasetsSchema>;

export const DatasetModel =
  mongoose.models.datasets || mongoose.model("datasets", datasetsSchema);
