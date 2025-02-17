import { Database } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getUserDbs } from '@/app/actions/datasets';
import CreateDatabaseButton from '@/components/reusables/CreateDatabaseButton';
import DatabasesGrid from '@/components/datasets/DatabasesGrid';

const Page = async () => {
    const databases = await getUserDbs();

    if (!databases) return notFound();

    return (
        <div className="h-screen px-4 py-8 flex-1">
            <div className="w-full mx-auto px-24 flex flex-col justify-center place-items-center">
                <div className="h-[450px] flex flex-col gap-3 w-full place-items-center">
                    <h1 className="flex text-3xl font-extrabold text-gray-800 mb-6 text-center items-center gap-4">
                        Databases
                        <CreateDatabaseButton />
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
                            <div className="h-full gap-4 items-center">
                                <DatabasesGrid databases={databases} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
