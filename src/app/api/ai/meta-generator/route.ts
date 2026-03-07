import { NextRequest, NextResponse } from "next/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { withApiMiddleware, successResponse } from "@/lib/api-middleware";
import { aiMetaGeneratorSchema } from "@/lib/validation";

async function handler(
  request: NextRequest,
  context: any,
  validatedData: {
    url: string;
    currentTitle?: string;
    currentDescription?: string;
    content?: string;
    targetKeywords?: string[];
    language: string;
  }
): Promise<NextResponse> {
  const { url, currentTitle, currentDescription, content, targetKeywords, language } = validatedData;

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
  const keywordsText = targetKeywords?.length
    ? `\nTarget Keywords: ${targetKeywords.join(", ")}`
    : "";

  const prompt = `You are an SEO expert. Generate optimized meta tags for the following website in ${targetLang}.

URL: ${url}
Current Title: ${currentTitle || "None"}
Current Description: ${currentDescription || "None"}
Page Content: ${content ? content.substring(0, 1000) : "Not available"}${keywordsText}

Please respond in the following format:

TITLE: [30-60 characters optimized title]
DESCRIPTION: [120-160 characters optimized description]
KEYWORDS: [5-10 keywords, comma-separated]
OG_TITLE: [Open Graph title]
OG_DESCRIPTION: [Open Graph description]
TWITTER_TITLE: [Twitter title]
TWITTER_DESCRIPTION: [Twitter description]

Suggestions:
- [SEO suggestion 1]
- [SEO suggestion 2]
- [SEO suggestion 3]

IMPORTANT: Respond in ${targetLang} language.`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    temperature: 0.7,
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
  const result: any = {
    suggestions: [],
  };

  lines.forEach((line: string) => {
    if (line.startsWith("TITLE:")) {
      result.title = line.replace("TITLE:", "").trim();
    } else if (line.startsWith("DESCRIPTION:")) {
      result.description = line.replace("DESCRIPTION:", "").trim();
    } else if (line.startsWith("KEYWORDS:")) {
      result.keywords = line.replace("KEYWORDS:", "").trim();
    } else if (line.startsWith("OG_TITLE:")) {
      result.ogTitle = line.replace("OG_TITLE:", "").trim();
    } else if (line.startsWith("OG_DESCRIPTION:")) {
      result.ogDescription = line.replace("OG_DESCRIPTION:", "").trim();
    } else if (line.startsWith("TWITTER_TITLE:")) {
      result.twitterTitle = line.replace("TWITTER_TITLE:", "").trim();
    } else if (line.startsWith("TWITTER_DESCRIPTION:")) {
      result.twitterDescription = line.replace("TWITTER_DESCRIPTION:", "").trim();
    } else if (line.trim().startsWith("-")) {
      result.suggestions.push(line.trim().substring(1).trim());
    }
  });

  return successResponse(result);
}

// Export with middleware
export const POST = withApiMiddleware(handler, {
  requireAuth: true,
  toolType: "ai",
  enableCache: true,
  cacheTTL: 7200, // 2 hours for AI responses
  validationSchema: aiMetaGeneratorSchema,
});
