import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';

/**
 * DELETE /api/blog/tags/[id]
 * Delete a tag (cascade deletes BlogPostTag relations)
 * Requires ADMIN role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Require admin authentication
    await requireAdmin();

    const { id } = await params;

    // 2. Get existing tag to check if it exists
    const existingTag = await blogService.getTagById(id);
    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // 3. Delete the tag (Prisma cascade deletes BlogPostTag relations)
    await blogService.deleteTag(id);

    // 4. Invalidate all related caches
    await cacheService.invalidateTags(existingTag.locale);
    await cacheService.invalidatePostLists(existingTag.locale);

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting tag:', error);

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
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
