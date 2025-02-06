import { getDataset } from "@/app/actions/datasets";
import { DatasetView } from "@/components/datasets/DatasetSlug";
import { HOST_URL, normalizeDatasetSlug } from "@/utils";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; //A Day

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;

  const dataset = await getDataset(slug);

  return {
    metadataBase: new URL(HOST_URL),
    title: dataset?.name,
    description: dataset?.metadata?.description,
  };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const dataset = await getDataset(slug);

  if (!dataset) {
    return notFound();
  }

  return <DatasetView dataset={dataset} />;
}
