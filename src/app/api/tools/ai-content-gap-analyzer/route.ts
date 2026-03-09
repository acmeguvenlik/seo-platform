import { NextRequest, NextResponse } from 'next/server';
import { generateContent, parseJSONFromResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const prompt = `Analyze the content gaps for the website: ${url}

Identify:
1. Missing content topics that competitors cover
2. Underserved keywords and topics
3. Content opportunities based on user intent
4. Gaps in content depth and quality

Return ONLY a JSON object with this structure:
{
  "contentGaps": [
    {
      "topic": "Topic name",
      "priority": "high|medium|low",
      "reason": "Why this is a gap",
      "competitorCoverage": "How competitors cover this"
    }
  ],
  "missingKeywords": [
    {
      "keyword": "keyword phrase",
      "searchIntent": "informational|transactional|navigational",
      "opportunity": "Why target this keyword"
    }
  ],
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "contentStrategy": "Overall strategy to fill content gaps"
}`;

    const responseText = await generateContent(prompt);
    const result = parseJSONFromResponse(responseText);

    return NextResponse.json({
      success: true,
      url,
      ...result,
    });
  } catch (error) {
    console.error('AI Content Gap Analyzer error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content gaps' },
      { status: 500 }
    );
  }
}
