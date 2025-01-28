import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Database, FolderOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CreateNewDataset from "@/components/datasets/CreateNewDataset";
import { getUserDbs } from "@/app/actions/datasets";

const Page = async () => {
  const databases = await getUserDbs();

  if (!databases) return notFound();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Databases</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
        <CreateNewDataset />

        {databases.map((database) => (
          <Link
            key={database.name}
            href={`/datasets/my/manage?database=${database.name}`}
            className="hover:no-underline"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {database.name}
                </CardTitle>
                <Database className="h-6 w-6 text-gray-500" />
              </CardHeader>

              <CardContent className="text-gray-700">
                <div className="flex items-center space-x-4 text-sm">
                  <FolderOpen className="h-5 w-5 text-gray-500" />
                </div>
              </CardContent>

              <CardFooter>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Last updated:{" "}
                    {new Date(database.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
