"use client";
import DatabaseCard from "@/components/datasets/DatabaseCard";
import React from "react";

const DatabasesGrid = () => {
  const handleViewDatabaseDetails = () => {
    console.log("view details of database");
  };
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
      <DatabaseCard
        name="Sample Database"
        dateCreated="2023-01-01"
        description="This is a sample database description."
        onViewDetails={handleViewDatabaseDetails}
      />

      <DatabaseCard
        name="Sample Database"
        dateCreated="2023-01-01"
        description="This is a sample database description."
        onViewDetails={handleViewDatabaseDetails}
      />

      <DatabaseCard
        name="Sample Database"
        dateCreated="2023-01-01"
        description="This is a sample database description."
        onViewDetails={handleViewDatabaseDetails}
      />

      <DatabaseCard
        name="Sample Database"
        dateCreated="2023-01-01"
        description="This is a sample database description."
        onViewDetails={handleViewDatabaseDetails}
      />

      <DatabaseCard
        name="Sample Database"
        dateCreated="2023-01-01"
        description="This is a sample database description."
        onViewDetails={handleViewDatabaseDetails}
      />
    </div>
  );
};

export default DatabasesGrid;
