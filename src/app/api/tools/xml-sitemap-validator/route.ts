import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Try common sitemap locations
    const sitemapUrls = [
      url.endsWith('.xml') ? url : `${url}/sitemap.xml`,
      `${url}/sitemap_index.xml`,
      `${url}/sitemap1.xml`,
    ];

    let sitemapFound = false;
    let sitemapUrl = '';
    let sitemapContent = '';

    for (const testUrl of sitemapUrls) {
      try {
        const response = await fetch(testUrl);
        if (response.ok && response.headers.get('content-type')?.includes('xml')) {
          sitemapFound = true;
          sitemapUrl = testUrl;
          sitemapContent = await response.text();
          break;
        }
      } catch {
        continue;
      }
    }

    if (!sitemapFound) {
      return NextResponse.json({
        success: true,
        found: false,
        score: 0,
        status: 'FAIL',
        issues: ['No sitemap found at common locations'],
        recommendations: [
          'Create an XML sitemap',
          'Submit sitemap to Google Search Console',
          'Add sitemap location to robots.txt',
        ],
      });
    }

    // Parse sitemap
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
    const urlCount = urlMatches.length;
    const hasLastmod = sitemapContent.includes('<lastmod>');
    const hasPriority = sitemapContent.includes('<priority>');
    const hasChangefreq = sitemapContent.includes('<changefreq>');

    const score = 
      (sitemapFound ? 40 : 0) +
      (urlCount > 0 ? 30 : 0) +
      (hasLastmod ? 10 : 0) +
      (hasPriority ? 10 : 0) +
      (hasChangefreq ? 10 : 0);

    return NextResponse.json({
      success: true,
      found: true,
      url: sitemapUrl,
      urlCount,
      hasLastmod,
      hasPriority,
      hasChangefreq,
      score,
      status: score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : 'FAIR',
      issues: [
        ...(!hasLastmod ? ['Missing <lastmod> tags'] : []),
        ...(!hasPriority ? ['Missing <priority> tags'] : []),
        ...(urlCount === 0 ? ['Sitemap contains no URLs'] : []),
      ],
      recommendations: [
        ...(!hasLastmod ? ['Add <lastmod> tags to indicate when pages were last modified'] : []),
        ...(!hasPriority ? ['Add <priority> tags to indicate page importance'] : []),
        'Keep sitemap updated regularly',
        'Submit sitemap to search engines',
      ],
    });
  } catch (error) {
    console.error('XML Sitemap Validator error:', error);
    return NextResponse.json({ error: 'Failed to validate sitemap' }, { status: 500 });
  }
}
