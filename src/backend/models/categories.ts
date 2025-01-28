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

export const CategoriesModel =
  mongoose.models.Categories || mongoose.model("Categories", categoriesSchema);
