import { getCollections, getDatabase } from '@/app/actions/datasets';
import DatasetManager from '@/components/datasets/DatasetManager';

interface Props {
    params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
    const { id: databaseId } = await params;

    const [collections, database] = await Promise.all([
        getCollections(databaseId),
        getDatabase(databaseId),
    ]);

    return <DatasetManager collections={collections} database={database} />;
};

export default Page;
