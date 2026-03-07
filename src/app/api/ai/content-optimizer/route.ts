import { NextRequest, NextResponse } from "next/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { withApiMiddleware, successResponse } from "@/lib/api-middleware";
import { aiContentOptimizerSchema } from "@/lib/validation";

interface ContentOptimizerResult {
  score: number;
  keywordDensity: number;
  missingKeywords: string[];
  headingRecommendations: string[];
  contentGaps: string[];
  optimizedIntro: string;
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

  const prompt = `You are an SEO content optimization expert. Analyze the following content and provide detailed SEO recommendations in ${targetLang}.

TARGET KEYWORD: ${targetKeyword}

CONTENT TO ANALYZE:
${content.substring(0, 3000)}${competitorInfo}

Please provide a comprehensive SEO analysis in the following format:

SCORE: [0-100 overall SEO score]
KEYWORD_DENSITY: [percentage as decimal, e.g., 0.02 for 2%]

MISSING_KEYWORDS:
- [LSI keyword 1]
- [LSI keyword 2]
- [LSI keyword 3]
- [LSI keyword 4]
- [LSI keyword 5]

HEADING_RECOMMENDATIONS:
- [Heading structure recommendation 1]
- [Heading structure recommendation 2]
- [Heading structure recommendation 3]

CONTENT_GAPS:
- [Missing topic 1]
- [Missing topic 2]
- [Missing topic 3]

OPTIMIZED_INTRO:
[Write an optimized version of the first 200 words that includes the target keyword naturally and hooks the reader]

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
  let score = 0;
  let keywordDensity = 0;
  const missingKeywords: string[] = [];
  const headingRecommendations: string[] = [];
  const contentGaps: string[] = [];
  let optimizedIntro = "";
  const suggestions: string[] = [];

  let currentSection = "";

  lines.forEach((line: string) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("SCORE:")) {
      const scoreMatch = trimmedLine.match(/\d+/);
      if (scoreMatch) {
        score = parseInt(scoreMatch[0]);
      }
    } else if (trimmedLine.startsWith("KEYWORD_DENSITY:")) {
      const densityMatch = trimmedLine.match(/[\d.]+/);
      if (densityMatch) {
        keywordDensity = parseFloat(densityMatch[0]);
      }
    } else if (trimmedLine === "MISSING_KEYWORDS:") {
      currentSection = "missing";
    } else if (trimmedLine === "HEADING_RECOMMENDATIONS:") {
      currentSection = "headings";
    } else if (trimmedLine === "CONTENT_GAPS:") {
      currentSection = "gaps";
    } else if (trimmedLine === "OPTIMIZED_INTRO:") {
      currentSection = "intro";
    } else if (trimmedLine === "SUGGESTIONS:") {
      currentSection = "suggestions";
    } else if (trimmedLine.startsWith("-")) {
      const item = trimmedLine.substring(1).trim();
      if (currentSection === "missing") {
        missingKeywords.push(item);
      } else if (currentSection === "headings") {
        headingRecommendations.push(item);
      } else if (currentSection === "gaps") {
        contentGaps.push(item);
      } else if (currentSection === "suggestions") {
        suggestions.push(item);
      }
    } else if (currentSection === "intro" && trimmedLine.length > 0) {
      optimizedIntro += (optimizedIntro ? " " : "") + trimmedLine;
    }
  });

  const result: ContentOptimizerResult = {
    score,
    keywordDensity,
    missingKeywords,
    headingRecommendations,
    contentGaps,
    optimizedIntro,
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
