import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";

const navLinks = [
  {
    label: "About Us",
    href: "/#about",
  },
  {
    label: "Data Services",
    href: "/#services",
  },
  {
    label: "Clients",
    href: "/#clients",
  },
  {
    label: "Products",
    href: "/#products",
  },
  {
    label: "Contact Us",
    href: "/#contact",
  },
  {
    label: "Visualizations",
    href: "/viz",
  },
];

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title:
    "DaXSome - Empowering Research and Innovation in Ghana with High-Quality Data",
  description:
    "Your trusted source for high-quality, localized datasets and open source projects tailored for research, AI training, and strategic planning in Ghana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="green" />

        <header className="sticky top-0 z-50 w-full border-b bg-white">
          <div className="container flex h-16 items-center justify-between">
            <Link className="flex items-center space-x-2" href="/">
              <Database className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">DaXSome</span>
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  className="transition-colors hover:text-green-600"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link href="/datasets">
              <Button className="hidden md:inline-flex" variant="outline">
                Datasets
              </Button>
            </Link>
          </div>
        </header>

        {children}

        <footer className="w-full py-6 bg-gray-100">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">DaXSome</span>
            </div>
            <p className="text-sm text-gray-600 mt-4 md:mt-0">
              Empowering Ghana&apos;s data-driven future through open
              collaboration and innovation. &copy; 2024 DaXSome
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="https://github.com/DaXSome"
                className="text-gray-600 hover:text-green-600"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <iframe
                src="https://github.com/sponsors/DaXSome/button"
                title="Sponsor DaXSome"
                height="32"
                width="114"
                style={{ border: 0, borderRadius: "6px;" }}
              ></iframe>
            </div>
          </div>
        </footer>
      </body>

      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-BG5DCFML0B" />
      )}
    </html>
  );
}
