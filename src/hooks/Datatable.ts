import { useState } from "react";

type Data = Record<string, unknown>;
type ColumnType = "string" | "number" | "boolean" | "date" | "array";

interface Column {
  name: string;
  type: ColumnType;
}
const useDataTable = ({
  data,
  setData,
}: {
  data: Data[];
  setData: (data: Data[]) => void;
}) => {
  const [columns, setColumns] = useState<Column[]>(
    data.length === 0
      ? []
      : Object.keys(data[0]).map(
          (name) =>
            ({
              name,
              type: Array.isArray(data[0][name])
                ? "array"
                : (typeof data[0][name] as ColumnType),
            }) as Column,
        ),
  );

  const addColumn = () => {
    const newColumn: Column = {
      name: `Column ${columns.length + 1}`,
      type: "string",
    };
    setColumns([...columns, newColumn]);
    setData(data.map((row) => ({ ...row, [newColumn.name]: "" })));
  };

  const removeColumn = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
    setData(
      data.map((row) => {
        const newRow = { ...row };
        delete newRow[columns[index].name];
        return newRow;
      }),
    );
  };

  const updateColumnName = (index: number, newName: string) => {
    const oldName = columns[index].name;
    const newColumns = columns.map((col, i) =>
      i === index ? { ...col, name: newName } : col,
    );
    setColumns(newColumns);
    setData(
      data.map((row) => {
        const newRow = { ...row };
        newRow[newName] = newRow[oldName];
        delete newRow[oldName];
        return newRow;
      }),
    );
  };

  const updateColumnType = (index: number, newType: ColumnType) => {
    setColumns(
      columns.map((col, i) => (i === index ? { ...col, type: newType } : col)),
    );
  };

  const addRow = () => {
    const newRow = columns.reduce(
      (acc, col) => ({ ...acc, [col.name]: "" }),
      {},
    );
    setData([...data, newRow]);
  };

  const updateCell = (rowIndex: number, columnName: string, value: string) => {
    const column = columns.find((col) => col.name === columnName);

    if (!column) return;

    let newValue;

    switch (column.type) {
      case "string":
        newValue = value;
        break;
      case "number":
        newValue = parseFloat(value);
        break;
      case "boolean":
        newValue = value === "true";
        break;
      case "date":
        newValue = new Date(value);
        break;
      case "array":
        newValue = value.split(",");
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
        const lines = content.split("\n");
        const headers = lines[0].split(",");
        const newColumns = headers.map((header) => ({
          name: header.trim(),
          type: "String" as ColumnType,
        }));
        setColumns(newColumns);
        const newData = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce(
            (acc, header, index) => ({
              ...acc,
              [header.trim()]: values[index]?.trim() || "",
            }),
            {},
          );
        });
        setData(newData);
      };
      reader.readAsText(file);
    }
  };

  return {
    columns,
    addColumn,
    removeColumn,
    updateColumnName,
    updateColumnType,
    addRow,
    updateCell,
    handleFileUpload,
  };
};

export default useDataTable;
