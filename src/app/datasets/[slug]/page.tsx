import { getDataset, getDatasets } from "@/app/actions/datasets";
import { Dataset } from "@/backend/models/datasets";
import { DatasetView } from "@/components/dataset-page";
import { HOST_URL, normalizeDatasetSlug, parseDatasetSlug } from "@/utils";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; //A Day


export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;


  const normalizedSlug = normalizeDatasetSlug(slug);

  const dataset = await getDataset(normalizedSlug);

  return {
    metadataBase: new URL(HOST_URL),
    title: dataset.name,
    description: dataset.description,
  };
};

export async function generateStaticParams() {

  const { datasets } = await getDatasets(null);

  const paths = (datasets as Dataset[]).map((dataset) => ({
    slug: parseDatasetSlug(dataset.name),
  }));

  return paths;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;


  const normalizedSlug = normalizeDatasetSlug(slug);

  const dataset = await getDataset(normalizedSlug);

  if (!dataset || dataset.status === "pending") {
    return notFound();
  }

  return <DatasetView dataset={dataset} />;
}
