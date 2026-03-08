/**
 * BlogService - Core service for blog post management
 * Handles CRUD operations, validation, and business logic
 */

import { db } from './db';
import { calculateReadingTime } from './blog-utils';
import type {
  BlogPost,
  BlogPostSummary,
  PaginatedPosts,
  Locale,
  PublicationStatus,
  Category,
  CategoryWithCount,
  Tag,
  TagWithCount,
} from '@/types/blog';
import type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  ListPostsParams,
} from './blog-validation';

export class BlogService {
  /**
   * Create a new blog post
   */
  async createPost(
    data: CreateBlogPostInput,
    authorId: string
  ): Promise<BlogPost> {
    // Validate slug uniqueness
    const isUnique = await this.validateSlugUniqueness(data.slug, data.locale);
    if (!isUnique) {
      throw new Error(`Slug "${data.slug}" already exists for locale "${data.locale}"`);
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(data.content);

    // Prepare post data
    const postData: any = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: data.slug,
      locale: data.locale,
      status: data.status,
      readingTime,
      authorId,
      categoryId: data.categoryId,
      featuredImageId: data.featuredImageId,
      translationOfId: data.translationOfId,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    };

    // Add SEO metadata if provided
    if (data.seoMetadata) {
      postData.seoTitle = data.seoMetadata.title;
      postData.seoDescription = data.seoMetadata.description;
      postData.ogImage = data.seoMetadata.ogImage;
    }

    // Create post with tags
    const post = await db.blogPost.create({
      data: {
        ...postData,
        tags: data.tagIds
          ? {
              create: data.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        category: true,
        featuredImage: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.mapToBlogPost(post);
  }

  /**
   * Update an existing blog post
   */
  async updatePost(
    id: string,
    data: UpdateBlogPostInput
  ): Promise<BlogPost> {
    // Check if post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error(`Blog post with id "${id}" not found`);
    }

    // Recalculate reading time if content changed
    const readingTime = data.content
      ? calculateReadingTime(data.content)
      : undefined;

    // Prepare update data
    const updateData: any = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      categoryId: data.categoryId,
      featuredImageId: data.featuredImageId,
      translationOfId: data.translationOfId,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      readingTime,
    };

    // Update SEO metadata if provided
    if (data.seoMetadata) {
      updateData.seoTitle = data.seoMetadata.title;
      updateData.seoDescription = data.seoMetadata.description;
      updateData.ogImage = data.seoMetadata.ogImage;
    }

    // Handle tag updates
    if (data.tagIds) {
      // Delete existing tags and create new ones
      await db.blogPostTag.deleteMany({
        where: { postId: id },
      });
    }

    // Update post
    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        tags: data.tagIds
          ? {
              create: data.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        category: true,
        featuredImage: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.mapToBlogPost(post);
  }

  /**
   * Delete a blog post
   * Only allowed for DRAFT or ARCHIVED posts
   */
  async deletePost(id: string): Promise<void> {
    const post = await db.blogPost.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!post) {
      throw new Error(`Blog post with id "${id}" not found`);
    }

    if (post.status !== 'DRAFT' && post.status !== 'ARCHIVED') {
      throw new Error(
        `Cannot delete post with status "${post.status}". Only DRAFT or ARCHIVED posts can be deleted.`
      );
    }

    await db.blogPost.delete({
      where: { id },
    });
  }

  /**
   * Get a blog post by ID
   */
  async getPostById(id: string): Promise<BlogPost | null> {
    const post = await db.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        featuredImage: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return this.mapToBlogPost(post);
  }

  /**
   * Get a blog post by slug and locale
   */
  async getPostBySlug(
    slug: string,
    locale: Locale
  ): Promise<BlogPost | null> {
    const post = await db.blogPost.findUnique({
      where: {
        slug_locale: {
          slug,
          locale,
        },
      },
      include: {
        author: true,
        category: true,
        featuredImage: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return this.mapToBlogPost(post);
  }

  /**
   * List blog posts with filtering, sorting, and pagination
   */
  async listPosts(params: ListPostsParams): Promise<PaginatedPosts> {
    const { locale, status, categoryId, tagId, page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      locale,
    };

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      };
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'publishedAt') {
      orderBy.publishedAt = sortOrder;
    } else if (sortBy === 'viewCount') {
      orderBy.viewCount = sortOrder;
    }

    // Execute queries
    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          featuredImage: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      db.blogPost.count({ where }),
    ]);

    return {
      posts: posts.map((post) => this.mapToBlogPostSummary(post)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Validate slug uniqueness within a locale
   */
  async validateSlugUniqueness(
    slug: string,
    locale: Locale,
    excludeId?: string
  ): Promise<boolean> {
    const where: any = {
      slug,
      locale,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingPost = await db.blogPost.findFirst({
      where,
    });

    return existingPost === null;
  }

  /**
   * Increment view count with session deduplication
   */
  async incrementViewCount(postId: string, sessionId: string): Promise<void> {
    // Check if this session has already viewed this post
    const existingView = await db.postView.findUnique({
      where: {
        postId_sessionId: {
          postId,
          sessionId,
        },
      },
    });

    // If already viewed, don't increment
    if (existingView) {
      return;
    }

    // Create view record and increment count in a transaction
    await db.$transaction([
      db.postView.create({
        data: {
          postId,
          sessionId,
          userAgent: '',
          locale: 'en',
        },
      }),
      db.blogPost.update({
        where: { id: postId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      }),
    ]);
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(
    categorySlug: string,
    locale: Locale,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedPosts> {
    const category = await db.category.findUnique({
      where: {
        slug_locale: {
          slug: categorySlug,
          locale,
        },
      },
    });

    if (!category) {
      return {
        posts: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }

    return this.listPosts({
      locale,
      categoryId: category.id,
      page,
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    });
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(
    tagSlug: string,
    locale: Locale,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedPosts> {
    const tag = await db.tag.findUnique({
      where: {
        slug_locale: {
          slug: tagSlug,
          locale,
        },
      },
    });

    if (!tag) {
      return {
        posts: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }

    return this.listPosts({
      locale,
      tagId: tag.id,
      page,
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    });
  }

  // ============================================
  // Category Management
  // ============================================

  /**
   * Create a new category
   */
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    locale: Locale;
  }): Promise<Category> {
    // Check slug uniqueness within locale
    const existing = await prisma.category.findUnique({
      where: {
        slug_locale: {
          slug: data.slug,
          locale: data.locale,
        },
      },
    });

    if (existing) {
      throw new Error(`Category with slug "${data.slug}" already exists for locale ${data.locale}`);
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        locale: data.locale,
      },
    });

    return category as Category;
  }

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      locale?: Locale;
    }
  ): Promise<Category> {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return category as Category;
  }

  /**
   * Delete a category (sets posts' categoryId to null)
   */
  async deleteCategory(id: string): Promise<void> {
    // First, set all posts' categoryId to null
    await prisma.blogPost.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    // Then delete the category
    await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    return category as Category | null;
  }

  /**
   * List categories by locale with post counts
   */
  async listCategories(locale: Locale): Promise<CategoryWithCount[]> {
    const categories = await prisma.category.findMany({
      where: { locale },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || undefined,
      locale: cat.locale as Locale,
      postCount: cat._count.posts,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  }

  // ============================================
  // Tag Management
  // ============================================

  /**
   * Create a new tag
   */
  async createTag(data: {
    name: string;
    slug: string;
    locale: Locale;
  }): Promise<Tag> {
    // Check slug uniqueness within locale
    const existing = await prisma.tag.findUnique({
      where: {
        slug_locale: {
          slug: data.slug,
          locale: data.locale,
        },
      },
    });

    if (existing) {
      throw new Error(`Tag with slug "${data.slug}" already exists for locale ${data.locale}`);
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
        locale: data.locale,
      },
    });

    return tag as Tag;
  }

  /**
   * Delete a tag (cascade deletes BlogPostTag relations)
   */
  async deleteTag(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    return tag as Tag | null;
  }

  /**
   * List tags by locale with post counts
   */
  async listTags(locale: Locale): Promise<TagWithCount[]> {
    const tags = await prisma.tag.findMany({
      where: { locale },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      locale: tag.locale as Locale,
      postCount: tag._count.posts,
      createdAt: tag.createdAt,
    }));
  }

  /**
   * Map Prisma result to BlogPost type
   */
  private mapToBlogPost(post: any): BlogPost {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || undefined,
      slug: post.slug,
      locale: post.locale,
      status: post.status,
      seoTitle: post.seoTitle || undefined,
      seoDescription: post.seoDescription || undefined,
      ogImage: post.ogImage || undefined,
      canonicalUrl: post.canonicalUrl || undefined,
      categoryId: post.categoryId || undefined,
      category: post.category || undefined,
      tags: post.tags?.map((pt: any) => pt.tag) || [],
      featuredImageId: post.featuredImageId || undefined,
      featuredImage: post.featuredImage || undefined,
      translationOfId: post.translationOfId || undefined,
      authorId: post.authorId,
      author: post.author,
      readingTime: post.readingTime,
      viewCount: post.viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt || undefined,
    };
  }

  /**
   * Map Prisma result to BlogPostSummary type
   */
  private mapToBlogPostSummary(post: any): BlogPostSummary {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || '',
      slug: post.slug,
      locale: post.locale,
      featuredImage: post.featuredImage
        ? {
            url: post.featuredImage.url,
            altText: post.featuredImage.altText,
          }
        : undefined,
      category: post.category
        ? {
            name: post.category.name,
            slug: post.category.slug,
          }
        : undefined,
      readingTime: post.readingTime,
      viewCount: post.viewCount,
      publishedAt: post.publishedAt || post.createdAt,
    };
  }
}

// Export singleton instance
export const blogService = new BlogService();
