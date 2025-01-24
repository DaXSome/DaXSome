import { deleteDocument } from "@/app/actions/datasets";
import { ColumnType } from "@/types";
import { useState } from "react";

type Data = Record<string, unknown>;

interface Column {
  name: string;
  type: ColumnType;
}
const useDataTable = ({
  data,
  database,
  collection,
  setData,
}: {
  data: Data[];
  database: string;
  collection: string;
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

  const removeRow = async (index: number) => {
    const newRows = data.filter((_, i) => i !== index);

    const currentRowId = data[index]._id;

    if (currentRowId) {
      await deleteDocument({
        database,
        collection,
        id: currentRowId as string,
      });
    }

    setData(newRows);
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

        let headers: Array<string> = [];
        let columns: Array<{ name: string; type: ColumnType }> = [];
        let data: Array<Record<string, unknown>> = [];

        const ext = file.name.split(".")[1];

        switch (ext) {
          case "json":
            try {
              data = JSON.parse(content);

              if (Array.isArray(data)) {
                headers = Object.keys(data[0]);
                columns = headers.map((header) => ({
                  name: header.trim(),
                  type: typeof data[0][header] as ColumnType,
                }));
              }
            } catch (error) {
              //TODO:Alert user
              console.error("Error parsing JSON file:", error);
            }
            break;

          case "csv":
            const lines = content.split("\n");
            headers = lines[0].split(",");
            columns = headers.map((header) => ({
              name: header.trim(),
              type: typeof header as ColumnType,
            }));
            data = lines.slice(1).map((line) => {
              const values = line.split(",");
              return headers.reduce(
                (acc, header, index) => ({
                  ...acc,
                  [header.trim()]: values[index]?.trim() || "",
                }),
                {},
              );
            });
            break;
        }

        setColumns(columns);
        setData(data);
      };

      reader.readAsText(file);
    }
  };

  return {
    columns,
    addColumn,
    removeRow,
    removeColumn,
    updateColumnName,
    updateColumnType,
    addRow,
    updateCell,
    handleFileUpload,
  };
};

export default useDataTable;
