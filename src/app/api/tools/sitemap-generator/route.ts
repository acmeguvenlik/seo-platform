import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { withApiMiddleware, successResponse } from "@/lib/api-middleware";
import { sitemapGeneratorSchema } from "@/lib/validation";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

interface SitemapResult {
  baseUrl: string;
  totalUrls: number;
  urls: SitemapEntry[];
  xmlSitemap: string;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

async function handler(
  request: NextRequest,
  context: any,
  validatedData: { url: string; maxPages: number; includeImages: boolean }
): Promise<NextResponse> {
  const startTime = Date.now();
  const { url, maxPages, includeImages } = validatedData;

  try {
    // URL validation
    let baseUrl: URL;
    try {
      baseUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Geçersiz URL formatı" },
        { status: 400 }
      );
    }

    const visitedUrls = new Set<string>();
    const sitemapEntries: SitemapEntry[] = [];
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Crawl the website (max 2 levels deep for performance)
    const maxDepth = 2;
    await crawlUrl(baseUrl.href, baseUrl, visitedUrls, sitemapEntries, 0, maxDepth, maxPages);

    // Analyze and generate suggestions
    if (sitemapEntries.length === 0) {
      issues.push("Hiçbir URL bulunamadı");
    }

    if (sitemapEntries.length > 50000) {
      issues.push("Sitemap 50,000 URL limitini aşıyor");
      suggestions.push("Sitemap'i birden fazla dosyaya bölün");
    }

    if (sitemapEntries.length > 1000) {
      suggestions.push("Büyük sitemap'ler için sitemap index kullanmayı düşünün");
    }

    // Generate XML sitemap
    const xmlSitemap = generateXmlSitemap(baseUrl.origin, sitemapEntries);

    const processingTime = Date.now() - startTime;

    const result: SitemapResult = {
      baseUrl: baseUrl.origin,
      totalUrls: sitemapEntries.length,
      urls: sitemapEntries.slice(0, 100), // Return first 100 for display
      xmlSitemap,
      issues,
      suggestions,
      processingTime,
    };

    return successResponse(result);
  } catch (error: any) {
    console.error("Sitemap generator error:", error);
    return NextResponse.json(
      { error: error.message || "Sitemap oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

async function crawlUrl(
  url: string,
  baseUrl: URL,
  visitedUrls: Set<string>,
  sitemapEntries: SitemapEntry[],
  depth: number,
  maxDepth: number,
  maxPages: number
): Promise<void> {
  if (depth > maxDepth || visitedUrls.has(url) || visitedUrls.size >= maxPages) {
    return;
  }

  visitedUrls.add(url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOToolsBot/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return;

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("text/html")) return;

    const html = await response.text();
    const $ = cheerio.load(html);

    // Add current URL to sitemap
    sitemapEntries.push({
      url: url,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: depth === 0 ? 1.0 : 0.8 - depth * 0.2,
    });

    // Find all links
    const links = $("a[href]");
    const promises: Promise<void>[] = [];

    links.each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url);
        
        // Only crawl same domain
        if (absoluteUrl.origin === baseUrl.origin && 
            !absoluteUrl.hash && 
            !visitedUrls.has(absoluteUrl.href)) {
          promises.push(
            crawlUrl(absoluteUrl.href, baseUrl, visitedUrls, sitemapEntries, depth + 1, maxDepth, maxPages)
          );
        }
      } catch {
        // Invalid URL, skip
      }
    });

    // Limit concurrent requests
    await Promise.all(promises.slice(0, 5));
  } catch (error) {
    // Skip failed URLs
  }
}

function generateXmlSitemap(baseUrl: string, entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }
    xml += "  </url>\n";
  }

  xml += "</urlset>";
  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Export with middleware
export const POST = withApiMiddleware(handler, {
  requireAuth: false,
  toolType: "tools",
  enableCache: true,
  cacheTTL: 3600,
  validationSchema: sitemapGeneratorSchema,
});
