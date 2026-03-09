import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url, schemaType, businessInfo } = await request.json();

    if (!url || !schemaType) {
      return NextResponse.json(
        { error: 'URL and schema type are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate a valid JSON-LD schema markup for the following:

URL: ${url}
Schema Type: ${schemaType}
${businessInfo ? `Business Information: ${JSON.stringify(businessInfo)}` : ''}

Generate a complete, valid JSON-LD schema that follows schema.org standards.
Include all relevant properties for the ${schemaType} type.

Return ONLY a JSON object with this structure:
{
  "schema": {
    "@context": "https://schema.org",
    "@type": "${schemaType}",
    ... (all relevant properties)
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "validation": {
    "isValid": true,
    "warnings": []
  }
}`;

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
    console.error('AI Schema Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate schema' },
      { status: 500 }
    );
  }
}
