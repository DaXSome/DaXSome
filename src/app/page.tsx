import FeaturedDatasets from "@/components/landing-page/Featured-Datasets";
import Hero from "@/components/landing-page/Hero";
import OurProducts from "@/components/landing-page/Our-Products";
import WhoWeServe from "@/components/landing-page/Who-We-Serve";

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      <Hero />
      <WhoWeServe />
      <OurProducts />
      <FeaturedDatasets />
    </div>
  );
}
