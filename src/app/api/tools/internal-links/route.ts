import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface InternalLink {
  href: string;
  anchorText: string;
  isNofollow: boolean;
}

interface InternalLinksResult {
  url: string;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
  emptyAnchors: number;
  links: InternalLink[];
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL gereklidir" },
        { status: 400 }
      );
    }

    let baseUrl: URL;
    try {
      baseUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Geçersiz URL formatı" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOToolsBot/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Web sayfası yüklenemedi" },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const links: InternalLink[] = [];
    let internalCount = 0;
    let externalCount = 0;
    let nofollowCount = 0;
    let emptyAnchorCount = 0;

    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      const anchorText = $(element).text().trim();
      const rel = $(element).attr("rel") || "";

      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      try {
        const linkUrl = new URL(href, url);
        const isInternal = linkUrl.origin === baseUrl.origin;
        const isNofollow = rel.includes("nofollow");

        if (isInternal) {
          internalCount++;
          links.push({
            href: linkUrl.href,
            anchorText: anchorText || "[Empty]",
            isNofollow,
          });

          if (!anchorText) emptyAnchorCount++;
          if (isNofollow) nofollowCount++;
        } else {
          externalCount++;
        }
      } catch {
        // Invalid URL
      }
    });

    const totalLinks = internalCount + externalCount;

    // Calculate score
    let score = 100;
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (internalCount === 0) {
      issues.push("Hiçbir internal link bulunamadı");
      suggestions.push("Sayfaya internal linkler ekleyin");
      score = 0;
    } else {
      if (internalCount < 3) {
        issues.push("Çok az internal link var");
        suggestions.push("En az 3-5 internal link ekleyin");
        score -= 20;
      }

      if (emptyAnchorCount > 0) {
        issues.push(`${emptyAnchorCount} linkde anchor text eksik`);
        suggestions.push("Tüm linklere açıklayıcı anchor text ekleyin");
        score -= 15;
      }

      if (nofollowCount > internalCount * 0.5) {
        issues.push("Internal linklerin çoğu nofollow");
        suggestions.push("Internal linklerden nofollow kaldırın");
        score -= 20;
      }

      const ratio = internalCount / Math.max(externalCount, 1);
      if (ratio < 0.5) {
        issues.push("External link sayısı internal linkten fazla");
        suggestions.push("Internal linking stratejinizi güçlendirin");
        score -= 10;
      }

      // Check for duplicate links
      const uniqueLinks = new Set(links.map(l => l.href));
      if (uniqueLinks.size < links.length * 0.8) {
        issues.push("Çok fazla tekrarlayan link var");
        suggestions.push("Farklı sayfalara link verin");
        score -= 10;
      }

      // Check anchor text diversity
      const anchorTexts = links.map(l => l.anchorText.toLowerCase());
      const uniqueAnchors = new Set(anchorTexts);
      if (uniqueAnchors.size < anchorTexts.length * 0.5) {
        suggestions.push("Anchor text çeşitliliğini artırın");
        score -= 5;
      }
    }

    score = Math.max(0, Math.round(score));

    const processingTime = Date.now() - startTime;

    const result: InternalLinksResult = {
      url,
      totalLinks,
      internalLinks: internalCount,
      externalLinks: externalCount,
      nofollowLinks: nofollowCount,
      emptyAnchors: emptyAnchorCount,
      links: links.slice(0, 100), // Return first 100
      score,
      issues,
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Internal links analyzer error:", error);
    return NextResponse.json(
      { error: error.message || "Internal link analizi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
