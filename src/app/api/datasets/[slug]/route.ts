import { DatasetsService } from "@/backend/services/datasets";
import { normalizeDatasetSlug } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

const datasetService = new DatasetsService();

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  const normalizedSlug = normalizeDatasetSlug(slug);

  const dataset = await datasetService.GetDataset(normalizedSlug);

  if (!dataset) {
    return NextResponse.json({ message: "No dataset found" }, { status: 404 });
  }

  return NextResponse.json(dataset);
}
