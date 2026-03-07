import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { url, currentTitle, currentDescription, content } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL gereklidir" },
        { status: 400 }
      );
    }

    // Check if anthropic is configured
    if (!anthropic) {
      return NextResponse.json(
        { error: "AI servisi yapılandırılmamış. Lütfen ANTHROPIC_API_KEY ekleyin." },
        { status: 503 }
      );
    }

    const prompt = `Sen bir SEO uzmanısın. Aşağıdaki web sitesi için optimize edilmiş meta etiketleri oluştur.

URL: ${url}
Mevcut Title: ${currentTitle || "Yok"}
Mevcut Description: ${currentDescription || "Yok"}
Sayfa İçeriği: ${content ? content.substring(0, 1000) : "Mevcut değil"}

Lütfen aşağıdaki formatta yanıt ver:

TITLE: [30-60 karakter arası optimize edilmiş title]
DESCRIPTION: [120-160 karakter arası optimize edilmiş description]
KEYWORDS: [5-10 anahtar kelime, virgülle ayrılmış]
OG_TITLE: [Open Graph için title]
OG_DESCRIPTION: [Open Graph için description]
TWITTER_TITLE: [Twitter için title]
TWITTER_DESCRIPTION: [Twitter için description]

Öneriler:
- [SEO önerisi 1]
- [SEO önerisi 2]
- [SEO önerisi 3]`;

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
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

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI meta generator error:", error);
    return NextResponse.json(
      { error: error.message || "AI önerileri oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
