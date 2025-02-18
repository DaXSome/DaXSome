import { CalendarIcon } from 'lucide-react';
import changelogData from './changelog.json';

export default function ChangelogPage() {
    return (
        <div className="container mx-auto px-6 py-10 max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-10 text-center">
                Changelog
            </h1>
            <div className="space-y-10">
                {changelogData.map((entry, index) => (
                    <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-6 py-6 bg-gray-50 shadow-sm rounded-lg"
                    >
                        <div className="flex items-center mb-3">
                            <span className="bg-blue-500 text-white text-lg font-semibold w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                                {entry.version.split('.')[0]}
                            </span>
                            <h2 className="text-2xl font-semibold ml-4">
                                Version {entry.version}
                            </h2>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <CalendarIcon className="w-5 h-5 mr-2" />
                            <time dateTime={entry.date}>{entry.date}</time>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">
                            {entry.changes.map((change, changeIndex) => (
                                <li
                                    key={changeIndex}
                                    className="leading-relaxed"
                                >
                                    {change}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
