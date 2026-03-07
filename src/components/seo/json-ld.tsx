import Script from "next/script";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id={`json-ld-${data["@type"]}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization Schema
export function OrganizationSchema({ url }: { url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SEO Tools Platform",
    url: url,
    logo: `${url}/logo.png`,
    description:
      "Professional SEO tools and AI-powered optimization platform for webmasters and digital marketers",
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@seotools.com",
    },
  };

  return <JsonLd data={schema} />;
}

// WebApplication Schema
export function WebApplicationSchema({ url }: { url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SEO Tools Platform",
    url: url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available with premium plans",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Meta Tag Analysis",
      "Keyword Density Checker",
      "Sitemap Generator",
      "Backlink Analyzer",
      "Page Speed Analysis",
      "AI-Powered SEO Suggestions",
    ],
  };

  return <JsonLd data={schema} />;
}

// SoftwareApplication Schema (for tool pages)
export function SoftwareApplicationSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    url: url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "SEO Tools Platform",
    },
  };

  return <JsonLd data={schema} />;
}

// BreadcrumbList Schema
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={schema} />;
}

// FAQPage Schema
export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
}

// Article Schema (for blog posts)
export function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "SEO Tools Platform",
      logo: {
        "@type": "ImageObject",
        url: `${url}/logo.png`,
      },
    },
  };

  return <JsonLd data={schema} />;
}

// Product Schema (for pricing page)
export function ProductSchema({
  name,
  description,
  price,
  currency,
  url,
}: {
  name: string;
  description: string;
  price: string;
  currency: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: url,
    },
  };

  return <JsonLd data={schema} />;
}
