'use client';
import { Import, Plus, Save, TrashIcon } from 'lucide-react';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { flexRender } from '@tanstack/react-table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useDataTable from '@/hooks/useDatatable';
import { useSearchParams } from 'next/navigation';
import { Badge } from '../ui/badge';
import clsx from 'clsx';
import { TOUR_STEP_IDS } from '@/lib/tour-constants';

export function DataTable() {
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '0')

    const {
        data,
        publishedState,
        table,
        count,
        handleFileUpload,
        addRow,
        removeRow,
        save,
    } = useDataTable(currentPage);

    const { toast } = useToast();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalPages = Math.ceil(count / 10);

    const handleSave = async () => {
        toast({ title: 'Saving...' });

        await save();

        toast({ title: 'Saved' });
    };

    const generatePaginationLink = (page: number) => {
        const url = new URL(window.location.href);

        url.searchParams.set('page', page.toString());

        return url.toString();
    };

    return (
        <div>
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".json, .csv"
            />

            <div className="w-full flex justify-end gap-3 mb-4">
                <Badge
                    id={TOUR_STEP_IDS.PUBLISHED_STATE}
                    className={clsx(
                        'text-white',
                        publishedState === 'Unpublished' && 'bg-yellow-500',
                        publishedState === 'Published' && 'bg-green-500',
                        publishedState === 'Pending' && 'bg-gray-500'
                    )}
                >
                    {publishedState}
                </Badge>
                <Button
                    id={TOUR_STEP_IDS.IMPORT_FILE}
                    onClick={() => fileInputRef.current?.click()}
                    variant={'outline'}
                >
                    {' '}
                    <Import /> import
                </Button>
                <Button
                    className="font-semibold text-slate-50"
                    onClick={addRow}
                >
                    {' '}
                    <Plus /> Add row
                </Button>
            </div>

            <div className="rounded-md border">
                {data.length > 0 && (
                    <Table key={data.length}>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody key={data.length}>
                            {table.getRowModel().rows?.length &&
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}

                                                                                    <TableCell >
                                            <TrashIcon onClick={() => removeRow(index)} className="text-red-500" />
                                            </TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className='flex mt-2'>
            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={generatePaginationLink(currentPage - 1)}
                            />
                        </PaginationItem>
                    )}

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => {
                        // Show pages within a range around the current page
                        const isWithinRange =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 2;

                        if (isWithinRange) {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={generatePaginationLink(page - 1)}
                                        className={
                                            page === currentPage + 1
                                                ? 'font-bold text-blue-500'
                                                : ''
                                        }
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }

                        // Handle ellipsis for skipped pages
                        const isEllipsis = Math.abs(page - currentPage) === 3;
                        if (isEllipsis) {
                            return (
                                <PaginationItem key={`ellipsis-${page}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return null;
                    })}

                    {currentPage + 1 < totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                href={generatePaginationLink(currentPage + 1)}
                            />
                        </PaginationItem>

                    )}
                </PaginationContent>
            </Pagination>

                            <Button
                    id={TOUR_STEP_IDS.SAVE_CHANGES}
                    className="font-semibold text-slate-50"
                    variant={'secondary'}
                    onClick={handleSave}
                >
                    {' '}
                    <Save /> Save
                </Button>

        </div>
        </div>
    );
}
