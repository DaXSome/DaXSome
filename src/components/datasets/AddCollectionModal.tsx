import React, { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useSearchParams, useRouter, usePathname, useParams } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { createCollecion, createDocumentSchema, getDocumentSchema } from '@/app/actions/datasets';
import { useUser } from '@clerk/nextjs';
import { DocumentSchema } from '@/backend/models/schema';

interface FieldType {
    name: string;
    type: DocumentSchema["schema"][number]["type"]
}

const AddCollectionModal = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const {id} = useParams()
    const {user} = useUser()
    const openModalParam = searchParams.get('openCollectionsModal');
    const collection = searchParams.get('col')


    const [addedFields, setAddedFields] = useState<FieldType[]>([]);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    const closeModal = () => {
        newSearchParams.delete('openCollectionsModal');
        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    const createEmptyField = () => {
        setAddedFields((pre) => [
            ...pre,
            {
                name: '',
                type: 'string',
            },
        ]);
    };

    const removeField = (index: number) => {
        setAddedFields((prevFields) =>
            prevFields.filter((_, i) => i !== index)
        );
    };

    const handleOnChange = (index: number, field: keyof FieldType, value: string) => {
        setAddedFields((prevFields) =>
            prevFields.map((f, i) =>
                i === index ? { ...f, [field]: value } : f
            )
        );
    };

    const createSchema = async () => {
        if (!user) return;

        const colId =
            collection ||
            (await createCollecion({
                database: id as string,
                user_id: user.id,
            }));


        await createDocumentSchema({
            collection: colId,
            user_id: user.id,
            database: id as string,
            schema: addedFields,
        });

        closeModal();
    };

    useEffect(() => {
        (async () => {
            if (!collection) return;

            const schema = await getDocumentSchema({
                database: id as string,
                collection,
            });

            if (schema) {
                setAddedFields(schema);
            }
        })();
    }, [collection]);


    return (
        <Dialog open={openModalParam === 'True'} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Collection</DialogTitle>
                    <DialogDescription>
                        Please add fields to create a new collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex justify-between">
                        <div className="flex-1">Name</div>
                        <div className="flex-1">Type</div>
                    </div>

                    {addedFields.length > 0 &&
                        addedFields.map((_, index) => (
                            <div
                                key={index}
                                className="w-full flex gap-1 justify-between"
                            >
                                <div className="flex-1">
                                    <Input value={addedFields[index].name} placeholder={`column name`} onChange={(e) => handleOnChange(index, 'name', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <Select defaultValue="string" value={addedFields[index].type} onValueChange={(e) => handleOnChange(index, 'type', e)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="String" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="string">
                                                String
                                            </SelectItem>
                                            <SelectItem value="boolean">
                                                Boolean
                                            </SelectItem>
                                            <SelectItem value="json">
                                                Json
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div
                                    className="flex place-items-center justify-center px-1 hover:bg-slate-300 transition-colors .01s ease-linear rounded-md w-7 cursor-pointer"
                                    onClick={() => removeField(index)}
                                >
                                    <Trash2 size={16} />
                                </div>
                            </div>
                        ))}

                    <div
                        className="w-full bg-slate-100 h-11 rounded-sm flex gap-6 place-items-center pl-2 cursor-pointer hover:bg-slate-200 transition-all .01s ease-linear"
                        onClick={createEmptyField}
                    >
                        <div className="w-6 h-6 bg-slate-300 rounded-full flex place-items-center justify-center">
                            <Plus size={16} className="text-slate-800" />
                        </div>
                        <div className="font-medium">
                            click to add a new field
                        </div>
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
                        disabled= {addedFields.length == 0}
                        onClick={createSchema}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
            <DialogClose />
        </Dialog>
    );
};

export default AddCollectionModal;
