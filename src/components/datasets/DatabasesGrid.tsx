'use client';

import { Database } from '@/backend/models/databases';
import DatabaseCard from '@/components/datasets/DatabaseCard';
import React from 'react';

interface Props {
    databases: Database[];
}

const DatabasesGrid = ({ databases }: Props) => {
    const handleViewDatabaseDetails = () => {
        console.log('view details of database');
    };

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
            {databases.map((db) => (
                <DatabaseCard
                    key={db.id}
                    name={db.name}
                    dateCreated={db.createdAt.toISOString()}
                    description={db.metadata?.description || 'No description'}
                    onViewDetails={handleViewDatabaseDetails}
                />
            ))}
        </div>
    );
};

export default DatabasesGrid;
