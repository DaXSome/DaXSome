'use client';
import { AppSidebar } from '@/app/datasets/my/[id]/SideBar';
import { Collection } from '@/backend/models/collections';
import AddCollectionModal from './AddCollectionModal';
import { DataTable } from './DataTable';
import { getDatabase } from '@/app/actions/datasets';
import { useState } from 'react';

interface Props {
    collections: Collection[];
    database: Awaited<ReturnType<typeof getDatabase>>;
}

const DatasetManager = ({ collections, database }: Props) => {
    const [openAddCollectionModal, setOpenAddCollectionModal] = useState(false);

    const toggleAddModal = () => {
        setOpenAddCollectionModal(!openAddCollectionModal);
    };

    return (
        <div className="container mx-auto py-4">
            <div className="flex items-center mb-4 w-full h-full gap-5">
                <AppSidebar toggleModal={toggleAddModal} collections={collections} database={database} />

                <AddCollectionModal
                    open={openAddCollectionModal}
                    closeModal={toggleAddModal}
                />

                {collections.length > 0 && (
                    <div className="flex-1 w-full h-full bg-gray-50 rounded-md p-4">
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
