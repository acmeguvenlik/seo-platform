/**
 * SEO Service
 * Handles SEO metadata generation, schema markup, and hreflang tags for blog posts
 */

import type {
  BlogPost,
  SEOMetadata,
  ArticleSchema,
  BreadcrumbSchema,
  FAQSchema,
  OrganizationSchema,
  HreflangTag,
  ValidationResult,
  Breadcrumb,
} from '@/types/blog';
import { generateExcerpt, validateSEOMetadata, generateCanonicalUrl, calculateSEOScore } from './blog-utils';

// Re-export calculateSEOScore for convenience
export { calculateSEOScore };

/**
 * Generate default SEO metadata from blog post
 * Uses post title and excerpt to create optimized meta tags
 */
export function generateDefaultMetadata(post: BlogPost): SEOMetadata {
  // Generate title (50-60 chars optimal)
  let title = post.title;
  if (title.length < 50) {
    title = `${title} | SEO Tools Platform`;
  } else if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }

  // Generate description (120-160 chars optimal)
  let description = post.excerpt || generateExcerpt(post.content, 160);
  if (description.length < 120) {
    description = `${description} Learn more about ${post.title.toLowerCase()} on SEO Tools Platform.`;
  }
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  // Generate og:image URL
  const ogImage = post.featuredImage?.ogImageUrl || 
    post.featuredImage?.url || 
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/images/default-og-image.jpg`;

  // Generate canonical URL
  const canonicalUrl = generateCanonicalUrl(post.slug, post.locale);

  return {
    title,
    description,
    ogImage,
    canonicalUrl,
  };
}

/**
 * Validate SEO metadata for optimal search engine performance
 * Checks title and description length constraints
 */
export function validateMetadata(metadata: {
  title?: string;
  description?: string;
}): ValidationResult {
  const result = validateSEOMetadata(metadata);
  
  // Convert string errors to ValidationError objects
  return {
    valid: result.valid,
    errors: result.errors.map(message => ({
      field: message.includes('title') ? 'title' : 'description',
      message,
    })),
  };
}

/**
 * Generate Article schema markup in JSON-LD format
 * Provides structured data for search engines
 */
export function generateArticleSchema(post: BlogPost): ArticleSchema {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: post.author.name || post.author.email,
    },
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.featuredImage?.url || `${baseUrl}/images/default-og-image.jpg`,
    publisher: {
      '@type': 'Organization',
      name: 'SEO Tools Platform',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
  };
}

/**
 * Generate Breadcrumb schema markup in JSON-LD format
 * Helps search engines understand page hierarchy
 */
export function generateBreadcrumbSchema(post: BlogPost, breadcrumbs: Breadcrumb[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.url,
    })),
  };
}

/**
 * Generate FAQ schema markup in JSON-LD format
 * Extracts FAQ sections from blog post content
 * Returns null if no FAQ section is found
 */
export function generateFAQSchema(post: BlogPost): FAQSchema | null {
  // Extract FAQ sections from markdown content
  // Look for patterns like:
  // ## FAQ or ## Frequently Asked Questions
  // ### Question?
  // Answer text
  
  const faqRegex = /##\s+(FAQ|Frequently Asked Questions|Questions?)\s*\n([\s\S]*?)(?=\n##|$)/i;
  const faqMatch = post.content.match(faqRegex);
  
  if (!faqMatch) {
    return null;
  }

  const faqSection = faqMatch[2];
  
  // Extract Q&A pairs
  // Pattern: ### Question text? \n Answer text
  const qaRegex = /###\s+(.+?\?)\s*\n([\s\S]*?)(?=\n###|$)/g;
  const questions: FAQSchema['mainEntity'] = [];
  
  let match;
  while ((match = qaRegex.exec(faqSection)) !== null) {
    const question = match[1].trim();
    const answer = match[2]
      .trim()
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 500); // Limit answer length
    
    if (question && answer) {
      questions.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      });
    }
  }

  if (questions.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

/**
 * Generate Organization schema markup in JSON-LD format
 * Provides information about the organization
 */
export function generateOrganizationSchema(): OrganizationSchema {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SEO Tools Platform',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://twitter.com/seotoolsplatform',
      'https://facebook.com/seotoolsplatform',
      'https://linkedin.com/company/seotoolsplatform',
    ],
  };
}

/**
 * Generate hreflang tags for blog post translations
 * Helps search engines serve the correct language version
 */
export function generateHreflangTags(post: BlogPost, translations: BlogPost[]): HreflangTag[] {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const tags: HreflangTag[] = [];

  // Add current post
  tags.push({
    hreflang: post.locale,
    href: `${baseUrl}/${post.locale}/blog/${post.slug}`,
  });

  // Add translations
  for (const translation of translations) {
    tags.push({
      hreflang: translation.locale,
      href: `${baseUrl}/${translation.locale}/blog/${translation.slug}`,
    });
  }

  // Add x-default (usually English)
  const defaultLocale = translations.find(t => t.locale === 'en') || post;
  tags.push({
    hreflang: 'x-default',
    href: `${baseUrl}/${defaultLocale.locale}/blog/${defaultLocale.slug}`,
  });

  return tags;
}
