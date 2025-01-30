
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AppSidebar() {
    return (
        <nav className="w-full h-full  bg-gray-50 max-w-[300px] flex flex-col rounded-md overflow-hidden">
            <h1 className='font-semibold text-2xl bg-slate-800 py-4 px-2 text-slate-50'>Database Manager</h1>
            <div className='w-full px-4'>
                <div className='flex justify-between pt-3 place-items-center'>
                    <h4>Collections</h4>
                    <Button className=''>
                        <Plus />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
