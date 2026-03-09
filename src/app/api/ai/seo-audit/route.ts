import { NextRequest, NextResponse } from 'next/server';
import { generateContent, parseJSONFromResponse, GEMINI_MODELS } from '@/lib/gemini';
import * as cheerio from 'cheerio';

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

    // Fetch the page
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract key SEO elements
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Tags = $('h1').map((_, el) => $(el).text()).get();
    const h2Tags = $('h2').map((_, el) => $(el).text()).get().slice(0, 5);
    const imageCount = $('img').length;
    const imagesWithoutAlt = $('img:not([alt])').length;
    const internalLinks = $('a[href^="/"], a[href^="' + url + '"]').length;
    const externalLinks = $('a[href^="http"]:not([href^="' + url + '"])').length;

    const prompt = `Perform a comprehensive SEO audit for this webpage and provide actionable recommendations.

URL: ${url}

Current SEO Elements:
- Title: "${title}" (${title.length} chars)
- Meta Description: "${metaDescription}" (${metaDescription.length} chars)
- H1 Tags: ${h1Tags.length} (${h1Tags.join(', ')})
- H2 Tags: ${h2Tags.length} (first 5: ${h2Tags.join(', ')})
- Images: ${imageCount} total, ${imagesWithoutAlt} without alt text
- Internal Links: ${internalLinks}
- External Links: ${externalLinks}

Analyze and provide:
1. Overall SEO Score (0-100)
2. Critical Issues (must fix immediately)
3. Warnings (should fix soon)
4. Opportunities (nice to have improvements)
5. Strengths (what's working well)
6. Specific action items with priority

Return ONLY a JSON object with this structure:
{
  "score": number,
  "grade": "A|B|C|D|F",
  "critical": [
    {
      "issue": "Issue description",
      "impact": "high|medium|low",
      "recommendation": "How to fix"
    }
  ],
  "warnings": [...],
  "opportunities": [...],
  "strengths": [...],
  "actionItems": [
    {
      "priority": "high|medium|low",
      "task": "Task description",
      "effort": "easy|medium|hard"
    }
  ]
}`;

    // Use Gemini 2.0 Flash for fast, accurate analysis
    const responseText = await generateContent(prompt, {
      model: GEMINI_MODELS.FLASH_2_0,
      temperature: 0.3,
      maxTokens: 4096,
    });
    
    const audit = parseJSONFromResponse(responseText);

    return NextResponse.json({
      success: true,
      url,
      audit,
      model: GEMINI_MODELS.FLASH_2_0,
    });
  } catch (error) {
    console.error('AI SEO Audit error:', error);
    return NextResponse.json(
      { error: 'Failed to perform SEO audit' },
      { status: 500 }
    );
  }
}
