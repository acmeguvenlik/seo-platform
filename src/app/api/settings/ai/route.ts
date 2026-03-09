import { NextRequest, NextResponse } from 'next/server';

// Note: In production, store these in a database per user
// For now, we'll use environment variables as fallback
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      apiKey: process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : '',
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    });
  } catch (error) {
    console.error('Failed to get AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model } = await request.json();

    // In production, save to database per user
    // For now, we'll just validate and return success
    // The actual values should be set in environment variables

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: 'API key and model are required' },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!apiKey.startsWith('AIzaSy')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully. Please update environment variables in Vercel for changes to take effect.',
      note: 'For production use, set GEMINI_API_KEY and GEMINI_MODEL in Vercel environment variables.',
    });
  } catch (error) {
    console.error('Failed to save AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
