import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Generate URL-friendly slug
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Generate variations
    const variations = [
      slug,
      slug.replace(/-/g, '_'), // Underscore version
      slug.replace(/-/g, ''), // No separator
      text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), // Alternative
    ].filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates

    return NextResponse.json({
      success: true,
      slug,
      variations,
      length: slug.length,
      seoFriendly: slug.length <= 60 && slug.length >= 3,
    });
  } catch (error) {
    console.error('URL Slug Generator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate slug' },
      { status: 500 }
    );
  }
}
