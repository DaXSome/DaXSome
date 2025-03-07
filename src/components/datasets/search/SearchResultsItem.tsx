import { DatasetInfo } from '@/types';
import { Hit } from 'algoliasearch';
import DatasetCard from '../DatasetCard';

interface SearchResultItemProps {
    hit: Hit<DatasetInfo>;
}

export const SearchResultItem = ({ hit }: SearchResultItemProps) => {
    return (
        <div className="flex w-full">
            <DatasetCard dataset={hit} />
        </div>
    );
};
