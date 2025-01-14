import { DatasetsService } from "@/backend/services/datasets";
import Datasets from "@/components/Datasets";
import { HOST_URL } from "@/utils";
import { Metadata } from "next";

export const revalidate = 86400; //A Day
export const dynamic = "force-dynamic";

const datasetsService = new DatasetsService();

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

  const { datasets, categories } = await datasetsService.GetDatasets(category);

  return <Datasets datasets={datasets} categories={categories} />;
}
