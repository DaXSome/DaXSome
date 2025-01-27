import mongoose from "mongoose";

export const categoriesSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type Category = mongoose.InferSchemaType<typeof categoriesSchema> & {
  _id: string;
};
