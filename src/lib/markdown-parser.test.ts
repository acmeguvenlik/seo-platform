/**
 * Unit tests for MarkdownParser
 */

import { describe, it, expect } from 'vitest';
import { MarkdownParser } from './markdown-parser';

describe('MarkdownParser', () => {
  const parser = new MarkdownParser();

  describe('parse()', () => {
    it('should convert basic Markdown to HTML', async () => {
      const markdown = '# Hello World\n\nThis is a paragraph.';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<h1');
      expect(html).toContain('Hello World');
      expect(html).toContain('<p>');
      expect(html).toContain('This is a paragraph.');
    });

    it('should handle headings H2-H6', async () => {
      const markdown = `
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
`;
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<h2');
      expect(html).toContain('<h3');
      expect(html).toContain('<h4');
      expect(html).toContain('<h5');
      expect(html).toContain('<h6');
    });

    it('should handle bold and italic text', async () => {
      const markdown = '**bold text** and *italic text*';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<strong>bold text</strong>');
      expect(html).toContain('<em>italic text</em>');
    });

    it('should handle links', async () => {
      const markdown = '[Google](https://google.com)';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<a');
      expect(html).toContain('href="https://google.com"');
      expect(html).toContain('Google');
    });

    it('should handle images', async () => {
      const markdown = '![Alt text](https://example.com/image.jpg)';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<img');
      expect(html).toContain('src="https://example.com/image.jpg"');
      expect(html).toContain('alt="Alt text"');
    });

    it('should handle unordered lists', async () => {
      const markdown = `
- Item 1
- Item 2
- Item 3
`;
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
      expect(html).toContain('<li>Item 3</li>');
    });

    it('should handle ordered lists', async () => {
      const markdown = `
1. First
2. Second
3. Third
`;
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>First</li>');
      expect(html).toContain('<li>Second</li>');
      expect(html).toContain('<li>Third</li>');
    });

    it('should handle code blocks', async () => {
      const markdown = '```javascript\nconst x = 42;\n```';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('const x = 42;');
    });

    it('should handle inline code', async () => {
      const markdown = 'Use `console.log()` for debugging';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<code>console.log()</code>');
    });

    it('should add IDs to headings', async () => {
      const markdown = '## Getting Started';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('id="getting-started"');
    });

    it('should handle GFM tables', async () => {
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<table>');
      expect(html).toContain('<thead>');
      expect(html).toContain('<tbody>');
      expect(html).toContain('Header 1');
      expect(html).toContain('Cell 1');
    });

    it('should handle GFM strikethrough', async () => {
      const markdown = '~~strikethrough text~~';
      const html = await parser.parse(markdown);
      
      expect(html).toContain('<del>strikethrough text</del>');
    });
  });

  describe('parseWithMetadata()', () => {
    it('should extract headings with correct levels', async () => {
      const markdown = `
# Main Title
## Section 1
### Subsection 1.1
## Section 2
`;
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.headings).toHaveLength(4);
      expect(result.headings[0]).toEqual({
        level: 1,
        text: 'Main Title',
        id: 'main-title',
      });
      expect(result.headings[1]).toEqual({
        level: 2,
        text: 'Section 1',
        id: 'section-1',
      });
      expect(result.headings[2]).toEqual({
        level: 3,
        text: 'Subsection 1.1',
        id: 'subsection-1-1',
      });
      expect(result.headings[3]).toEqual({
        level: 2,
        text: 'Section 2',
        id: 'section-2',
      });
    });

    it('should extract image URLs', async () => {
      const markdown = `
![Image 1](https://example.com/img1.jpg)
Some text
![Image 2](https://example.com/img2.png)
`;
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.images).toHaveLength(2);
      expect(result.images).toContain('https://example.com/img1.jpg');
      expect(result.images).toContain('https://example.com/img2.png');
    });

    it('should extract link URLs', async () => {
      const markdown = `
[Google](https://google.com)
[GitHub](https://github.com)
`;
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.links).toHaveLength(2);
      expect(result.links).toContain('https://google.com');
      expect(result.links).toContain('https://github.com');
    });

    it('should count words correctly', async () => {
      const markdown = `
# Title

This is a paragraph with ten words in it here.

Another paragraph with five words.
`;
      const result = await parser.parseWithMetadata(markdown);
      
      // "Title" (1) + "This is a paragraph with ten words in it here" (10) + "Another paragraph with five words" (5) = 16
      expect(result.wordCount).toBe(16);
    });

    it('should not count words in code blocks', async () => {
      const markdown = `
Regular text with five words.

\`\`\`javascript
const x = 42;
console.log(x);
\`\`\`

More text here.
`;
      const result = await parser.parseWithMetadata(markdown);
      
      // Should count "Regular text with five words" (5) + "More text here" (3) = 8
      // Code block words should not be counted
      expect(result.wordCount).toBe(8);
    });

    it('should detect FAQ sections', async () => {
      const markdown = `
# Blog Post

## FAQ

**Q: What is this?**
A: This is a test.
`;
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.hasFAQ).toBe(true);
    });

    it('should detect "Frequently Asked Questions" heading', async () => {
      const markdown = `
# Blog Post

## Frequently Asked Questions

Some content here.
`;
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.hasFAQ).toBe(true);
    });

    it('should return false for hasFAQ when no FAQ section exists', async () => {
      const markdown = `
# Blog Post

## Introduction

Some content here.
`;
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.hasFAQ).toBe(false);
    });

    it('should generate HTML along with metadata', async () => {
      const markdown = '## Test Heading\n\nTest content.';
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.html).toContain('<h2');
      expect(result.html).toContain('Test Heading');
      expect(result.html).toContain('<p>Test content.</p>');
    });

    it('should handle Turkish characters in heading IDs', async () => {
      const markdown = '## Başlık Örneği';
      const result = await parser.parseWithMetadata(markdown);
      
      // Note: ö is converted to 'oe' (German style) for consistency across languages
      expect(result.headings[0].id).toBe('baslik-oernegi');
    });

    it('should handle German characters in heading IDs', async () => {
      const markdown = '## Überschrift Beispiel';
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.headings[0].id).toBe('ueberschrift-beispiel');
    });

    it('should handle Spanish characters in heading IDs', async () => {
      const markdown = '## Título Español';
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.headings[0].id).toBe('titulo-espanol');
    });

    it('should handle French characters in heading IDs', async () => {
      const markdown = '## Titre Français';
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.headings[0].id).toBe('titre-francais');
    });

    it('should handle empty markdown', async () => {
      const markdown = '';
      const result = await parser.parseWithMetadata(markdown);
      
      expect(result.headings).toHaveLength(0);
      expect(result.images).toHaveLength(0);
      expect(result.links).toHaveLength(0);
      expect(result.wordCount).toBe(0);
      expect(result.hasFAQ).toBe(false);
    });
  });

  describe('validateStructure()', () => {
    it('should pass validation when H2 heading exists', () => {
      const markdown = `
# Main Title

## Section 1

Some content here.
`;
      const result = parser.validateStructure(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when no H2 heading exists', () => {
      const markdown = `
# Main Title

### Subsection

Some content here.
`;
      const result = parser.validateStructure(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('content');
      expect(result.errors[0].message).toContain('H2 heading');
    });

    it('should pass validation with multiple H2 headings', () => {
      const markdown = `
# Main Title

## Section 1

Content 1

## Section 2

Content 2
`;
      const result = parser.validateStructure(markdown);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with only H1 and H3 headings', () => {
      const markdown = `
# Main Title

### Subsection 1

### Subsection 2
`;
      const result = parser.validateStructure(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle empty markdown', () => {
      const markdown = '';
      const result = parser.validateStructure(markdown);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });
});
