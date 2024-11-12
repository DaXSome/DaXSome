import { Dataset } from "@/backend/models/datasets";

export type DatasetInfo = Dataset & {
  updated_at: string;
  id: string;
  format: string[];
  sample: { [key: string]: string | number }[];
  total: number
};

export type DatasetMeta = Omit<DatasetInfo, "size" | "format" | "sample">;
