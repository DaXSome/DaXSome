import React from "react";
import { Button } from "../ui/button";

interface DatabaseCardProps {
  name: string;
  dateCreated: string;
  description: string;
  onViewDetails: () => void;
}

const DatabaseCard: React.FC<DatabaseCardProps> = ({
  name,
  dateCreated,
  description,
  onViewDetails,
}) => {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 m-4 max-w-md">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">
        Created on: {new Date(dateCreated).toLocaleDateString()}
      </p>
      <p className="text-gray-800">{description}</p>
      <Button
        onClick={onViewDetails}
        className="mt-4 py-2 px-4 rounded font-medium bg-transparent text-slate-500 hover:text-slate-50"
      >
        View Details
      </Button>
    </div>
  );
};

export default DatabaseCard;
