import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Check important security headers
    const securityHeaders = {
      'strict-transport-security': !!headers['strict-transport-security'],
      'x-content-type-options': !!headers['x-content-type-options'],
      'x-frame-options': !!headers['x-frame-options'],
      'x-xss-protection': !!headers['x-xss-protection'],
      'content-security-policy': !!headers['content-security-policy'],
    };

    const missingHeaders = Object.entries(securityHeaders)
      .filter(([_, present]) => !present)
      .map(([header]) => header);

    const score = ((5 - missingHeaders.length) / 5) * 100;

    return NextResponse.json({
      success: true,
      url,
      statusCode: response.status,
      headers,
      security: securityHeaders,
      missing: missingHeaders,
      score: Math.round(score),
      status: score >= 80 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR',
      issues: missingHeaders.map(h => `Missing security header: ${h}`),
      recommendations: missingHeaders.map(h => `Add ${h} header for better security`),
    });
  } catch (error) {
    console.error('HTTP Header Checker error:', error);
    return NextResponse.json({ error: 'Failed to check HTTP headers' }, { status: 500 });
  }
}
