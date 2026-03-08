import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, seedKeywords, language = 'en' } = await request.json();

    if (!topic && !seedKeywords) {
      return NextResponse.json(
        { error: 'Topic or seed keywords required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate comprehensive keyword suggestions for SEO optimization.

Topic: ${topic || 'Not specified'}
${seedKeywords ? `Seed Keywords: ${seedKeywords}` : ''}
Language: ${language}

Provide:
1. Primary keywords (high volume, competitive)
2. Long-tail keywords (lower volume, easier to rank)
3. LSI keywords (semantically related)
4. Question-based keywords (for featured snippets)
5. Local keywords (if applicable)

For each keyword, estimate:
- Search volume (high/medium/low)
- Competition (high/medium/low)
- Intent (informational/commercial/transactional/navigational)

Return ONLY a JSON object with this structure:
{
  "primary": [
    {
      "keyword": "keyword phrase",
      "volume": "high|medium|low",
      "competition": "high|medium|low",
      "intent": "informational|commercial|transactional|navigational"
    }
  ],
  "longTail": [...],
  "lsi": [...],
  "questions": [...],
  "local": [...]
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

    const keywords = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      keywords,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('AI Keyword Suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate keyword suggestions' },
      { status: 500 }
    );
  }
}
