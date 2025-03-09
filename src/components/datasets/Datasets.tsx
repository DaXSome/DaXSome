'use client';

import {
    InstantSearch,
    Hits,
    SearchBox,
    Configure,
    Pagination,
    Stats,
    useHits,
} from 'react-instantsearch';
import 'instantsearch.css/themes/satellite.css';
import { useSearchParams } from 'next/navigation';
import { searchClient } from '@/utils';
import FacetSidebar from './search/FacetSidebar';
import { SearchResultItem } from './search/SearchResultsItem';
import { DatasetInfo } from '@/types';

export default function Datasets() {
    const params = useSearchParams();

    return (
        <div className="flex flex-col w-full ">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    Explore Our Datasets
                </h1>
                <p className="text-xl text-muted-foreground">
                    Discover DaXSome&apos;s curated datasets
                </p>
            </header>

            <div className="">
                <InstantSearch
                    searchClient={searchClient}
                    initialUiState={{
                        datasets: {
                            query: params.get('query')!,
                        },
                    }}
                    indexName="datasets"
                >
                    <div className="min-h-screen flex flex-col bg-gray-50">
                        <header className="bg-white shadow-sm">
                            <div className=" flex  justify-center mb-4">
                                <SearchBox />
                            </div>
                        </header>
                        <main className="container mx-auto px-4 py-8 flex">
                            <aside className="hidden md:block">
                                <FacetSidebar />
                            </aside>
                            <div className="w-full md:ml-8">
                                <Configure hitsPerPage={10} />
                                <Stats />
                                <div className="mb-4">
                                    <CustomHits />
                                </div>

                                <Pagination />
                            </div>
                        </main>
                    </div>
                </InstantSearch>
            </div>
        </div>
    );
}

const CustomHits = () => {
    const hits = useHits<DatasetInfo>();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
            {hits.items.map((hit) => (
                <SearchResultItem key={hit.objectID} hit={hit} />
            ))}
        </div>
    );
};
