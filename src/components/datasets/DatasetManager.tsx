"use client";

import { useEffect, useState } from "react";
import { CollectionSelector } from "@/components/datasets/CollectionSelector";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { redirect, useSearchParams } from "next/navigation";
import { getDatasetInfo, saveData } from "@/app/actions/datasets";
import DatasetInfoBtn from "./DatasetInfoBtn";
import { DatasetInfo } from "@/types";

type Data = Record<string, unknown>;

interface Props {
  collections: string[];
  data: Data[];
  count: number;
}

const DatasetManager = ({ collections, data, count }: Props) => {
  const [tableData, setTableData] = useState<Data[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);

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

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const info = await getDatasetInfo({ database, collection });
      setDatasetInfo(info);

      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{database} Database</h1>
      <div className="space-y-4">
        {database && (
          <div className="flex items-center justify-between">
            <CollectionSelector
              key={database}
              selectedCollection={collection!}
              collections={collections}
              database={database}
            />

            <DatasetInfoBtn
              key={datasetInfo?._id}
              database={database}
              collection={collection}
              info={datasetInfo}
              isLoading={isLoading}
            />
          </div>
        )}
        {collection && (
          <div className="flex flex-col gap-2">
            <DataTable
              key={`${database}-${collection}-${count}`}
              data={tableData}
              setData={setTableData}
            />

            <span className="mt-4 mb-4 text-gray-600">{count} Documents </span>

            <Button disabled={isLoading} onClick={handleSaveData}>
              Save Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetManager;
