import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface SchemaData {
  type: string;
  found: boolean;
  data?: any;
}

interface SchemaResult {
  url: string;
  hasSchema: boolean;
  schemas: SchemaData[];
  totalSchemas: number;
  score: number;
  generatedSchema: any;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { url, schemaType = "Organization" } = await request.json();

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

    const schemas: SchemaData[] = [];
    let hasSchema = false;

    // Find JSON-LD schemas
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const content = $(element).html();
        if (content) {
          const data = JSON.parse(content);
          hasSchema = true;
          schemas.push({
            type: data["@type"] || "Unknown",
            found: true,
            data,
          });
        }
      } catch {
        // Invalid JSON
      }
    });

    // Calculate score
    let score = 0;
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!hasSchema) {
      issues.push("Hiçbir Schema markup bulunamadı");
      suggestions.push("JSON-LD formatında Schema markup ekleyin");
      score = 0;
    } else {
      score = 60; // Base score

      if (schemas.length >= 3) score += 20;
      else if (schemas.length >= 2) score += 10;

      const hasOrganization = schemas.some(s => s.type === "Organization");
      const hasWebSite = schemas.some(s => s.type === "WebSite");
      const hasBreadcrumb = schemas.some(s => s.type === "BreadcrumbList");

      if (hasOrganization) score += 10;
      else suggestions.push("Organization schema ekleyin");

      if (hasWebSite) score += 5;
      else suggestions.push("WebSite schema ekleyin");

      if (hasBreadcrumb) score += 5;
      else suggestions.push("BreadcrumbList schema ekleyin");
    }

    // Generate sample schema based on page content
    const title = $("title").text() || baseUrl.hostname;
    const description = $('meta[name="description"]').attr("content") || "";
    const logo = $('meta[property="og:image"]').attr("content") || "";

    const generatedSchema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: title,
      url: baseUrl.href,
      description: description,
      ...(logo && { logo: logo }),
      ...(schemaType === "Organization" && {
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
        },
      }),
      ...(schemaType === "WebSite" && {
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl.origin}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }),
    };

    if (schemas.length < 2) {
      suggestions.push("Birden fazla schema türü kullanarak zengin snippet şansınızı artırın");
    }

    suggestions.push("Google Rich Results Test ile schema'nızı doğrulayın");

    score = Math.max(0, Math.min(100, score));

    const processingTime = Date.now() - startTime;

    const result: SchemaResult = {
      url,
      hasSchema,
      schemas,
      totalSchemas: schemas.length,
      score,
      generatedSchema,
      issues,
      suggestions,
      processingTime,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Schema generator error:", error);
    return NextResponse.json(
      { error: error.message || "Schema oluşturma sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
