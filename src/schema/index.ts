import { z } from "zod";

export const datasetSchema = z.object({
  database: z.string(),
  sample_collection: z.string(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Short description is required"),
  full_description: z.string().min(1, "Full description is required"),
  use_cases: z.string().min(1, "Use cases are required"),
  tags: z.string().min(1, "Tags are required"),
  access_type: z.enum(["Free", "Paid"]),
  publish: z.boolean().default(false),
});

export type DatasetFormData = z.infer<typeof datasetSchema>;
