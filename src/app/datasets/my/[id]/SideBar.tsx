'use client';
import { Collection } from '@/backend/models/collections';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';

interface Props {
    collections: Collection[];
}

export function AppSidebar({ collections }: Props) {
    const router = useRouter();

    const handleAddCollectionModal = () => {
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        searchParams.delete("col")

        if (searchParams.has('openCollectionsModal')) {
            searchParams.delete('openCollectionsModal');
        } else {
            searchParams.set('openCollectionsModal', 'True');
        }

        router.push(`${currentUrl.pathname}?${searchParams.toString()}`);
    };

    return (
        <nav className="w-full h-full bg-gray-50 max-w-[300px] flex flex-col rounded-md overflow-hidden">
            <h1 className="font-semibold text-2xl bg-slate-800 py-4 px-2 text-slate-100">
                Database Manager
            </h1>
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
            <div className="mt-4 space-y-2 flex flex-col">
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
                            <PopoverContent className="w-40">
                                <Link
                                    href={`?col=${collection._id}&openCollectionsModal=True`}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Edit
                                </Link>
                            </PopoverContent>
                        </Popover>
                    </div>
                ))}
            </div>
        </nav>
    );
}
