"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { parseDatasetSlug } from "@/utils";

const CreateNewDataset = () => {
  const [databaseName, setDatabaseName] = useState("");
  const [collectionName, setCollectionName] = useState("");

  const router = useRouter();

  const createNewDataset = () => {
    if (!databaseName || !collectionName) return;

    router.push(
      `/datasets/my/manage?database=${parseDatasetSlug(databaseName)}&collection=${parseDatasetSlug(collectionName)}`,
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Card className="flex flex-col h-full justify-center hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-gray-900">
              Create New
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center text-muted-foreground">
            <PlusIcon className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create new Database</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            <Input
              placeholder="Database Name"
              onChange={(e) => setDatabaseName(e.target.value)}
            />

            <Input
              placeholder="Collection Name"
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={createNewDataset}>
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewDataset;
