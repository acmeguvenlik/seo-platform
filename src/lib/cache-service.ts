/**
 * CacheService - Redis-based caching for blog content
 * Handles caching of posts, lists, related posts, categories, and tags
 * Implements cache invalidation strategy for post updates
 */

import { redis } from './redis';
import type { BlogPost, BlogPostSummary, PaginatedPosts, Locale } from '@/types/blog';

/**
 * Cache TTL constants (in seconds)
 */
const CACHE_TTL = {
  POST: 3600,           // 1 hour
  POST_LIST: 1800,      // 30 minutes
  RELATED_POSTS: 3600,  // 1 hour
  CATEGORIES: 7200,     // 2 hours
  TAGS: 7200,           // 2 hours
} as const;

/**
 * Cache key generators
 */
const CACHE_KEYS = {
  post: (slug: string, locale: Locale) => `post:${locale}:${slug}`,
  
  postList: (locale: Locale, page: number, filters: string) => 
    `posts:${locale}:${page}:${filters}`,
  
  relatedPosts: (postId: string) => `related:${postId}`,
  
  categoryPosts: (slug: string, locale: Locale, page: number) => 
    `category:${locale}:${slug}:${page}`,
  
  tagPosts: (slug: string, locale: Locale, page: number) => 
    `tag:${locale}:${slug}:${page}`,
  
  categories: (locale: Locale) => `categories:${locale}`,
  
  tags: (locale: Locale) => `tags:${locale}`,
} as const;

export class CacheService {
  // ============================================================================
  // Post Caching
  // ============================================================================

  /**
   * Get cached blog post by slug and locale
   */
  async getCachedPost(slug: string, locale: Locale): Promise<BlogPost | null> {
    try {
      const key = CACHE_KEYS.post(slug, locale);
      const cached = await redis.get<string>(key);
      
      if (!cached) {
        return null;
      }
      
      return JSON.parse(cached) as BlogPost;
    } catch (error) {
      console.error('Error getting cached post:', error);
      return null;
    }
  }

  /**
   * Cache a blog post with TTL
   */
  async setCachedPost(
    slug: string,
    locale: Locale,
    post: BlogPost,
    ttl: number = CACHE_TTL.POST
  ): Promise<void> {
    try {
      const key = CACHE_KEYS.post(slug, locale);
      await redis.setex(key, ttl, JSON.stringify(post));
    } catch (error) {
      console.error('Error setting cached post:', error);
    }
  }

  /**
   * Invalidate a specific post cache
   */
  async invalidatePost(slug: string, locale: Locale): Promise<void> {
    try {
      const key = CACHE_KEYS.post(slug, locale);
      await redis.del(key);
    } catch (error) {
      console.error('Error invalidating post cache:', error);
    }
  }

  // ============================================================================
  // Post List Caching
  // ============================================================================

  /**
   * Get cached post list
   * @param key - Cache key for the list (use generatePostListKey)
   */
  async getCachedPostList(key: string): Promise<PaginatedPosts | null> {
    try {
      const cached = await redis.get<string>(key);
      
      if (!cached) {
        return null;
      }
      
      return JSON.parse(cached) as PaginatedPosts;
    } catch (error) {
      console.error('Error getting cached post list:', error);
      return null;
    }
  }

  /**
   * Cache a post list with TTL
   */
  async setCachedPostList(
    key: string,
    posts: PaginatedPosts,
    ttl: number = CACHE_TTL.POST_LIST
  ): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(posts));
    } catch (error) {
      console.error('Error setting cached post list:', error);
    }
  }

  /**
   * Invalidate all post list caches for a locale
   * This uses pattern matching to delete all list-related keys
   */
  async invalidatePostLists(locale: Locale): Promise<void> {
    try {
      // Get all keys matching the pattern
      const patterns = [
        `posts:${locale}:*`,
        `category:${locale}:*`,
        `tag:${locale}:*`,
      ];

      for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } catch (error) {
      console.error('Error invalidating post lists:', error);
    }
  }

  /**
   * Generate cache key for post list with filters
   */
  generatePostListKey(
    locale: Locale,
    page: number,
    filters: {
      status?: string;
      categoryId?: string;
      tagId?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ): string {
    // Create a consistent filter string
    const filterParts: string[] = [];
    
    if (filters.status) filterParts.push(`status=${filters.status}`);
    if (filters.categoryId) filterParts.push(`cat=${filters.categoryId}`);
    if (filters.tagId) filterParts.push(`tag=${filters.tagId}`);
    if (filters.sortBy) filterParts.push(`sort=${filters.sortBy}`);
    if (filters.sortOrder) filterParts.push(`order=${filters.sortOrder}`);
    
    const filterString = filterParts.length > 0 ? filterParts.join('&') : 'default';
    
    return CACHE_KEYS.postList(locale, page, filterString);
  }

  // ============================================================================
  // Related Posts Caching
  // ============================================================================

  /**
   * Get cached related posts
   */
  async getCachedRelatedPosts(postId: string): Promise<BlogPostSummary[] | null> {
    try {
      const key = CACHE_KEYS.relatedPosts(postId);
      const cached = await redis.get<string>(key);
      
      if (!cached) {
        return null;
      }
      
      return JSON.parse(cached) as BlogPostSummary[];
    } catch (error) {
      console.error('Error getting cached related posts:', error);
      return null;
    }
  }

  /**
   * Cache related posts with TTL
   */
  async setCachedRelatedPosts(
    postId: string,
    posts: BlogPostSummary[],
    ttl: number = CACHE_TTL.RELATED_POSTS
  ): Promise<void> {
    try {
      const key = CACHE_KEYS.relatedPosts(postId);
      await redis.setex(key, ttl, JSON.stringify(posts));
    } catch (error) {
      console.error('Error setting cached related posts:', error);
    }
  }

  /**
   * Invalidate related posts cache
   */
  async invalidateRelatedPosts(postId: string): Promise<void> {
    try {
      const key = CACHE_KEYS.relatedPosts(postId);
      await redis.del(key);
    } catch (error) {
      console.error('Error invalidating related posts cache:', error);
    }
  }

  // ============================================================================
  // Category and Tag Caching
  // ============================================================================

  /**
   * Get cached categories for a locale
   */
  async getCachedCategories(locale: Locale): Promise<any[] | null> {
    try {
      const key = CACHE_KEYS.categories(locale);
      const cached = await redis.get<string>(key);
      
      if (!cached) {
        return null;
      }
      
      return JSON.parse(cached);
    } catch (error) {
      console.error('Error getting cached categories:', error);
      return null;
    }
  }

  /**
   * Cache categories with TTL
   */
  async setCachedCategories(
    locale: Locale,
    categories: any[],
    ttl: number = CACHE_TTL.CATEGORIES
  ): Promise<void> {
    try {
      const key = CACHE_KEYS.categories(locale);
      await redis.setex(key, ttl, JSON.stringify(categories));
    } catch (error) {
      console.error('Error setting cached categories:', error);
    }
  }

  /**
   * Invalidate categories cache for a locale
   */
  async invalidateCategories(locale: Locale): Promise<void> {
    try {
      const key = CACHE_KEYS.categories(locale);
      await redis.del(key);
    } catch (error) {
      console.error('Error invalidating categories cache:', error);
    }
  }

  /**
   * Get cached tags for a locale
   */
  async getCachedTags(locale: Locale): Promise<any[] | null> {
    try {
      const key = CACHE_KEYS.tags(locale);
      const cached = await redis.get<string>(key);
      
      if (!cached) {
        return null;
      }
      
      return JSON.parse(cached);
    } catch (error) {
      console.error('Error getting cached tags:', error);
      return null;
    }
  }

  /**
   * Cache tags with TTL
   */
  async setCachedTags(
    locale: Locale,
    tags: any[],
    ttl: number = CACHE_TTL.TAGS
  ): Promise<void> {
    try {
      const key = CACHE_KEYS.tags(locale);
      await redis.setex(key, ttl, JSON.stringify(tags));
    } catch (error) {
      console.error('Error setting cached tags:', error);
    }
  }

  /**
   * Invalidate tags cache for a locale
   */
  async invalidateTags(locale: Locale): Promise<void> {
    try {
      const key = CACHE_KEYS.tags(locale);
      await redis.del(key);
    } catch (error) {
      console.error('Error invalidating tags cache:', error);
    }
  }

  // ============================================================================
  // Cache Invalidation Strategy
  // ============================================================================

  /**
   * Comprehensive cache invalidation when a post is created/updated/deleted
   * 
   * This method implements the cache invalidation strategy:
   * 1. Invalidate the specific post cache
   * 2. Invalidate all post list caches for that locale
   * 3. Invalidate related posts cache for that post
   * 4. Invalidate category/tag caches if changed
   */
  async invalidatePostAndRelated(
    postId: string,
    slug: string,
    locale: Locale,
    options: {
      categoryChanged?: boolean;
      tagsChanged?: boolean;
    } = {}
  ): Promise<void> {
    try {
      // 1. Invalidate the specific post cache
      await this.invalidatePost(slug, locale);

      // 2. Invalidate all post list caches for that locale
      await this.invalidatePostLists(locale);

      // 3. Invalidate related posts cache for that post
      await this.invalidateRelatedPosts(postId);

      // 4. Invalidate category/tag caches if changed
      if (options.categoryChanged) {
        await this.invalidateCategories(locale);
      }

      if (options.tagsChanged) {
        await this.invalidateTags(locale);
      }
    } catch (error) {
      console.error('Error in comprehensive cache invalidation:', error);
    }
  }

  /**
   * Clear all blog-related caches (use with caution)
   */
  async clearAllBlogCaches(): Promise<void> {
    try {
      const patterns = [
        'post:*',
        'posts:*',
        'related:*',
        'category:*',
        'tag:*',
        'categories:*',
        'tags:*',
      ];

      for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } catch (error) {
      console.error('Error clearing all blog caches:', error);
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Export cache key generators for external use
export { CACHE_KEYS, CACHE_TTL };
