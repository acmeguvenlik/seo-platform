import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import * as auth from '@/lib/auth';
import { blogService } from '@/lib/blog-service';
import { cacheService } from '@/lib/cache-service';

// Mock dependencies
vi.mock('@/lib/auth');
vi.mock('@/lib/blog-service');
vi.mock('@/lib/cache-service');

describe('POST /api/blog/posts', () => {
  const mockAdminUser = {
    id: 'user-123',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN' as const,
    plan: 'ENTERPRISE' as const,
    emailVerified: true,
    createdAt: new Date(),
  };

  const validPostData = {
    title: 'Test Blog Post',
    content: 'This is test content with more than enough words to be valid.',
    excerpt: 'Test excerpt',
    slug: 'test-blog-post',
    locale: 'en' as const,
    status: 'DRAFT' as const,
  };

  const mockCreatedPost = {
    id: 'post-123',
    ...validPostData,
    authorId: mockAdminUser.id,
    author: mockAdminUser,
    readingTime: 1,
    viewCount: 0,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a blog post successfully with valid data', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(blogService.createPost).mockResolvedValue(mockCreatedPost);
    vi.mocked(cacheService.invalidatePostLists).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(validPostData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.post.id).toBe(mockCreatedPost.id);
    expect(data.post.title).toBe(mockCreatedPost.title);
    expect(data.post.slug).toBe(mockCreatedPost.slug);
    expect(auth.requireAdmin).toHaveBeenCalledOnce();
    expect(blogService.createPost).toHaveBeenCalledWith(validPostData, mockAdminUser.id);
    expect(cacheService.invalidatePostLists).toHaveBeenCalledWith('en');
  });

  it('should invalidate category cache when categoryId is provided', async () => {
    // Arrange
    const postWithCategory = {
      ...validPostData,
      categoryId: 'clx1234567890abcdefghij', // Valid CUID format
    };

    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(blogService.createPost).mockResolvedValue({
      ...mockCreatedPost,
      categoryId: 'clx1234567890abcdefghij',
    });
    vi.mocked(cacheService.invalidatePostLists).mockResolvedValue(undefined);
    vi.mocked(cacheService.invalidateCategories).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postWithCategory),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(201);
    expect(cacheService.invalidateCategories).toHaveBeenCalledWith('en');
  });

  it('should invalidate tags cache when tagIds are provided', async () => {
    // Arrange
    const postWithTags = {
      ...validPostData,
      tagIds: ['clx1234567890abcdefghi1', 'clx1234567890abcdefghi2'], // Valid CUID format
    };

    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(blogService.createPost).mockResolvedValue(mockCreatedPost);
    vi.mocked(cacheService.invalidatePostLists).mockResolvedValue(undefined);
    vi.mocked(cacheService.invalidateTags).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postWithTags),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(201);
    expect(cacheService.invalidateTags).toHaveBeenCalledWith('en');
  });

  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockRejectedValue(new Error('Unauthorized'));

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(validPostData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });

  it('should return 403 when user is not admin', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockRejectedValue(new Error('Forbidden'));

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(validPostData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(403);
    expect(data.error).toBe('Admin access required');
  });

  it('should return 400 when validation fails', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);

    const invalidData = {
      title: '', // Empty title should fail validation
      content: 'Content',
      slug: 'test',
      locale: 'en',
      status: 'DRAFT',
    };

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.message).toBeDefined();
  });

  it('should return 409 when slug already exists', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(blogService.createPost).mockRejectedValue(
      new Error('Slug "test-blog-post" already exists for locale "en"')
    );

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(validPostData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(409);
    expect(data.error).toContain('already exists');
  });

  it('should validate SCHEDULED status requires publishedAt', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);

    const scheduledPostWithoutDate = {
      ...validPostData,
      status: 'SCHEDULED' as const,
      // Missing publishedAt
    };

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(scheduledPostWithoutDate),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });

  it('should accept valid SEO metadata', async () => {
    // Arrange
    const postWithSEO = {
      ...validPostData,
      seoMetadata: {
        title: 'SEO Title That Is Between Fifty And Sixty Characters',
        description: 'This is a meta description that is between 120 and 160 characters long to meet SEO requirements and provide good search results.',
        ogImage: 'https://example.com/image.jpg',
      },
    };

    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(blogService.createPost).mockResolvedValue(mockCreatedPost);
    vi.mocked(cacheService.invalidatePostLists).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postWithSEO),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(201);
    expect(blogService.createPost).toHaveBeenCalledWith(
      expect.objectContaining({
        seoMetadata: postWithSEO.seoMetadata,
      }),
      mockAdminUser.id
    );
  });

  it('should handle generic errors gracefully', async () => {
    // Arrange
    vi.mocked(auth.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(blogService.createPost).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new NextRequest('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(validPostData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create blog post');
  });
});
