import {
    deleteDocument,
    getData,
    getDocumentSchema,
    saveData,
} from '@/app/actions/datasets';
import { readFile } from '@/utils';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Data = Record<string, unknown>;

const useDataTable = () => {
    const { id: databaseId } = useParams();
    const searchParams = useSearchParams();

    const collection = searchParams.get('col') as string;

    const [columns, setColumns] = useState<
        Awaited<ReturnType<typeof getDocumentSchema>>
    >([]);

    const [data, setData] = useState<Data[]>([]);
    const [originalData, setOriginalData] = useState<Data[]>([]);

    const addRow = () => {
        if (!columns) return;

        const newRow = columns.reduce(
            (acc, col) => ({ ...acc, [col.name]: '' }),
            {}
        );
        setData([...data, newRow]);
    };

    const removeRow = async (index: number) => {
        const newRows = data.filter((_, i) => i !== index);

        const currentRowId = data[index]._id;

        if (currentRowId) {
            await deleteDocument(currentRowId as string);
        }

        setData(newRows);
    };

    const updateCell = (
        rowIndex: number,
        columnName: string,
        value: string
    ) => {
        if (!columns) return;

        const column = columns.find((col) => col.name === columnName);

        if (!column) return;

        let newValue;

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

        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [columnName]: newValue };
        setData(newData);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const { data } =await readFile(file)

        setData(data)
    };

    const save = async () => {
        await saveData({
            hostname: window.location.hostname,
            database: databaseId as string,
            collection,
            data,
        });

        setOriginalData(data)
    };


    
    const getCellColor = (id: string, key: string) => {
        if (!id) return;

        const originalDoc = originalData.find((d) => d._id === id);
        const currentDoc = data.find((d) => d._id === id);

        if (!originalDoc || !currentDoc) return "red"


        if (currentDoc[key] != originalDoc[key]) {
            return "yellow"
        }
    };

    useEffect(() => {
        (async () => {
            const [schema, documents] = await Promise.all([
                getDocumentSchema({
                    database: databaseId as string,
                    collection,
                }),


                getData(
                    databaseId as string,
                    collection,
                    "0"
                )
            ]);

            if (schema) {
                setColumns(schema);

                setData(documents.data)
                setOriginalData(documents.data)
            }
        })();
    }, [databaseId, collection]);

    return {
        data,
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
