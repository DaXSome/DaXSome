import { DatasetsService } from "@/backend/services/datasets";
import { NextRequest, NextResponse } from "next/server";

const datasetService = new DatasetsService();

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const link = await datasetService.getAltLink(id);

  if (!link) {
    return NextResponse.json({ message: "No link found" }, { status: 404 });
  }

  return NextResponse.json(link);
}
