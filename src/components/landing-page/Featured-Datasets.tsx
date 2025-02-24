import { getFeaturedDatasets } from "@/app/actions/datasets";
import DatasetCard from "../datasets/DatasetCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FeaturedDatasets = async () => {
  const datasets = await getFeaturedDatasets()

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Datasets
            </h2>
            <p className="text-lg text-gray-700 mb-12">
              Explore our curated datasets that provide actionable insights for
              your projects.
            </p>
          </div>

          <div>
            <Link
              href="/datasets"
              className="flex items-center justify-center text-lg font-semibold text-blue-600 hover:text-blue-800"
            >
              View All Datasets
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {datasets.map((dataset) => (
            <DatasetCard key={dataset._id} dataset={dataset} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDatasets;
