import { DatasetView } from "@/components/dataset-page";
import { HOST_URL } from "@/utils";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; //A Day

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;

  const res = await fetch(`${HOST_URL}/api/datasets/${slug}`);

  const dataset = await res.json();

  const data: Metadata = {
    metadataBase: new URL(HOST_URL),
    title: dataset.title,
    description: dataset.description,
  };

  return data;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(`${HOST_URL}/api/datasets/${slug}`);

  const dataset = await res.json();

  return <DatasetView dataset={dataset} />;
}
