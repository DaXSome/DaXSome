import { Dataset } from "@/backend/models/datasets";
import { DatasetsService } from "@/backend/services/datasets";
import { DatasetView } from "@/components/dataset-page";
import { HOST_URL, normalizeDatasetSlug, parseDatasetSlug } from "@/utils";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; //A Day


const datasetService = new DatasetsService();

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;


  const normalizedSlug = normalizeDatasetSlug(slug);

  const dataset = await datasetService.GetDataset(normalizedSlug);

  return {
    metadataBase: new URL(HOST_URL),
    title: dataset.name,
    description: dataset.description,
  };
};

export async function generateStaticParams() {

  const { datasets } = await datasetService.GetDatasets(null);

  const paths = (datasets as Dataset[]).map((dataset) => ({
    slug: parseDatasetSlug(dataset.name),
  }));

  return paths;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;


  const normalizedSlug = normalizeDatasetSlug(slug);

  const dataset = await datasetService.GetDataset(normalizedSlug);

  if (!dataset || dataset.status === "pending") {
    return notFound();
  }

  return <DatasetView dataset={dataset} />;
}
