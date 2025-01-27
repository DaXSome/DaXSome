import mongoose from "mongoose";

export const entriesSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    database: {
      type: String,
      required: true,
    },

    collections: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export type Entries = mongoose.InferSchemaType<typeof entriesSchema> & {
  toJSON: () => Record<string, unknown>;
};
