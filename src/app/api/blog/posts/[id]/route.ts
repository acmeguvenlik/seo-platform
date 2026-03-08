import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';
import { UpdateBlogPostSchema } from '@/lib/blog-validation';
import { z } from 'zod';

/**
 * GET /api/blog/posts/[id]
 * Get a single blog post by ID
 * Public endpoint
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch post from database (includes related data)
    const post = await blogService.getPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/posts/[id]
 * Update a blog post
 * Requires ADMIN role
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Require admin authentication
    await requireAdmin();

    const { id } = params;

    // 2. Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = UpdateBlogPostSchema.parse(body);
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

    // 3. Get existing post to check if it exists
    const existingPost = await blogService.getPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // 4. Update blog post using BlogService
    const updatedPost = await blogService.updatePost(id, validatedData);

    // 5. Invalidate caches
    await cacheService.invalidatePostAndRelated(
      id,
      updatedPost.slug,
      updatedPost.locale
    );

    // If category or tags changed, invalidate those caches too
    if (validatedData.categoryId !== undefined) {
      await cacheService.invalidateCategories(updatedPost.locale);
    }
    if (validatedData.tagIds !== undefined) {
      await cacheService.invalidateTags(updatedPost.locale);
    }

    // 6. Return updated post
    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error: any) {
    console.error('Error updating blog post:', error);

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

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/posts/[id]
 * Delete a blog post
 * Requires ADMIN role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Require admin authentication
    await requireAdmin();

    const { id } = params;

    // 2. Get existing post to validate deletion rules
    const existingPost = await blogService.getPostById(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // 3. Validate deletion rules: only draft or archived posts can be deleted
    if (existingPost.status !== 'DRAFT' && existingPost.status !== 'ARCHIVED') {
      return NextResponse.json(
        {
          error: 'Cannot delete post',
          message: 'Only draft or archived posts can be deleted',
        },
        { status: 400 }
      );
    }

    // 4. Warning if viewCount > 100 (client should confirm before calling)
    if (existingPost.viewCount > 100) {
      const confirmed = request.headers.get('x-confirm-delete');
      if (confirmed !== 'true') {
        return NextResponse.json(
          {
            error: 'Confirmation required',
            message: `This post has ${existingPost.viewCount} views. Please confirm deletion.`,
            requiresConfirmation: true,
          },
          { status: 409 }
        );
      }
    }

    // 5. Delete the post
    await blogService.deletePost(id);

    // 6. Invalidate all related caches
    await cacheService.invalidatePostAndRelated(
      id,
      existingPost.slug,
      existingPost.locale
    );

    if (existingPost.categoryId) {
      await cacheService.invalidateCategories(existingPost.locale);
    }
    if (existingPost.tags.length > 0) {
      await cacheService.invalidateTags(existingPost.locale);
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);

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

    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
