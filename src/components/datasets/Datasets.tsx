"use client";

import { useState } from "react";
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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DatasetMeta } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import DatasetCard from "./DatasetCard";
import Link from "next/link";

interface Props {
  datasets: DatasetMeta[];
  categories: string[];
}

export default function Datasets({ datasets, categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const selectedCategory = params.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccessType] = useState("");

  const { user, isLoaded } = useUser();

  const handleCategoryChange = (category: string) => {
    router.push(`?category=${category}`);
  };

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedAccessType === "" || dataset.access_type === selectedAccessType),
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

          {user && isLoaded && (
            <Link href={"/datasets/my"} >
              <Button className="text-white">My Datasets</Button>{" "}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredDatasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>
    </div>
  );
}
