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

    const redirectChain: Array<{
      url: string;
      statusCode: number;
      redirectTo?: string;
    }> = [];

    let currentUrl = url;
    let maxRedirects = 10;
    let redirectCount = 0;

    while (redirectCount < maxRedirects) {
      try {
        const response = await fetch(currentUrl, {
          method: 'HEAD',
          redirect: 'manual',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEO-Tools-Bot/1.0)',
          },
        });

        const statusCode = response.status;
        const location = response.headers.get('location');

        redirectChain.push({
          url: currentUrl,
          statusCode,
          redirectTo: location || undefined,
        });

        // Check if it's a redirect
        if (statusCode >= 300 && statusCode < 400 && location) {
          // Handle relative URLs
          currentUrl = new URL(location, currentUrl).href;
          redirectCount++;
        } else {
          // Final destination reached
          break;
        }
      } catch (error) {
        redirectChain.push({
          url: currentUrl,
          statusCode: 0,
        });
        break;
      }
    }

    const finalStatus = redirectChain[redirectChain.length - 1].statusCode;
    const hasRedirects = redirectChain.length > 1;
    const redirectType = hasRedirects
      ? redirectChain[0].statusCode === 301
        ? 'Permanent (301)'
        : redirectChain[0].statusCode === 302
        ? 'Temporary (302)'
        : redirectChain[0].statusCode === 307
        ? 'Temporary (307)'
        : redirectChain[0].statusCode === 308
        ? 'Permanent (308)'
        : 'Unknown'
      : 'No Redirect';

    return NextResponse.json({
      success: true,
      url,
      redirectChain,
      totalRedirects: redirectChain.length - 1,
      finalUrl: redirectChain[redirectChain.length - 1].url,
      finalStatus,
      redirectType,
      hasRedirectLoop: redirectCount >= maxRedirects,
      issues: [
        ...(redirectCount >= maxRedirects ? ['Too many redirects (possible loop)'] : []),
        ...(redirectChain.length > 3 ? ['Multiple redirects detected (bad for SEO)'] : []),
        ...(redirectChain.some(r => r.statusCode === 302) ? ['Temporary redirect (302) - consider using 301'] : []),
      ],
    });
  } catch (error) {
    console.error('Redirect Checker error:', error);
    return NextResponse.json(
      { error: 'Failed to check redirects' },
      { status: 500 }
    );
  }
}
