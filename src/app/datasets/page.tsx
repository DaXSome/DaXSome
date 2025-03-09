import Datasets from '@/components/datasets/Datasets';
import { HOST_URL } from '@/utils';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const generateMetadata = async () => {
    const data: Metadata = {
        metadataBase: new URL(HOST_URL),
        title: `DaXSome -  Datasets`,
        description: `Explore Datasets on DaXSome`,
    };

    return data;
};

export default async function Page() {
    return (
        <Suspense>
            <Datasets />;
        </Suspense>
    );
}
