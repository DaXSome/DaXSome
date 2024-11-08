"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type Dataset = {
  updated_at: string;
  name: string;
  category: string;
  tags: string[];
  access_type: string;
  full_description: string;
  use_cases: string;
  asset_url: string;
  description: string;
  id: string;
};

interface Props {
  datasets: Dataset[];
}

export default function Datasets({ datasets }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccessType, setSelectedAccessType] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const filteredDatasets =
    selectedCategory === "all"
      ? datasets
      : datasets.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "" ||
              dataset.category === selectedCategory) &&
            (selectedAccessType === "" ||
              dataset.access_type === selectedAccessType),
        );

  const categories = Array.from(
    new Set(datasets.map((dataset) => dataset.category)),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Our Datasets</h1>
        <p className="text-xl text-muted-foreground">
          Discover DaXSome&apos;s curated datasets
        </p>
      </header>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search datasets
            </Label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search datasets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={selectedAccessType}
            onValueChange={setSelectedAccessType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Access Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Access Type</SelectLabel>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className={"border-primary"}>
            <CardHeader>
              <CardTitle>{dataset.name}</CardTitle>
              <CardDescription>{dataset.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{dataset.description}</p>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge
                variant={
                  dataset.access_type === "Free" ? "default" : "destructive"
                }
              >
                {dataset.access_type}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated: {new Date(dataset.updated_at).toLocaleDateString()}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDataset(dataset)}
                  >
                    View Details <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>{selectedDataset?.name}</DialogTitle>
                    <DialogDescription>
                      {selectedDataset?.category}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p>{selectedDataset?.full_description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Use Cases:</h4>
                      <p>{selectedDataset?.use_cases}</p>
                    </div>
                  </div>
                  {selectedDataset?.asset_url && (
                    <DialogFooter>
                      <Link href={selectedDataset?.asset_url}>
                        <Button>Download</Button>
                      </Link>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
