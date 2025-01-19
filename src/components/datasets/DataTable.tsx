"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import useDataTable from "@/hooks/Datatable";

type Data = Record<string, unknown>;

export function DataTable({
  data,
  setData,
}: {
  data: Data[];
  setData: (data: Data[]) => void;
}) {
  const {
    columns,
    handleFileUpload,
    updateCell,
    addRow,
    updateColumnType,
    updateColumnName,
    removeColumn,
    addColumn,
  } = useDataTable({ data, setData });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="border border-gray-300 p-2">
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Input
                        value={column.name}
                        onChange={(e) =>
                          updateColumnName(index, e.target.value)
                        }
                        className="mb-2"
                      />
                      <Select
                        value={column.type}
                        onValueChange={(value: ColumnType) =>
                          updateColumnType(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                      <ContextMenuItem onClick={addColumn}>
                        Insert column
                      </ContextMenuItem>

                      <ContextMenuItem onClick={() => removeColumn(index)}>
                        Remove
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="w-full border border-gray-300 p-2"
                  >
                    <ContextMenu>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={addRow}>
                          Add row
                        </ContextMenuItem>
                      </ContextMenuContent>
                      <ContextMenuTrigger>
                        <Textarea
                          className="relative focus:h-60 focus:w-60 w-50 h-50 transition-all resize-none overflow-hidden"
                          value={(row[column.name] as string) || ""}
                          onChange={(e) =>
                            updateCell(rowIndex, column.name, e.target.value)
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
