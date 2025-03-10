import React, { ChangeEvent, useEffect, useRef } from 'react';
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
import { useSearchParams, useParams } from 'next/navigation';
import { Import, Plus, Trash2, X } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { readFile, supportedDataTypes } from '@/utils';
import { useLoadingStore } from '@/states/app';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
    open: boolean;
    closeModal: () => void;
}

const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm">{message}</p>;
};

const AddCollectionModal = ({ open, closeModal }: Props) => {
    const searchParams = useSearchParams();
    const { id } = useParams();
    const { user } = useUser();
    const collection = searchParams.get('col');

    const { toast } = useToast();
    const router = useRouter();

    const { toggleLoading } = useLoadingStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const formSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        fields: z.array(z.any()),
        metadata: z.object({
            title: z.string().min(1, 'Title is required'),
            description: z.string(),
            tags: z.array(z.string()),
            currentTag: z.string().optional(),
            category: z.string().min(1, 'Category is required'),
            access_type: z.enum(['Free', 'Paid']),
            full_description: z.string(),
            status: z.enum(['Unpublished', 'Published', 'Pending']),
        }),
    });

    type FormValues = z.infer<typeof formSchema>;

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
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

        closeModal();

        toggleLoading();

        delete data.metadata.currentTag;

        toast({ title: 'Saving collection' });

        const colId = await createCollecion(
            {
                name: data.name,
                database: id as string,
                user_id: user.id,
                metadata: data.metadata,
            },
            collection
        );

        await createDocumentSchema({
            collection: colId,
            user_id: user.id,
            database: id as string,
            schema: data.fields,
        });

        toast({ title: 'Saved collection' });

        toggleLoading();

        router.push(`?col=${colId}`);
    };

    const handleFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const { headers } = await readFile(file);

        setValue('fields', headers);
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
                setValue('name', collectionMeta.name);
            }
        })();
    }, [collection, setValue, id]);

    return (
        <Dialog open={open} onOpenChange={closeModal}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2">
                        <Input
                            placeholder="Name of collection"
                            {...register(`name`, {
                                required: 'collection name is required',
                            })}
                        />
                    </div>

                    <Tabs defaultValue="schema">
                        <TabsList>
                            <TabsTrigger value="schema">Schema</TabsTrigger>
                            <TabsTrigger value="info">
                                Collection info
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="schema">
                            <DialogHeader>
                                <DialogTitle>
                                    <Input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileImport}
                                        className="hidden"
                                        accept=".json, .csv"
                                    />
                                    <div className="w-full flex justify-between items-center gap-3">
                                        <span>Add New Collection</span>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            variant={'outline'}
                                        >
                                            {' '}
                                            <Import /> Infer
                                        </Button>
                                    </div>
                                </DialogTitle>
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
                                                            'field name is required',
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
                                                    <SelectValue
                                                        placeholder={
                                                            supportedDataTypes[0]
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {supportedDataTypes.map(
                                                        (type) => (
                                                            <SelectItem
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                            className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-4"
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
                                <ErrorMessage
                                    message={errors.metadata?.title?.message}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Description
                                </label>
                                <Input
                                    {...register('metadata.description', {
                                        required: 'Description is required',
                                    })}
                                    placeholder="Short description (e.g., Collection of e-commerce data)"
                                />
                                <ErrorMessage
                                    message={
                                        errors.metadata?.description?.message
                                    }
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
                                    {...register('metadata.category', {
                                        required: 'Category is required',
                                    })}
                                    placeholder="Enter category (e.g., Machine Learning)"
                                />
                                <ErrorMessage
                                    message={errors.metadata?.category?.message}
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
                                <ErrorMessage
                                    message={
                                        errors.metadata?.access_type?.message
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Full Description
                                </label>
                                <Textarea
                                    {...register('metadata.full_description', {
                                        required:
                                            'Full description is required',
                                    })}
                                    placeholder="Detailed description of the dataset or content."
                                />
                                <ErrorMessage
                                    message={
                                        errors.metadata?.full_description
                                            ?.message
                                    }
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
                                <ErrorMessage
                                    message={errors.metadata?.status?.message}
                                />
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
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            <DialogClose />
        </Dialog>
    );
};

export default AddCollectionModal;
