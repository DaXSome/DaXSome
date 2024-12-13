/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppSkeleton from "@/components/AppSkeleton";
import { colors } from "@/utils";

interface Dataset {
  name: string;
  campus: string;
  degree: string;
  course: string;
}

const loadDataset = async (file: string) => {
  const data = await import(`./datasets/${file}.json`);
  return data.default as Dataset[];
};

export default function KNUSTAdmissionPage() {
  const [datasets, setDatasets] = useState<Record<string, Dataset[]>>({});

  const years = Object.keys(datasets) as (keyof typeof datasets)[];

  const [selectedYears, setSelectedYears] = useState(years);

  useEffect(() => {
    const fetchData = async () => {
      const [twentyOne, twentyThree] = await Promise.all([
        loadDataset("2021-2022"),
        loadDataset("2023-2024"),
      ]);

      const datasets = {
        "2021/2022": twentyOne,
        "2023/2024": twentyThree,
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

  const totalAdmissionsData = selectedYears.map((year) => ({
    year,
    total: datasets[year].length,
  }));

  const campusData = selectedYears.map((year) => ({
    year,
    "Main Campus": datasets[year].filter((d) => d.campus === "main").length,
    "Obuasi Campus": datasets[year].filter((d) => d.campus === "obuasi").length,
  }));

  const getCounter = (
    year: (typeof years)[number],
    value: "degree" | "course",
  ) => {
    const degreeCounts = datasets[year].reduce(
      (acc, d) => {
        let target = d[value];

        if (!target) return acc;

        // Remove the trailing periods for consistency
        if (value === "degree") {
          target = target.replace(/\.$/, "").trim();
        }

        if (!acc[target]) {
          acc[target] = 0;
        }

        acc[target]++;

        return acc;
      },
      {} as Record<string, number>,
    );
    return degreeCounts;
  };

  const selectedDegrees = selectedYears.map((year) => ({
    year,
    ...getCounter(year, "degree"),
  }));

  const degrees = Array.from(
    new Set(
      selectedDegrees
        .map((d) => Object.keys(d))
        .flat()
        .filter((d) => d !== "year"),
    ),
  );

  const selectedCourses = selectedYears.map((year) => ({
    year,
    ...getCounter(year, "course"),
  }));

  const sortedSelectedCourses: typeof selectedCourses = [];

  for (const course of selectedCourses) {
    const sorted = (Object.entries(course) as any[])
      .sort(([, a], [, b]) => (b as any) - (a as any))
      // Year is first
      .slice(0, 6)
      .reduce(
        (r, [k, v]) => ({ ...r, [k]: v }),
        {},
      ) as (typeof selectedCourses)[number];

    sortedSelectedCourses.push(sorted);
  }

  const courses = Array.from(
    new Set(sortedSelectedCourses.map((course) => Object.keys(course)).flat()),
  ).filter((c) => c !== "year");

  const allCourses = Array.from(
    new Set(
      Object.values(datasets)
        .flat()
        .map((d) => d.course),
    ),
  )
    .sort((a, b) => a.localeCompare(b))
    .filter((c) => c !== undefined);

  if (years.length === 0) return <AppSkeleton />;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold">KNUST Admission Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Compare admission data across multiple years
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
          <CardTitle>Total Admissions</CardTitle>
          <CardDescription>
            Year-over-year comparison of total admissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={totalAdmissionsData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line dataKey="total" stroke={colors[0]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campus Breakdown</CardTitle>
            <CardDescription>
              Distribution of students across campuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campusData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Main Campus" fill={colors[0]} />
                <Bar dataKey="Obuasi Campus" fill={colors[1]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Degree Types</CardTitle>
            <CardDescription>
              Number of students enrolled in each degree type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={selectedDegrees}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {degrees.map((d, i) => (
                  <Bar stackId="a" key={i} dataKey={d} fill={colors[i]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Course Enrollment</CardTitle>
          <CardDescription>
            Number of students enrolled for the top 5 courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedSelectedCourses}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip itemSorter={(item) => -item.value!} />
              <Legend />
              {courses.map((d, i) => (
                <Bar key={i} dataKey={d} fill={colors[i]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle> All Courses Enrollment</CardTitle>
          <CardDescription>
            Number of students enrolled for all courses
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-y-scroll">
          <Table>
            <TableCaption>
              Number of students enrolled for all courses
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Course</TableHead>
                {years.map((year) => (
                  <TableHead key={year} className="w-[100px]">
                    {year} ({datasets[year].length}){" "}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCourses.map((course) => {
                return (
                  <TableRow key={course}>
                    <TableCell className="font-medium">{course}</TableCell>
                    {years.map((year) => (
                      <TableCell key={year}>
                        {getCounter(year, "course")[course] || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
