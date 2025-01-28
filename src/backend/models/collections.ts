import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    database: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Database",
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    metadata: {
      description: {
        type: String,
        default: "",
      },

      tags: {
        type: [String],
        default: [],
      },

      category: {
        type: String,
        default: "",
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

      status: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const CollectionModel =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
