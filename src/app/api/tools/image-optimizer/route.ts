import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { withApiMiddleware, successResponse } from "@/lib/api-middleware";
import { imageOptimizerSchema } from "@/lib/validation";

interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  hasAlt: boolean;
  hasTitle: boolean;
  isLazy: boolean;
  issues: string[];
}

interface ImageOptimizerResult {
  url: string;
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  lazyLoadedImages: number;
  images: ImageData[];
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

async function handler(
  request: NextRequest,
  context: any,
  validatedData: { url: string }
): Promise<NextResponse> {
  const startTime = Date.now();
  const { url } = validatedData;

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

    const images: ImageData[] = [];
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    let lazyLoadedImages = 0;

    // Analyze all images
    $("img").each((_, element) => {
      const src = $(element).attr("src") || $(element).attr("data-src") || "";
      const alt = $(element).attr("alt") || "";
      const title = $(element).attr("title") || "";
      const width = $(element).attr("width");
      const height = $(element).attr("height");
      const loading = $(element).attr("loading");

      if (!src) return;

      const hasAlt = alt.length > 0;
      const hasTitle = title.length > 0;
      const isLazy = loading === "lazy" || $(element).attr("data-src") !== undefined;

      if (hasAlt) imagesWithAlt++;
      else imagesWithoutAlt++;

      if (isLazy) lazyLoadedImages++;

      // Determine format from URL
      const format = src.split(".").pop()?.split("?")[0]?.toLowerCase() || "unknown";

      // Analyze issues for this image
      const imageIssues: string[] = [];

      if (!hasAlt) {
        imageIssues.push("Alt text eksik");
      } else if (alt.length < 5) {
        imageIssues.push("Alt text çok kısa (minimum 5 karakter önerilir)");
      } else if (alt.length > 125) {
        imageIssues.push("Alt text çok uzun (maksimum 125 karakter önerilir)");
      }

      if (!width || !height) {
        imageIssues.push("Genişlik ve yükseklik belirtilmemiş");
      }

      if (!isLazy && images.length > 2) {
        imageIssues.push("Lazy loading kullanılmıyor");
      }

      if (format === "jpg" || format === "jpeg" || format === "png") {
        imageIssues.push("Modern format kullanılmıyor (WebP veya AVIF önerilir)");
      }

      if (format === "gif") {
        imageIssues.push("GIF yerine video formatı kullanın");
      }

      const imageData: ImageData = {
        src: src.startsWith("http") ? src : new URL(src, url).href,
        alt,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        format,
        hasAlt,
        hasTitle,
        isLazy,
        issues: imageIssues,
      };

      images.push(imageData);
    });

    // Calculate score
    let score = 100;
    const totalImages = images.length;

    if (totalImages === 0) {
      score = 0;
    } else {
      // Deduct points for missing alt text
      const altTextScore = (imagesWithAlt / totalImages) * 40;
      score = altTextScore;

      // Add points for lazy loading
      const lazyLoadScore = (lazyLoadedImages / Math.max(totalImages - 2, 1)) * 30;
      score += Math.min(lazyLoadScore, 30);

      // Add points for modern formats
      const modernFormats = images.filter(img => 
        img.format === "webp" || img.format === "avif"
      ).length;
      const formatScore = (modernFormats / totalImages) * 30;
      score += formatScore;
    }

    score = Math.round(Math.max(0, Math.min(100, score)));

    // Generate global issues and suggestions
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} görselde alt text eksik`);
      suggestions.push("Tüm görsellere açıklayıcı alt text ekleyin");
    }

    if (lazyLoadedImages < totalImages - 2) {
      issues.push("Çoğu görsel lazy loading kullanmıyor");
      suggestions.push("Fold altındaki görsellere loading='lazy' ekleyin");
    }

    const modernFormatCount = images.filter(img => 
      img.format === "webp" || img.format === "avif"
    ).length;

    if (modernFormatCount < totalImages * 0.5) {
      issues.push("Modern görsel formatları yeterince kullanılmıyor");
      suggestions.push("WebP veya AVIF formatlarını kullanarak dosya boyutunu %30-50 azaltın");
    }

    if (images.some(img => !img.width || !img.height)) {
      issues.push("Bazı görsellerde boyut bilgisi eksik");
      suggestions.push("CLS (Cumulative Layout Shift) önlemek için width ve height ekleyin");
    }

    if (totalImages > 20) {
      suggestions.push("Sayfa başına görsel sayısını azaltmayı düşünün");
      suggestions.push("Görsel sprite veya CSS kullanarak ikon sayısını azaltın");
    }

    const processingTime = Date.now() - startTime;

    const result: ImageOptimizerResult = {
      url,
      totalImages,
      imagesWithAlt,
      imagesWithoutAlt,
      lazyLoadedImages,
      images: images.slice(0, 50), // Return first 50
      score,
      issues,
      suggestions,
      processingTime,
    };

    return successResponse(result);
  } catch (error: any) {
    console.error("Image optimizer error:", error);
    return NextResponse.json(
      { error: error.message || "Görsel optimizasyonu sırasında bir hata oluştu" },
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
  validationSchema: imageOptimizerSchema,
});
