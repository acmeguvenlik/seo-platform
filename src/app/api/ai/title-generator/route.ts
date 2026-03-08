import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, tone = 'professional' } = await request.json();

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

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const titles = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      titles,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('AI Title Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    );
  }
}
