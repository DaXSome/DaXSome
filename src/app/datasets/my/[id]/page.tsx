import { getCollections } from '@/app/actions/datasets';
import DatasetManager from '@/components/datasets/DatasetManager';

interface Props {
    params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
    const { id: databaseId } = await params;

    const collections = await getCollections(databaseId);

    return <DatasetManager collections={collections} />;
};

export default Page;
