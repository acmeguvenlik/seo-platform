import { NextRequest, NextResponse } from 'next/server';
import { generateContent, parseJSONFromResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { topic, audience, contentType = 'blog post' } = await request.json();

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

    const responseText = await generateContent(prompt);
    const ideas = parseJSONFromResponse(responseText);

    return NextResponse.json({
      success: true,
      ideas,
    });
  } catch (error) {
    console.error('AI Content Ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    );
  }
}
