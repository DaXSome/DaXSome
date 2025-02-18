import FeaturedDatasets from "@/components/landing-page/Featured-Datasets";
import Hero from "@/components/landing-page/Hero";
import OurProducts from "@/components/landing-page/Our-Products";
import Partners from "@/components/landing-page/Partners";
import WhoWeServe from "@/components/landing-page/Who-We-Serve";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <Hero />
      <WhoWeServe />
      <OurProducts />
      <FeaturedDatasets />
      <Partners />
    </div>
  );
}
