import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  BookOpen,
  Briefcase,
  Building2,
  Database,
  Github,
  GraduationCap,
  MessageCircle,
  Network,
  Search,
  Server,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const products = [
    {
      link: "https://cedisearch.daxsome.org",
      icon: Search,
      name: "Cedi Search",
      desc: "An AI-powered e-commerce search engine optimized for the Ghanaian market, enhancing online shopping experiences.",
      cta: "Search Now",
    },
    {
      icon: BarChart,
      link: "https://ghinsights.daxsome.org",
      name: "Awesome-Github-Insights",
      desc: "Gain valuable insights into GitHub user accounts, enhancing your understanding of developer activity and contributions.",
      cta: "Get insights",
    },
    {
      icon: GraduationCap,
      link: "/viz/knust-admission",
      name: "KNUST Admission Analytics",
      desc: "Analyze and visualize admission data for Kwame Nkrumah University of Science and Technology, providing meaningful insights into educational trends.",
      cta: "View Analytics",
    },
    {
      link: "https://gh-friends.vercel.app/",
      icon: Network,
      name: "Gh Friends",
      desc: "Visualize the network of connections between GitHub users in Ghana, fostering collaboration and community growth.",
      cta: "See Network",
    },
    {
      link: "https://github.com/DaXSome/WhatsApp-Telegram-Chat-Analysis",
      icon: MessageCircle,
      name: "Chat Analysis Tool",
      desc: "Analyze WhatsApp and Telegram chats to visualize most used words, texting patterns, and sentiment analysis of conversations.",
      cta: "Try Analysis",
    },
    {
      link: "https://github.com/DaXSome",
      icon: Github,
      name: "Contribute",
      desc: "Join our open source community and contribute to existing projects or propose new ones that benefit Ghana's data ecosystem.",
      cta: "Get Involved",
    },
  ];

  const clients = [
    {
      icon: BookOpen,
      title: "Academic Institutions",
      description:
        "Supporting research with comprehensive, localized datasets.",
    },
    {
      icon: Building2,
      title: "Government & Policy Makers",
      description: "Enabling data-driven policy decisions for Ghana's future.",
    },
    {
      icon: Briefcase,
      title: "Businesses & AI Firms",
      description:
        "Powering innovation and strategic planning with quality data.",
    },
    {
      icon: Users,
      title: "NGOs",
      description:
        "Facilitating impactful community initiatives through data insights.",
    },
    {
      icon: GraduationCap,
      title: "Educational Programs",
      description:
        "Enhancing learning experiences with real-world, local data.",
    },
    {
      icon: Github,
      title: "Open Source Community",
      description:
        "Collaborating on data projects to drive innovation and transparency.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold  md:text-5xl lg:text-6xl">
                  Empowering Data-Driven Decisions in Ghana
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Your trusted source for high-quality, localized datasets and
                  open source projects tailored for research, AI training, and
                  strategic planning in Ghana.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/datasets">
                  <Button className="mb-2 text-white bg-primary hover:bg-secondary">
                    Explore Our Datasets
                  </Button>
                </Link>
                <Link href="/viz">
                  <Button variant="outline">View Dataset Visualizations</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Our Mission
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl text-center">
              At DaXSome, we are committed to providing accessible, localized
              data for academia, government, and industry to drive insights and
              impactful decisions. Our goal is to empower Ghana&apos;s
              data-driven future through high-quality, comprehensive datasets
              and innovative open source projects.
            </p>
          </div>
        </section>
        <section
          id="services"
          className="w-full py-12 md:py-24 lg:py-32 bg-yellow-50"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Core Services
            </h2>
            <div className="grid gap-10 sm:grid-cols-2">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Database className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">
                    Data Collection & Curation
                  </h3>
                  <p className="text-center text-gray-600">
                    We employ advanced data collection techniques, rigorous data
                    cleaning processes, and meticulous structuring and
                    meta-tagging to ensure the highest quality datasets.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Server className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">API Access</h3>
                  <p className="text-center text-gray-600">
                    Our custom API solutions provide easy, programmatic
                    integration of our datasets into your existing systems and
                    workflows.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="clients" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Clients
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((item, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <item.icon className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-center text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section
          id="products"
          className="w-full py-12 md:py-24 lg:py-32 bg-red-50"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((proj) => (
                <Link key={proj.name} href={proj.link} className="h-full">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-between space-y-4 p-6 h-full">
                      <div className="flex flex-col items-center space-y-4">
                        <proj.icon className="h-12 w-12 text-primary" />
                        <h3 className="text-xl font-bold text-center">
                          {proj.name}
                        </h3>
                        <p className="text-center text-gray-600">{proj.desc}</p>
                      </div>
                      <Button variant="outline">{proj.cta}</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
