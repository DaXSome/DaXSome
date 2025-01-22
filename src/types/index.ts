import { getUser } from "@/app/actions/user";
import { Dataset } from "@/backend/models/datasets";

export type DatasetInfo = Dataset & {
  _id: string;
  updated_at: string;
  asset_url: string;
  format: string[];
  sample: { [key: string]: string | number }[];
  total: number;
  status: "published" | "pending";
} & { user: Awaited<ReturnType<typeof getUser>> };

export type ColumnType = "string" | "number" | "boolean" | "date" | "array";
