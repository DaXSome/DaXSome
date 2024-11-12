import { DatasetView } from "@/components/dataset-page";
import { HOST_URL } from "@/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; //A Day

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(`${HOST_URL}/api/datasets/${slug}`);

  const dataset  = (await res.json())

  return <DatasetView dataset={dataset} />;
}
