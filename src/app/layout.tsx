import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { OrganizationSchema } from "@/components/seo/json-ld";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com"),
  title: {
    default: "SEO Tools Platform - Professional SEO Analysis & Optimization",
    template: "%s | SEO Tools Platform",
  },
  description: "Premium SaaS platform for SEO tools, webmaster tools, and AI-powered content optimization. Analyze meta tags, keywords, backlinks, and more.",
  keywords: [
    "SEO tools",
    "meta tag analyzer",
    "keyword density",
    "backlink checker",
    "page speed",
    "sitemap generator",
    "AI SEO",
    "content optimization",
    "webmaster tools",
  ],
  authors: [{ name: "SEO Tools Platform" }],
  creator: "SEO Tools Platform",
  publisher: "SEO Tools Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com",
    title: "SEO Tools Platform - Professional SEO Analysis & Optimization",
    description: "Premium SaaS platform for SEO tools, webmaster tools, and AI-powered content optimization",
    siteName: "SEO Tools Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Tools Platform - Professional SEO Analysis & Optimization",
    description: "Premium SaaS platform for SEO tools, webmaster tools, and AI-powered content optimization",
    creator: "@seotools",
  },
  verification: {
    google: "google-site-verification-code", // Add actual code when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com";

  return (
    <html lang="en" className="light" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <OrganizationSchema url={baseUrl} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
