/**
 * Markdown Parser using unified/remark/rehype ecosystem
 * Converts Markdown to HTML and extracts metadata for SEO purposes
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Root as MdastRoot } from 'mdast';
import type { Root as HastRoot } from 'hast';
import { visit } from 'unist-util-visit';

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface ParsedContent {
  html: string;
  headings: Heading[];
  images: string[];
  links: string[];
  wordCount: number;
  hasFAQ: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Markdown Parser for blog content
 */
export class MarkdownParser {
  /**
   * Parse Markdown to HTML
   */
  async parse(markdown: string): Promise<string> {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
      })
      .use(rehypeStringify)
      .process(markdown);

    return String(result);
  }

  /**
   * Parse Markdown with metadata extraction
   */
  async parseWithMetadata(markdown: string): Promise<ParsedContent> {
    const headings: Heading[] = [];
    const images: string[] = [];
    const links: string[] = [];
    let wordCount = 0;
    let hasFAQ = false;

    // Parse markdown to AST
    const mdast = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .parse(markdown) as MdastRoot;

    // Extract metadata from markdown AST
    visit(mdast, (node) => {
      // Extract headings
      if (node.type === 'heading') {
        const text = extractText(node);
        const id = slugify(text);
        headings.push({
          level: node.depth,
          text,
          id,
        });

        // Check for FAQ section
        if (text.toLowerCase().includes('faq') || 
            text.toLowerCase().includes('frequently asked questions')) {
          hasFAQ = true;
        }
      }

      // Extract images
      if (node.type === 'image') {
        if (node.url) {
          images.push(node.url);
        }
      }

      // Extract links
      if (node.type === 'link') {
        if (node.url) {
          links.push(node.url);
        }
      }

      // Count words in text nodes
      if (node.type === 'text') {
        const words = node.value.trim().split(/\s+/).filter(w => w.length > 0);
        wordCount += words.length;
      }
    });

    // Generate HTML
    const html = await this.parse(markdown);

    return {
      html,
      headings,
      images,
      links,
      wordCount,
      hasFAQ,
    };
  }

  /**
   * Validate Markdown structure for SEO requirements
   */
  validateStructure(markdown: string): ValidationResult {
    const errors: ValidationError[] = [];

    // Parse markdown to AST
    const mdast = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .parse(markdown) as MdastRoot;

    let hasH2 = false;

    // Check for H2 heading requirement
    visit(mdast, 'heading', (node) => {
      if (node.depth === 2) {
        hasH2 = true;
      }
    });

    if (!hasH2) {
      errors.push({
        field: 'content',
        message: 'Content must contain at least one H2 heading for proper SEO structure',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Extract text content from a node
 */
function extractText(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  
  return '';
}

/**
 * Generate slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace Turkish characters first (before German)
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
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
    // Replace spaces and special chars
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Export singleton instance
export const markdownParser = new MarkdownParser();
