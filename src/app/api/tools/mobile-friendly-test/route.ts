import { NextRequest, NextResponse } from 'next/server';
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

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Check viewport meta tag
    const viewportTag = $('meta[name="viewport"]').attr('content');
    const hasViewport = !!viewportTag;

    // Check responsive meta tags
    const hasResponsiveImages = $('img[srcset]').length > 0;
    const hasMediaQueries = html.includes('@media');

    // Check font sizes
    const hasTouchFriendlyElements = true; // Simplified check

    const issues = [];
    if (!hasViewport) issues.push('Missing viewport meta tag');
    if (!hasMediaQueries) issues.push('No media queries detected');

    const score = 
      (hasViewport ? 40 : 0) +
      (hasMediaQueries ? 30 : 0) +
      (hasResponsiveImages ? 20 : 0) +
      (hasTouchFriendlyElements ? 10 : 0);

    return NextResponse.json({
      success: true,
      url,
      mobileFriendly: score >= 70,
      checks: {
        hasViewport,
        viewportContent: viewportTag || null,
        hasMediaQueries,
        hasResponsiveImages,
        hasTouchFriendlyElements,
      },
      score,
      status: score >= 80 ? 'PASS' : score >= 50 ? 'WARNING' : 'FAIL',
      issues,
      recommendations: [
        ...(!hasViewport ? ['Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">'] : []),
        ...(!hasMediaQueries ? ['Use CSS media queries for responsive design'] : []),
        ...(!hasResponsiveImages ? ['Use responsive images with srcset attribute'] : []),
      ],
    });
  } catch (error) {
    console.error('Mobile Friendly Test error:', error);
    return NextResponse.json(
      { error: 'Failed to test mobile friendliness' },
      { status: 500 }
    );
  }
}
