'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import useDataTable from '@/hooks/useDatatable';
import { Button } from '../ui/button';
import { Import, Plus, Save } from 'lucide-react';
import { useRef } from 'react';
import clsx from 'clsx';

export function DataTable() {
    const {
        data,
        columns,
        handleFileUpload,
        updateCell,
        addRow,
        removeRow,
        save,
        getCellColor,
    } = useDataTable();

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-4">
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
            />

            <div className="w-full flex justify-end gap-3">
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
                    onClick={save}
                >
                    {' '}
                    <Save /> Save
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            {columns?.map((column, index) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 p-2"
                                >
                                    <Input
                                        disabled
                                        value={column.name}
                                        className="mb-2"
                                    />
                                    <Input
                                        disabled
                                        value={column.type}
                                        className="mb-2"
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns?.map((column, columnIndex) => (
                                    <td
                                        key={columnIndex}
                                        className=" border border-gray-300 p-2"
                                    >
                                        <ContextMenu>
                                            <ContextMenuContent>
                                                <ContextMenuItem
                                                    onClick={addRow}
                                                >
                                                    Add row
                                                </ContextMenuItem>
                                                <ContextMenuItem
                                                    onClick={() =>
                                                        removeRow(rowIndex)
                                                    }
                                                >
                                                    Remove row
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                            <ContextMenuTrigger>
                                                <Textarea
                                                    className={clsx(
                                                        'relative focus:h-60 focus:w-60 w-50 h-50 transition-all resize-none overflow-hidden ',
                                                        getCellColor(
                                                            data[rowIndex]
                                                                ._id as string,
                                                            column.name
                                                        )
                                                    )}
                                                    value={
                                                        (row[
                                                            column.name
                                                        ] as string) || ''
                                                    }
                                                    onChange={(e) =>
                                                        updateCell(
                                                            rowIndex,
                                                            column.name,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </ContextMenuTrigger>
                                        </ContextMenu>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
