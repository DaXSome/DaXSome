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

const CreateNewDataset = () => {
  const [datasetName, setDatasetName] = useState("");
  const router = useRouter();

  const createNewDataset = () => {
    if (!datasetName) return;

    router.push(`/datasets/my/manage?database=${datasetName}`);
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
          <AlertDialogTitle>Create new Dataset</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              placeholder="Dataset Name"
              onChange={(e) => setDatasetName(e.target.value)}
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
