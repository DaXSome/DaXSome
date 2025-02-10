import {
    deleteDocument,
    getData,
    getDocumentSchema,
    saveData,
} from '@/app/actions/datasets';
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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;

                let headers: Array<string> = [];
                let data: Array<Record<string, unknown>> = [];

                const ext = file.name.split('.')[1];

                switch (ext) {
                    case 'json':
                        try {
                            data = JSON.parse(content);

                            if (Array.isArray(data)) {
                                headers = Object.keys(data[0]);
                            }
                        } catch (error) {
                            //TODO:Alert user
                            console.error('Error parsing JSON file:', error);
                        }
                        break;

                    case 'csv':
                        const lines = content.split('\n');
                        headers = lines[0].split(',');
                        data = lines.slice(1).map((line) => {
                            const values = line.split(',');
                            return headers.reduce(
                                (acc, header, index) => ({
                                    ...acc,
                                    [header.trim()]:
                                        values[index]?.trim() || '',
                                }),
                                {}
                            );
                        });
                        break;
                }

                setData(data);
            };

            reader.readAsText(file);
        }
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
