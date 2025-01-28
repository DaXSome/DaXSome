"use client";
import { useState , useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { dropCollection, dropDatabase, saveData } from "@/app/actions/datasets";

import { DatasetInfo } from "@/types";

import { AppSidebar } from "@/app/datasets/my/manage/SideBar";
import DashboardView from "./DashboardView";
import { useUser } from "@clerk/nextjs";

type Data = Record<string, unknown>;

interface Props {
  collections: string[];
  data: Data[];
  count: number;
}

const DatasetManager = ({ collections, data, count }: Props) => {
  const [tableData, setTableData] = useState<Data[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [datasetInfo, _] = useState<DatasetInfo | null>(null);

  const params = useSearchParams();
  const { user } = useUser();

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

  const dropActions = async (action: "database" | "collection" | "dataset") => {
    if (!user || !confirm("This action can't be undone")) return;

    switch (action) {
      case "database":
        await dropDatabase(database);
        break;
      case "collection":
        await dropCollection(collection);
        break;
    }

    window.location.href = generatePaginationLink(currentPage);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      // const info = await getDatasetInfo({ database, collection });
      // setDatasetInfo(info);

      setIsLoading(false);
    })();
  }, []);

  // if (!database) {
  //   redirect("/datasets/my");
  // }

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4 w-full h-full gap-5">
        <AppSidebar/>

        <DashboardView/>

      </div>
    </div>
  );
};

export default DatasetManager;
