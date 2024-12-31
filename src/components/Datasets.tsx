"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { DatasetMeta } from "@/types";
import { parseDatasetSlug } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  datasets: DatasetMeta[];
  categories: string[];
}

export default function Datasets({ datasets, categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const selectedCategory = params.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccessType, setSelectedAccessType] = useState("");

  const handleCategoryChange = (category: string) => {
    router.push(`?category=${category}`);
  };

  const filteredDatasets =
    selectedCategory === "All"
      ? datasets
      : datasets.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedAccessType === "" ||
              dataset.access_type === selectedAccessType),
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
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="All">All Categories</SelectItem>
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
        {filteredDatasets.map((dataset) => {
          const isPublished = dataset.status === "published";

          return (
            <Link
              key={dataset._id}
              href={
                !isPublished
                  ? "#"
                  : `/datasets/${parseDatasetSlug(dataset.name)}`
              }
              className="h-full"
            >
              <Card className="border-primary h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{dataset.name}</CardTitle>
                  <CardDescription>{dataset.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-4 line-clamp-3">{dataset.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  {isPublished ? (
                    <Badge
                      variant={
                        dataset.access_type === "Free"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {dataset.access_type}
                    </Badge>
                  ) : (
                    <Badge variant={"destructive"}>Coming Soon</Badge>
                  )}
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
