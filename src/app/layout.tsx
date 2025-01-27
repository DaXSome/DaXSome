import Link from "next/link";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";
import Logo from "@/components/Logo";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

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
    label: "Datasets",
    href: "/datasets",
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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <NextTopLoader color="blue" />

          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-white flex justify-center">
            <div className="container flex h-16 items-center justify-between">
              <div>
                <Logo />
              </div>
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

              <SignedOut>
                <Button>
                  <SignInButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center gap-4">
                  <UserButton />
                  <Link href="/datasets/my">
                    <Button className="text-white">My Datasets</Button>
                  </Link>
                </div>
              </SignedIn>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          <Footer />
        </body>

        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-BG5DCFML0B" />
        )}
      </html>
    </ClerkProvider>
  );
}
