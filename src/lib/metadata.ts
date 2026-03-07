import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com";

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  locale?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  path = "",
  locale = "en",
  image,
  noIndex = false,
}: PageMetadata): Metadata {
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/og-image.png`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: "SEO Tools Platform",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@seotools",
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en${path}`,
        tr: `${baseUrl}/tr${path}`,
        de: `${baseUrl}/de${path}`,
        es: `${baseUrl}/es${path}`,
        fr: `${baseUrl}/fr${path}`,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
  };
}

// Tool-specific metadata generator
export function generateToolMetadata({
  toolName,
  toolDescription,
  locale = "en",
}: {
  toolName: string;
  toolDescription: string;
  locale?: string;
}): Metadata {
  return generateMetadata({
    title: `${toolName} - Free SEO Tool`,
    description: toolDescription,
    keywords: [
      "seo tool",
      "free seo",
      toolName.toLowerCase(),
      "website analysis",
      "seo optimization",
    ],
    path: `/tools/${toolName.toLowerCase().replace(/\s+/g, "-")}`,
    locale,
  });
}

// Dashboard metadata (noindex)
export function generateDashboardMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return generateMetadata({
    title,
    description,
    noIndex: true, // Dashboard pages should not be indexed
  });
}

// Blog post metadata
export function generateBlogMetadata({
  title,
  description,
  slug,
  image,
  publishedAt,
  modifiedAt,
  author,
  tags = [],
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  tags?: string[];
}): Metadata {
  const metadata = generateMetadata({
    title,
    description,
    keywords: tags,
    path: `/blog/${slug}`,
    image,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt || publishedAt,
      authors: [author],
      tags,
    },
  };
}
