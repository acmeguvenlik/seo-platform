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
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const favicons: any[] = [];
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check standard favicon
    const standardFavicon = $('link[rel="icon"]').attr('href') || 
                           $('link[rel="shortcut icon"]').attr('href');
    
    if (standardFavicon) {
      favicons.push({ type: 'Standard Favicon', url: standardFavicon });
    } else {
      issues.push('Standard favicon bulunamadı');
    }

    // Check Apple Touch Icon
    const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr('href');
    if (appleTouchIcon) {
      favicons.push({ type: 'Apple Touch Icon', url: appleTouchIcon });
    } else {
      recommendations.push('Apple cihazlar için apple-touch-icon ekleyin');
    }

    // Check various sizes
    $('link[rel*="icon"]').each((_, el) => {
      const sizes = $(el).attr('sizes');
      const href = $(el).attr('href');
      if (sizes && href) {
        favicons.push({ type: `Icon ${sizes}`, url: href });
      }
    });

    const score = favicons.length >= 3 ? 100 : favicons.length === 2 ? 80 : favicons.length === 1 ? 60 : 0;

    return NextResponse.json({
      success: true,
      url,
      score,
      favicons,
      issues,
      recommendations,
      summary: {
        total: favicons.length,
        hasStandard: !!standardFavicon,
        hasApple: !!appleTouchIcon,
      },
    });
  } catch (error) {
    console.error('Favicon Checker error:', error);
    return NextResponse.json(
      { error: 'Failed to check favicon' },
      { status: 500 }
    );
  }
}
