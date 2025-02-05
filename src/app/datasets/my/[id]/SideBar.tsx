'use client';
import { Collection } from '@/backend/models/collections';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { dropCollection, getDatabase } from '@/app/actions/datasets';
import { useState } from 'react';
import EditDatabaseModal from '@/components/datasets/EditDatabaseModal';

interface Props {
    collections: Collection[];
    database: Awaited<ReturnType<typeof getDatabase>>;
    toggleModal: () => void;
}

export function AppSidebar({ collections, database, toggleModal }: Props) {
    const router = useRouter();

    const [editDb, setEditDb] = useState(false);

    const handleAddCollectionModal = () => {
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        searchParams.delete('col');

        toggleModal()

    };

    const handleDrop = async (id: string) => {
        if (confirm('Are you sure?')) {
            await dropCollection(id);
            handleDbEdit();
            router.refresh();
        }
    };

    const handleDbEdit = () => {
        setEditDb(!editDb);
    };

    return (
        <nav className="w-full h-full bg-gray-50 max-w-[300px] flex flex-col rounded-md overflow-hidden">
            <h1 className="font-semibold text-2xl bg-slate-800 py-4 px-2 text-slate-100 flex gap-4 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                <span className="truncate">{database?.name}</span>
                <span>
                    <Pencil onClick={handleDbEdit} />
                </span>
            </h1>

            <EditDatabaseModal
                open={editDb}
                name={database?.name as string}
                id={database?._id}
                closeModal={handleDbEdit}
            />

            <div className="w-full px-4">
                <div className="flex justify-between pt-3 items-center">
                    <h4 className="font-semibold text-slate-800">
                        {collections.length} Collections
                    </h4>
                    <Button onClick={handleAddCollectionModal}>
                        <Plus className="text-slate-50" />
                    </Button>
                </div>
            </div>
            <div className="mt-4 px-2 space-y-2 flex flex-col">
                {collections.map((collection) => (
                    <div
                        key={collection._id as string}
                        className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
                    >
                        <Link
                            href={`?col=${collection._id}`}
                            className="flex-1"
                        >
                            {collection.name}
                        </Link>
                        <Popover>
                            <PopoverTrigger>
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </PopoverTrigger>
                            <PopoverContent className="flex gap-4 w-40">
                                <Button
                                    onClick={toggleModal}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Edit
                                </Button>
                                <Button
                                    className="block w-full text-left px-4 py-2 hover:bg-red-200 bg-red-400 text-white"
                                    onClick={() =>
                                        handleDrop(collection._id as string)
                                    }
                                >
                                    Drop
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                ))}
            </div>
        </nav>
    );
}
