import Datasets from "@/components/datasets/Datasets";
import { HOST_URL } from "@/utils";
import { Metadata } from "next";
import { getDatasets } from "../actions/datasets";

export const revalidate = 86400; //A Day
export const dynamic = "force-dynamic";

type SearchParamsProps = {
  searchParams: Promise<{
    category: string;
  }>;
};

export const generateMetadata = async ({ searchParams }: SearchParamsProps) => {
  const { category } = await searchParams;

  const data: Metadata = {
    metadataBase: new URL(HOST_URL),
    title: `DaXSome - ${category || "All"} Datasets`,
    description: `Explore ${category || "All"} Datasets on DaXSome`,
  };

  return data;
};

export default async function Page({ searchParams }: SearchParamsProps) {
  const { category } = await searchParams;

  const { datasets, categories } = await getDatasets(category);

  return <Datasets datasets={datasets} categories={categories} />;
}
