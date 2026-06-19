import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import LayoutWrapper from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://bulelengmall.com'),
  
  title: {
    template: "%s | Buleleng Mall",
    default: "Buleleng Mall - Sentra Produk UMKM Lokal Buleleng",
  },
  description: "Platform e-commerce resmi untuk menjelajahi dan berbelanja produk lokal, kerajinan tangan, dan kuliner terbaik hasil binaan UMKM Kabupaten Buleleng.",
  keywords: ["Buleleng Mall", "UMKM Buleleng", "Produk Lokal Singaraja", "Kerajinan Bali", "Belanja Online Buleleng"],
  
  openGraph: {
    title: "Buleleng Mall - Sentra Produk UMKM Lokal Buleleng",
    description: "Platform e-commerce resmi untuk menjelajahi dan berbelanja produk lokal, kerajinan tangan, dan kuliner terbaik hasil binaan UMKM Kabupaten Buleleng.",
    url: "/",
    siteName: "Buleleng Mall",
    images: [
      {
        url: "/logo-bm.png",
        width: 800,
        height: 600,
        alt: "Buleleng Mall Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Buleleng Mall - Sentra Produk UMKM Lokal Buleleng",
    description: "Platform e-commerce resmi untuk menjelajahi dan berbelanja produk lokal, kerajinan tangan, dan kuliner terbaik hasil binaan UMKM Kabupaten Buleleng.",
    images: ["/logo-bm.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50/50`}
      >
        <NextTopLoader
          color="#274a6a"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #274a6a, 0 0 5px #274a6a"
        />

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

      </body>
    </html>
  );
}