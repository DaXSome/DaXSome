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

export const LinksModel =
  mongoose.models.links || mongoose.model("links", linksSchema);
