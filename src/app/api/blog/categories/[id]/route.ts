import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';
import { UpdateCategorySchema } from '@/lib/blog-validation';
import { z } from 'zod';

/**
 * PUT /api/blog/categories/[id]
 * Update a category
 * Requires ADMIN role
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Require admin authentication
    await requireAdmin();

    // 2. Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = UpdateCategorySchema.parse(body);
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

    // 3. Get existing category to check if it exists
    const existingCategory = await blogService.getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 4. Update category using BlogService
    const updatedCategory = await blogService.updateCategory(id, validatedData);

    // 5. Invalidate caches
    await cacheService.invalidateCategories(updatedCategory.locale);
    await cacheService.invalidatePostLists(updatedCategory.locale);

    // 6. Return updated category
    return NextResponse.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);

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
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/categories/[id]
 * Delete a category (sets posts' categoryId to null)
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

    // 2. Get existing category to check if it exists
    const existingCategory = await blogService.getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // 3. Delete the category (BlogService handles setting posts to null)
    await blogService.deleteCategory(id);

    // 4. Invalidate all related caches
    await cacheService.invalidateCategories(existingCategory.locale);
    await cacheService.invalidatePostLists(existingCategory.locale);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);

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
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
