"use client";

import { useEffect, useState } from "react";
import { CollectionSelector } from "@/components/datasets/CollectionSelector";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { redirect, useSearchParams } from "next/navigation";
import { getDatasetInfo, saveData } from "@/app/actions/datasets";
import DatasetInfoBtn from "./DatasetInfoBtn";
import { DatasetInfo } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const database = params.get("database") as string;
  const currentPage = parseInt(params.get("page") || "0");

  const collection = params.get("collection") || collections[0];

  const totalPages = Math.ceil(count / 10);

  const handleSaveData = async () => {
    if (tableData.length === 0) {
      return;
    }

    setIsLoading(true);

    const inserts: typeof tableData = [];
    const updates: typeof tableData = [];

    for (const currentData of tableData) {
      if (!currentData._id) {
        const fmttedData = { ...currentData };

        delete fmttedData._id;

        inserts.push(fmttedData);
      } else {
        const originalData = data.find((d) => d._id === currentData._id);

        if (JSON.stringify(originalData) != JSON.stringify(currentData)) {
          updates.push(currentData);
        }
      }
    }

    await saveData({ db: database, collection, inserts, updates });

    setIsLoading(false);

    window.location.href = `/datasets/my/manage?database=${database}&collection=${collection}`;
  };

  const generatePaginationLink = (page: number) => {
    return `/datasets/my/manage?database=${database}&collection=${collection}&page=${page}`;
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const info = await getDatasetInfo({ database, collection });
      setDatasetInfo(info);

      setIsLoading(false);
    })();
  }, []);

  if (!database) {
    redirect("/datasets/my");
  }

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
              database={database}
              collection={collection}
              data={tableData}
              setData={setTableData}
            />

            <div className="flex justify-between items-center mt-4">
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
                    (_, index) => index + 1,
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
                                ? "font-bold text-blue-500"
                                : ""
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
