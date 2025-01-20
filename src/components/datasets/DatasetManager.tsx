"use client";

import { useState } from "react";
import { CollectionSelector } from "@/components/datasets/CollectionSelector";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { saveData } from "@/app/actions/datasets";

type Data = Record<string, unknown>;

interface Props {
  collections: string[];
  data: Data[];
  count: number;
}

const DatasetManager = ({ collections, data, count }: Props) => {
  const [tableData, setTableData] = useState<Data[]>(data);
  const [isLoading, setIsLoading] = useState(false);

  const params = useSearchParams();

  const database = params.get("database");

  if (!database) return redirect("/datasets/my");

  const collection = params.get("collection") || collections[0];

  const handleSaveData = async () => {
    if (tableData.length === 0) {
      return;
    }

    setIsLoading(true);

    await saveData(database, collection, tableData);

    setIsLoading(false);

    window.location.href = `/datasets/my/manage?database=${database}&collection=${collection}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{database} Database</h1>
      <div className="space-y-4">
        {database && (
          <CollectionSelector
            key={database}
            selectedCollection={collection!}
            collections={collections}
            database={database}
          />
        )}
        {collection && (
          <>
            <span className="mt-4 mb-4">{count} Documents </span>
            <DataTable
              key={`${database}-${collection}-${count}`}
              data={tableData}
              setData={setTableData}
            />
            <Button disabled={isLoading} onClick={handleSaveData}>
              Save Data
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DatasetManager;
