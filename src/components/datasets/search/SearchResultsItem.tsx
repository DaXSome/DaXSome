import { DatasetInfo } from '@/types';
import { Hit } from 'algoliasearch';
import DatasetCard from '../DatasetCard';

interface SearchResultItemProps {
    hit: Hit<DatasetInfo>;
}

export const SearchResultItem = ({ hit }: SearchResultItemProps) => {
    return <DatasetCard dataset={hit} />;
};
