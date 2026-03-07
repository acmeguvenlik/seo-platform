import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

export const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// Check if Anthropic is configured
export function isAnthropicConfigured(): boolean {
  return anthropic !== null && !!process.env.ANTHROPIC_API_KEY;
}

// AI Meta Tag Generator
export async function generateMetaTags(params: {
  url: string;
  content?: string;
  keywords?: string[];
  language?: string;
}): Promise<{
  titles: string[];
  descriptions: string[];
  keywords: string;
  ogTags: {
    title: string;
    description: string;
  };
  twitterTags: {
    title: string;
    description: string;
  };
}> {
  if (!anthropic) {
    throw new Error("Anthropic API is not configured");
  }

  const prompt = `Sen bir SEO uzmanısın. Aşağıdaki bilgilere göre optimize edilmiş meta etiketleri oluştur.

URL: ${params.url}
${params.content ? `İçerik: ${params.content.substring(0, 1000)}` : ""}
${params.keywords ? `Hedef Kelimeler: ${params.keywords.join(", ")}` : ""}
Dil: ${params.language || "tr"}

Lütfen aşağıdaki formatta yanıt ver:

TITLE_1: [50-60 karakter arası SEO optimize title]
TITLE_2: [50-60 karakter arası alternatif title]
TITLE_3: [50-60 karakter arası alternatif title]

DESC_1: [150-160 karakter arası SEO optimize description]
DESC_2: [150-160 karakter arası alternatif description]
DESC_3: [150-160 karakter arası alternatif description]

KEYWORDS: [virgülle ayrılmış 8-10 anahtar kelime]

OG_TITLE: [Open Graph için optimize title]
OG_DESC: [Open Graph için optimize description]

TWITTER_TITLE: [Twitter için optimize title]
TWITTER_DESC: [Twitter için optimize description]`;

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

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse response
  const lines = responseText.split("\n");
  const titles: string[] = [];
  const descriptions: string[] = [];
  let keywords = "";
  let ogTitle = "";
  let ogDesc = "";
  let twitterTitle = "";
  let twitterDesc = "";

  lines.forEach((line) => {
    if (line.startsWith("TITLE_")) {
      titles.push(line.split(":")[1]?.trim() || "");
    } else if (line.startsWith("DESC_")) {
      descriptions.push(line.split(":")[1]?.trim() || "");
    } else if (line.startsWith("KEYWORDS:")) {
      keywords = line.replace("KEYWORDS:", "").trim();
    } else if (line.startsWith("OG_TITLE:")) {
      ogTitle = line.replace("OG_TITLE:", "").trim();
    } else if (line.startsWith("OG_DESC:")) {
      ogDesc = line.replace("OG_DESC:", "").trim();
    } else if (line.startsWith("TWITTER_TITLE:")) {
      twitterTitle = line.replace("TWITTER_TITLE:", "").trim();
    } else if (line.startsWith("TWITTER_DESC:")) {
      twitterDesc = line.replace("TWITTER_DESC:", "").trim();
    }
  });

  return {
    titles: titles.filter(Boolean),
    descriptions: descriptions.filter(Boolean),
    keywords,
    ogTags: {
      title: ogTitle,
      description: ogDesc,
    },
    twitterTags: {
      title: twitterTitle,
      description: twitterDesc,
    },
  };
}

// AI Content Optimizer
export async function optimizeContent(params: {
  content: string;
  targetKeyword: string;
  language?: string;
}): Promise<{
  score: number;
  issues: string[];
  suggestions: string[];
  missingKeywords: string[];
  optimizedIntro: string;
}> {
  if (!anthropic) {
    throw new Error("Anthropic API is not configured");
  }

  const prompt = `Sen bir SEO içerik uzmanısın. Aşağıdaki içeriği analiz et ve optimize et.

İçerik:
${params.content.substring(0, 2000)}

Hedef Anahtar Kelime: ${params.targetKeyword}
Dil: ${params.language || "tr"}

Lütfen aşağıdaki formatta yanıt ver:

SCORE: [0-100 arası SEO skoru]

ISSUES:
- [Sorun 1]
- [Sorun 2]
- [Sorun 3]

SUGGESTIONS:
- [Öneri 1]
- [Öneri 2]
- [Öneri 3]

MISSING_KEYWORDS:
- [Eksik anahtar kelime 1]
- [Eksik anahtar kelime 2]

OPTIMIZED_INTRO:
[İlk 300 kelimenin optimize edilmiş versiyonu]`;

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

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse response
  const lines = responseText.split("\n");
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];
  const missingKeywords: string[] = [];
  let optimizedIntro = "";
  let currentSection = "";

  lines.forEach((line) => {
    if (line.startsWith("SCORE:")) {
      score = parseInt(line.replace("SCORE:", "").trim()) || 0;
    } else if (line.startsWith("ISSUES:")) {
      currentSection = "issues";
    } else if (line.startsWith("SUGGESTIONS:")) {
      currentSection = "suggestions";
    } else if (line.startsWith("MISSING_KEYWORDS:")) {
      currentSection = "keywords";
    } else if (line.startsWith("OPTIMIZED_INTRO:")) {
      currentSection = "intro";
    } else if (line.trim().startsWith("-")) {
      const text = line.trim().substring(1).trim();
      if (currentSection === "issues") issues.push(text);
      else if (currentSection === "suggestions") suggestions.push(text);
      else if (currentSection === "keywords") missingKeywords.push(text);
    } else if (currentSection === "intro" && line.trim()) {
      optimizedIntro += line + "\n";
    }
  });

  return {
    score,
    issues: issues.filter(Boolean),
    suggestions: suggestions.filter(Boolean),
    missingKeywords: missingKeywords.filter(Boolean),
    optimizedIntro: optimizedIntro.trim(),
  };
}

// Track token usage
export async function logTokenUsage(
  userId: string,
  toolSlug: string,
  inputTokens: number,
  outputTokens: number
): Promise<void> {
  // Log to database for cost monitoring
  // This would be implemented with Prisma
  console.log("Token usage:", {
    userId,
    toolSlug,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  });
}
