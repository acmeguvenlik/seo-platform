# BlogService Implementation

## Overview

The BlogService has been successfully implemented as the core service layer for blog post management in the SEO Tools Platform. This service handles all CRUD operations, validation, and business logic for blog posts.

## Implementation Details

### File Location
- **Service**: `src/lib/blog-service.ts`
- **Verification Script**: `scripts/verify-blog-service.ts`

### Core Features Implemented

#### 1. Create Post (`createPost`)
- Validates slug uniqueness per locale
- Automatically calculates reading time (200 words/minute)
- Supports SEO metadata (title, description, og:image)
- Handles category, tags, and featured image associations
- Supports translation linking
- Validates scheduled posts require publishedAt timestamp

#### 2. Update Post (`updatePost`)
- Updates all post fields except slug (immutable)
- Recalculates reading time if content changes
- Handles tag updates (removes old, adds new)
- Supports partial updates
- Validates post existence before update

#### 3. Delete Post (`deletePost`)
- Enforces deletion rules: only DRAFT or ARCHIVED posts can be deleted
- Validates post existence
- Cascading deletes handled by Prisma (tags, views)

#### 4. Get Post by ID (`getPostById`)
- Returns full post with all relationships
- Includes author, category, tags, and featured image
- Returns null if not found

#### 5. Get Post by Slug (`getPostBySlug`)
- Queries by slug and locale (unique constraint)
- Returns full post with all relationships
- Returns null if not found

#### 6. List Posts (`listPosts`)
- Supports filtering by:
  - Locale (required)
  - Publication status
  - Category ID
  - Tag ID
- Supports sorting by:
  - Published date (asc/desc)
  - View count (asc/desc)
- Pagination support (page, limit)
- Returns paginated results with total count

#### 7. Slug Uniqueness Validation (`validateSlugUniqueness`)
- Validates slug is unique within a locale
- Supports excluding a post ID (for updates)
- Returns boolean result

#### 8. View Count Increment (`incrementViewCount`)
- Session-based deduplication
- Creates PostView record
- Increments viewCount atomically
- Uses database transaction for consistency

#### 9. Get Posts by Category (`getPostsByCategory`)
- Finds category by slug and locale
- Returns paginated posts in that category
- Sorted by published date (newest first)

#### 10. Get Posts by Tag (`getPostsByTag`)
- Finds tag by slug and locale
- Returns paginated posts with that tag
- Sorted by published date (newest first)

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **1.1**: Create blog posts with all required fields
- **1.2**: Validate slug uniqueness per locale
- **1.3**: Support publication status (DRAFT, SCHEDULED, PUBLISHED, ARCHIVED)
- **1.4**: Require publishedAt for SCHEDULED status
- **1.5**: Edit existing posts without changing slug
- **1.6**: Delete posts only if DRAFT or ARCHIVED
- **1.7**: Automatically calculate reading time (200 words/minute)
- **1.8**: Store metadata (author, timestamps)
- **8.8**: Increment view count with session deduplication

## Data Mapping

The service includes private helper methods to map Prisma results to TypeScript types:

- `mapToBlogPost()`: Maps to full BlogPost type with all relationships
- `mapToBlogPostSummary()`: Maps to BlogPostSummary for list views

## Error Handling

The service throws descriptive errors for:
- Duplicate slugs within a locale
- Post not found
- Invalid deletion attempts (non-DRAFT/ARCHIVED posts)
- Missing required fields (handled by Zod validation)

## Database Integration

- Uses Prisma ORM for all database operations
- Leverages Prisma transactions for atomic operations
- Utilizes Prisma's include feature for eager loading relationships
- Respects unique constraints defined in schema

## Testing

A verification script has been created at `scripts/verify-blog-service.ts` that tests:
- Slug generation
- Slug uniqueness validation
- Getting non-existent posts
- Listing posts (empty database)

Run with: `npx tsx scripts/verify-blog-service.ts`

## Usage Example

```typescript
import { blogService } from '@/lib/blog-service';

// Create a post
const post = await blogService.createPost(
  {
    title: 'How to Optimize Meta Tags',
    content: '# Introduction\n\nMeta tags are important...',
    slug: 'how-to-optimize-meta-tags',
    locale: 'en',
    status: 'PUBLISHED',
    categoryId: 'category-id',
    tagIds: ['tag-1', 'tag-2'],
    seoMetadata: {
      title: 'How to Optimize Meta Tags for SEO - Complete Guide',
      description: 'Learn how to optimize meta tags for better SEO performance with our comprehensive guide covering title tags, meta descriptions, and more.',
    },
  },
  'user-id'
);

// Get post by slug
const foundPost = await blogService.getPostBySlug('how-to-optimize-meta-tags', 'en');

// List posts
const posts = await blogService.listPosts({
  locale: 'en',
  status: 'PUBLISHED',
  page: 1,
  limit: 12,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
});

// Increment view count
await blogService.incrementViewCount(post.id, 'session-id');
```

## Next Steps

The following related tasks should be implemented next:
- Unit tests for BlogService (Task 2.2)
- CacheService integration (Task 2.3)
- SEOService for metadata generation (Task 2.4)
- API routes for blog management (Task 5)

## Notes

- The service is exported as a singleton instance (`blogService`)
- All methods are async and return Promises
- The service relies on existing utilities in `blog-utils.ts` for reading time calculation
- Validation schemas from `blog-validation.ts` should be used at the API layer
