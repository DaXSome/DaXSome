import {
    deleteDocument,
    getData,
    getDocumentSchema,
    saveData,
} from '@/app/actions/datasets';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { useLoadingStore } from '@/states/app';
import { readFile } from '@/utils';
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useParams, useSearchParams } from 'next/navigation';
import { memo, useEffect, useMemo, useState } from 'react';

type Data = Record<string, unknown>;

const useDataTable = (page: number) => {
    const { id: databaseId } = useParams();
    const searchParams = useSearchParams();

    const collection = searchParams.get('col') as string;

    const [columns, setColumns] = useState<
        Awaited<ReturnType<typeof getDocumentSchema>>
    >([]);

    const [data, setData] = useState<Data[]>([]);
    const [originalData, setOriginalData] = useState<Data[]>([]);
    const [count, setCount] = useState(0);

    const { toggleLoading } = useLoadingStore();

    const addRow = () => {
        if (!columns) return;

        const newRow = columns.reduce(
            (acc, col) => ({ ...acc, [col.name]: '' }),
            {}
        );
        setData((prev) => [...prev, newRow]);
        table.setPageSize(data.length + 1);
    };

    const removeRow = async (index: number) => {
        const newRows = data.filter((_, i) => i !== index);

        const currentRowId = data[index]._id;

        if (currentRowId) {
            await deleteDocument(currentRowId as string);
        }

        setData((_) => [...newRows]);
    };

    const updateCell = (
        rowIndex: number,
        columnName: string,
        value: string
    ) => {
        if (!columns) return;

        const column = columns.find((col) => col.name === columnName);
        if (!column) return;

        let newValue: unknown;

        switch (column.type) {
            case 'string':
                newValue = value;
                break;
            case 'number':
                newValue = parseFloat(value);
                break;
            case 'boolean':
                newValue = value === 'true';
                break;
        }

        setData((prevData) =>
            prevData.map((row, idx) =>
                idx === rowIndex ? { ...row, [columnName]: newValue } : row
            )
        );
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        const { data } = await readFile(file);

        toggleLoading();

        await saveData({
            hostname: window.location.hostname,
            database: databaseId as string,
            collection,
            data,
        });

        toggleLoading();

        window.location.reload();
    };

    const save = async () => {
        toggleLoading();

        await saveData({
            hostname: window.location.hostname,
            database: databaseId as string,
            collection,
            data,
        });

        toggleLoading();

        setOriginalData(data);
    };

    const getCellColor = (id: string, key: string) => {
        if (!id) return;

        const originalDoc = originalData.find((d) => d._id === id);
        const currentDoc = data.find((d) => d._id === id);

        if (!originalDoc || !currentDoc) return 'red';

        if (currentDoc[key] != originalDoc[key]) {
            return 'yellow';
        }
    };

    interface ColumnDefinition {
        name: string;
        type: 'string' | 'number';
    }

    const EditableCell = memo(({ getValue, row, column, table }: any) => {
        const initialValue = getValue();
        const columnMeta = table.options.meta?.columnsDef.find(
            (col: ColumnDefinition) => col.name === column.id
        );

        const [value, setValue] = useState(initialValue);

        const onBlur = () => {
            updateCell(row.index, column.id, value);
        };

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        return (
            <ContextMenu>
                <ContextMenuContent>
                    <ContextMenuItem onClick={addRow}>Add row</ContextMenuItem>
                    <ContextMenuItem onClick={() => removeRow(row.index)}>
                        Remove row
                    </ContextMenuItem>
                </ContextMenuContent>
                <ContextMenuTrigger>
                    <Input
                        style={{
                            borderColor:
                                initialValue !== value ? 'yellow' : 'gray',
                            borderWidth: initialValue !== value ? '5px' : '1px',
                        }}
                        type={columnMeta?.type === 'number' ? 'number' : 'text'}
                        value={value as string}
                        onChange={(e) =>
                            setValue(
                                columnMeta?.type === 'number'
                                    ? Number.parseFloat(e.target.value)
                                    : e.target.value
                            )
                        }
                        onBlur={onBlur}
                    />
                </ContextMenuTrigger>
            </ContextMenu>
        );
    });

    EditableCell.displayName = 'EditableCell';

    const tableColumns = useMemo<ColumnDef<Record<string, any>>[]>(
        () => [
            {
                accessorKey: '#',
                header: '#',
                cell: ({ row }) => row.index + 1,
            },
            ...(columns ?? []).map((col) => ({
                accessorKey: col.name,
                header: () => (
                    <div>
                        <div>{col.name}</div>
                        <div className="text-xs text-gray-500">{col.type}</div>
                    </div>
                ),
                cell: EditableCell,
            })),
        ],
        [columns]
    );

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        meta: {
            columnsDef: columns,
        },
    });

    useEffect(() => {
        (async () => {
            toggleLoading();

            const [schema, documents] = await Promise.all([
                getDocumentSchema({
                    database: databaseId as string,
                    collection,
                }),

                getData(databaseId as string, collection, page),
            ]);

            toggleLoading();

            if (schema) {
                setColumns(schema);

                setData(documents.data);
                setOriginalData(documents.data);
                setCount(documents.count);
            }
        })();
    }, [databaseId, collection, page]);

    return {
        table,
        data,
        count,
        columns,
        removeRow,
        addRow,
        updateCell,
        getCellColor,
        handleFileUpload,
        save,
    };
};

export default useDataTable;
