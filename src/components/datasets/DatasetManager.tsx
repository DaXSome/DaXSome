'use client';
import DashboardView from './DashboardView';
import { AppSidebar } from '@/app/datasets/my/[id]/SideBar';
import { Collection } from '@/backend/models/collections';

interface Props {
    collections: Collection[];
}

const DatasetManager = ({ collections }: Props) => {
    return (
        <div className="container mx-auto py-4">
            <div className="flex items-center mb-4 w-full h-full gap-5">
                <AppSidebar collections={collections}/>

                <DashboardView />
            </div>
        </div>
    );
};

export default DatasetManager;
