import { NextRequest, NextResponse } from "next/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { withApiMiddleware, successResponse } from "@/lib/api-middleware";
import { aiContentOptimizerSchema } from "@/lib/validation";

interface ContentOptimizerResult {
  optimizedContent: string;
  originalLength: number;
  optimizedLength: number;
  keywordDensity: number;
  readabilityScore: number;
  seoScore: number;
  improvements: {
    category: string;
    before: string;
    after: string;
    impact: "high" | "medium" | "low";
  }[];
  suggestions: string[];
  processingTime: number;
}

async function handler(
  request: NextRequest,
  context: any,
  validatedData: {
    content: string;
    targetKeyword: string;
    competitorUrls?: string[];
    language: string;
  }
): Promise<NextResponse> {
  const startTime = Date.now();
  const { content, targetKeyword, competitorUrls, language } = validatedData;

  // Check if anthropic is configured
  if (!anthropic) {
    return NextResponse.json(
      { error: "AI servisi yapılandırılmamış. Lütfen ANTHROPIC_API_KEY ekleyin." },
      { status: 503 }
    );
  }

  const languageNames: Record<string, string> = {
    en: "English",
    tr: "Turkish",
    de: "German",
    es: "Spanish",
    fr: "French",
  };

  const targetLang = languageNames[language] || "English";
  const competitorInfo = competitorUrls?.length
    ? `\n\nCompetitor URLs for reference:\n${competitorUrls.join("\n")}`
    : "";

  const prompt = `You are an SEO content optimization expert. Analyze and optimize the following content for SEO in ${targetLang}.

TARGET KEYWORD: ${targetKeyword}

ORIGINAL CONTENT:
${content.substring(0, 3000)}${competitorInfo}

Please provide:
1. An optimized version of the entire content
2. Detailed analysis and improvements
3. SEO recommendations

Respond in the following format:

OPTIMIZED_CONTENT:
[Write the complete optimized version of the content here. Make it SEO-friendly while maintaining readability and natural flow. Include the target keyword naturally 2-3 times.]

SEO_SCORE: [0-100]
READABILITY_SCORE: [0-100]
KEYWORD_DENSITY: [percentage as decimal, e.g., 0.025 for 2.5%]

IMPROVEMENTS:
CATEGORY: Keyword Usage | BEFORE: [original text snippet] | AFTER: [improved text snippet] | IMPACT: high
CATEGORY: Readability | BEFORE: [original text snippet] | AFTER: [improved text snippet] | IMPACT: medium
CATEGORY: Structure | BEFORE: [original text snippet] | AFTER: [improved text snippet] | IMPACT: high

SUGGESTIONS:
- [Actionable SEO suggestion 1]
- [Actionable SEO suggestion 2]
- [Actionable SEO suggestion 3]
- [Actionable SEO suggestion 4]
- [Actionable SEO suggestion 5]

IMPORTANT: Respond in ${targetLang} language.`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText = message.content[0].type === "text" 
    ? message.content[0].text 
    : "";

  // Parse the response
  const lines = responseText.split("\n");
  let optimizedContent = "";
  let seoScore = 0;
  let readabilityScore = 0;
  let keywordDensity = 0;
  const improvements: any[] = [];
  const suggestions: string[] = [];

  let currentSection = "";
  let currentImprovement: any = {};

  lines.forEach((line: string) => {
    const trimmedLine = line.trim();

    if (trimmedLine === "OPTIMIZED_CONTENT:") {
      currentSection = "content";
    } else if (trimmedLine.startsWith("SEO_SCORE:")) {
      currentSection = "";
      const scoreMatch = trimmedLine.match(/\d+/);
      if (scoreMatch) {
        seoScore = parseInt(scoreMatch[0]);
      }
    } else if (trimmedLine.startsWith("READABILITY_SCORE:")) {
      const scoreMatch = trimmedLine.match(/\d+/);
      if (scoreMatch) {
        readabilityScore = parseInt(scoreMatch[0]);
      }
    } else if (trimmedLine.startsWith("KEYWORD_DENSITY:")) {
      const densityMatch = trimmedLine.match(/[\d.]+/);
      if (densityMatch) {
        keywordDensity = parseFloat(densityMatch[0]) * 100; // Convert to percentage
      }
    } else if (trimmedLine === "IMPROVEMENTS:") {
      currentSection = "improvements";
    } else if (trimmedLine === "SUGGESTIONS:") {
      currentSection = "suggestions";
    } else if (currentSection === "content" && trimmedLine.length > 0 && !trimmedLine.startsWith("SEO_SCORE")) {
      optimizedContent += (optimizedContent ? "\n" : "") + trimmedLine;
    } else if (currentSection === "improvements" && trimmedLine.startsWith("CATEGORY:")) {
      // Parse improvement line: CATEGORY: X | BEFORE: Y | AFTER: Z | IMPACT: W
      const parts = trimmedLine.split("|").map(p => p.trim());
      if (parts.length >= 4) {
        improvements.push({
          category: parts[0].replace("CATEGORY:", "").trim(),
          before: parts[1].replace("BEFORE:", "").trim(),
          after: parts[2].replace("AFTER:", "").trim(),
          impact: parts[3].replace("IMPACT:", "").trim() as "high" | "medium" | "low",
        });
      }
    } else if (currentSection === "suggestions" && trimmedLine.startsWith("-")) {
      suggestions.push(trimmedLine.substring(1).trim());
    }
  });

  // If no optimized content, use original
  if (!optimizedContent) {
    optimizedContent = content;
  }

  const result: ContentOptimizerResult = {
    optimizedContent,
    originalLength: content.length,
    optimizedLength: optimizedContent.length,
    keywordDensity,
    readabilityScore: readabilityScore || 75,
    seoScore: seoScore || 70,
    improvements,
    suggestions,
    processingTime: Date.now() - startTime,
  };

  return successResponse(result);
}

export const POST = withApiMiddleware(handler, {
  requireAuth: true,
  toolType: "ai",
  enableCache: true,
  cacheTTL: 7200,
  validationSchema: aiContentOptimizerSchema,
});
