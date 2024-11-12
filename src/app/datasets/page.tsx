import Datasets from "@/components/Datasets";
import { HOST_URL } from "@/utils";

export const revalidate = 86400; //A Day
export const dynamic = "force-dynamic"

export default async function Page() {
  const res = await fetch(`${HOST_URL}/api/datasets`,);

  const datasets = await res.json();

  return <Datasets datasets={datasets} />;
}
