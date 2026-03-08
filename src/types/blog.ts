// Blog System Types

// Enums
export type Locale = 'en' | 'tr' | 'de' | 'es' | 'fr';
export type PublicationStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
export type ImageFormat = 'JPEG' | 'PNG' | 'WEBP';

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  locale: Locale;
  status: PublicationStatus;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  categoryId?: string;
  category?: Category;
  tags: Tag[];
  featuredImageId?: string;
  featuredImage?: Image;
  translationOfId?: string;
  translations?: BlogPost[];
  authorId: string;
  author: User;
  readingTime: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  locale: Locale;
  featuredImage?: {
    url: string;
    altText: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  readingTime: number;
  viewCount: number;
  publishedAt: Date;
}

export interface BlogPostDetail extends BlogPost {
  relatedPosts: BlogPostSummary[];
  breadcrumbs: Breadcrumb[];
  hreflangTags: HreflangTag[];
  schemaMarkup: {
    article: ArticleSchema;
    breadcrumb: BreadcrumbSchema;
    faq?: FAQSchema;
  };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  locale: Locale;
  postCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  locale: Locale;
  postCount?: number;
  createdAt: Date;
}

export interface TagWithCount extends Tag {
  postCount: number;
}

// Image Types
export interface Image {
  id: string;
  filename: string;
  altText: string;
  url: string;
  width: number;
  height: number;
  format: ImageFormat;
  size: number;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  ogImageUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ImageVariants {
  thumbnail: string;
  medium: string;
  large: string;
  ogImage: string;
}

export interface ImageUsage {
  isUsed: boolean;
  usedInPosts: string[];
}

// User Type (minimal for blog context)
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  dateModified: string;
  image: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface FAQSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

// Navigation Types
export interface Breadcrumb {
  label: string;
  url: string;
}

export interface HreflangTag {
  hreflang: string;
  href: string;
}

// Analytics Types
export interface PostView {
  id: string;
  postId: string;
  sessionId: string;
  referrer?: string;
  userAgent: string;
  locale: Locale;
  timeOnPage?: number;
  viewedAt: Date;
}

export interface PostMetrics {
  postId: string;
  title: string;
  views: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topKeywords: string[];
  trafficSources: TrafficSource[];
}

export interface TrafficSource {
  source: 'organic' | 'direct' | 'referral' | 'social';
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  totalPosts: number;
  totalViews: number;
  postsByLocale: Record<Locale, number>;
  postsByStatus: Record<PublicationStatus, number>;
  topPosts: PostMetrics[];
}

export type AnalyticsPeriod = '7d' | '30d' | '90d';

// Pagination Types
export interface PaginatedPosts {
  posts: BlogPostSummary[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginatedImages {
  images: Image[];
  total: number;
  page: number;
  totalPages: number;
}

// Validation Types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Markdown Processing Types
export interface ParsedContent {
  html: string;
  headings: Heading[];
  images: string[];
  links: string[];
  wordCount: number;
  hasFAQ: boolean;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}
