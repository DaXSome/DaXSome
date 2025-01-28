
import { Database } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getUserDbs } from '@/app/actions/datasets';
import CreateDatabaseButton from '@/components/reusables/CreateDatabaseButton';
import DatabasesGrid from '@/components/datasets/DatabasesGrid';

const Page = async () => {
    const databases = await getUserDbs();

    if (!databases) return notFound();

    return (
        <div className="px-4 py-8 flex-1">
            <div className="w-full mx-auto px-24 flex flex-col justify-center place-items-center">
                <div className="h-[450px] flex flex-col gap-3 w-full place-items-center">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                        Databases
                    </h1>

                    <div className="w-full max-w-7xl h-full flex place-items-center justify-center p-8 px-16 rounded-md shadow-sm bg-gray-50">
                        {databases && databases.length == 0 ? (
                            <div className="w-full flex flex-col place-items-center justify-center gap-3">
                                <div className="flex flex-col gap-2 justify-center place-items-center">
                                    <Database
                                        size={90}
                                        className="text-slate-300"
                                    />
                                    <h4 className="text-slate-500">
                                        No databases found
                                    </h4>
                                </div>
                                <CreateDatabaseButton />
                            </div>
                        ) : (
                            <DatabasesGrid />
                        )}
                    </div>
                </div>
            </div>

            {/*
        (databases && databases.length == 0) && <CreateNewDataset/>
      */}

            {/* <div className="w-full grid grid-cols-1 md:grid-cols-2 place-items-center items-center gap-6 max-w-5xl px-4 py-4">
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
      </div> */}
        </div>
    );
};

export default Page;
