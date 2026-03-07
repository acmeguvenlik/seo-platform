import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com";
  const locales = ["en", "tr", "de", "es", "fr"];
  const now = new Date();

  // Marketing pages
  const marketingRoutes = [
    { path: "", priority: 1.0, changeFreq: "daily" as const },
    { path: "/about", priority: 0.7, changeFreq: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFreq: "monthly" as const },
    { path: "/docs", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" as const },
  ];

  // Tool pages
  const toolRoutes = [
    { path: "/tools", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/meta-analyzer", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/keyword-density", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/sitemap-generator", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/robots-validator", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/backlink-analyzer", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/page-speed", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/image-optimizer", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/schema-generator", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/heading-analyzer", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/tools/internal-links", priority: 0.9, changeFreq: "weekly" as const },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add all routes for each locale
  locales.forEach((locale) => {
    [...marketingRoutes, ...toolRoutes].forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFreq,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route.path}`])
          ),
        },
      });
    });
  });

  return sitemap;
}
