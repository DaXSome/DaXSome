import { getCollections, getData } from "@/app/actions/datasets";
import DatasetManager from "@/components/datasets/DatasetManager";

interface Props {
  searchParams: Promise<{ database: string; collection: string; page: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { database, collection, page } = await searchParams;

  let collections = (await getCollections(database)).map((c) => c.name);

  if (!collections.includes(collection)) {
    collections = [...collections, collection];
  }

  const { count, data: initialData } = await getData(
    database,
    collection || collections[0],
    page,
  );

  let data = initialData;

  if (data.length === 0) {
    data = [{ "Column 1": "" }];
  }

  return <DatasetManager collections={collections} data={data} count={count} />;
};

export default Page;
