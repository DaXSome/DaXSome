import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    database: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Database",
      required: true,
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const DocumentModel =
  mongoose.models.Document || mongoose.model("Document", documentSchema);
