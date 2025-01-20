import { getCollections, getData } from "@/app/actions/user";
import DatasetManager from "@/components/datasets/DatasetManager";

interface Props {
  searchParams: Promise<{ database: string; collection: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { database, collection } = await searchParams;

  let collections = await getCollections(database);

  if (!collections.includes(collection)) {
    collections = [...collections, collection];
  }

  let { data, count } = await getData(database, collection || collections[0]);

  if (data.length === 0) {
    data = [{ "Column 1": "" }];
  }

  return <DatasetManager collections={collections} data={data} count={count} />;
};

export default Page;
