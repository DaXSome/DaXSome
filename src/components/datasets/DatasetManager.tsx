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
  const currentPage = parseInt(params.get("page") || "0");

  if (!database) return redirect("/datasets/my");

  const collection = params.get("collection") || collections[0];

  const totalPages = Math.ceil(count / 10);

  const handleSaveData = async () => {
    if (tableData.length === 0) {
      return;
    }

    setIsLoading(true);

    await saveData(database, collection, tableData);

    setIsLoading(false);

    window.location.href = `/datasets/my/manage?database=${database}&collection=${collection}`;
  };

  const handlePageChange = (newPage: number) => {
    window.location.href = `/datasets/my/manage?database=${database}&collection=${collection}&page=${newPage}`;
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
              key={`${database}-${collection}-${currentPage}`}
              data={data}
              setData={setTableData}
            />

            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  disabled={currentPage + 1 === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>

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
