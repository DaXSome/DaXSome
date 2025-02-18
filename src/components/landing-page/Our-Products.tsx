import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const products = [
  {
    name: "Cedi Search",
    description: "AI-powered e-commerce search engine designed to help you find the right products efficiently.",
    cta: "Explore Cedi Search",
    link: "https://cedisearch.daxsome.org",
  },
  {
    name: "Admission Analytics",
    description: "Visualize year-on-year university admissions data to uncover trends and patterns.",
    cta: "See Admission Analytics",
    link: "/viz/knust-admission",
  },
  {
    name: "Gh Insights",
    description: "Analyze your GitHub profile with beautiful insights.",
    cta: "View Gh Insights",
    link: "https://ghinsights.daxsome.org",
  },
  {
    name: "Career Mapper",
    description: "Plan your academic and professional journey with a roadmap tailored to you.",
    cta: "Coming Soon",
    link: "#",
  },
];

const OurProducts = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Our Products</h2>
        <p className="text-lg text-gray-700 mb-12">
          From insights to innovation, our tools are designed to unlock the power of data for everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <Card
              key={index}
              className="rounded-2xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl bg-white flex flex-col justify-between"
            >
              <div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                </CardContent>
              </div>
              <div className="p-4">
                <Link
                href={product.link}
                  className="w-full bg-primary text-white hover:bg-secondary p-2 rounded-lg font-medium shadow-md hover:shadow-lg"
                >
                  {product.cta}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
