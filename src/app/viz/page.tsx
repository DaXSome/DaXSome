import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const visualizations = [
  {
    id: "knust-admission",
    title: "KNUST Admission Analytics",
    description:
      "Breakdown of admission data to uncover patterns and trends across years.",
    image: "https://knust-admission-analytics.owbird.site/ss.png",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Visualizations
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Interactive insights from our <Link className="text-green-600 underline" href='/datasets'>datasets</Link>{" "}
          to power your research and decisions.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visualizations.map((viz, index) => (
            <Link href={`/viz/${viz.id}`} key={index}>
              <Card
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <Image
                    src={viz.image}
                    alt={viz.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {viz.title}
                    </h3>
                    <p className="text-gray-601 mb-4">{viz.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
