/**
 * Blog System Utility Functions
 * Provides helper functions for slug generation, reading time calculation, and SEO scoring
 */

/**
 * Generate a URL-friendly slug from a title
 * Handles special characters from multiple languages (Turkish, German, Spanish, French)
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace Turkish characters
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Replace German characters
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    // Replace Spanish characters
    .replace(/ñ/g, 'n')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    // Replace French characters
    .replace(/[àâ]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôœ]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    // Replace spaces and special chars
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate estimated reading time in minutes
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;
  
  // Remove markdown syntax
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep link text
    .replace(/[#*_~]/g, '') // Remove markdown symbols
    .trim();
  
  const wordCount = plainText.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  
  return Math.max(minutes, 1); // Minimum 1 minute
}

/**
 * Calculate SEO score for a blog post (0-100)
 * Based on title length, meta description, images, content structure, and links
 */
export function calculateSEOScore(post: {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  featuredImageId?: string;
}): number {
  let score = 0;
  
  // Title length (50-60 chars) - 20 points
  const titleLength = post.seoTitle?.length || post.title.length;
  if (titleLength >= 50 && titleLength <= 60) {
    score += 20;
  } else if (titleLength >= 40 && titleLength < 70) {
    score += 10;
  }
  
  // Meta description (120-160 chars) - 20 points
  const descLength = post.seoDescription?.length || 0;
  if (descLength >= 120 && descLength <= 160) {
    score += 20;
  } else if (descLength >= 100 && descLength < 180) {
    score += 10;
  }
  
  // Has featured image - 15 points
  if (post.featuredImageId) {
    score += 15;
  }
  
  // Content structure - 25 points
  const hasH2 = /^##\s+/m.test(post.content);
  const headingCount = (post.content.match(/^#{2,6}\s+/gm) || []).length;
  const wordCount = post.content.split(/\s+/).length;
  
  if (hasH2) {
    score += 10; // Has H2
  }
  if (headingCount >= 3) {
    score += 10; // Multiple headings
  }
  if (wordCount >= 300) {
    score += 5; // Sufficient content
  }
  
  // Internal links - 10 points
  const linkMatches = post.content.match(/\[([^\]]+)\]\(([^\)]+)\)/g) || [];
  const internalLinks = linkMatches.filter(link => {
    const urlMatch = link.match(/\(([^\)]+)\)/);
    if (!urlMatch) return false;
    const url = urlMatch[1];
    return url.startsWith('/') || url.includes(process.env.NEXT_PUBLIC_APP_URL || '');
  });
  
  if (internalLinks.length >= 2) {
    score += 10;
  } else if (internalLinks.length >= 1) {
    score += 5;
  }
  
  // Images with alt text - 10 points
  const imageCount = (post.content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  if (imageCount > 0) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * Extract excerpt from content if not provided
 * Takes first 160 characters of plain text
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Cut at last complete word before maxLength
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Validate image dimensions for social sharing
 * Minimum 1200x630 for optimal og:image
 */
export function validateImageDimensions(
  width: number,
  height: number,
  minWidth: number = 1200,
  minHeight: number = 630
): { valid: boolean; message?: string } {
  if (width < minWidth || height < minHeight) {
    return {
      valid: false,
      message: `Image dimensions (${width}x${height}) are below recommended size (${minWidth}x${minHeight}) for optimal social sharing`,
    };
  }
  
  return { valid: true };
}

/**
 * Generate canonical URL for a blog post
 */
export function generateCanonicalUrl(slug: string, locale: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/${locale}/blog/${slug}`;
}

/**
 * Validate SEO metadata
 */
export function validateSEOMetadata(metadata: {
  title?: string;
  description?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (metadata.title) {
    if (metadata.title.length < 50) {
      errors.push('SEO title is too short (minimum 50 characters)');
    }
    if (metadata.title.length > 60) {
      errors.push('SEO title is too long (maximum 60 characters)');
    }
  }
  
  if (metadata.description) {
    if (metadata.description.length < 120) {
      errors.push('Meta description is too short (minimum 120 characters)');
    }
    if (metadata.description.length > 160) {
      errors.push('Meta description is too long (maximum 160 characters)');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
