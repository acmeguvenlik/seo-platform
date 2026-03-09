import { NextRequest, NextResponse } from 'next/server';
import { generateContent, parseJSONFromResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, tone = 'professional' } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate 10 SEO-optimized, engaging titles for a blog post or article about: "${topic}"

${keywords ? `Focus on these keywords: ${keywords}` : ''}
Tone: ${tone}

Requirements:
- Each title should be 50-60 characters
- Include power words and emotional triggers
- Make them click-worthy but not clickbait
- Optimize for search engines
- Vary the style (questions, how-to, lists, etc.)

Return ONLY a JSON array of objects with this structure:
[
  {
    "title": "The title text",
    "length": number of characters,
    "style": "question|how-to|list|statement",
    "score": SEO score out of 100
  }
]`;

    const responseText = await generateContent(prompt);
    const titles = parseJSONFromResponse(responseText);

    return NextResponse.json({
      success: true,
      titles,
    });
  } catch (error) {
    console.error('AI Title Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    );
  }
}
