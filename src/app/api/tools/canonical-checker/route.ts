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
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Find canonical tag
    const canonicalTag = $('link[rel="canonical"]').attr('href');
    const canonicalInHeader = response.headers.get('Link')?.includes('rel="canonical"');

    // Check for multiple canonical tags
    const canonicalTags = $('link[rel="canonical"]');
    const hasMultipleCanonicals = canonicalTags.length > 1;

    // Validate canonical URL
    let canonicalUrl = canonicalTag;
    let isAbsolute = false;
    let isValid = false;

    if (canonicalUrl) {
      try {
        const parsedUrl = new URL(canonicalUrl, url);
        canonicalUrl = parsedUrl.href;
        isAbsolute = canonicalTag?.startsWith('http');
        isValid = true;
      } catch {
        isValid = false;
      }
    }

    // Check if canonical points to itself
    const pointsToSelf = canonicalUrl === url;

    // Check for common issues
    const issues = [];
    if (!canonicalTag) {
      issues.push('No canonical tag found');
    }
    if (hasMultipleCanonicals) {
      issues.push(`Multiple canonical tags found (${canonicalTags.length})`);
    }
    if (canonicalTag && !isAbsolute) {
      issues.push('Canonical URL is relative (should be absolute)');
    }
    if (canonicalTag && !isValid) {
      issues.push('Invalid canonical URL format');
    }
    if (canonicalTag && !pointsToSelf) {
      issues.push('Canonical points to different URL');
    }

    const score = issues.length === 0 ? 100 : Math.max(0, 100 - issues.length * 20);

    return NextResponse.json({
      success: true,
      url,
      canonical: {
        tag: canonicalTag || null,
        url: canonicalUrl || null,
        inHeader: canonicalInHeader,
        isAbsolute,
        isValid,
        pointsToSelf,
        multipleFound: hasMultipleCanonicals,
        count: canonicalTags.length,
      },
      score,
      status: score >= 80 ? 'PASS' : score >= 50 ? 'WARNING' : 'FAIL',
      issues,
      recommendations: [
        ...(!canonicalTag ? ['Add a canonical tag to specify the preferred URL'] : []),
        ...(canonicalTag && !isAbsolute ? ['Use absolute URLs in canonical tags'] : []),
        ...(hasMultipleCanonicals ? ['Remove duplicate canonical tags'] : []),
        ...(canonicalTag && pointsToSelf ? [] : ['Canonical should typically point to itself unless this is a duplicate page']),
      ],
    });
  } catch (error) {
    console.error('Canonical Checker error:', error);
    return NextResponse.json(
      { error: 'Failed to check canonical tag' },
      { status: 500 }
    );
  }
}
