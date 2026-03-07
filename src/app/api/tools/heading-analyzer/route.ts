import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { withApiMiddleware, successResponse } from "@/lib/api-middleware";
import { headingAnalyzerSchema } from "@/lib/validation";

interface Heading {
  level: number;
  text: string;
  length: number;
}

interface HeadingResult {
  url?: string;
  headings: Heading[];
  structure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    total: number;
  };
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

async function handler(
  request: NextRequest,
  context: any,
  validatedData: { url?: string; content?: string }
): Promise<NextResponse> {
  const startTime = Date.now();
  const { url, content } = validatedData;

  try {
    let html: string;

    if (url) {
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

      html = await response.text();
    } else if (content) {
      html = content;
    } else {
      return NextResponse.json(
        { error: "URL veya içerik gereklidir" },
        { status: 400 }
      );
    }

    const $ = cheerio.load(html);

    const headings: Heading[] = [];
    const structure = {
      h1Count: 0,
      h2Count: 0,
      h3Count: 0,
      h4Count: 0,
      h5Count: 0,
      h6Count: 0,
      total: 0,
    };

    // Extract all headings
    for (let level = 1; level <= 6; level++) {
      $(`h${level}`).each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          headings.push({
            level,
            text,
            length: text.length,
          });

          switch (level) {
            case 1: structure.h1Count++; break;
            case 2: structure.h2Count++; break;
            case 3: structure.h3Count++; break;
            case 4: structure.h4Count++; break;
            case 5: structure.h5Count++; break;
            case 6: structure.h6Count++; break;
          }
          structure.total++;
        }
      });
    }

    // Calculate score
    let score = 100;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check H1
    if (structure.h1Count === 0) {
      issues.push("H1 başlığı bulunamadı");
      suggestions.push("Sayfaya bir H1 başlığı ekleyin");
      score -= 30;
    } else if (structure.h1Count > 1) {
      issues.push(`Birden fazla H1 başlığı var (${structure.h1Count} adet)`);
      suggestions.push("Sayfa başına sadece bir H1 kullanın");
      score -= 20;
    } else {
      const h1 = headings.find(h => h.level === 1);
      if (h1) {
        if (h1.length < 20) {
          issues.push("H1 başlığı çok kısa");
          suggestions.push("H1 başlığını 20-70 karakter arasında tutun");
          score -= 10;
        } else if (h1.length > 70) {
          issues.push("H1 başlığı çok uzun");
          suggestions.push("H1 başlığını 20-70 karakter arasında tutun");
          score -= 10;
        }
      }
    }

    // Check hierarchy
    let previousLevel = 0;
    let hierarchyBroken = false;

    for (const heading of headings) {
      if (previousLevel > 0 && heading.level > previousLevel + 1) {
        hierarchyBroken = true;
        break;
      }
      previousLevel = heading.level;
    }

    if (hierarchyBroken) {
      issues.push("Başlık hiyerarşisi bozuk (örn: H1'den sonra H3)");
      suggestions.push("Başlıkları sıralı kullanın (H1 → H2 → H3)");
      score -= 15;
    }

    // Check H2 usage
    if (structure.h2Count === 0 && structure.total > 1) {
      issues.push("H2 başlığı bulunamadı");
      suggestions.push("İçeriği H2 başlıklarıyla bölümlere ayırın");
      score -= 10;
    }

    // Check total headings
    if (structure.total === 0) {
      issues.push("Hiçbir başlık bulunamadı");
      suggestions.push("Sayfaya başlık yapısı ekleyin");
      score = 0;
    } else if (structure.total < 3) {
      suggestions.push("Daha fazla başlık ekleyerek içeriği yapılandırın");
      score -= 5;
    }

    // Check empty headings
    const emptyHeadings = headings.filter(h => h.length === 0);
    if (emptyHeadings.length > 0) {
      issues.push(`${emptyHeadings.length} boş başlık var`);
      suggestions.push("Tüm başlıklara anlamlı metin ekleyin");
      score -= 10;
    }

    // Check very long headings
    const longHeadings = headings.filter(h => h.length > 100);
    if (longHeadings.length > 0) {
      issues.push(`${longHeadings.length} başlık çok uzun (>100 karakter)`);
      suggestions.push("Başlıkları kısa ve öz tutun");
      score -= 5;
    }

    score = Math.max(0, Math.round(score));

    const processingTime = Date.now() - startTime;

    const result: HeadingResult = {
      url: url || undefined,
      headings,
      structure,
      score,
      issues,
      suggestions,
      processingTime,
    };

    return successResponse(result);
  } catch (error: any) {
    console.error("Heading analyzer error:", error);
    return NextResponse.json(
      { error: error.message || "Başlık analizi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Export with middleware
export const POST = withApiMiddleware(handler, {
  requireAuth: false,
  toolType: "tools",
  enableCache: true,
  cacheTTL: 3600,
  validationSchema: headingAnalyzerSchema,
});
