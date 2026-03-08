/**
 * Unit tests for CacheService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './cache-service';
import type { BlogPost, BlogPostSummary, PaginatedPosts, Locale } from '@/types/blog';

// Mock Redis
vi.mock('./redis', () => ({
  redis: {
    get: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
  },
}));

import { redis } from './redis';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
    vi.clearAllMocks();
  });

  // ============================================================================
  // Post Caching Tests
  // ============================================================================

  describe('Post Caching', () => {
    const mockPost: BlogPost = {
      id: 'post-1',
      title: 'Test Post',
      content: 'Test content',
      slug: 'test-post',
      locale: 'en' as Locale,
      status: 'PUBLISHED',
      authorId: 'user-1',
      author: {
        id: 'user-1',
        name: 'Test Author',
        email: 'test@example.com',
        role: 'ADMIN',
      },
      readingTime: 5,
      viewCount: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };

    it('should get cached post', async () => {
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockPost));

      const result = await cacheService.getCachedPost('test-post', 'en');

      expect(redis.get).toHaveBeenCalledWith('post:en:test-post');
      expect(result).toEqual(mockPost);
    });

    it('should return null when post not in cache', async () => {
      vi.mocked(redis.get).mockResolvedValue(null);

      const result = await cacheService.getCachedPost('test-post', 'en');

      expect(result).toBeNull();
    });

    it('should set cached post with default TTL', async () => {
      await cacheService.setCachedPost('test-post', 'en', mockPost);

      expect(redis.setex).toHaveBeenCalledWith(
        'post:en:test-post',
        CACHE_TTL.POST,
        JSON.stringify(mockPost)
      );
    });

    it('should set cached post with custom TTL', async () => {
      await cacheService.setCachedPost('test-post', 'en', mockPost, 7200);

      expect(redis.setex).toHaveBeenCalledWith(
        'post:en:test-post',
        7200,
        JSON.stringify(mockPost)
      );
    });

    it('should invalidate post cache', async () => {
      await cacheService.invalidatePost('test-post', 'en');

      expect(redis.del).toHaveBeenCalledWith('post:en:test-post');
    });

    it('should handle errors gracefully when getting cached post', async () => {
      vi.mocked(redis.get).mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.getCachedPost('test-post', 'en');

      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // Post List Caching Tests
  // ============================================================================

  describe('Post List Caching', () => {
    const mockPostList: PaginatedPosts = {
      posts: [
        {
          id: 'post-1',
          title: 'Test Post 1',
          excerpt: 'Excerpt 1',
          slug: 'test-post-1',
          locale: 'en' as Locale,
          readingTime: 5,
          viewCount: 100,
          publishedAt: new Date(),
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    it('should get cached post list', async () => {
      const key = 'posts:en:1:default';
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockPostList));

      const result = await cacheService.getCachedPostList(key);

      expect(redis.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(mockPostList);
    });

    it('should set cached post list with default TTL', async () => {
      const key = 'posts:en:1:default';
      await cacheService.setCachedPostList(key, mockPostList);

      expect(redis.setex).toHaveBeenCalledWith(
        key,
        CACHE_TTL.POST_LIST,
        JSON.stringify(mockPostList)
      );
    });

    it('should generate post list key without filters', () => {
      const key = cacheService.generatePostListKey('en', 1);

      expect(key).toBe('posts:en:1:default');
    });

    it('should generate post list key with filters', () => {
      const key = cacheService.generatePostListKey('en', 2, {
        status: 'PUBLISHED',
        categoryId: 'cat-1',
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });

      expect(key).toBe('posts:en:2:status=PUBLISHED&cat=cat-1&sort=publishedAt&order=desc');
    });

    it('should invalidate all post lists for a locale', async () => {
      vi.mocked(redis.keys).mockResolvedValueOnce(['posts:en:1:default', 'posts:en:2:default']);
      vi.mocked(redis.keys).mockResolvedValueOnce(['category:en:seo:1']);
      vi.mocked(redis.keys).mockResolvedValueOnce(['tag:en:meta:1']);

      await cacheService.invalidatePostLists('en');

      expect(redis.keys).toHaveBeenCalledWith('posts:en:*');
      expect(redis.keys).toHaveBeenCalledWith('category:en:*');
      expect(redis.keys).toHaveBeenCalledWith('tag:en:*');
      expect(redis.del).toHaveBeenCalledTimes(3);
    });
  });

  // ============================================================================
  // Related Posts Caching Tests
  // ============================================================================

  describe('Related Posts Caching', () => {
    const mockRelatedPosts: BlogPostSummary[] = [
      {
        id: 'post-2',
        title: 'Related Post',
        excerpt: 'Related excerpt',
        slug: 'related-post',
        locale: 'en' as Locale,
        readingTime: 3,
        viewCount: 50,
        publishedAt: new Date(),
      },
    ];

    it('should get cached related posts', async () => {
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockRelatedPosts));

      const result = await cacheService.getCachedRelatedPosts('post-1');

      expect(redis.get).toHaveBeenCalledWith('related:post-1');
      expect(result).toEqual(mockRelatedPosts);
    });

    it('should set cached related posts', async () => {
      await cacheService.setCachedRelatedPosts('post-1', mockRelatedPosts);

      expect(redis.setex).toHaveBeenCalledWith(
        'related:post-1',
        CACHE_TTL.RELATED_POSTS,
        JSON.stringify(mockRelatedPosts)
      );
    });

    it('should invalidate related posts cache', async () => {
      await cacheService.invalidateRelatedPosts('post-1');

      expect(redis.del).toHaveBeenCalledWith('related:post-1');
    });
  });

  // ============================================================================
  // Category and Tag Caching Tests
  // ============================================================================

  describe('Category and Tag Caching', () => {
    const mockCategories = [
      { id: 'cat-1', name: 'SEO', slug: 'seo', locale: 'en' },
      { id: 'cat-2', name: 'Tools', slug: 'tools', locale: 'en' },
    ];

    const mockTags = [
      { id: 'tag-1', name: 'Meta Tags', slug: 'meta-tags', locale: 'en' },
      { id: 'tag-2', name: 'Keywords', slug: 'keywords', locale: 'en' },
    ];

    it('should get cached categories', async () => {
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockCategories));

      const result = await cacheService.getCachedCategories('en');

      expect(redis.get).toHaveBeenCalledWith('categories:en');
      expect(result).toEqual(mockCategories);
    });

    it('should set cached categories', async () => {
      await cacheService.setCachedCategories('en', mockCategories);

      expect(redis.setex).toHaveBeenCalledWith(
        'categories:en',
        CACHE_TTL.CATEGORIES,
        JSON.stringify(mockCategories)
      );
    });

    it('should invalidate categories cache', async () => {
      await cacheService.invalidateCategories('en');

      expect(redis.del).toHaveBeenCalledWith('categories:en');
    });

    it('should get cached tags', async () => {
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockTags));

      const result = await cacheService.getCachedTags('en');

      expect(redis.get).toHaveBeenCalledWith('tags:en');
      expect(result).toEqual(mockTags);
    });

    it('should set cached tags', async () => {
      await cacheService.setCachedTags('en', mockTags);

      expect(redis.setex).toHaveBeenCalledWith(
        'tags:en',
        CACHE_TTL.TAGS,
        JSON.stringify(mockTags)
      );
    });

    it('should invalidate tags cache', async () => {
      await cacheService.invalidateTags('en');

      expect(redis.del).toHaveBeenCalledWith('tags:en');
    });
  });

  // ============================================================================
  // Cache Invalidation Strategy Tests
  // ============================================================================

  describe('Cache Invalidation Strategy', () => {
    it('should invalidate post and related caches', async () => {
      vi.mocked(redis.keys).mockResolvedValue([]);

      await cacheService.invalidatePostAndRelated('post-1', 'test-post', 'en');

      // Should invalidate post
      expect(redis.del).toHaveBeenCalledWith('post:en:test-post');
      
      // Should invalidate related posts
      expect(redis.del).toHaveBeenCalledWith('related:post-1');
      
      // Should invalidate post lists
      expect(redis.keys).toHaveBeenCalledWith('posts:en:*');
      expect(redis.keys).toHaveBeenCalledWith('category:en:*');
      expect(redis.keys).toHaveBeenCalledWith('tag:en:*');
    });

    it('should invalidate categories when categoryChanged is true', async () => {
      vi.mocked(redis.keys).mockResolvedValue([]);

      await cacheService.invalidatePostAndRelated('post-1', 'test-post', 'en', {
        categoryChanged: true,
      });

      expect(redis.del).toHaveBeenCalledWith('categories:en');
    });

    it('should invalidate tags when tagsChanged is true', async () => {
      vi.mocked(redis.keys).mockResolvedValue([]);

      await cacheService.invalidatePostAndRelated('post-1', 'test-post', 'en', {
        tagsChanged: true,
      });

      expect(redis.del).toHaveBeenCalledWith('tags:en');
    });

    it('should clear all blog caches', async () => {
      vi.mocked(redis.keys).mockResolvedValue(['post:en:test', 'posts:en:1:default']);

      await cacheService.clearAllBlogCaches();

      expect(redis.keys).toHaveBeenCalledWith('post:*');
      expect(redis.keys).toHaveBeenCalledWith('posts:*');
      expect(redis.keys).toHaveBeenCalledWith('related:*');
      expect(redis.keys).toHaveBeenCalledWith('category:*');
      expect(redis.keys).toHaveBeenCalledWith('tag:*');
      expect(redis.keys).toHaveBeenCalledWith('categories:*');
      expect(redis.keys).toHaveBeenCalledWith('tags:*');
    });
  });

  // ============================================================================
  // Cache Key Generation Tests
  // ============================================================================

  describe('Cache Key Generation', () => {
    it('should generate correct post cache key', () => {
      const key = CACHE_KEYS.post('my-post', 'en');
      expect(key).toBe('post:en:my-post');
    });

    it('should generate correct post list cache key', () => {
      const key = CACHE_KEYS.postList('tr', 2, 'status=PUBLISHED');
      expect(key).toBe('posts:tr:2:status=PUBLISHED');
    });

    it('should generate correct related posts cache key', () => {
      const key = CACHE_KEYS.relatedPosts('post-123');
      expect(key).toBe('related:post-123');
    });

    it('should generate correct category posts cache key', () => {
      const key = CACHE_KEYS.categoryPosts('seo-guides', 'de', 1);
      expect(key).toBe('category:de:seo-guides:1');
    });

    it('should generate correct tag posts cache key', () => {
      const key = CACHE_KEYS.tagPosts('meta-tags', 'es', 3);
      expect(key).toBe('tag:es:meta-tags:3');
    });

    it('should generate correct categories cache key', () => {
      const key = CACHE_KEYS.categories('fr');
      expect(key).toBe('categories:fr');
    });

    it('should generate correct tags cache key', () => {
      const key = CACHE_KEYS.tags('en');
      expect(key).toBe('tags:en');
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle Redis errors gracefully when setting cache', async () => {
      vi.mocked(redis.setex).mockRejectedValue(new Error('Redis error'));

      // Should not throw
      await expect(
        cacheService.setCachedPost('test-post', 'en', {} as BlogPost)
      ).resolves.not.toThrow();
    });

    it('should handle Redis errors gracefully when invalidating', async () => {
      vi.mocked(redis.del).mockRejectedValue(new Error('Redis error'));

      // Should not throw
      await expect(
        cacheService.invalidatePost('test-post', 'en')
      ).resolves.not.toThrow();
    });

    it('should handle Redis errors gracefully when getting keys', async () => {
      vi.mocked(redis.keys).mockRejectedValue(new Error('Redis error'));

      // Should not throw
      await expect(
        cacheService.invalidatePostLists('en')
      ).resolves.not.toThrow();
    });
  });
});
