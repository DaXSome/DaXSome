import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Linkedin, Github } from "lucide-react";
import Link from "next/link";

type FooterLink = { label: string; href: string };

const products: FooterLink[] = [
  {
    label: "Cedi Search",
    href: "https://cedisearch.daxsome.org",
  },
  {
    label: "Github Insights",
    href: "https://ghinsights.daxsome.org",
  },
];

const company: FooterLink[] = [
  {
    label: "About Us",
    href: "/about",
  },
];

const footerSections = { products, company };

const socials = [
  {
    href: "https://www.linkedin.com/company/daxsome/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "https://github.com/daxsome", icon: Github, label: "GitHub" },
];

const LinkList = ({ title, items }: { title: string; items: FooterLink[] }) => (
  <div>
    <CardHeader>
      <CardTitle className="text-white capitalize">{title}</CardTitle>
    </CardHeader>
    <ul className="space-y-2">
      {items.map((item) => (
        <li className="ml-6" key={item.href}>
          <Button variant="link" className="text-gray-300 hover:text-white p-0">
            <Link href={item.href}>{item.label}</Link>
          </Button>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLinks = () => {
  return (
    <ul className="flex space-x-4">
      {socials.map(({ href, icon: Icon, label }) => (
        <li key={label}>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-gray-300 hover:text-white"
          >
            <Icon size={20} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <Card className="mr-4 ml-4 bg-transparent">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {Object.keys(footerSections).map((section) => (
            <LinkList
              key={section}
              title={section}
              items={footerSections[section as keyof typeof footerSections]}
            />
          ))}
          <div>
            <CardHeader>
              <CardTitle className="text-white">Connect</CardTitle>
            </CardHeader>
            <SocialLinks />
          </div>
        </CardContent>

        <Separator className="bg-gray-700 mt-8" />

        <CardContent className="mt-4 flex flex-col items-center text-center text-sm space-y-2">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Daxsome. All rights reserved.
          </p>
          {/* <p>
            <Button
              variant="link"
              className="text-gray-300 hover:text-white p-0"
            >
              <Link href="#">Privacy Policy</Link>
            </Button>{" "}
            |{" "}
            <Button
              variant="link"
              className="text-gray-300 hover:text-white p-0"
            >
              <Link href="#">Terms of Service</Link>
            </Button>
          </p> */}
          <iframe
            src="https://github.com/sponsors/DaXSome/button"
            title="Sponsor DaXSome"
            height="32"
            width="114"
            style={{ border: 0, borderRadius: "6px" }}
          ></iframe>
        </CardContent>
      </Card>
    </footer>
  );
}
