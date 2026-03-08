# CacheService Integration Guide

## Overview

The `CacheService` provides Redis-based caching for blog content with automatic cache invalidation. This document explains how to integrate it with the `BlogService`.

## Cache Strategy

### Cache Keys

The service uses structured cache keys for different content types:

- **Posts**: `post:{locale}:{slug}` (TTL: 1 hour)
- **Post Lists**: `posts:{locale}:{page}:{filters}` (TTL: 30 minutes)
- **Related Posts**: `related:{postId}` (TTL: 1 hour)
- **Category Posts**: `category:{locale}:{slug}:{page}` (TTL: 30 minutes)
- **Tag Posts**: `tag:{locale}:{slug}:{page}` (TTL: 30 minutes)
- **Categories**: `categories:{locale}` (TTL: 2 hours)
- **Tags**: `tags:{locale}` (TTL: 2 hours)

### Cache Invalidation Strategy

When a post is created/updated/deleted, the following caches are invalidated:

1. The specific post cache
2. All post list caches for that locale
3. Related posts cache for that post
4. Category/tag caches (if changed)

## Integration Examples

### 1. Caching Post Retrieval

```typescript
import { cacheService } from './cache-service';
import { blogService } from './blog-service';

async function getPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null> {
  // Try to get from cache first
  const cached = await cacheService.getCachedPost(slug, locale);
  if (cached) {
    return cached;
  }

  // If not in cache, fetch from database
  const post = await blogService.getPostBySlug(slug, locale);
  
  // Cache the result if found
  if (post) {
    await cacheService.setCachedPost(slug, locale, post);
  }

  return post;
}
```

### 2. Caching Post Lists

```typescript
async function listPosts(params: ListPostsParams): Promise<PaginatedPosts> {
  // Generate cache key based on parameters
  const cacheKey = cacheService.generatePostListKey(
    params.locale,
    params.page,
    {
      status: params.status,
      categoryId: params.categoryId,
      tagId: params.tagId,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }
  );

  // Try to get from cache
  const cached = await cacheService.getCachedPostList(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const posts = await blogService.listPosts(params);

  // Cache the result
  await cacheService.setCachedPostList(cacheKey, posts);

  return posts;
}
```

### 3. Cache Invalidation on Post Update

```typescript
async function updatePost(
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

  // Determine what changed
  const categoryChanged = data.categoryId && data.categoryId !== existingPost.categoryId;
  const tagsChanged = data.tagIds && 
    JSON.stringify(data.tagIds) !== JSON.stringify(existingPost.tags.map(t => t.id));

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
```

### 4. Cache Invalidation on Post Creation

```typescript
async function createPost(
  data: CreateBlogPostInput,
  authorId: string
): Promise<BlogPost> {
  // Create the post
  const post = await blogService.createPost(data, authorId);

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
```

### 5. Cache Invalidation on Post Deletion

```typescript
async function deletePost(id: string): Promise<void> {
  // Get the post before deletion
  const post = await blogService.getPostById(id);
  if (!post) {
    throw new Error('Post not found');
  }

  // Delete the post
  await blogService.deletePost(id);

  // Invalidate all related caches
  await cacheService.invalidatePostAndRelated(
    post.id,
    post.slug,
    post.locale,
    {
      categoryChanged: !!post.categoryId,
      tagsChanged: post.tags.length > 0,
    }
  );
}
```

### 6. Caching Related Posts

```typescript
async function getRelatedPosts(postId: string, limit: number = 6): Promise<BlogPostSummary[]> {
  // Try to get from cache
  const cached = await cacheService.getCachedRelatedPosts(postId);
  if (cached) {
    return cached;
  }

  // Calculate related posts (implement your algorithm)
  const relatedPosts = await calculateRelatedPosts(postId, limit);

  // Cache the result
  await cacheService.setCachedRelatedPosts(postId, relatedPosts);

  return relatedPosts;
}
```

### 7. Caching Categories and Tags

```typescript
async function getCategories(locale: Locale): Promise<Category[]> {
  // Try to get from cache
  const cached = await cacheService.getCachedCategories(locale);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const categories = await db.category.findMany({
    where: { locale },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  // Cache the result
  await cacheService.setCachedCategories(locale, categories);

  return categories;
}

async function getTags(locale: Locale): Promise<Tag[]> {
  // Try to get from cache
  const cached = await cacheService.getCachedTags(locale);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const tags = await db.tag.findMany({
    where: { locale },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  // Cache the result
  await cacheService.setCachedTags(locale, tags);

  return tags;
}
```

## Best Practices

### 1. Always Use Try-Catch for Cache Operations

Cache operations should never break your application. The `CacheService` handles errors gracefully, but you should still be aware:

```typescript
// The service already handles errors internally
const cached = await cacheService.getCachedPost(slug, locale);
// If Redis fails, this returns null instead of throwing
```

### 2. Cache Invalidation is Critical

Always invalidate caches when data changes:

```typescript
// ✅ Good: Invalidate after update
await blogService.updatePost(id, data);
await cacheService.invalidatePostAndRelated(id, slug, locale);

// ❌ Bad: Forget to invalidate
await blogService.updatePost(id, data);
// Users will see stale data!
```

### 3. Use Appropriate TTLs

Different content types have different update frequencies:

- **Posts**: 1 hour (content rarely changes after publication)
- **Lists**: 30 minutes (new posts added regularly)
- **Categories/Tags**: 2 hours (metadata changes infrequently)

### 4. Monitor Cache Hit Rates

Track cache effectiveness:

```typescript
async function getPostWithMetrics(slug: string, locale: Locale) {
  const cached = await cacheService.getCachedPost(slug, locale);
  
  if (cached) {
    // Log cache hit
    console.log('Cache hit for post:', slug);
    return cached;
  }
  
  // Log cache miss
  console.log('Cache miss for post:', slug);
  const post = await blogService.getPostBySlug(slug, locale);
  
  if (post) {
    await cacheService.setCachedPost(slug, locale, post);
  }
  
  return post;
}
```

### 5. Bulk Operations

For bulk operations, invalidate caches efficiently:

```typescript
async function bulkPublishPosts(postIds: string[]): Promise<void> {
  const posts = await Promise.all(
    postIds.map(id => blogService.getPostById(id))
  );

  // Update all posts
  await Promise.all(
    posts.map(post => 
      post ? blogService.updatePost(post.id, { status: 'PUBLISHED' }) : null
    )
  );

  // Invalidate caches by locale (more efficient than per-post)
  const locales = [...new Set(posts.map(p => p?.locale).filter(Boolean))];
  await Promise.all(
    locales.map(locale => cacheService.invalidatePostLists(locale as Locale))
  );
}
```

## Testing

### Unit Tests

The `CacheService` includes comprehensive unit tests in `cache-service.test.ts`. Run them with:

```bash
npm test cache-service.test.ts
```

### Integration Tests

Test cache integration with BlogService:

```typescript
describe('BlogService with Cache', () => {
  it('should cache post on first retrieval', async () => {
    const post = await getPostBySlug('test-post', 'en');
    
    // Second call should hit cache
    const cachedPost = await getPostBySlug('test-post', 'en');
    
    expect(cachedPost).toEqual(post);
  });

  it('should invalidate cache on update', async () => {
    const post = await getPostBySlug('test-post', 'en');
    
    await updatePost(post.id, { title: 'Updated Title' });
    
    // Cache should be invalidated
    const cached = await cacheService.getCachedPost('test-post', 'en');
    expect(cached).toBeNull();
  });
});
```

## Performance Considerations

### Cache Warming

Pre-populate cache for frequently accessed content:

```typescript
async function warmCache(locale: Locale): Promise<void> {
  // Cache top posts
  const topPosts = await blogService.listPosts({
    locale,
    status: 'PUBLISHED',
    page: 1,
    limit: 50,
    sortBy: 'viewCount',
    sortOrder: 'desc',
  });

  // Cache each post individually
  await Promise.all(
    topPosts.posts.map(post =>
      cacheService.setCachedPost(post.slug, locale, post as BlogPost)
    )
  );

  // Cache categories and tags
  const categories = await getCategories(locale);
  await cacheService.setCachedCategories(locale, categories);

  const tags = await getTags(locale);
  await cacheService.setCachedTags(locale, tags);
}
```

### Cache Stampede Prevention

Prevent multiple simultaneous cache misses:

```typescript
const pendingRequests = new Map<string, Promise<BlogPost | null>>();

async function getPostWithStampedeProtection(
  slug: string,
  locale: Locale
): Promise<BlogPost | null> {
  const cacheKey = `post:${locale}:${slug}`;

  // Check cache first
  const cached = await cacheService.getCachedPost(slug, locale);
  if (cached) return cached;

  // Check if request is already pending
  const pending = pendingRequests.get(cacheKey);
  if (pending) return pending;

  // Create new request
  const request = (async () => {
    try {
      const post = await blogService.getPostBySlug(slug, locale);
      if (post) {
        await cacheService.setCachedPost(slug, locale, post);
      }
      return post;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
}
```

## Requirements Validation

This implementation satisfies the following requirements:

### Requirement 10.1 (ISR with 3600 second revalidation)
- ✅ Individual posts cached with 3600 second (1 hour) TTL
- ✅ Post lists cached with 1800 second (30 minutes) TTL

### Requirement 10.2 (ISR for individual blog posts)
- ✅ Individual blog posts cached with 3600 second TTL
- ✅ Cache invalidation on post updates

### Requirement 10.4 (Redis caching with 1 hour TTL)
- ✅ Posts cached in Redis with 1 hour TTL
- ✅ Configurable TTL for different content types

### Requirement 10.5 (Cache invalidation on updates)
- ✅ Comprehensive cache invalidation strategy
- ✅ Invalidates post, lists, related posts, and metadata caches
- ✅ Conditional invalidation based on what changed

## Next Steps

1. **Install Vitest** (if not already installed):
   ```bash
   npm install -D vitest @vitest/ui
   ```

2. **Add test script** to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui"
     }
   }
   ```

3. **Integrate with BlogService**: Update `BlogService` methods to use `CacheService`

4. **Add monitoring**: Track cache hit rates and performance metrics

5. **Configure Redis**: Ensure Redis connection is properly configured in production
