import { CalendarIcon } from "lucide-react";
import changelogData from "./changelog.json";

export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Changelog</h1>
      <div className="space-y-8">
        {changelogData.map((entry, index) => (
          <div key={index} className="border-l-2 border-gray-200 pl-4 pb-8">
            <div className="flex items-center mb-2">
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold">
                {entry.version.split(".")[0]}
              </div>
              <h2 className="text-xl font-semibold ml-3">
                Version {entry.version}
              </h2>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <time dateTime={entry.date}>{entry.date}</time>
            </div>
            <ul className="list-disc list-inside space-y-2">
              {entry.changes.map((change, changeIndex) => (
                <li key={changeIndex} className="text-gray-700">
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
