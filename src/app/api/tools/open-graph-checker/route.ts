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

    const ogTags: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property');
      const content = $(el).attr('content');
      if (property && content) {
        ogTags[property] = content;
      }
    });

    const requiredTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
    const missingTags = requiredTags.filter(tag => !ogTags[tag]);
    const score = ((requiredTags.length - missingTags.length) / requiredTags.length) * 100;

    return NextResponse.json({
      success: true,
      url,
      tags: ogTags,
      required: requiredTags,
      missing: missingTags,
      score: Math.round(score),
      status: score >= 80 ? 'PASS' : score >= 50 ? 'WARNING' : 'FAIL',
      issues: missingTags.map(tag => `Missing ${tag}`),
      recommendations: missingTags.map(tag => `Add ${tag} meta tag`),
    });
  } catch (error) {
    console.error('Open Graph Checker error:', error);
    return NextResponse.json({ error: 'Failed to check Open Graph tags' }, { status: 500 });
  }
}
