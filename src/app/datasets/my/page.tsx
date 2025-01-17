import { getUserDbs } from "@/app/actions/user";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Database, FolderOpen } from "lucide-react";
import { notFound } from "next/navigation";

const Page = async () => {
  const databases = await getUserDbs();

  if (!databases) return notFound();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-lg">Databases</h1>
      <div className="flex gap-3 justify-center items-center">
        {databases.map((database) => (
          <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                {database.database}
              </CardTitle>
              <Database className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FolderOpen className="mr-1 h-4 w-4" />
                  <span>{database.collections.length} collections</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    Last updated: {database.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button className="text-sm text-primary hover:underline">
                View Details
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
