import React from 'react';
import DatasetViewTable from './DatasetViewTable';
import { Button } from '../ui/button';
import { Import, Plus } from 'lucide-react';
import AddCollectionModal from './AddCollectionModal';

const DashboardView = () => {
    const collections = ['one', 'two'];

    return (
        <div className="flex-1 w-full h-full bg-gray-50 rounded-md p-4">
            <AddCollectionModal />
            {collections.length <= 0 ? (
                <div className="w-full h-full flex flex-col gap-1 justify-center place-items-center">
                    <div className="font-semibold text-slate-500">
                        You have no collections
                    </div>
                    <Button className="font-semibold text-slate-700">
                        Create a collection
                    </Button>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default DashboardView;
