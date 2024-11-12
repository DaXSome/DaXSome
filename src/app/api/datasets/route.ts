import { DatasetsService } from "@/backend/services/datasets";
import { NextResponse } from "next/server";

const datasetsService = new DatasetsService();

export async function GET() {
  const datasets = await datasetsService.GetDatasets();

  return NextResponse.json(datasets);
}
