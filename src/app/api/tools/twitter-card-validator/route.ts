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

    const twitterTags: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr('name');
      const content = $(el).attr('content');
      if (name && content) {
        twitterTags[name] = content;
      }
    });

    const requiredTags = ['twitter:card', 'twitter:title', 'twitter:description'];
    const missingTags = requiredTags.filter(tag => !twitterTags[tag]);
    const score = ((requiredTags.length - missingTags.length) / requiredTags.length) * 100;

    return NextResponse.json({
      success: true,
      url,
      tags: twitterTags,
      cardType: twitterTags['twitter:card'] || null,
      required: requiredTags,
      missing: missingTags,
      score: Math.round(score),
      status: score >= 80 ? 'PASS' : score >= 50 ? 'WARNING' : 'FAIL',
      issues: missingTags.map(tag => `Missing ${tag}`),
      recommendations: missingTags.map(tag => `Add ${tag} meta tag`),
    });
  } catch (error) {
    console.error('Twitter Card Validator error:', error);
    return NextResponse.json({ error: 'Failed to validate Twitter Card' }, { status: 500 });
  }
}
