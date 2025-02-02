'use client';

import { getDocumentSchema } from '@/app/actions/datasets';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function DatasetViewTable() {
    const { id: databaseId } = useParams();
    const searchParams = useSearchParams();

    const collection = searchParams.get('col') as string;

    const [schema, setSchema] = useState<
        Awaited<ReturnType<typeof getDocumentSchema>>
    >([]);

    useEffect(() => {
        (async () => {
            const schema = await getDocumentSchema({
                database: databaseId as string,
                collection,
            });

            if (schema) {
                setSchema(schema);
            }
        })();
    }, [databaseId, collection]);

    return (
        <Table key={`${databaseId}-${collection}`}>
            <TableCaption>Documents.</TableCaption>
            <TableHeader>
                <TableRow>
                    {schema?.map((schema) => (
                        <TableHead className="w-[100px]">
                            {schema.name}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

export default DatasetViewTable;
