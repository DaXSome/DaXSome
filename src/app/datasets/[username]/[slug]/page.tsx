import { getDataset } from "@/app/actions/datasets";
import { DatasetView } from "@/components/datasets/DatasetSlug";
import { DatasetInfo } from "@/types";
import { HOST_URL, normalizeDatasetSlug } from "@/utils";
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
    title: dataset?.name,
    description: dataset?.metadata?.description,
  };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const normalizedSlug = normalizeDatasetSlug(slug);

  const dataset = await getDataset(normalizedSlug);

  if (!dataset) {
    return notFound();
  }

  return <DatasetView dataset={dataset as unknown as DatasetInfo} />;
}
