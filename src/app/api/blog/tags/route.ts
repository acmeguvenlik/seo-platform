import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';
import { CreateTagSchema, LocaleSchema } from '@/lib/blog-validation';
import { z } from 'zod';

/**
 * GET /api/blog/tags
 * List tags by locale with post counts
 * Public endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // Validate locale
    let validatedLocale;
    try {
      validatedLocale = LocaleSchema.parse(locale);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid locale parameter' },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedTags = await cacheService.getCachedTags(validatedLocale);
    if (cachedTags) {
      return NextResponse.json({
        success: true,
        tags: cachedTags,
        cached: true,
      });
    }

    // Fetch from database
    const tags = await blogService.listTags(validatedLocale);

    // Cache the result (2 hours TTL)
    await cacheService.setCachedTags(validatedLocale, tags, 7200);

    return NextResponse.json({
      success: true,
      tags,
      cached: false,
    });
  } catch (error: any) {
    console.error('Error listing tags:', error);
    return NextResponse.json(
      { error: 'Failed to list tags' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/tags
 * Create a new tag
 * Requires ADMIN role
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Require admin authentication
    await requireAdmin();

    // 2. Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = CreateTagSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return NextResponse.json(
          {
            error: 'Validation failed',
            message: firstError.message,
            field: firstError.path.join('.'),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // 3. Create tag using BlogService
    const tag = await blogService.createTag(validatedData);

    // 4. Invalidate cache for tags
    await cacheService.invalidateTags(tag.locale);

    // 5. Return created tag with 201 status
    return NextResponse.json(
      {
        success: true,
        tag,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating tag:', error);

    // Handle specific errors
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 } // Conflict
      );
    }

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
