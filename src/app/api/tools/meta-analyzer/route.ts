import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as cheerio from "cheerio";

interface MetaAnalysisResult {
  url: string;
  score: number;
  title: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
    message: string;
  };
  description: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
    message: string;
  };
  ogTags: {
    hasOgTitle: boolean;
    hasOgDescription: boolean;
    hasOgImage: boolean;
    hasOgUrl: boolean;
  };
  twitterTags: {
    hasTwitterCard: boolean;
    hasTwitterTitle: boolean;
    hasTwitterDescription: boolean;
    hasTwitterImage: boolean;
  };
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

    // Extract meta tags
    const title = $("title").text() || "";
    const description = $('meta[name="description"]').attr("content") || "";

    // Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogUrl = $('meta[property="og:url"]').attr("content");

    // Twitter tags
    const twitterCard = $('meta[name="twitter:card"]').attr("content");
    const twitterTitle = $('meta[name="twitter:title"]').attr("content");
    const twitterDescription = $('meta[name="twitter:description"]').attr("content");
    const twitterImage = $('meta[name="twitter:image"]').attr("content");

    // Analyze title
    const titleAnalysis = analyzeTitle(title);
    const descriptionAnalysis = analyzeDescription(description);

    // Calculate score
    let score = 0;
    
    // Title scoring (30 points)
    if (titleAnalysis.status === "good") score += 30;
    else if (titleAnalysis.status === "warning") score += 20;
    else score += 10;

    // Description scoring (30 points)
    if (descriptionAnalysis.status === "good") score += 30;
    else if (descriptionAnalysis.status === "warning") score += 20;
    else score += 10;

    // Open Graph scoring (20 points)
    const ogScore = [ogTitle, ogDescription, ogImage, ogUrl].filter(Boolean).length * 5;
    score += ogScore;

    // Twitter scoring (20 points)
    const twitterScore = [twitterCard, twitterTitle, twitterDescription, twitterImage].filter(Boolean).length * 5;
    score += twitterScore;

    // Generate suggestions
    const suggestions: string[] = [];
    
    if (titleAnalysis.status !== "good") {
      suggestions.push(titleAnalysis.message);
    }
    
    if (descriptionAnalysis.status !== "good") {
      suggestions.push(descriptionAnalysis.message);
    }
    
    if (!ogTitle) suggestions.push("Open Graph title etiketi ekleyin (og:title)");
    if (!ogDescription) suggestions.push("Open Graph description etiketi ekleyin (og:description)");
    if (!ogImage) suggestions.push("Open Graph image etiketi ekleyin (og:image)");
    if (!ogUrl) suggestions.push("Open Graph URL etiketi ekleyin (og:url)");
    
    if (!twitterCard) suggestions.push("Twitter Card etiketi ekleyin (twitter:card)");
    if (!twitterTitle) suggestions.push("Twitter title etiketi ekleyin (twitter:title)");
    if (!twitterDescription) suggestions.push("Twitter description etiketi ekleyin (twitter:description)");
    if (!twitterImage) suggestions.push("Twitter image etiketi ekleyin (twitter:image)");

    const processingTime = Date.now() - startTime;

    const result: MetaAnalysisResult = {
      url,
      score: Math.round(score),
      title: titleAnalysis,
      description: descriptionAnalysis,
      ogTags: {
        hasOgTitle: !!ogTitle,
        hasOgDescription: !!ogDescription,
        hasOgImage: !!ogImage,
        hasOgUrl: !!ogUrl,
      },
      twitterTags: {
        hasTwitterCard: !!twitterCard,
        hasTwitterTitle: !!twitterTitle,
        hasTwitterDescription: !!twitterDescription,
        hasTwitterImage: !!twitterImage,
      },
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Meta analyzer error:", error);
    return NextResponse.json(
      { error: error.message || "Analiz sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}

function analyzeTitle(title: string) {
  const length = title.length;

  if (length === 0) {
    return {
      content: "",
      length: 0,
      status: "error" as const,
      message: "Title etiketi bulunamadı",
    };
  }

  if (length < 30) {
    return {
      content: title,
      length,
      status: "warning" as const,
      message: "Çok kısa (30-60 karakter önerilir)",
    };
  }

  if (length > 60) {
    return {
      content: title,
      length,
      status: "warning" as const,
      message: "Çok uzun (30-60 karakter önerilir)",
    };
  }

  return {
    content: title,
    length,
    status: "good" as const,
    message: "Optimal uzunluk",
  };
}

function analyzeDescription(description: string) {
  const length = description.length;

  if (length === 0) {
    return {
      content: "",
      length: 0,
      status: "error" as const,
      message: "Meta description bulunamadı",
    };
  }

  if (length < 120) {
    return {
      content: description,
      length,
      status: "warning" as const,
      message: "Çok kısa (120-160 karakter önerilir)",
    };
  }

  if (length > 160) {
    return {
      content: description,
      length,
      status: "warning" as const,
      message: "Çok uzun (120-160 karakter önerilir)",
    };
  }

  return {
    content: description,
    length,
    status: "good" as const,
    message: "Optimal uzunluk",
  };
}
