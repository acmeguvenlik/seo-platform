import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Simulate Core Web Vitals check (in production, use real metrics)
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)' },
    });
    const loadTime = Date.now() - startTime;

    const html = await response.text();
    const contentSize = new Blob([html]).size;

    // Simulated metrics (in production, use Lighthouse or real user monitoring)
    const lcp = loadTime * 1.2; // Largest Contentful Paint
    const fid = Math.random() * 100; // First Input Delay
    const cls = Math.random() * 0.25; // Cumulative Layout Shift

    const vitals = {
      lcp: {
        value: Math.round(lcp),
        unit: 'ms',
        rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
        threshold: { good: 2500, poor: 4000 },
      },
      fid: {
        value: Math.round(fid),
        unit: 'ms',
        rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
        threshold: { good: 100, poor: 300 },
      },
      cls: {
        value: Math.round(cls * 1000) / 1000,
        unit: 'score',
        rating: cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor',
        threshold: { good: 0.1, poor: 0.25 },
      },
    };

    const goodCount = Object.values(vitals).filter(v => v.rating === 'good').length;
    const score = (goodCount / 3) * 100;

    return NextResponse.json({
      success: true,
      url,
      vitals,
      pageSize: contentSize,
      loadTime,
      score: Math.round(score),
      status: score >= 80 ? 'PASS' : score >= 50 ? 'WARNING' : 'FAIL',
      issues: Object.entries(vitals)
        .filter(([_, v]) => v.rating !== 'good')
        .map(([key, v]) => `${key.toUpperCase()}: ${v.value}${v.unit} (${v.rating})`),
      recommendations: [
        ...(vitals.lcp.rating !== 'good' ? ['Optimize images and reduce server response time'] : []),
        ...(vitals.fid.rating !== 'good' ? ['Minimize JavaScript execution time'] : []),
        ...(vitals.cls.rating !== 'good' ? ['Add size attributes to images and embeds'] : []),
      ],
    });
  } catch (error) {
    console.error('Core Web Vitals error:', error);
    return NextResponse.json({ error: 'Failed to check Core Web Vitals' }, { status: 500 });
  }
}
