import { getCollections, getData } from "@/app/actions/user";
import DatasetManager from "@/components/datasets/DatasetManager";

interface Props {
  searchParams: Promise<{ database: string; collection: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { database, collection } = await searchParams;

  const collections = await getCollections(database);

  const { data, count } = await getData(database, collection || collections[0]);

  return <DatasetManager collections={collections} data={data} count={count} />;
};

export default Page;
