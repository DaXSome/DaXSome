import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KNUST Admission Analytics - Insights into KNUST Admissions",
  description: "KNUST Admission Analytics - Insights into KNUST Admissions",
  openGraph: {
    type: "website",
    url: "https://knust-admission-analytics.owbird.site/",
    title: "KNUST Admission Analytics - Insights into KNUST Admissions",
    description: "KNUST Admission Analytics - Insights into KNUST Admissions",
    images: [
      {
        url: "https://knust-admission-analytics.owbird.site/ss.png",
        alt: "KNUST Admission Analytics Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://knust-admission-analytics.owbird.site/",
    title: "KNUST Admission Analytics - Insights into KNUST Admissions",
    description: "KNUST Admission Analytics - Insights into KNUST Admissions",
    images: [
      {
        url: "https://knust-admission-analytics.owbird.site/ss.png",
        alt: "KNUST Admission Analytics Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
