"use client"
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
    const router = useRouter()
    const handleAddCollectionModal = () => {
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        if (searchParams.has('openCollectionsModal')) {
            searchParams.delete('openCollectionsModal');
        } else {
            searchParams.set('openCollectionsModal', 'True');
        }

        router.push(`${currentUrl.pathname}?${searchParams.toString()}`);
    }

    return (
        <nav className="w-full h-full  bg-gray-50 max-w-[300px] flex flex-col rounded-md overflow-hidden">
            <h1 className='font-semibold text-2xl bg-slate-800 py-4 px-2 text-slate-100'>Database Manager</h1>
            <div className='w-full px-4'>
                <div className='flex justify-between pt-3 place-items-center'>
                    <h4 className='font-semibold text-slate-800'>Collections</h4>
                    <Button className='' onClick={handleAddCollectionModal}>
                        <Plus className='text-slate-50'/>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
