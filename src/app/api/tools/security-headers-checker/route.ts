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

    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });

    const headers = response.headers;

    // Check security headers
    const securityHeaders = {
      'strict-transport-security': headers.get('strict-transport-security'),
      'content-security-policy': headers.get('content-security-policy'),
      'x-frame-options': headers.get('x-frame-options'),
      'x-content-type-options': headers.get('x-content-type-options'),
      'x-xss-protection': headers.get('x-xss-protection'),
      'referrer-policy': headers.get('referrer-policy'),
      'permissions-policy': headers.get('permissions-policy'),
    };

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // HSTS
    if (!securityHeaders['strict-transport-security']) {
      issues.push('HSTS (Strict-Transport-Security) header eksik');
      recommendations.push('HSTS header ekleyerek HTTPS bağlantılarını zorunlu kılın');
      score -= 15;
    }

    // CSP
    if (!securityHeaders['content-security-policy']) {
      issues.push('Content-Security-Policy header eksik');
      recommendations.push('CSP header ile XSS saldırılarına karşı koruma ekleyin');
      score -= 20;
    }

    // X-Frame-Options
    if (!securityHeaders['x-frame-options']) {
      issues.push('X-Frame-Options header eksik');
      recommendations.push('Clickjacking saldırılarına karşı X-Frame-Options ekleyin');
      score -= 15;
    }

    // X-Content-Type-Options
    if (!securityHeaders['x-content-type-options']) {
      issues.push('X-Content-Type-Options header eksik');
      recommendations.push('MIME type sniffing saldırılarına karşı X-Content-Type-Options: nosniff ekleyin');
      score -= 10;
    }

    // X-XSS-Protection
    if (!securityHeaders['x-xss-protection']) {
      issues.push('X-XSS-Protection header eksik');
      recommendations.push('XSS saldırılarına karşı X-XSS-Protection: 1; mode=block ekleyin');
      score -= 10;
    }

    // Referrer-Policy
    if (!securityHeaders['referrer-policy']) {
      issues.push('Referrer-Policy header eksik');
      recommendations.push('Gizlilik için Referrer-Policy header ekleyin');
      score -= 10;
    }

    // Permissions-Policy
    if (!securityHeaders['permissions-policy']) {
      issues.push('Permissions-Policy header eksik');
      recommendations.push('Tarayıcı özelliklerini kontrol etmek için Permissions-Policy ekleyin');
      score -= 10;
    }

    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    return NextResponse.json({
      success: true,
      url,
      score,
      grade,
      headers: securityHeaders,
      issues,
      recommendations,
      summary: {
        total: 7,
        present: Object.values(securityHeaders).filter(v => v !== null).length,
        missing: Object.values(securityHeaders).filter(v => v === null).length,
      },
    });
  } catch (error) {
    console.error('Security Headers Checker error:', error);
    return NextResponse.json(
      { error: 'Failed to check security headers' },
      { status: 500 }
    );
  }
}
