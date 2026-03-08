/**
 * Example usage of CacheService with BlogService
 * This file demonstrates how to integrate caching into blog operations
 */

import { cacheService } from './cache-service';
import { blogService } from './blog-service';
import type {
  BlogPost,
  BlogPostSummary,
  PaginatedPosts,
  Locale,
} from '@/types/blog';
import type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  ListPostsParams,
} from './blog-validation';

/**
 * Get a blog post by slug with caching
 */
export async function getCachedPostBySlug(
  slug: string,
  locale: Locale
): Promise<BlogPost | null> {
  // Try to get from cache first
  const cached = await cacheService.getCachedPost(slug, locale);
  if (cached) {
    console.log(`Cache hit for post: ${slug}`);
    return cached;
  }

  console.log(`Cache miss for post: ${slug}`);

  // If not in cache, fetch from database
  const post = await blogService.getPostBySlug(slug, locale);

  // Cache the result if found
  if (post) {
    await cacheService.setCachedPost(slug, locale, post);
  }

  return post;
}

/**
 * List blog posts with caching
 */
export async function getCachedPostList(
  params: ListPostsParams
): Promise<PaginatedPosts> {
  // Generate cache key based on parameters
  const cacheKey = cacheService.generatePostListKey(params.locale, params.page, {
    status: params.status,
    categoryId: params.categoryId,
    tagId: params.tagId,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  // Try to get from cache
  const cached = await cacheService.getCachedPostList(cacheKey);
  if (cached) {
    console.log(`Cache hit for post list: ${cacheKey}`);
    return cached;
  }

  console.log(`Cache miss for post list: ${cacheKey}`);

  // Fetch from database
  const posts = await blogService.listPosts(params);

  // Cache the result
  await cacheService.setCachedPostList(cacheKey, posts);

  return posts;
}

/**
 * Create a blog post with cache invalidation
 */
export async function createPostWithCache(
  data: CreateBlogPostInput,
  authorId: string
): Promise<BlogPost> {
  // Create the post
  const post = await blogService.createPost(data, authorId);

  console.log(`Post created: ${post.slug}, invalidating caches...`);

  // Invalidate post lists for the locale
  await cacheService.invalidatePostLists(post.locale);

  // Invalidate categories/tags if they were set
  if (data.categoryId) {
    await cacheService.invalidateCategories(post.locale);
  }
  if (data.tagIds && data.tagIds.length > 0) {
    await cacheService.invalidateTags(post.locale);
  }

  return post;
}

/**
 * Update a blog post with cache invalidation
 */
export async function updatePostWithCache(
  id: string,
  data: UpdateBlogPostInput
): Promise<BlogPost> {
  // Get the existing post to check what changed
  const existingPost = await blogService.getPostById(id);
  if (!existingPost) {
    throw new Error('Post not found');
  }

  // Update the post
  const updatedPost = await blogService.updatePost(id, data);

  console.log(`Post updated: ${updatedPost.slug}, invalidating caches...`);

  // Determine what changed
  const categoryChanged =
    data.categoryId !== undefined && data.categoryId !== existingPost.categoryId;
  const tagsChanged =
    data.tagIds !== undefined &&
    JSON.stringify(data.tagIds?.sort()) !==
      JSON.stringify(existingPost.tags.map((t) => t.id).sort());

  // Invalidate caches
  await cacheService.invalidatePostAndRelated(
    updatedPost.id,
    updatedPost.slug,
    updatedPost.locale,
    {
      categoryChanged,
      tagsChanged,
    }
  );

  return updatedPost;
}

/**
 * Delete a blog post with cache invalidation
 */
export async function deletePostWithCache(id: string): Promise<void> {
  // Get the post before deletion
  const post = await blogService.getPostById(id);
  if (!post) {
    throw new Error('Post not found');
  }

  console.log(`Deleting post: ${post.slug}, invalidating caches...`);

  // Delete the post
  await blogService.deletePost(id);

  // Invalidate all related caches
  await cacheService.invalidatePostAndRelated(post.id, post.slug, post.locale, {
    categoryChanged: !!post.categoryId,
    tagsChanged: post.tags.length > 0,
  });
}

/**
 * Get posts by category with caching
 */
export async function getCachedPostsByCategory(
  categorySlug: string,
  locale: Locale,
  page: number = 1
): Promise<PaginatedPosts> {
  // Generate cache key
  const cacheKey = `category:${locale}:${categorySlug}:${page}`;

  // Try to get from cache
  const cached = await cacheService.getCachedPostList(cacheKey);
  if (cached) {
    console.log(`Cache hit for category posts: ${cacheKey}`);
    return cached;
  }

  console.log(`Cache miss for category posts: ${cacheKey}`);

  // Fetch from database
  const posts = await blogService.getPostsByCategory(categorySlug, locale, page);

  // Cache the result
  await cacheService.setCachedPostList(cacheKey, posts);

  return posts;
}

/**
 * Get posts by tag with caching
 */
export async function getCachedPostsByTag(
  tagSlug: string,
  locale: Locale,
  page: number = 1
): Promise<PaginatedPosts> {
  // Generate cache key
  const cacheKey = `tag:${locale}:${tagSlug}:${page}`;

  // Try to get from cache
  const cached = await cacheService.getCachedPostList(cacheKey);
  if (cached) {
    console.log(`Cache hit for tag posts: ${cacheKey}`);
    return cached;
  }

  console.log(`Cache miss for tag posts: ${cacheKey}`);

  // Fetch from database
  const posts = await blogService.getPostsByTag(tagSlug, locale, page);

  // Cache the result
  await cacheService.setCachedPostList(cacheKey, posts);

  return posts;
}

/**
 * Increment view count with caching consideration
 */
export async function incrementViewCountWithCache(
  postId: string,
  slug: string,
  locale: Locale,
  sessionId: string
): Promise<void> {
  // Increment view count in database
  await blogService.incrementViewCount(postId, sessionId);

  // Invalidate the cached post to reflect new view count
  // Note: You might want to debounce this or update cache directly
  // to avoid too many cache invalidations
  await cacheService.invalidatePost(slug, locale);
}

/**
 * Example: Cache warming for popular content
 */
export async function warmCacheForLocale(locale: Locale): Promise<void> {
  console.log(`Warming cache for locale: ${locale}`);

  // Cache the first page of posts
  const firstPage = await getCachedPostList({
    locale,
    status: 'PUBLISHED',
    page: 1,
    limit: 12,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  console.log(`Cached ${firstPage.posts.length} posts for first page`);

  // Cache individual popular posts
  const popularPosts = await blogService.listPosts({
    locale,
    status: 'PUBLISHED',
    page: 1,
    limit: 10,
    sortBy: 'viewCount',
    sortOrder: 'desc',
  });

  for (const post of popularPosts.posts) {
    const fullPost = await blogService.getPostBySlug(post.slug, locale);
    if (fullPost) {
      await cacheService.setCachedPost(post.slug, locale, fullPost);
    }
  }

  console.log(`Cached ${popularPosts.posts.length} popular posts`);
}

/**
 * Example: Batch cache invalidation for bulk operations
 */
export async function bulkPublishPostsWithCache(
  postIds: string[]
): Promise<void> {
  console.log(`Bulk publishing ${postIds.length} posts...`);

  // Get all posts
  const posts = await Promise.all(
    postIds.map((id) => blogService.getPostById(id))
  );

  // Update all posts to published
  await Promise.all(
    posts.map((post) =>
      post
        ? blogService.updatePost(post.id, {
            status: 'PUBLISHED',
            publishedAt: new Date().toISOString(),
          })
        : null
    )
  );

  // Invalidate caches by locale (more efficient than per-post)
  const locales = [...new Set(posts.map((p) => p?.locale).filter(Boolean))];

  for (const locale of locales) {
    await cacheService.invalidatePostLists(locale as Locale);
  }

  console.log(`Invalidated caches for locales: ${locales.join(', ')}`);
}
