'use client';
import { Collection } from '@/backend/models/collections';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Pencil } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { dropCollection, getDatabase } from '@/app/actions/datasets';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import EditDatabaseModal from '@/components/datasets/EditDatabaseModal';
import clsx from 'clsx';
import { useLoadingStore } from '@/states/app';

interface Props {
    collections: Collection[];
    database: Awaited<ReturnType<typeof getDatabase>>;
    toggleModal: () => void;
}

export function AppSidebar({ collections, database, toggleModal }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const { toast } = useToast();

    const [editDb, setEditDb] = useState(false);

    const { toggleLoading } = useLoadingStore();

    const handleAddCollectionModal = () => {
        const currentParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );

        currentParams.delete('col');

        router.replace(`${pathname}?${currentParams.toString()}`);

        toggleModal();
    };

    const handleDrop = async (id: string) => {
        if (confirm('Are you sure?')) {
            toast({ title: 'Dropping collection' });

                        toggleLoading();  

            await dropCollection(id);
            toast({ title: 'Dropped collection' });

                                    toggleLoading();  

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
                    <Link
                        key={collection._id as string}
                        href={`?col=${collection._id}`}
                        className={clsx(
                            'flex items-center justify-between p-2  rounded-md shadow-sm hover:bg-gray-100 cursor-pointer',
                            searchParams.get('col') === collection._id &&
                                'bg-primary text-white'
                        )}
                    >
                        {collection.name}
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
                    </Link>
                ))}
            </div>
        </nav>
    );
}
