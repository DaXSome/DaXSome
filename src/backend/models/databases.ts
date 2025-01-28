import mongoose from "mongoose";

const databaseSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    metadata: {
      description: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

export type Database = mongoose.InferSchemaType<typeof databaseSchema>;

export const DatabaseModel =
  mongoose.models.Database || mongoose.model("Database", databaseSchema);
