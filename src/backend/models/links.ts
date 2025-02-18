import mongoose from "mongoose";

export const linksSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
});

export type Link = mongoose.InferSchemaType<typeof linksSchema>;

export const LinkModel =
  mongoose.models.Link || mongoose.model("Link", linksSchema);
