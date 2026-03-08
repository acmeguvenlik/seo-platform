/**
 * Markdown Pretty Printer using unified/rehype/remark ecosystem
 * Converts HTML back to Markdown and formats Markdown content
 */

import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';

/**
 * Markdown Pretty Printer for blog content
 */
export class MarkdownPrettyPrinter {
  /**
   * Convert HTML back to Markdown
   */
  print(html: string): string {
    const result = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify, {
        bullet: '-',
        emphasis: '*',
        strong: '*',
        fence: '`',
        fences: true,
        incrementListMarker: true,
      })
      .processSync(html);

    return String(result);
  }

  /**
   * Format and normalize Markdown
   */
  format(markdown: string): string {
    const result = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStringify, {
        bullet: '-',
        emphasis: '*',
        strong: '*',
        fence: '`',
        fences: true,
        incrementListMarker: true,
      })
      .processSync(markdown);

    return String(result);
  }
}

// Export singleton instance
export const markdownPrettyPrinter = new MarkdownPrettyPrinter();
