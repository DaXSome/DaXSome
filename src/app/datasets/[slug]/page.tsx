import { Dataset } from "@/backend/models/datasets";
import { DatasetView } from "@/components/dataset-page";
import { DatasetInfo } from "@/types";
import { HOST_URL, parseDatasetSlug } from "@/utils";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; //A Day

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;

  const res = await fetch(`${HOST_URL}/api/datasets/${slug}`);

  const dataset = await res.json();

  return {
    metadataBase: new URL(HOST_URL),
    title: dataset.name,
    description: dataset.description,
  };
};

export async function generateStaticParams() {
  const res = await fetch(`${HOST_URL}/api/datasets`);

  const { datasets } = await res.json();

  const paths = (datasets as Dataset[]).map((dataset) => ({
    slug: parseDatasetSlug(dataset.name),
  }));

  return paths;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(`${HOST_URL}/api/datasets/${slug}`);

  const dataset = await res.json() as DatasetInfo

  if (res.status === 404 || dataset.status === "pending") {
    return notFound();
  }

  return <DatasetView dataset={dataset} />;
}
