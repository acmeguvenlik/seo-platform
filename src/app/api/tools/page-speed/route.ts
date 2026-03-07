import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface ResourceTiming {
  type: string;
  count: number;
  totalSize: number;
}

interface PageSpeedResult {
  url: string;
  loadTime: number;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  metrics: {
    ttfb: number;
    domContentLoaded: number;
    totalResources: number;
    totalSize: number;
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
  };
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  resources: ResourceTiming[];
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
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Geçersiz URL formatı" },
        { status: 400 }
      );
    }

    // Measure load time
    const fetchStart = Date.now();
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
    const loadTime = Date.now() - fetchStart;
    const $ = cheerio.load(html);

    // Count resources
    const scripts = $("script").length;
    const stylesheets = $("link[rel='stylesheet']").length;
    const images = $("img").length;
    const fonts = $("link[rel='preload'][as='font']").length;
    const totalResources = scripts + stylesheets + images + fonts;

    // Estimate sizes (in real app, fetch each resource)
    const estimatedScriptSize = scripts * 50; // KB
    const estimatedStyleSize = stylesheets * 30; // KB
    const estimatedImageSize = images * 100; // KB
    const estimatedFontSize = fonts * 50; // KB
    const totalSize = estimatedScriptSize + estimatedStyleSize + estimatedImageSize + estimatedFontSize;

    // Simulate Core Web Vitals (in real app, use Lighthouse API)
    const lcp = loadTime * 0.8 + Math.random() * 500; // Largest Contentful Paint
    const fid = Math.random() * 100; // First Input Delay
    const cls = Math.random() * 0.25; // Cumulative Layout Shift

    // Calculate TTFB (Time to First Byte)
    const ttfb = loadTime * 0.2;
    const domContentLoaded = loadTime * 0.6;

    // Calculate score (0-100)
    let score = 100;

    // Deduct points for slow load time
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 20;
    else if (loadTime > 1000) score -= 10;

    // Deduct points for too many resources
    if (totalResources > 100) score -= 20;
    else if (totalResources > 50) score -= 10;

    // Deduct points for large page size
    if (totalSize > 3000) score -= 20;
    else if (totalSize > 2000) score -= 10;

    // Deduct points for poor Core Web Vitals
    if (lcp > 2500) score -= 15;
    if (fid > 100) score -= 10;
    if (cls > 0.1) score -= 10;

    score = Math.max(0, Math.round(score));

    // Determine grade
    let grade: "A" | "B" | "C" | "D" | "F";
    if (score >= 90) grade = "A";
    else if (score >= 80) grade = "B";
    else if (score >= 70) grade = "C";
    else if (score >= 60) grade = "D";
    else grade = "F";

    // Generate issues and suggestions
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (loadTime > 3000) {
      issues.push("Sayfa yükleme süresi çok yavaş (>3 saniye)");
      suggestions.push("Sunucu yanıt süresini optimize edin");
      suggestions.push("CDN kullanarak içerik dağıtımını hızlandırın");
    }

    if (scripts > 20) {
      issues.push(`Çok fazla JavaScript dosyası (${scripts} adet)`);
      suggestions.push("JavaScript dosyalarını birleştirin ve minify edin");
      suggestions.push("Kullanılmayan JavaScript'i kaldırın");
    }

    if (stylesheets > 10) {
      issues.push(`Çok fazla CSS dosyası (${stylesheets} adet)`);
      suggestions.push("CSS dosyalarını birleştirin ve minify edin");
      suggestions.push("Critical CSS'i inline olarak ekleyin");
    }

    if (images > 50) {
      issues.push(`Çok fazla görsel (${images} adet)`);
      suggestions.push("Görselleri lazy loading ile yükleyin");
      suggestions.push("WebP formatını kullanın");
    }

    if (totalSize > 2000) {
      issues.push(`Sayfa boyutu çok büyük (${totalSize}KB)`);
      suggestions.push("Gzip veya Brotli sıkıştırma kullanın");
      suggestions.push("Gereksiz kaynakları kaldırın");
    }

    if (lcp > 2500) {
      issues.push("LCP (Largest Contentful Paint) yavaş");
      suggestions.push("Ana içeriği öncelikli yükleyin");
      suggestions.push("Render-blocking kaynaklarını optimize edin");
    }

    if (cls > 0.1) {
      issues.push("CLS (Cumulative Layout Shift) yüksek");
      suggestions.push("Görsellere width ve height ekleyin");
      suggestions.push("Font yükleme stratejisini optimize edin");
    }

    if (!$("link[rel='preconnect']").length) {
      suggestions.push("Önemli kaynaklara preconnect ekleyin");
    }

    if (!$("link[rel='dns-prefetch']").length) {
      suggestions.push("DNS prefetch kullanarak bağlantı süresini azaltın");
    }

    const resources: ResourceTiming[] = [
      { type: "JavaScript", count: scripts, totalSize: estimatedScriptSize },
      { type: "CSS", count: stylesheets, totalSize: estimatedStyleSize },
      { type: "Images", count: images, totalSize: estimatedImageSize },
      { type: "Fonts", count: fonts, totalSize: estimatedFontSize },
    ];

    const processingTime = Date.now() - startTime;

    const result: PageSpeedResult = {
      url,
      loadTime,
      score,
      grade,
      metrics: {
        ttfb: Math.round(ttfb),
        domContentLoaded: Math.round(domContentLoaded),
        totalResources,
        totalSize,
        scripts,
        stylesheets,
        images,
        fonts,
      },
      coreWebVitals: {
        lcp: Math.round(lcp),
        fid: Math.round(fid),
        cls: Math.round(cls * 100) / 100,
      },
      resources,
      issues,
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Page speed analyzer error:", error);
    return NextResponse.json(
      { error: error.message || "Sayfa hızı analizi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
