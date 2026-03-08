import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, url } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Calculate character counts
    const titleLength = title.length;
    const descriptionLength = description.length;

    // Optimal ranges
    const titleOptimal = titleLength >= 50 && titleLength <= 60;
    const descriptionOptimal = descriptionLength >= 120 && descriptionLength <= 160;

    // Truncate for preview
    const displayTitle = titleLength > 60 ? title.substring(0, 60) + '...' : title;
    const displayDescription = descriptionLength > 160 ? description.substring(0, 160) + '...' : description;

    // Extract domain from URL
    let displayUrl = url || 'example.com';
    try {
      const urlObj = new URL(url);
      displayUrl = urlObj.hostname + urlObj.pathname;
      if (displayUrl.length > 50) {
        displayUrl = displayUrl.substring(0, 50) + '...';
      }
    } catch {
      // Invalid URL, use as is
    }

    // Calculate score
    let score = 0;
    if (titleOptimal) score += 50;
    else if (titleLength >= 40 && titleLength <= 70) score += 30;
    else if (titleLength > 0) score += 10;

    if (descriptionOptimal) score += 50;
    else if (descriptionLength >= 100 && descriptionLength <= 180) score += 30;
    else if (descriptionLength > 0) score += 10;

    const issues = [];
    if (titleLength < 30) issues.push('Title is too short');
    if (titleLength > 60) issues.push('Title may be truncated in search results');
    if (descriptionLength < 70) issues.push('Description is too short');
    if (descriptionLength > 160) issues.push('Description may be truncated in search results');

    return NextResponse.json({
      success: true,
      preview: {
        title: displayTitle,
        description: displayDescription,
        url: displayUrl,
      },
      analysis: {
        title: {
          length: titleLength,
          optimal: titleOptimal,
          status: titleLength > 60 ? 'TOO_LONG' : titleLength < 30 ? 'TOO_SHORT' : 'GOOD',
        },
        description: {
          length: descriptionLength,
          optimal: descriptionOptimal,
          status: descriptionLength > 160 ? 'TOO_LONG' : descriptionLength < 70 ? 'TOO_SHORT' : 'GOOD',
        },
      },
      score,
      status: score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : score >= 40 ? 'FAIR' : 'POOR',
      issues,
      recommendations: [
        ...(titleLength < 50 ? ['Increase title length to 50-60 characters'] : []),
        ...(titleLength > 60 ? ['Reduce title length to 50-60 characters'] : []),
        ...(descriptionLength < 120 ? ['Increase description length to 120-160 characters'] : []),
        ...(descriptionLength > 160 ? ['Reduce description length to 120-160 characters'] : []),
      ],
    });
  } catch (error) {
    console.error('SERP Preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SERP preview' },
      { status: 500 }
    );
  }
}
