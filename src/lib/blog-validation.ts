import { z } from 'zod';

// Enums
export const LocaleSchema = z.enum(['en', 'tr', 'de', 'es', 'fr']);
export type Locale = z.infer<typeof LocaleSchema>;

export const PublicationStatusSchema = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']);
export type PublicationStatus = z.infer<typeof PublicationStatusSchema>;

export const ImageFormatSchema = z.enum(['JPEG', 'PNG', 'WEBP']);
export type ImageFormat = z.infer<typeof ImageFormatSchema>;

// SEO Metadata
export const SEOMetadataInputSchema = z.object({
  title: z.string().min(50).max(60).optional(),
  description: z.string().min(120).max(160).optional(),
  ogImage: z.string().url().optional(),
});
export type SEOMetadataInput = z.infer<typeof SEOMetadataInputSchema>;

// Blog Post Input Schemas
export const CreateBlogPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: LocaleSchema,
  categoryId: z.string().cuid().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  featuredImageId: z.string().cuid().optional(),
  status: PublicationStatusSchema,
  publishedAt: z.string().datetime().optional(),
  translationOfId: z.string().cuid().optional(),
  seoMetadata: SEOMetadataInputSchema.optional(),
}).refine(
  (data) => {
    // If status is SCHEDULED, publishedAt is required
    if (data.status === 'SCHEDULED' && !data.publishedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'publishedAt is required when status is SCHEDULED',
    path: ['publishedAt'],
  }
);
export type CreateBlogPostInput = z.infer<typeof CreateBlogPostSchema>;

// Update schema without refinement (refinement applied at runtime if needed)
const UpdateBlogPostBaseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  locale: LocaleSchema.optional(),
  categoryId: z.string().cuid().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  featuredImageId: z.string().cuid().optional(),
  status: PublicationStatusSchema.optional(),
  publishedAt: z.string().datetime().optional(),
  translationOfId: z.string().cuid().optional(),
  seoMetadata: SEOMetadataInputSchema.optional(),
});

export const UpdateBlogPostSchema = UpdateBlogPostBaseSchema.refine(
  (data) => {
    // If status is SCHEDULED, publishedAt is required
    if (data.status === 'SCHEDULED' && !data.publishedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'publishedAt is required when status is SCHEDULED',
    path: ['publishedAt'],
  }
);
export type UpdateBlogPostInput = z.infer<typeof UpdateBlogPostSchema>;

// Category Input Schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  locale: LocaleSchema,
});
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial().omit({ slug: true });
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

// Tag Input Schemas
export const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: LocaleSchema,
});
export type CreateTagInput = z.infer<typeof CreateTagSchema>;

export const UpdateTagSchema = CreateTagSchema.partial().omit({ slug: true });
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;

// Image Input Schemas
export const ImageMetadataSchema = z.object({
  altText: z.string().min(1).max(200),
  filename: z.string().min(1).max(255),
});
export type ImageMetadataInput = z.infer<typeof ImageMetadataSchema>;

export const UploadImageSchema = z.object({
  altText: z.string().min(1).max(200),
});
export type UploadImageInput = z.infer<typeof UploadImageSchema>;

// Query Parameter Schemas
export const ListPostsParamsSchema = z.object({
  locale: LocaleSchema,
  status: PublicationStatusSchema.optional(),
  categoryId: z.string().cuid().optional(),
  tagId: z.string().cuid().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
  sortBy: z.enum(['publishedAt', 'viewCount']).default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type ListPostsParams = z.infer<typeof ListPostsParamsSchema>;

export const SearchPostsParamsSchema = z.object({
  query: z.string().min(1),
  locale: LocaleSchema,
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
});
export type SearchPostsParams = z.infer<typeof SearchPostsParamsSchema>;

// View Tracking Schema
export const TrackViewSchema = z.object({
  postId: z.string().cuid(),
  sessionId: z.string(),
  referrer: z.string().optional(),
  userAgent: z.string(),
  locale: LocaleSchema,
  timeOnPage: z.number().int().positive().optional(),
});
export type TrackViewInput = z.infer<typeof TrackViewSchema>;

// Bulk Action Schema
export const BulkActionSchema = z.object({
  postIds: z.array(z.string().cuid()).min(1),
  action: z.enum(['publish', 'archive', 'delete']),
});
export type BulkActionInput = z.infer<typeof BulkActionSchema>;

// Analytics Schemas
export const AnalyticsPeriodSchema = z.enum(['7d', '30d', '90d']);
export type AnalyticsPeriod = z.infer<typeof AnalyticsPeriodSchema>;

export const GetPostMetricsSchema = z.object({
  postId: z.string().cuid(),
  period: AnalyticsPeriodSchema.default('30d'),
});
export type GetPostMetricsParams = z.infer<typeof GetPostMetricsSchema>;

export const ExportAnalyticsSchema = z.object({
  locale: LocaleSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
export type ExportAnalyticsParams = z.infer<typeof ExportAnalyticsSchema>;
