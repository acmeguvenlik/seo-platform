# SEO Service Usage Guide

The SEO Service provides comprehensive SEO metadata generation, schema markup, and hreflang tag generation for blog posts.

## Features

- **Metadata Generation**: Automatically generate optimized SEO metadata from blog post content
- **Metadata Validation**: Validate title and description lengths for optimal search engine performance
- **Schema Markup**: Generate JSON-LD schema markup (Article, Breadcrumb, FAQ, Organization)
- **Hreflang Tags**: Generate hreflang tags for multi-language content
- **SEO Scoring**: Calculate SEO score based on multiple factors

## API Reference

### generateDefaultMetadata(post: BlogPost): SEOMetadata

Generates default SEO metadata from a blog post's title and excerpt.

**Features:**
- Optimizes title length (50-60 characters)
- Optimizes description length (120-160 characters)
- Uses featured image or default og:image
- Generates canonical URL

**Example:**
```typescript
import { generateDefaultMetadata } from '@/lib/seo-service';

const metadata = generateDefaultMetadata(blogPost);
// Returns:
// {
//   title: "How to Optimize Meta Tags | SEO Tools Platform",
//   description: "Learn how to optimize meta tags for better search engine rankings...",
//   ogImage: "https://example.com/images/meta-tags-og.jpg",
//   canonicalUrl: "https://example.com/en/blog/optimize-meta-tags"
// }
```

### validateMetadata(metadata: { title?: string; description?: string }): ValidationResult

Validates SEO metadata against best practices.

**Validation Rules:**
- Title: 50-60 characters (optimal)
- Description: 120-160 characters (optimal)

**Example:**
```typescript
import { validateMetadata } from '@/lib/seo-service';

const result = validateMetadata({
  title: "Perfect title length for SEO optimization and ranking",
  description: "This is a perfect meta description length for SEO optimization. It provides enough information to entice users."
});

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### calculateSEOScore(post: BlogPost): number

Calculates an SEO score (0-100) based on multiple factors.

**Scoring Factors:**
- Title length (20 points)
- Meta description length (20 points)
- Featured image (15 points)
- Content structure (25 points)
- Internal links (10 points)
- Images with alt text (10 points)

**Example:**
```typescript
import { calculateSEOScore } from '@/lib/seo-service';

const score = calculateSEOScore(blogPost);
console.log(`SEO Score: ${score}/100`);
```

### generateArticleSchema(post: BlogPost): ArticleSchema

Generates Article schema markup in JSON-LD format.

**Example:**
```typescript
import { generateArticleSchema } from '@/lib/seo-service';

const schema = generateArticleSchema(blogPost);

// Use in Next.js page:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

### generateBreadcrumbSchema(post: BlogPost, breadcrumbs: Breadcrumb[]): BreadcrumbSchema

Generates Breadcrumb schema markup in JSON-LD format.

**Example:**
```typescript
import { generateBreadcrumbSchema } from '@/lib/seo-service';

const breadcrumbs = [
  { label: 'Home', url: 'https://example.com' },
  { label: 'Blog', url: 'https://example.com/en/blog' },
  { label: 'SEO Guides', url: 'https://example.com/en/blog/category/seo-guides' },
  { label: post.title, url: `https://example.com/en/blog/${post.slug}` }
];

const schema = generateBreadcrumbSchema(post, breadcrumbs);
```

### generateFAQSchema(post: BlogPost): FAQSchema | null

Generates FAQ schema markup if the post contains an FAQ section.

**FAQ Format in Markdown:**
```markdown
## FAQ

### What are meta tags?
Meta tags are HTML elements that provide metadata about a web page.

### Why are meta tags important?
They help search engines understand your content better.
```

**Example:**
```typescript
import { generateFAQSchema } from '@/lib/seo-service';

const faqSchema = generateFAQSchema(blogPost);

if (faqSchema) {
  // Add to page
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
  />
}
```

### generateOrganizationSchema(): OrganizationSchema

Generates Organization schema markup for the platform.

**Example:**
```typescript
import { generateOrganizationSchema } from '@/lib/seo-service';

const schema = generateOrganizationSchema();

// Add to layout or homepage
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

### generateHreflangTags(post: BlogPost, translations: BlogPost[]): HreflangTag[]

Generates hreflang tags for multi-language content.

**Example:**
```typescript
import { generateHreflangTags } from '@/lib/seo-service';

const translations = await getPostTranslations(post.id);
const hreflangTags = generateHreflangTags(post, translations);

// Use in Next.js metadata:
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  const translations = await getPostTranslations(post.id);
  const hreflangTags = generateHreflangTags(post, translations);
  
  return {
    alternates: {
      languages: Object.fromEntries(
        hreflangTags.map(tag => [tag.hreflang, tag.href])
      )
    }
  };
}
```

## Complete Example: Blog Post Page

```typescript
import { 
  generateDefaultMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateOrganizationSchema,
  generateHreflangTags,
  calculateSEOScore
} from '@/lib/seo-service';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  const translations = await getPostTranslations(post.id);
  
  // Generate SEO metadata
  const seoMetadata = post.seoTitle && post.seoDescription
    ? {
        title: post.seoTitle,
        description: post.seoDescription,
        ogImage: post.ogImage || post.featuredImage?.ogImageUrl,
        canonicalUrl: post.canonicalUrl
      }
    : generateDefaultMetadata(post);
  
  // Generate hreflang tags
  const hreflangTags = generateHreflangTags(post, translations);
  
  return {
    title: seoMetadata.title,
    description: seoMetadata.description,
    openGraph: {
      title: seoMetadata.title,
      description: seoMetadata.description,
      images: [seoMetadata.ogImage],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    alternates: {
      canonical: seoMetadata.canonicalUrl,
      languages: Object.fromEntries(
        hreflangTags.map(tag => [tag.hreflang, tag.href])
      )
    }
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  const translations = await getPostTranslations(post.id);
  
  // Generate schema markup
  const articleSchema = generateArticleSchema(post);
  const breadcrumbs = [
    { label: 'Home', url: process.env.NEXT_PUBLIC_APP_URL },
    { label: 'Blog', url: `${process.env.NEXT_PUBLIC_APP_URL}/${post.locale}/blog` },
    { label: post.category?.name, url: `${process.env.NEXT_PUBLIC_APP_URL}/${post.locale}/blog/category/${post.category?.slug}` },
    { label: post.title, url: `${process.env.NEXT_PUBLIC_APP_URL}/${post.locale}/blog/${post.slug}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(post, breadcrumbs);
  const faqSchema = generateFAQSchema(post);
  const orgSchema = generateOrganizationSchema();
  
  // Calculate SEO score for admin display
  const seoScore = calculateSEOScore(post);
  
  return (
    <>
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      
      {/* Page content */}
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
```

## Environment Variables

Make sure to set the following environment variable:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Best Practices

1. **Always validate metadata** before saving to ensure optimal SEO performance
2. **Use custom metadata** when available, fall back to generated metadata
3. **Include all schema types** that apply to your content (Article, Breadcrumb, FAQ)
4. **Generate hreflang tags** for all translated content
5. **Monitor SEO scores** to identify content that needs optimization
6. **Test schema markup** using Google's Rich Results Test tool

## Related Documentation

- [Blog Service Documentation](./blog-service-implementation.md)
- [Cache Service Documentation](./cache-service-integration.md)
- [Requirements Document](../.kiro/specs/blog-system/requirements.md)
- [Design Document](../.kiro/specs/blog-system/design.md)
