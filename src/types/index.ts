import { getUser } from "@/app/actions/user";
import { Database } from "@/backend/models/databases";

export type DatasetInfo = Database & {
  _id: string;
  updated_at: string;
  asset_url: string;
  category: string;
  access_type: "Free" | "Paid";
  description: string;
  format: string[];
  tags: string[];
  sample: { [key: string]: string | number }[];
  total: number;
  status: "published" | "pending";
} & { user: Awaited<ReturnType<typeof getUser>> };

export type ColumnType = "string" | "number" | "boolean" | "date" | "array";
