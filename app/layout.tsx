import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVio — AI Destekli CV Oluşturucu & Kariyer Koçu",
  description:
    "Yapay zeka ile 60 saniyede profesyonel CV oluşturun. ATS uyumlu şablonlar, AI kariyer koçu ve paylaşılabilir link özelliği.",
  keywords: ["cv oluşturucu", "özgeçmiş", "ai cv", "akıllı cv", "kariyer"],
  authors: [{ name: "CVio" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "CVio — AI Destekli CV Oluşturucu & Kariyer Koçu",
    description: "60 saniyede yapay zeka destekli profesyonel CV oluşturun.",
    type: "website",
    siteName: "CVio",
    url: "https://cvio-ai.com.tr",
  },
  verification: {
    google: "V5PkLzII7TU3EPkxQT2vQFoQjErMAO7b5uX-sET5LnI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CVio",
              "alternateName": ["CVio AI", "CVio Özgeçmiş"],
              "url": "https://cvio-ai.com.tr"
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
