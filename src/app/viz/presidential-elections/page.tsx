"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppSkeleton from "@/components/AppSkeleton";
import { colors } from "@/utils";

interface Dataset {
  regional: Record<string, number>;
  party: Record<string, number>;
}

const loadDataset = async (file: string) => {
  const data = await import(`./datasets/${file}.json`);
  return data.default as Dataset;
};

export default function PresidentialElectionsPage() {
  const [datasets, setDatasets] = useState<Record<string, Dataset>>({});

  const years = Object.keys(datasets) as (keyof typeof datasets)[];

  const [selectedYears, setSelectedYears] = useState(years);

  useEffect(() => {
    const fetchData = async () => {
      const [twentyTwenty, twentyTwentyFour] = await Promise.all([
        loadDataset("2020"),
        loadDataset("2024"),
      ]);

      const datasets = {
        "2020": twentyTwenty,
        "2024": twentyTwentyFour,
      };

      setDatasets(datasets);

      setSelectedYears(Object.keys(datasets));
    };

    fetchData();
  }, []);

  const handleYearChange = (year: (typeof years)[number]) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const totalVotes = selectedYears.map((year) => ({
    year,
    votes: Object.values(datasets[year]["regional"]).reduce((acc, total) => acc +total, 0),
  }));

  if (years.length === 0) return <AppSkeleton />;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Presidential Elections Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Compare election result across multiple years
        </p>
      </header>

      <div className="flex justify-center space-x-4">
        {years.map((year) => (
          <Button
            key={year}
            variant={selectedYears.includes(year) ? "default" : "outline"}
            onClick={() => handleYearChange(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Votes</CardTitle>
          <CardDescription>
            Year-over-year comparison of total votes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalVotes}>
    <XAxis dataKey="year" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="votes" fill={colors[0]} />
  </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
