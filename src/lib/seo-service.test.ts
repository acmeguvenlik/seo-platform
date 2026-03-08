/**
 * SEO Service Tests
 * Unit tests for SEO metadata generation, schema markup, and hreflang tags
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateDefaultMetadata,
  validateMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateOrganizationSchema,
  generateHreflangTags,
} from './seo-service';
import type { BlogPost, Breadcrumb } from '@/types/blog';

describe('SEOService', () => {
  let mockPost: BlogPost;

  beforeEach(() => {
    mockPost = {
      id: '1',
      title: 'How to Optimize Meta Tags for Better SEO Rankings',
      content: `This is a comprehensive guide about meta tags.

## Introduction
Meta tags are important for SEO.

## FAQ
### What are meta tags?
Meta tags are HTML elements that provide metadata about a web page.

### Why are meta tags important?
They help search engines understand your content better.`,
      excerpt: 'Learn how to optimize meta tags for better search engine rankings and improve your website visibility.',
      slug: 'optimize-meta-tags-seo',
      locale: 'en',
      status: 'PUBLISHED',
      seoTitle: undefined,
      seoDescription: undefined,
      ogImage: undefined,
      canonicalUrl: undefined,
      categoryId: 'cat1',
      category: {
        id: 'cat1',
        name: 'SEO Guides',
        slug: 'seo-guides',
        locale: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      tags: [],
      featuredImageId: 'img1',
      featuredImage: {
        id: 'img1',
        filename: 'meta-tags.jpg',
        altText: 'Meta tags illustration',
        url: 'https://example.com/images/meta-tags.jpg',
        width: 1200,
        height: 630,
        format: 'JPEG',
        size: 150000,
        thumbnailUrl: 'https://example.com/images/meta-tags-thumb.jpg',
        mediumUrl: 'https://example.com/images/meta-tags-medium.jpg',
        largeUrl: 'https://example.com/images/meta-tags-large.jpg',
        ogImageUrl: 'https://example.com/images/meta-tags-og.jpg',
        uploadedBy: 'user1',
        uploadedAt: new Date(),
      },
      translationOfId: undefined,
      translations: [],
      authorId: 'user1',
      author: {
        id: 'user1',
        email: 'author@example.com',
        name: 'John Doe',
        role: 'ADMIN',
      },
      readingTime: 5,
      viewCount: 100,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      publishedAt: new Date('2024-01-01'),
    };
  });

  describe('generateDefaultMetadata', () => {
    it('should generate metadata with title from post title', () => {
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.title).toContain(mockPost.title);
      expect(metadata.title.length).toBeGreaterThanOrEqual(50);
      expect(metadata.title.length).toBeLessThanOrEqual(70);
    });

    it('should use excerpt for description', () => {
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.description).toContain(mockPost.excerpt!);
      expect(metadata.description.length).toBeGreaterThanOrEqual(120);
      expect(metadata.description.length).toBeLessThanOrEqual(170);
    });

    it('should use featured image for og:image', () => {
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.ogImage).toBe(mockPost.featuredImage!.ogImageUrl);
    });

    it('should generate canonical URL', () => {
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.canonicalUrl).toContain(mockPost.slug);
      expect(metadata.canonicalUrl).toContain(mockPost.locale);
    });

    it('should handle short titles by appending site name', () => {
      mockPost.title = 'Short Title';
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.title).toContain('SEO Tools Platform');
    });

    it('should truncate long titles', () => {
      mockPost.title = 'This is a very long title that exceeds the optimal length for SEO and needs to be truncated';
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.title.length).toBeLessThanOrEqual(60);
      expect(metadata.title).toContain('...');
    });

    it('should handle missing excerpt by generating from content', () => {
      mockPost.excerpt = undefined;
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.description).toBeTruthy();
      expect(metadata.description.length).toBeGreaterThanOrEqual(120);
    });

    it('should use default image when no featured image', () => {
      mockPost.featuredImage = undefined;
      mockPost.featuredImageId = undefined;
      const metadata = generateDefaultMetadata(mockPost);
      
      expect(metadata.ogImage).toContain('default-og-image.jpg');
    });
  });

  describe('validateMetadata', () => {
    it('should validate correct title length', () => {
      const result = validateMetadata({
        title: 'This is a perfect title length for SEO optimization',
      });
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject title that is too short', () => {
      const result = validateMetadata({
        title: 'Too short',
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('too short'))).toBe(true);
    });

    it('should reject title that is too long', () => {
      const result = validateMetadata({
        title: 'This is a very long title that exceeds the maximum recommended length',
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('too long'))).toBe(true);
    });

    it('should validate correct description length', () => {
      const result = validateMetadata({
        description: 'This is a perfect meta description length for SEO optimization. It provides enough information to entice users to click while staying within limits.',
      });
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject description that is too short', () => {
      const result = validateMetadata({
        description: 'Too short description',
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('too short'))).toBe(true);
    });

    it('should reject description that is too long', () => {
      const result = validateMetadata({
        description: 'This is a very long meta description that exceeds the maximum recommended length for optimal display in search engine results pages and should be rejected by validation.',
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('too long'))).toBe(true);
    });

    it('should validate both title and description', () => {
      const result = validateMetadata({
        title: 'Perfect title length for SEO optimization and ranking',
        description: 'This is a perfect meta description length for SEO optimization. It provides enough information to entice users to click while staying within limits.',
      });
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('generateArticleSchema', () => {
    it('should generate valid Article schema', () => {
      const schema = generateArticleSchema(mockPost);
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe(mockPost.title);
      expect(schema.author['@type']).toBe('Person');
      expect(schema.author.name).toBe(mockPost.author.name);
    });

    it('should include publication dates', () => {
      const schema = generateArticleSchema(mockPost);
      
      expect(schema.datePublished).toBe(mockPost.publishedAt!.toISOString());
      expect(schema.dateModified).toBe(mockPost.updatedAt.toISOString());
    });

    it('should include featured image', () => {
      const schema = generateArticleSchema(mockPost);
      
      expect(schema.image).toBe(mockPost.featuredImage!.url);
    });

    it('should include publisher information', () => {
      const schema = generateArticleSchema(mockPost);
      
      expect(schema.publisher['@type']).toBe('Organization');
      expect(schema.publisher.name).toBe('SEO Tools Platform');
      expect(schema.publisher.logo['@type']).toBe('ImageObject');
      expect(schema.publisher.logo.url).toContain('logo.png');
    });

    it('should use author email when name is not available', () => {
      mockPost.author.name = undefined;
      const schema = generateArticleSchema(mockPost);
      
      expect(schema.author.name).toBe(mockPost.author.email);
    });

    it('should use createdAt when publishedAt is not available', () => {
      mockPost.publishedAt = undefined;
      const schema = generateArticleSchema(mockPost);
      
      expect(schema.datePublished).toBe(mockPost.createdAt.toISOString());
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid Breadcrumb schema', () => {
      const breadcrumbs: Breadcrumb[] = [
        { label: 'Home', url: 'https://example.com' },
        { label: 'Blog', url: 'https://example.com/en/blog' },
        { label: 'SEO Guides', url: 'https://example.com/en/blog/category/seo-guides' },
        { label: mockPost.title, url: `https://example.com/en/blog/${mockPost.slug}` },
      ];

      const schema = generateBreadcrumbSchema(mockPost, breadcrumbs);
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(4);
    });

    it('should set correct positions for breadcrumb items', () => {
      const breadcrumbs: Breadcrumb[] = [
        { label: 'Home', url: 'https://example.com' },
        { label: 'Blog', url: 'https://example.com/en/blog' },
      ];

      const schema = generateBreadcrumbSchema(mockPost, breadcrumbs);
      
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
    });

    it('should include correct labels and URLs', () => {
      const breadcrumbs: Breadcrumb[] = [
        { label: 'Home', url: 'https://example.com' },
        { label: 'Blog', url: 'https://example.com/en/blog' },
      ];

      const schema = generateBreadcrumbSchema(mockPost, breadcrumbs);
      
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[0].item).toBe('https://example.com');
      expect(schema.itemListElement[1].name).toBe('Blog');
      expect(schema.itemListElement[1].item).toBe('https://example.com/en/blog');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate FAQ schema when FAQ section exists', () => {
      const schema = generateFAQSchema(mockPost);
      
      expect(schema).not.toBeNull();
      expect(schema!['@context']).toBe('https://schema.org');
      expect(schema!['@type']).toBe('FAQPage');
      expect(schema!.mainEntity.length).toBeGreaterThan(0);
    });

    it('should extract questions and answers correctly', () => {
      const schema = generateFAQSchema(mockPost);
      
      expect(schema!.mainEntity[0]['@type']).toBe('Question');
      expect(schema!.mainEntity[0].name).toContain('What are meta tags?');
      expect(schema!.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(schema!.mainEntity[0].acceptedAnswer.text).toContain('HTML elements');
    });

    it('should return null when no FAQ section exists', () => {
      mockPost.content = 'This is a post without FAQ section.';
      const schema = generateFAQSchema(mockPost);
      
      expect(schema).toBeNull();
    });

    it('should handle multiple FAQ questions', () => {
      const schema = generateFAQSchema(mockPost);
      
      expect(schema!.mainEntity.length).toBe(2);
      expect(schema!.mainEntity[1].name).toContain('Why are meta tags important?');
    });

    it('should return null when FAQ section has no questions', () => {
      mockPost.content = `## FAQ\nThis section has no questions.`;
      const schema = generateFAQSchema(mockPost);
      
      expect(schema).toBeNull();
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate valid Organization schema', () => {
      const schema = generateOrganizationSchema();
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('SEO Tools Platform');
    });

    it('should include logo and social profiles', () => {
      const schema = generateOrganizationSchema();
      
      expect(schema.logo).toContain('logo.png');
      expect(schema.sameAs).toBeInstanceOf(Array);
      expect(schema.sameAs.length).toBeGreaterThan(0);
    });
  });

  describe('generateHreflangTags', () => {
    it('should generate hreflang tags for all translations', () => {
      const translations: BlogPost[] = [
        {
          ...mockPost,
          id: '2',
          locale: 'tr',
          slug: 'meta-etiketleri-optimizasyonu',
        },
        {
          ...mockPost,
          id: '3',
          locale: 'de',
          slug: 'meta-tags-optimierung',
        },
      ];

      const tags = generateHreflangTags(mockPost, translations);
      
      expect(tags.length).toBe(4); // en, tr, de, x-default
      expect(tags.some(t => t.hreflang === 'en')).toBe(true);
      expect(tags.some(t => t.hreflang === 'tr')).toBe(true);
      expect(tags.some(t => t.hreflang === 'de')).toBe(true);
      expect(tags.some(t => t.hreflang === 'x-default')).toBe(true);
    });

    it('should include current post in hreflang tags', () => {
      const tags = generateHreflangTags(mockPost, []);
      
      expect(tags.some(t => t.hreflang === mockPost.locale)).toBe(true);
      expect(tags.find(t => t.hreflang === mockPost.locale)?.href).toContain(mockPost.slug);
    });

    it('should set x-default to English version when available', () => {
      const translations: BlogPost[] = [
        {
          ...mockPost,
          id: '2',
          locale: 'en',
          slug: 'optimize-meta-tags',
        },
      ];

      mockPost.locale = 'tr';
      const tags = generateHreflangTags(mockPost, translations);
      
      const xDefault = tags.find(t => t.hreflang === 'x-default');
      expect(xDefault?.href).toContain('/en/');
    });

    it('should set x-default to current post when no English version', () => {
      mockPost.locale = 'tr';
      const tags = generateHreflangTags(mockPost, []);
      
      const xDefault = tags.find(t => t.hreflang === 'x-default');
      expect(xDefault?.href).toContain('/tr/');
    });

    it('should generate correct URLs for each locale', () => {
      const translations: BlogPost[] = [
        {
          ...mockPost,
          id: '2',
          locale: 'tr',
          slug: 'meta-etiketleri',
        },
      ];

      const tags = generateHreflangTags(mockPost, translations);
      
      const enTag = tags.find(t => t.hreflang === 'en');
      const trTag = tags.find(t => t.hreflang === 'tr');
      
      expect(enTag?.href).toContain('/en/blog/optimize-meta-tags-seo');
      expect(trTag?.href).toContain('/tr/blog/meta-etiketleri');
    });
  });
});
