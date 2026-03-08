import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, targetLength = 1500, tone = 'professional' } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const prompt = `Create a comprehensive, SEO-optimized blog post outline for: "${topic}"

${keywords ? `Target Keywords: ${keywords}` : ''}
Target Length: ${targetLength} words
Tone: ${tone}

Create a detailed outline with:
1. Compelling title (50-60 chars)
2. Meta description (120-160 chars)
3. Introduction (what to cover)
4. Main sections with H2 headings
5. Subsections with H3 headings
6. Key points to cover in each section
7. Conclusion structure
8. Call-to-action suggestions

Optimize for:
- Search intent
- Featured snippets
- Readability
- User engagement
- Internal linking opportunities

Return ONLY a JSON object with this structure:
{
  "title": "SEO-optimized title",
  "metaDescription": "Meta description",
  "introduction": {
    "hook": "Opening hook",
    "context": "Background context",
    "preview": "What readers will learn"
  },
  "sections": [
    {
      "heading": "H2 heading",
      "wordCount": estimated words,
      "subsections": [
        {
          "heading": "H3 heading",
          "keyPoints": ["point 1", "point 2"]
        }
      ]
    }
  ],
  "conclusion": {
    "summary": "Key takeaways",
    "cta": "Call to action"
  },
  "seoTips": ["tip 1", "tip 2"],
  "internalLinkOpportunities": ["topic 1", "topic 2"]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const outline = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      outline,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('AI Blog Outline error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog outline' },
      { status: 500 }
    );
  }
}
