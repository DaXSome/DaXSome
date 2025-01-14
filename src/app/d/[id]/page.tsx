import { DatasetsService } from "@/backend/services/datasets";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const datasetService = new DatasetsService();


export default async function Page({ params }: Props) {
  const { id } = await params;

  const link = await datasetService.getAltLink(id);


  if (!link) {
    return redirect("/datasets");
  }

  return redirect(link.link);
}
