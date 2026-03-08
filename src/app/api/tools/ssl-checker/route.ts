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

    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';

    if (!isHttps) {
      return NextResponse.json({
        success: true,
        url,
        hasSSL: false,
        score: 0,
        status: 'FAIL',
        issues: ['Website does not use HTTPS'],
        recommendations: [
          'Install an SSL certificate',
          'Redirect HTTP traffic to HTTPS',
          'Update all internal links to use HTTPS',
        ],
      });
    }

    // Try to fetch the URL to check SSL
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)',
        },
      });

      const hasHSTS = response.headers.has('strict-transport-security');
      const hstsValue = response.headers.get('strict-transport-security');

      const issues = [];
      if (!hasHSTS) {
        issues.push('HSTS header not found');
      }

      const score = hasHSTS ? 100 : 80;

      return NextResponse.json({
        success: true,
        url,
        hasSSL: true,
        protocol: 'HTTPS',
        security: {
          hasHSTS,
          hstsValue: hstsValue || null,
        },
        score,
        status: score >= 90 ? 'EXCELLENT' : 'GOOD',
        issues,
        recommendations: [
          ...(!hasHSTS ? ['Enable HSTS (HTTP Strict Transport Security)'] : []),
          'Ensure SSL certificate is valid and not expired',
          'Use strong encryption protocols (TLS 1.2+)',
        ],
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        url,
        hasSSL: true,
        protocol: 'HTTPS',
        score: 70,
        status: 'WARNING',
        issues: ['Could not verify SSL certificate details'],
        recommendations: [
          'Verify SSL certificate is properly installed',
          'Check certificate expiration date',
        ],
      });
    }
  } catch (error) {
    console.error('SSL Checker error:', error);
    return NextResponse.json(
      { error: 'Failed to check SSL' },
      { status: 500 }
    );
  }
}
