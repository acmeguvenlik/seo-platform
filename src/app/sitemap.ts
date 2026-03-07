import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com";
  const locales = ["en", "tr", "de", "es", "fr"];

  const routes = [
    "",
    "/about",
    "/contact",
    "/docs",
    "/pricing",
    "/tools",
    "/tools/meta-analyzer",
    "/tools/keyword-density",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}
