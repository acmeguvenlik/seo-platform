import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface Backlink {
  sourceUrl: string;
  anchorText: string;
  linkType: "dofollow" | "nofollow";
  isExternal: boolean;
}

interface BacklinkResult {
  url: string;
  totalBacklinks: number;
  dofollowLinks: number;
  nofollowLinks: number;
  externalLinks: number;
  internalLinks: number;
  backlinks: Backlink[];
  domainAuthority: number;
  linkQuality: "excellent" | "good" | "fair" | "poor";
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

    // URL validation
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Geçersiz URL formatı" },
        { status: 400 }
      );
    }

    // Fetch the webpage
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

    const backlinks: Backlink[] = [];
    let dofollowCount = 0;
    let nofollowCount = 0;
    let externalCount = 0;
    let internalCount = 0;

    // Analyze all links
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      const anchorText = $(element).text().trim() || "[No anchor text]";
      const rel = $(element).attr("rel") || "";
      
      if (!href) return;

      try {
        const linkUrl = new URL(href, url);
        const isExternal = linkUrl.origin !== targetUrl.origin;
        const isNofollow = rel.includes("nofollow");

        const backlink: Backlink = {
          sourceUrl: linkUrl.href,
          anchorText: anchorText.substring(0, 100),
          linkType: isNofollow ? "nofollow" : "dofollow",
          isExternal,
        };

        backlinks.push(backlink);

        if (isNofollow) nofollowCount++;
        else dofollowCount++;

        if (isExternal) externalCount++;
        else internalCount++;
      } catch {
        // Invalid URL, skip
      }
    });

    // Calculate metrics
    const totalBacklinks = backlinks.length;
    const dofollowRatio = totalBacklinks > 0 ? (dofollowCount / totalBacklinks) * 100 : 0;
    
    // Simulate domain authority (in real app, use external API)
    const domainAuthority = Math.min(100, Math.round(
      (dofollowCount * 2) + (totalBacklinks * 0.5) + Math.random() * 20
    ));

    // Determine link quality
    let linkQuality: "excellent" | "good" | "fair" | "poor";
    if (domainAuthority >= 70) linkQuality = "excellent";
    else if (domainAuthority >= 50) linkQuality = "good";
    else if (domainAuthority >= 30) linkQuality = "fair";
    else linkQuality = "poor";

    // Generate issues and suggestions
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (dofollowRatio < 50) {
      issues.push("Dofollow link oranı düşük (%50'den az)");
      suggestions.push("Daha fazla dofollow backlink elde etmeye çalışın");
    }

    if (externalCount > internalCount * 3) {
      issues.push("Çok fazla external link var");
      suggestions.push("Internal linking stratejinizi güçlendirin");
    }

    if (totalBacklinks < 10) {
      suggestions.push("Backlink sayınızı artırmak için guest posting yapın");
      suggestions.push("Kaliteli içerik oluşturarak doğal backlink kazanın");
    }

    if (backlinks.some(b => b.anchorText === "[No anchor text]")) {
      issues.push("Bazı linklerde anchor text eksik");
      suggestions.push("Tüm linklere açıklayıcı anchor text ekleyin");
    }

    const processingTime = Date.now() - startTime;

    const result: BacklinkResult = {
      url,
      totalBacklinks,
      dofollowLinks: dofollowCount,
      nofollowLinks: nofollowCount,
      externalLinks: externalCount,
      internalLinks: internalCount,
      backlinks: backlinks.slice(0, 50), // Return first 50
      domainAuthority,
      linkQuality,
      issues,
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Backlink analyzer error:", error);
    return NextResponse.json(
      { error: error.message || "Backlink analizi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
