import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const startTime = Date.now();
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });
    const loadTime = Date.now() - startTime;

    const html = await response.text();
    const contentSize = new Blob([html]).size;

    // Count resources
    const imageCount = (html.match(/<img/g) || []).length;
    const scriptCount = (html.match(/<script/g) || []).length;
    const stylesheetCount = (html.match(/<link[^>]*rel=["']stylesheet["']/g) || []).length;

    // Calculate score
    let score = 100;
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 20;
    else if (loadTime > 1000) score -= 10;

    if (contentSize > 1000000) score -= 20; // > 1MB
    else if (contentSize > 500000) score -= 10; // > 500KB

    if (scriptCount > 10) score -= 10;
    if (stylesheetCount > 5) score -= 10;

    score = Math.max(0, score);

    const issues = [];
    if (loadTime > 3000) issues.push('Page load time is too slow (>3s)');
    if (contentSize > 500000) issues.push('Page size is too large');
    if (scriptCount > 10) issues.push('Too many JavaScript files');
    if (stylesheetCount > 5) issues.push('Too many CSS files');

    return NextResponse.json({
      success: true,
      url,
      performance: {
        loadTime,
        contentSize,
        imageCount,
        scriptCount,
        stylesheetCount,
      },
      score: Math.round(score),
      status: score >= 80 ? 'FAST' : score >= 60 ? 'MODERATE' : 'SLOW',
      issues,
      recommendations: [
        ...(loadTime > 2000 ? ['Optimize server response time'] : []),
        ...(contentSize > 500000 ? ['Reduce page size by compressing assets'] : []),
        ...(scriptCount > 10 ? ['Combine and minify JavaScript files'] : []),
        ...(stylesheetCount > 5 ? ['Combine and minify CSS files'] : []),
        'Enable browser caching',
        'Use a CDN for static assets',
        'Optimize and compress images',
      ],
    });
  } catch (error) {
    console.error('Website Speed Test error:', error);
    return NextResponse.json({ error: 'Failed to test website speed' }, { status: 500 });
  }
}
