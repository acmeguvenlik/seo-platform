import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';
import { CreateCategorySchema, LocaleSchema } from '@/lib/blog-validation';
import { z } from 'zod';

/**
 * GET /api/blog/categories
 * List categories by locale with post counts
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
    const cachedCategories = await cacheService.getCachedCategories(validatedLocale);
    if (cachedCategories) {
      return NextResponse.json({
        success: true,
        categories: cachedCategories,
        cached: true,
      });
    }

    // Fetch from database
    const categories = await blogService.listCategories(validatedLocale);

    // Cache the result (2 hours TTL)
    await cacheService.setCachedCategories(validatedLocale, categories, 7200);

    return NextResponse.json({
      success: true,
      categories,
      cached: false,
    });
  } catch (error: any) {
    console.error('Error listing categories:', error);
    return NextResponse.json(
      { error: 'Failed to list categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/categories
 * Create a new category
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
      validatedData = CreateCategorySchema.parse(body);
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

    // 3. Create category using BlogService
    const category = await blogService.createCategory(validatedData);

    // 4. Invalidate cache for categories
    await cacheService.invalidateCategories(category.locale);

    // 5. Return created category with 201 status
    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

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
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
