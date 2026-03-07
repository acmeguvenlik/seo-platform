import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface KeywordData {
  keyword: string;
  count: number;
  density: number;
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

    // Remove script, style, and other non-content elements
    $("script, style, noscript, iframe").remove();

    // Get text content
    const text = $("body").text();

    // Clean and process text
    const cleanText = text
      .toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Split into words
    const words = cleanText.split(" ").filter((word) => word.length > 2);
    const totalWords = words.length;

    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Calculate density and create keyword data
    const keywords: KeywordData[] = Object.entries(wordCount)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: (count / totalWords) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    // Filter out common stop words (Turkish and English)
    const stopWords = new Set([
      "bir", "bu", "ve", "için", "ile", "olan", "var", "gibi", "daha", "çok",
      "en", "da", "de", "mi", "mu", "mı", "mü", "ki", "ne", "ya", "veya",
      "the", "is", "at", "which", "on", "a", "an", "as", "are", "was", "were",
      "be", "been", "being", "have", "has", "had", "do", "does", "did", "will",
      "would", "should", "could", "may", "might", "must", "can", "to", "of",
      "in", "for", "with", "by", "from", "up", "about", "into", "through",
      "during", "before", "after", "above", "below", "between", "under",
      "again", "further", "then", "once", "here", "there", "when", "where",
      "why", "how", "all", "both", "each", "few", "more", "most", "other",
      "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
      "too", "very", "that", "this", "these", "those",
    ]);

    const topKeywords = keywords
      .filter((kw) => !stopWords.has(kw.keyword))
      .slice(0, 20);

    const uniqueWords = Object.keys(wordCount).length;

    // Generate suggestions
    const suggestions: string[] = [];

    // Check for keyword stuffing
    const highDensityKeywords = topKeywords.filter((kw) => kw.density > 5);
    if (highDensityKeywords.length > 0) {
      suggestions.push(
        `"${highDensityKeywords[0].keyword}" kelimesi çok sık kullanılıyor (%${highDensityKeywords[0].density.toFixed(2)}). Keyword stuffing'den kaçının.`
      );
    }

    // Check for low density
    const lowDensityKeywords = topKeywords.filter(
      (kw) => kw.density < 1 && kw.count > 2
    );
    if (lowDensityKeywords.length > 0) {
      suggestions.push(
        `Bazı önemli kelimeler yeterince kullanılmamış. İçeriğinizi zenginleştirin.`
      );
    }

    // Check for ideal density
    const idealKeywords = topKeywords.filter(
      (kw) => kw.density >= 2 && kw.density <= 3
    );
    if (idealKeywords.length > 0) {
      suggestions.push(
        `"${idealKeywords[0].keyword}" kelimesi ideal yoğunlukta (%${idealKeywords[0].density.toFixed(2)}). Harika!`
      );
    }

    // Content length suggestion
    if (totalWords < 300) {
      suggestions.push(
        "İçerik çok kısa. SEO için en az 300 kelime önerilir."
      );
    } else if (totalWords > 2000) {
      suggestions.push(
        "İçerik çok uzun. Okuyucu deneyimi için içeriği bölümlere ayırın."
      );
    }

    // Unique words ratio
    const uniqueRatio = (uniqueWords / totalWords) * 100;
    if (uniqueRatio < 30) {
      suggestions.push(
        "Kelime çeşitliliği düşük. Daha fazla farklı kelime kullanın."
      );
    }

    const processingTime = Date.now() - startTime;

    const result = {
      url,
      totalWords,
      uniqueWords,
      keywords: topKeywords,
      topKeywords: topKeywords.slice(0, 10),
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Keyword density error:", error);
    return NextResponse.json(
      { error: error.message || "Analiz sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
