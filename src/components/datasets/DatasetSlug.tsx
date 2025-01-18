"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DatasetInfo } from "@/types";
import { sendGAEvent } from "@next/third-parties/google";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface Props {
  dataset: DatasetInfo;
}

export function DatasetView({ dataset }: Props) {
  const headers = Object.keys(dataset.sample[0]);

  const { user, isLoaded } = useUser();

  const handleDownload = () => {
    sendGAEvent({ event: "download", value: dataset.name });

    const a = document.createElement("a");

    a.href = dataset.asset_url;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex gap-2 justify-between">
          <h1 className="text-4xl font-bold mb-2">{dataset.name}</h1>
          {user && user.id === dataset.user_id && (
            <Link
              href={`/datasets/my/manage?database=${dataset.database}&collection=${dataset.sample_collection}`}
            >
              <Button className="text-white">Edit</Button>
            </Link>
          )}
        </div>
        <p className="text-xl text-muted-foreground mb-4">
          {dataset.description}
        </p>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h2 className="text-sm font-semibold">Format</h2>
                <p>{dataset.format.join(", ")}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold">Last Updated</h2>
                <p>{new Date(dataset.updated_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold">Tags</h2>
                <p>{dataset.tags.join(", ")}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold">Category</h2>
                <p>{dataset.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Preview</h2>
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header}>{header.toUpperCase()}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataset.sample.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="border-b">
                    {headers.map((header) => (
                      <TableCell
                        key={header}
                        className="px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {row[header as keyof typeof row]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>{" "}
            </Table>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                Showing {dataset.sample.length} of {dataset.total}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Export Options</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownload}
                  className="w-full sm:w-auto"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as CSV
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download the full dataset in CSV format</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </div>
  );
}
