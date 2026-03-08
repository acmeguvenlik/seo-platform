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

    // Find JSON-LD structured data
    const jsonLdScripts: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const content = $(el).html();
        if (content) {
          const data = JSON.parse(content);
          jsonLdScripts.push(data);
        }
      } catch {
        // Invalid JSON
      }
    });

    // Find microdata
    const microdataItems = $('[itemscope]').length;

    // Find RDFa
    const rdfaItems = $('[vocab], [typeof]').length;

    const totalStructuredData = jsonLdScripts.length + microdataItems + rdfaItems;

    // Extract schema types
    const schemaTypes = jsonLdScripts
      .map(data => data['@type'])
      .filter(Boolean)
      .flat();

    const issues = [];
    if (totalStructuredData === 0) {
      issues.push('No structured data found');
    }
    if (jsonLdScripts.length === 0) {
      issues.push('No JSON-LD structured data found (recommended format)');
    }

    const score = totalStructuredData === 0 ? 0 :
      (jsonLdScripts.length > 0 ? 60 : 0) +
      (schemaTypes.length > 0 ? 30 : 0) +
      (totalStructuredData > 1 ? 10 : 0);

    return NextResponse.json({
      success: true,
      url,
      structuredData: {
        jsonLd: jsonLdScripts,
        jsonLdCount: jsonLdScripts.length,
        microdataCount: microdataItems,
        rdfaCount: rdfaItems,
        total: totalStructuredData,
      },
      schemaTypes,
      score,
      status: score >= 80 ? 'EXCELLENT' : score >= 50 ? 'GOOD' : totalStructuredData === 0 ? 'NOT_FOUND' : 'FAIR',
      issues,
      recommendations: [
        ...(totalStructuredData === 0 ? ['Add structured data to help search engines understand your content'] : []),
        ...(jsonLdScripts.length === 0 ? ['Use JSON-LD format (recommended by Google)'] : []),
        ...(schemaTypes.length === 0 ? ['Add schema.org types (Article, Product, Organization, etc.)'] : []),
        'Test structured data with Google Rich Results Test',
      ],
    });
  } catch (error) {
    console.error('Structured Data Validator error:', error);
    return NextResponse.json({ error: 'Failed to validate structured data' }, { status: 500 });
  }
}
