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

const datasets = [
  {
    name: "KNUST 2023-2024 Admission",
    category: "Education",
    description:
      "Data on gained admissions to KNUST for the 2023-2024 academic year.",
    tags: ["Education", "KNUST", "University"],
    featured: true,
    accessType: "Free",
    fullDescription:
      "This dataset provides comprehensive information on gained admission to KNUST for the 2023-2024 academic year. It includes data on admission programmes, location, and more.",
    useCases: "Admission planning, educational research, policy evaluation",
    assetUrl:
      "https://firebasestorage.googleapis.com/v0/b/exacheer-c9099.appspot.com/o/DaXSome%2Fdatasets%2Fust_admission_23_24.csv?alt=media&token=d433da53-e306-429c-b2f9-ac54c7bdf62c",
  },
  {
    name: "E-Commerce products dataset",
    category: "E-commerce",
    description: "Curated list of products from multiple e-commerce sites",
    tags: ["E-commerce", "Products"],
    featured: true,
    accessType: "Free",
    fullDescription:
      "Product data from multiple e-commerce sites. Includes product name, price, category, and more.",
    useCases: "E-commerce analysis, product recommendation",
    assetUrl:
      "https://firebasestorage.googleapis.com/v0/b/exacheer-c9099.appspot.com/o/DaXSome%2Fdatasets%2Fcedi-search.csv?alt=media&token=b5fe5fbc-aa0d-46ea-bdfd-a505af69348b",
  },
];

export default function DatasetsPageComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccessType, setSelectedAccessType] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<
    (typeof datasets)[number] | null
  >(null);

  const filteredDatasets =
    selectedCategory === "all"
      ? datasets
      : datasets.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "" ||
              dataset.category === selectedCategory) &&
            (selectedAccessType === "" ||
              dataset.accessType === selectedAccessType),
        );

  const categories = datasets.map((dataset) => dataset.category);

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
          <Card
            key={dataset.name}
            className={dataset.featured ? "border-primary" : ""}
          >
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
                  dataset.accessType === "Free" ? "default" : "destructive"
                }
              >
                {dataset.accessType}
              </Badge>
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
                    <p>{selectedDataset?.fullDescription}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Use Cases:</h4>
                      <p>{selectedDataset?.useCases}</p>
                    </div>
                  </div>
                  {selectedDataset?.assetUrl && (
                    <DialogFooter>
                      <Link href={selectedDataset?.assetUrl}>
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
