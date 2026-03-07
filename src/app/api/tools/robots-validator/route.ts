import { NextRequest, NextResponse } from "next/server";

interface RobotsRule {
  userAgent: string;
  allows: string[];
  disallows: string[];
}

interface RobotsResult {
  url: string;
  hasRobotsTxt: boolean;
  content: string;
  rules: RobotsRule[];
  sitemaps: string[];
  crawlDelay?: number;
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

    const robotsUrl = `${baseUrl.origin}/robots.txt`;
    
    let hasRobotsTxt = false;
    let content = "";
    const rules: RobotsRule[] = [];
    const sitemaps: string[] = [];
    let crawlDelay: number | undefined;

    try {
      const response = await fetch(robotsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SEOToolsBot/1.0)",
        },
      });

      if (response.ok) {
        hasRobotsTxt = true;
        content = await response.text();

        // Parse robots.txt
        const lines = content.split("\n");
        let currentUserAgent = "";
        let currentAllows: string[] = [];
        let currentDisallows: string[] = [];

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;

          const [key, ...valueParts] = trimmed.split(":");
          const value = valueParts.join(":").trim();

          if (key.toLowerCase() === "user-agent") {
            if (currentUserAgent) {
              rules.push({
                userAgent: currentUserAgent,
                allows: [...currentAllows],
                disallows: [...currentDisallows],
              });
            }
            currentUserAgent = value;
            currentAllows = [];
            currentDisallows = [];
          } else if (key.toLowerCase() === "allow") {
            currentAllows.push(value);
          } else if (key.toLowerCase() === "disallow") {
            currentDisallows.push(value);
          } else if (key.toLowerCase() === "sitemap") {
            sitemaps.push(value);
          } else if (key.toLowerCase() === "crawl-delay") {
            crawlDelay = parseInt(value);
          }
        }

        if (currentUserAgent) {
          rules.push({
            userAgent: currentUserAgent,
            allows: currentAllows,
            disallows: currentDisallows,
          });
        }
      }
    } catch (error) {
      // robots.txt not found or error fetching
    }

    // Calculate score
    let score = 0;
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!hasRobotsTxt) {
      issues.push("robots.txt dosyası bulunamadı");
      suggestions.push("robots.txt dosyası oluşturun");
      score = 0;
    } else {
      score = 50; // Base score for having robots.txt

      if (rules.length === 0) {
        issues.push("Hiçbir kural tanımlanmamış");
        suggestions.push("En az bir User-agent kuralı ekleyin");
      } else {
        score += 20;
      }

      if (sitemaps.length === 0) {
        issues.push("Sitemap tanımlanmamış");
        suggestions.push("Sitemap: directive ile sitemap URL'i ekleyin");
      } else {
        score += 20;
      }

      const hasWildcard = rules.some(r => r.userAgent === "*");
      if (!hasWildcard) {
        issues.push("Genel User-agent (*) kuralı yok");
        suggestions.push("User-agent: * ile genel kurallar ekleyin");
      } else {
        score += 10;
      }

      const blockingAll = rules.some(r => 
        r.userAgent === "*" && r.disallows.includes("/")
      );
      if (blockingAll) {
        issues.push("Tüm botlar engellenmiş (Disallow: /)");
        suggestions.push("Disallow: / kuralını kaldırın veya Allow kuralları ekleyin");
        score -= 30;
      }

      if (crawlDelay && crawlDelay > 10) {
        issues.push(`Crawl-delay çok yüksek (${crawlDelay} saniye)`);
        suggestions.push("Crawl-delay değerini 1-5 saniye arasında tutun");
      }

      if (content.length > 500000) {
        issues.push("robots.txt dosyası çok büyük (>500KB)");
        suggestions.push("Dosya boyutunu 500KB altında tutun");
      }
    }

    score = Math.max(0, Math.min(100, score));

    const processingTime = Date.now() - startTime;

    const result: RobotsResult = {
      url: robotsUrl,
      hasRobotsTxt,
      content: content.substring(0, 10000), // Limit content size
      rules,
      sitemaps,
      crawlDelay,
      score,
      issues,
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Robots validator error:", error);
    return NextResponse.json(
      { error: error.message || "Robots.txt doğrulama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
