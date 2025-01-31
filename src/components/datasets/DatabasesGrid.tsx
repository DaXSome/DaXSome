'use client';

import { getUserDbs } from '@/app/actions/datasets';
import DatabaseCard from '@/components/datasets/DatabaseCard';
import React from 'react';

interface Props {
    databases: Awaited<ReturnType<typeof getUserDbs>>
}

const DatabasesGrid = ({ databases }: Props) => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
            {databases && databases.map((db) => (
                <DatabaseCard
                    key={db.id}
                    id={db.id}
                    name={db.name}
                    collections={db.collections}
                    dateCreated={db.createdAt.toISOString()}
                    description={db.metadata?.description || 'No description'}
                />
            ))}
        </div>
    );
};

export default DatabasesGrid;
