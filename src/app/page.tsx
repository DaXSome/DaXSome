import Hero from "@/components/landing-page/Hero";
import WhoWeServe from "@/components/landing-page/Who-We-Serve";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <Hero />
        <WhoWeServe />
      </main>
    </div>
  );
}
