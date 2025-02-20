import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ClerkProvider } from '@clerk/nextjs';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/toaster';
import Loader from '@/components/Loader';
import { TourProvider } from '@/components/tour';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'DaXSome - Empowering Research and Innovation in Ghana with High-Quality Data',
    description:
        'Your trusted source for high-quality, localized datasets and open source projects tailored for research, AI training, and strategic planning in Ghana.',
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
                    className={` h-full ${geistSans.variable} ${geistMono.variable} antialiased flex flex-col bg-slate-100`}
                >
                    <NextTopLoader color="blue" />
                    <Navbar />

                    <main className="flex-1 bg-white flex justify-between h-screen w-full">
                        <TourProvider>{children}</TourProvider>
                        <Loader />
                    </main>

                    <Toaster />

                    <Footer />
                </body>

                {typeof window !== 'undefined' &&
                    window.location.hostname === 'daxsome.org' && (
                        <GoogleAnalytics gaId="G-BG5DCFML0B" />
                    )}
            </html>
        </ClerkProvider>
    );
}
