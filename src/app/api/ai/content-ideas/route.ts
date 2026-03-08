import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, audience, contentType = 'blog post' } = await request.json();

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

    const prompt = `Generate 15 unique content ideas for: "${topic}"

Content Type: ${contentType}
${audience ? `Target Audience: ${audience}` : ''}

For each idea, provide:
- A compelling title
- Brief description (1-2 sentences)
- Content angle/hook
- Estimated word count
- Difficulty level (beginner/intermediate/advanced)
- SEO potential (high/medium/low)

Vary the content types:
- How-to guides
- Listicles
- Case studies
- Comparisons
- Ultimate guides
- Quick tips
- Expert interviews
- Infographics
- Video scripts
- Checklists

Return ONLY a JSON array with this structure:
[
  {
    "title": "Content title",
    "description": "Brief description",
    "angle": "Unique angle or hook",
    "wordCount": estimated number,
    "difficulty": "beginner|intermediate|advanced",
    "seoPotential": "high|medium|low",
    "type": "how-to|listicle|case-study|comparison|guide|tips|interview|infographic|video|checklist"
  }
]`;

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
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const ideas = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      ideas,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('AI Content Ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    );
  }
}
