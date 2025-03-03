'use client';

import { Fragment, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
// import { useRouter, useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import DatasetCard from './DatasetCard';
import Link from 'next/link';
import { DatasetInfo } from '@/types';
import { Textarea } from '../ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { NLPSearch } from '@/app/actions/datasets';

interface Props {
    datasets: DatasetInfo[];
    categories: string[];
}

export default function Datasets({ datasets }: Props) {
    // const router = useRouter();
    // const params = useSearchParams();

    // const selectedCategory = params.get("category") || "All";

    const [searchTerm, setSearchTerm] = useState('');
    // const [selectedAccessType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filteredDatasets, setFilteredDatasets] = useState(datasets);

    // const handleCategoryChange = (category: string) => {
    //   router.push(`?category=${category}`);
    // };

    const handleSearch = async () => {
        setIsLoading(true)

        const res = await NLPSearch(searchTerm);
            console.log({res})

        if (res) {
            setFilteredDatasets(res);
        }

        setIsLoading(false)
    };

    return (
        <div className="container mx-auto px-4 py-8 ">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    Explore Our Datasets
                </h1>
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
                            <Textarea
                                id="search"
                                placeholder={'Ask me for a dataset...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />

                            <Button
                                type="submit"
                                className="flex gap-2 w-full mt-4 text-white"
                                disabled={isLoading || !searchTerm.trim()}
                            >
                                {isLoading ? (
                                    <Fragment>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </Fragment>
                                ) : (
                                    <span className="flex gap-2 items-center" onClick={handleSearch}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                    {/* <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
          </Select> */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredDatasets.map((dataset) => (
                    <DatasetCard key={dataset._id} dataset={dataset} />
                ))}
            </div>
        </div>
    );
}
