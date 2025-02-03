'use client';
import { AppSidebar } from '@/app/datasets/my/[id]/SideBar';
import { Collection } from '@/backend/models/collections';
import AddCollectionModal from './AddCollectionModal';
import { DataTable } from './DataTable';

interface Props {
    collections: Collection[];
}

const DatasetManager = ({ collections }: Props) => {
    return (
        <div className="container mx-auto py-4">
            <div className="flex items-center mb-4 w-full h-full gap-5">
                <AppSidebar collections={collections} />

                {collections.length > 0 && (
                    <div className="flex-1 w-full h-full bg-gray-50 rounded-md p-4">
                        <AddCollectionModal />
                        <div>
                            <DataTable />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatasetManager;
