import { NextRequest, NextResponse } from 'next/server';
import { generateContent, parseJSONFromResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { url, schemaType, businessInfo } = await request.json();

    if (!url || !schemaType) {
      return NextResponse.json(
        { error: 'URL and schema type are required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
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

    const responseText = await generateContent(prompt, {
      temperature: 0.3,
      maxTokens: 2048,
    });
    
    const result = parseJSONFromResponse(responseText);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('AI Schema Generator error:', error);
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to generate schema';
    if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error?.message?.includes('API key')) {
      errorMessage = 'Invalid API key configuration';
    } else if (error?.message?.includes('model')) {
      errorMessage = 'AI model not available';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error?.message },
      { status: 500 }
    );
  }
}
