import Datasets from "@/components/Datasets";

export const revalidate = 86400; //A Day

export default async function Page() {
  const API_KEY = process.env.DB_API_KEY as string;

  const res = await fetch(process.env.DB_HOST_URL as string, {
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
    },
  });

  const datasets = await res.json();

  return <Datasets datasets={datasets} />;
}
