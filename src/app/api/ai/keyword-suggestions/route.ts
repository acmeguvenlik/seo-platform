import { NextRequest, NextResponse } from 'next/server';
import { generateContent, parseJSONFromResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { topic, seedKeywords, language = 'en' } = await request.json();

    if (!topic && !seedKeywords) {
      return NextResponse.json(
        { error: 'Topic or seed keywords required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
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

    const responseText = await generateContent(prompt);
    const keywords = parseJSONFromResponse(responseText);

    return NextResponse.json({
      success: true,
      keywords,
    });
  } catch (error) {
    console.error('AI Keyword Suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate keyword suggestions' },
      { status: 500 }
    );
  }
}
