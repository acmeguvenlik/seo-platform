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

    // Find hreflang tags
    const hreflangTags: Array<{ lang: string; url: string }> = [];
    $('link[rel="alternate"][hreflang]').each((_, el) => {
      const lang = $(el).attr('hreflang');
      const href = $(el).attr('href');
      if (lang && href) {
        hreflangTags.push({ lang, url: href });
      }
    });

    // Check for x-default
    const hasXDefault = hreflangTags.some(tag => tag.lang === 'x-default');

    // Check for self-referencing
    const hasSelfReference = hreflangTags.some(tag => tag.url === url);

    // Check for duplicates
    const langCounts = hreflangTags.reduce((acc, tag) => {
      acc[tag.lang] = (acc[tag.lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const duplicates = Object.entries(langCounts).filter(([_, count]) => count > 1);

    const issues = [];
    if (hreflangTags.length === 0) {
      issues.push('No hreflang tags found');
    }
    if (!hasXDefault && hreflangTags.length > 0) {
      issues.push('Missing x-default hreflang tag');
    }
    if (!hasSelfReference && hreflangTags.length > 0) {
      issues.push('Missing self-referencing hreflang tag');
    }
    if (duplicates.length > 0) {
      issues.push(`Duplicate hreflang tags: ${duplicates.map(([lang]) => lang).join(', ')}`);
    }

    const score = hreflangTags.length === 0 ? 0 :
      (hasXDefault ? 40 : 0) +
      (hasSelfReference ? 40 : 0) +
      (duplicates.length === 0 ? 20 : 0);

    return NextResponse.json({
      success: true,
      url,
      hreflangTags,
      count: hreflangTags.length,
      hasXDefault,
      hasSelfReference,
      duplicates: duplicates.map(([lang, count]) => ({ lang, count })),
      score,
      status: score >= 80 ? 'PASS' : score >= 50 ? 'WARNING' : hreflangTags.length === 0 ? 'NOT_FOUND' : 'FAIL',
      issues,
      recommendations: [
        ...(!hasXDefault && hreflangTags.length > 0 ? ['Add x-default hreflang for fallback language'] : []),
        ...(!hasSelfReference && hreflangTags.length > 0 ? ['Add self-referencing hreflang tag'] : []),
        ...(duplicates.length > 0 ? ['Remove duplicate hreflang tags'] : []),
        ...(hreflangTags.length === 0 ? ['Add hreflang tags for international SEO'] : []),
      ],
    });
  } catch (error) {
    console.error('Hreflang Validator error:', error);
    return NextResponse.json({ error: 'Failed to validate hreflang' }, { status: 500 });
  }
}
