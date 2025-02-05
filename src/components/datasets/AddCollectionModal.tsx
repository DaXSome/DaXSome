import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    useSearchParams,
    useRouter,
    usePathname,
    useParams,
} from 'next/navigation';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    createCollecion,
    createDocumentSchema,
    getCollection,
    getDocumentSchema,
} from '@/app/actions/datasets';
import { useUser } from '@clerk/nextjs';
import { DocumentSchema } from '@/backend/models/schema';
import { Textarea } from '../ui/textarea';
import { Collection } from '@/backend/models/collections';

interface FieldType {
    name: string;
    type: DocumentSchema['schema'][number]['type'];
}

interface FormValues {
    fields: FieldType[];
    metadata: Collection['metadata'] & {
        currentTag?: string;
    };
}

const AddCollectionModal = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { id } = useParams();
    const { user } = useUser();
    const openModalParam = searchParams.get('openCollectionsModal');
    const collection = searchParams.get('col');

    const { register, control, handleSubmit, setValue, watch } =
        useForm<FormValues>({
            defaultValues: {
                fields: [],
                metadata: {
                    title: '',
                    description: '',
                    tags: [],
                    currentTag: '',
                    category: '',
                    access_type: 'Free',
                    full_description: '',
                    status: 'Unpublished',
                },
            },
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'fields',
    });

    const tags = watch('metadata.tags');
    const currentTag = watch('metadata.currentTag');

    const newSearchParams = new URLSearchParams(searchParams.toString());
    const closeModal = () => {
        newSearchParams.delete('openCollectionsModal');
        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    const createEmptyField = () => {
        append({ name: '', type: 'string' });
    };

    const addTag = () => {
        if (!currentTag) return;

        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setValue('metadata.tags', [...tags, currentTag.trim()]);
            setValue('metadata.currentTag', '');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue(
            'metadata.tags',
            tags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const onSubmit = async (data: FormValues) => {
        if (!user) return;

        delete data.metadata.currentTag;

        const colId =
            collection ||
            (await createCollecion({
                database: id as string,
                user_id: user.id,
                metadata: data.metadata,
            }));

        await createDocumentSchema({
            collection: colId,
            user_id: user.id,
            database: id as string,
            schema: data.fields,
        });

        closeModal();
    };

    useEffect(() => {
        if (!collection) return;

        (async () => {
            const [schema, collectionMeta] = await Promise.all([
                getDocumentSchema({
                    database: id as string,
                    collection,
                }),
                getCollection(collection),
            ]);

            if (schema) {
                setValue('fields', schema);
                setValue('metadata', {
                    ...collectionMeta.metadata,
                    currentTag: '',
                });
            }
        })();
    }, [collection, setValue, id]);

    return (
        <Dialog open={openModalParam === 'True'} onOpenChange={closeModal}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Tabs defaultValue="schema" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="schema">Schema</TabsTrigger>
                            <TabsTrigger value="info">
                                Collection info
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="schema">
                            <DialogHeader>
                                <DialogTitle>Add New Collection</DialogTitle>
                                <DialogDescription>
                                    Please add fields to create a new
                                    collection.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full flex justify-between">
                                    <div className="flex-1">Name</div>
                                    <div className="flex-1">Type</div>
                                </div>

                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="w-full flex gap-1 justify-between"
                                    >
                                        <div className="flex-1">
                                            <Input
                                                {...register(
                                                    `fields.${index}.name`,
                                                    {
                                                        required:
                                                            'Field name is required',
                                                    }
                                                )}
                                                placeholder="column name"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Select
                                                value={field.type}
                                                onValueChange={(value) =>
                                                    setValue(
                                                        `fields.${index}.type`,
                                                        value as DocumentSchema['schema'][number]['type']
                                                    )
                                                }
                                            >
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
                                            onClick={() => remove(index)}
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
                                        <Plus
                                            size={16}
                                            className="text-slate-800"
                                        />
                                    </div>
                                    <div className="font-medium">
                                        click to add a new field
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="info"
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="text-sm font-medium">
                                    Title
                                </label>
                                <Input
                                    {...register('metadata.title', {
                                        required: 'Title is required',
                                    })}
                                    placeholder="Enter title (e.g., 2024 Births)"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Description
                                </label>
                                <Input
                                    {...register('metadata.description')}
                                    placeholder="Short description (e.g., Collection of e-commerce data)"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag}
                                            className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                                        >
                                            <span>{tag}</span>
                                            <X
                                                size={14}
                                                className="cursor-pointer hover:text-red-500"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        {...register('metadata.currentTag')}
                                        placeholder="Add tags (press Enter)"
                                        onKeyUp={handleTagKeyPress}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addTag}
                                        className="whitespace-nowrap"
                                    >
                                        Add Tag
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Category
                                </label>
                                <Input
                                    {...register('metadata.category')}
                                    placeholder="Enter category (e.g., Machine Learning)"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Access Type
                                </label>
                                <Select
                                    value={watch('metadata.access_type')}
                                    onValueChange={(value) =>
                                        setValue(
                                            'metadata.access_type',
                                            value as FormValues['metadata']['access_type']
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select access type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Free">
                                            Free
                                        </SelectItem>
                                        <SelectItem value="Paid" disabled>
                                            Paid - Coming Soon
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Full Description
                                </label>
                                <Textarea
                                    {...register('metadata.full_description')}
                                    placeholder="Detailed description of the dataset or content."
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Status
                                </label>
                                <Select
                                    value={watch('metadata.status')}
                                    onValueChange={(value) =>
                                        setValue(
                                            'metadata.status',
                                            value as FormValues['metadata']['status']
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="Unpublished">
                                            Unpublished
                                        </SelectItem>
                                        <SelectItem value="Published">
                                            Published
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            type="button"
                            className="bg-slate-200 font-semibold hover:bg-slate-400"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="text-slate-50 font-semibold"
                            disabled={fields.length === 0}
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            <DialogClose />
        </Dialog>
    );
};

export default AddCollectionModal;
