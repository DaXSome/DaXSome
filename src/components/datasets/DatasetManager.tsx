'use client';
import { AppSidebar } from '@/app/datasets/my/[id]/SideBar';
import { Collection } from '@/backend/models/collections';
import DatasetViewTable from './DatasetViewTable';
import { Button } from '../ui/button';
import { Import, Plus } from 'lucide-react';
import AddCollectionModal from './AddCollectionModal';

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
                            <div className="w-full flex justify-end gap-3">
                                <Button variant={'outline'}>
                                    {' '}
                                    <Import /> import
                                </Button>
                                <Button className="font-semibold text-slate-50">
                                    {' '}
                                    <Plus /> Add document
                                </Button>
                            </div>
                            <DatasetViewTable />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatasetManager;
