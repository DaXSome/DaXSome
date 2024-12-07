import { DatasetsService } from "@/backend/services/datasets";
import { NextRequest, NextResponse } from "next/server";

const datasetsService = new DatasetsService();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");

  const { datasets, categories } = await datasetsService.GetDatasets(category);

  return NextResponse.json({ datasets, categories });
}
