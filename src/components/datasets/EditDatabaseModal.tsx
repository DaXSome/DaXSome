import React, { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { dropDatabase, updateDatabaseName } from '@/app/actions/datasets';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Props {
    open: boolean;
    name: string;
    id: string;
    closeModal: () => void;
}

const EditDatabaseModal = ({ open, name, id, closeModal }: Props) => {
    const { toast } = useToast();

    const router = useRouter();

    const [newDbName, setNewDbName] = useState(name);

    const save = async () => {
        toast({ title: 'Saving...' });

        await updateDatabaseName(id, newDbName);

        toast({ title: 'Saved' });

        closeModal();
    };

    const handleDrop = async () => {
        toast({ title: 'Dropping database' });

        await dropDatabase(id);

        toast({ title: 'Dropped' });

        closeModal();

        router.push('/datasets/my');
    };

    return (
        <Dialog open={open} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit database</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex-1">Name</div>

                    <Input
                        value={newDbName}
                        placeholder={`Database name`}
                        onChange={(e) => {
                            setNewDbName(e.target.value);
                        }}
                    />
                    <div
                        className="w-full bg-red-100 h-11 rounded-sm flex gap-6 place-items-center pl-2 cursor-pointer hover:bg-slate-200 transition-all .01s ease-linear"
                        onClick={handleDrop}
                    >
                        <div className="w-6 h-6 bg-red-300 rounded-full flex place-items-center justify-center">
                            <Trash size={16} className="text-red-800" />
                        </div>
                        <div className="font-medium">Drop database</div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="bg-slate-200 font-semibold hover:bg-slate-400"
                        type="button"
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="text-slate-50 font-semibold"
                        disabled={
                            !newDbName ||
                            newDbName.toLowerCase() === name.toLowerCase()
                        }
                        onClick={save}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
            <DialogClose />
        </Dialog>
    );
};

export default EditDatabaseModal;
