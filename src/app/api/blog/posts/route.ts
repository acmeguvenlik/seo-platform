import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';
import { CreateBlogPostSchema, ListPostsParamsSchema } from '@/lib/blog-validation';
import { z } from 'zod';

/**
 * GET /api/blog/posts
 * List blog posts with pagination, filters, and sorting
 * Public endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const params = {
      locale: searchParams.get('locale') || 'en',
      status: searchParams.get('status') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tagId: searchParams.get('tagId') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '12', 10),
      sortBy: (searchParams.get('sortBy') || 'publishedAt') as 'publishedAt' | 'viewCount',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };

    let validatedParams;
    try {
      validatedParams = ListPostsParamsSchema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return NextResponse.json(
          {
            error: 'Invalid parameters',
            message: firstError.message,
            field: firstError.path.join('.'),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Generate cache key
    const { locale, page, status, categoryId, tagId, sortBy, sortOrder } = validatedParams;
    const cacheKey = cacheService.generatePostListKey(locale, page, {
      status,
      categoryId,
      tagId,
      sortBy,
      sortOrder,
    });

    // Check cache first
    const cachedResult = await cacheService.getCachedPostList(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        ...cachedResult,
        cached: true,
      });
    }

    // Fetch from database
    const result = await blogService.listPosts(validatedParams);

    // Cache the result (30 minutes TTL)
    await cacheService.setCachedPostList(cacheKey, result, 1800);

    return NextResponse.json({
      success: true,
      ...result,
      cached: false,
    });
  } catch (error: any) {
    console.error('Error listing blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to list blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/posts
 * Create a new blog post
 * Requires ADMIN role
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Require admin authentication
    const user = await requireAdmin();

    // 2. Parse and validate request body
    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = CreateBlogPostSchema.parse(body);
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

    // 3. Create blog post using BlogService
    const post = await blogService.createPost(validatedData, user.id);

    // 4. Invalidate cache for post lists
    await cacheService.invalidatePostLists(post.locale);

    // 5. If category or tags were set, invalidate those caches too
    if (validatedData.categoryId) {
      await cacheService.invalidateCategories(post.locale);
    }
    if (validatedData.tagIds && validatedData.tagIds.length > 0) {
      await cacheService.invalidateTags(post.locale);
    }

    // 6. Return created post with 201 status
    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating blog post:', error);

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
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
