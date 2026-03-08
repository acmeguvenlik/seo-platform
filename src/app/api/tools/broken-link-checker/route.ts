import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract all links
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
        try {
          const absoluteUrl = new URL(href, url).href;
          links.push(absoluteUrl);
        } catch {
          // Invalid URL
        }
      }
    });

    // Remove duplicates
    const uniqueLinks = [...new Set(links)];

    // Check links (limit to first 20 for performance)
    const linksToCheck = uniqueLinks.slice(0, 20);
    const brokenLinks: Array<{ url: string; status: number }> = [];
    const workingLinks: Array<{ url: string; status: number }> = [];

    await Promise.all(
      linksToCheck.map(async (link) => {
        try {
          const linkResponse = await fetch(link, {
            method: 'HEAD',
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
            signal: AbortSignal.timeout(5000),
          });

          if (linkResponse.status >= 400) {
            brokenLinks.push({ url: link, status: linkResponse.status });
          } else {
            workingLinks.push({ url: link, status: linkResponse.status });
          }
        } catch {
          brokenLinks.push({ url: link, status: 0 });
        }
      })
    );

    const totalChecked = linksToCheck.length;
    const brokenCount = brokenLinks.length;
    const workingCount = workingLinks.length;
    const score = totalChecked > 0 ? ((workingCount / totalChecked) * 100) : 100;

    return NextResponse.json({
      success: true,
      url,
      totalLinks: uniqueLinks.length,
      checked: totalChecked,
      working: workingCount,
      broken: brokenCount,
      brokenLinks,
      score: Math.round(score),
      status: brokenCount === 0 ? 'PASS' : brokenCount <= 2 ? 'WARNING' : 'FAIL',
      issues: brokenLinks.map(link => `Broken link: ${link.url} (${link.status || 'timeout'})`),
      recommendations: [
        ...(brokenCount > 0 ? ['Fix or remove broken links'] : []),
        'Regularly check for broken links',
        'Use 301 redirects for moved content',
      ],
      note: uniqueLinks.length > 20 ? `Only first 20 links checked out of ${uniqueLinks.length} total` : undefined,
    });
  } catch (error) {
    console.error('Broken Link Checker error:', error);
    return NextResponse.json({ error: 'Failed to check broken links' }, { status: 500 });
  }
}
