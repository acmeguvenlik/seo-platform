import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Construct robots.txt URL
    const robotsUrl = new URL(url);
    robotsUrl.pathname = '/robots.txt';
    robotsUrl.search = '';
    robotsUrl.hash = '';

    // Fetch robots.txt
    const response = await fetch(robotsUrl.toString(), {
      headers: {
        'User-Agent': 'SEO-Tools-Bot/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        url,
        exists: false,
        content: null,
        issues: ['Robots.txt file not found'],
        recommendations: [
          'Create a robots.txt file to control search engine crawling',
          'Add sitemap reference in robots.txt',
          'Ensure robots.txt is accessible at root domain',
        ],
      });
    }

    const content = await response.text();
    const lines = content.split('\n');

    // Analyze robots.txt
    const analysis = {
      hasUserAgent: false,
      hasDisallow: false,
      hasAllow: false,
      hasSitemap: false,
      hasCrawlDelay: false,
      userAgents: [] as string[],
      sitemaps: [] as string[],
      disallowRules: [] as string[],
      allowRules: [] as string[],
    };

    lines.forEach((line) => {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.startsWith('user-agent:')) {
        analysis.hasUserAgent = true;
        analysis.userAgents.push(line.split(':')[1].trim());
      } else if (trimmed.startsWith('disallow:')) {
        analysis.hasDisallow = true;
        analysis.disallowRules.push(line.split(':')[1].trim());
      } else if (trimmed.startsWith('allow:')) {
        analysis.hasAllow = true;
        analysis.allowRules.push(line.split(':')[1].trim());
      } else if (trimmed.startsWith('sitemap:')) {
        analysis.hasSitemap = true;
        analysis.sitemaps.push(line.split(':')[1].trim());
      } else if (trimmed.startsWith('crawl-delay:')) {
        analysis.hasCrawlDelay = true;
      }
    });

    // Generate issues and recommendations
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!analysis.hasUserAgent) {
      issues.push('No User-agent directive found');
      recommendations.push('Add at least one User-agent directive');
    }

    if (!analysis.hasSitemap) {
      issues.push('No Sitemap directive found');
      recommendations.push('Add Sitemap directive pointing to your XML sitemap');
    }

    if (analysis.disallowRules.includes('/')) {
      issues.push('Entire site is disallowed for crawling');
      recommendations.push('Review Disallow rules - blocking entire site may harm SEO');
    }

    if (analysis.hasCrawlDelay) {
      recommendations.push('Crawl-delay is set - ensure it\'s not too restrictive');
    }

    if (issues.length === 0) {
      recommendations.push('Robots.txt is properly configured');
    }

    return NextResponse.json({
      success: true,
      url,
      exists: true,
      content,
      lineCount: lines.length,
      analysis,
      issues,
      recommendations,
      score: Math.max(0, 100 - (issues.length * 20)),
    });
  } catch (error) {
    console.error('Robots analyzer error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze robots.txt' },
      { status: 500 }
    );
  }
}
