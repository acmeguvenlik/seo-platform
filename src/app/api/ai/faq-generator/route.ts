import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, targetAudience, numberOfQuestions = 10, language = 'tr' } = await request.json();

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

    const languageNames: Record<string, string> = {
      en: 'English',
      tr: 'Turkish',
      de: 'German',
      es: 'Spanish',
      fr: 'French',
    };

    const targetLang = languageNames[language] || 'Turkish';

    const prompt = `Generate ${numberOfQuestions} frequently asked questions (FAQ) about: "${topic}"

${targetAudience ? `Target Audience: ${targetAudience}` : ''}
Language: ${targetLang}

Create questions that:
- Cover different aspects of the topic
- Are commonly searched by users
- Range from basic to advanced
- Include actionable answers
- Are optimized for featured snippets

Return ONLY a JSON object with this structure:
{
  "faqs": [
    {
      "question": "Question text",
      "answer": "Detailed answer (2-3 sentences)",
      "category": "basic|intermediate|advanced",
      "searchVolume": "high|medium|low"
    }
  ],
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Question text",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Answer text"
        }
      }
    ]
  }
}

IMPORTANT: Respond in ${targetLang} language.`;

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

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      ...result,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('AI FAQ Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate FAQs' },
      { status: 500 }
    );
  }
}
