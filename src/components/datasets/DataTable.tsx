'use client';
import { Import, Plus, Save } from 'lucide-react';
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

export function DataTable() {
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;

    const { data, table, columns, count, handleFileUpload, addRow, save } =
        useDataTable(currentPage);

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
                <Button
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
                <Button
                    className="font-semibold text-slate-50"
                    variant={'secondary'}
                    onClick={handleSave}
                >
                    {' '}
                    <Save /> Save
                </Button>
            </div>

            <div className="rounded-md border">
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
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
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns?.length! + 1}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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
                                        href={generatePaginationLink(page)}
                                        className={
                                            page === currentPage
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

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                href={generatePaginationLink(currentPage + 1)}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
