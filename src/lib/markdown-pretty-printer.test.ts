/**
 * Unit tests for MarkdownPrettyPrinter
 */

import { describe, it, expect } from 'vitest';
import { MarkdownPrettyPrinter } from './markdown-pretty-printer';

describe('MarkdownPrettyPrinter', () => {
  const printer = new MarkdownPrettyPrinter();

  describe('print()', () => {
    it('should convert basic HTML to Markdown', () => {
      const html = '<h1>Hello World</h1><p>This is a paragraph.</p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('# Hello World');
      expect(markdown).toContain('This is a paragraph.');
    });

    it('should handle headings H2-H6', () => {
      const html = `
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      `;
      const markdown = printer.print(html);
      
      expect(markdown).toContain('## Heading 2');
      expect(markdown).toContain('### Heading 3');
      expect(markdown).toContain('#### Heading 4');
      expect(markdown).toContain('##### Heading 5');
      expect(markdown).toContain('###### Heading 6');
    });

    it('should handle bold and italic text', () => {
      const html = '<p><strong>bold text</strong> and <em>italic text</em></p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('**bold text**');
      expect(markdown).toContain('*italic text*');
    });

    it('should handle links', () => {
      const html = '<p><a href="https://google.com">Google</a></p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('[Google](https://google.com)');
    });

    it('should handle images', () => {
      const html = '<img src="https://example.com/image.jpg" alt="Alt text">';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('![Alt text](https://example.com/image.jpg)');
    });

    it('should handle unordered lists', () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      `;
      const markdown = printer.print(html);
      
      expect(markdown).toContain('- Item 1');
      expect(markdown).toContain('- Item 2');
      expect(markdown).toContain('- Item 3');
    });

    it('should handle ordered lists', () => {
      const html = `
        <ol>
          <li>First</li>
          <li>Second</li>
          <li>Third</li>
        </ol>
      `;
      const markdown = printer.print(html);
      
      expect(markdown).toContain('1. First');
      expect(markdown).toContain('2. Second');
      expect(markdown).toContain('3. Third');
    });

    it('should handle code blocks', () => {
      const html = '<pre><code class="language-javascript">const x = 42;</code></pre>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('```');
      expect(markdown).toContain('const x = 42;');
    });

    it('should handle inline code', () => {
      const html = '<p>Use <code>console.log()</code> for debugging</p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('`console.log()`');
    });

    it('should handle tables', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cell 1</td>
              <td>Cell 2</td>
            </tr>
          </tbody>
        </table>
      `;
      const markdown = printer.print(html);
      
      expect(markdown).toContain('Header 1');
      expect(markdown).toContain('Header 2');
      expect(markdown).toContain('Cell 1');
      expect(markdown).toContain('Cell 2');
      expect(markdown).toContain('|');
    });

    it('should handle strikethrough text', () => {
      const html = '<p><del>strikethrough text</del></p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('~~strikethrough text~~');
    });

    it('should handle nested elements', () => {
      const html = '<p>This is <strong>bold with <em>italic</em> inside</strong></p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('**bold');
      expect(markdown).toContain('*italic*');
    });

    it('should handle multiple paragraphs', () => {
      const html = '<p>First paragraph.</p><p>Second paragraph.</p>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('First paragraph.');
      expect(markdown).toContain('Second paragraph.');
    });

    it('should handle empty HTML', () => {
      const html = '';
      const markdown = printer.print(html);
      
      expect(markdown).toBe('');
    });

    it('should handle HTML with IDs on headings', () => {
      const html = '<h2 id="getting-started">Getting Started</h2>';
      const markdown = printer.print(html);
      
      expect(markdown).toContain('## Getting Started');
    });

    it('should handle complex nested lists', () => {
      const html = `
        <ul>
          <li>Item 1
            <ul>
              <li>Nested 1</li>
              <li>Nested 2</li>
            </ul>
          </li>
          <li>Item 2</li>
        </ul>
      `;
      const markdown = printer.print(html);
      
      expect(markdown).toContain('- Item 1');
      expect(markdown).toContain('- Nested 1');
      expect(markdown).toContain('- Nested 2');
      expect(markdown).toContain('- Item 2');
    });
  });

  describe('format()', () => {
    it('should normalize Markdown formatting', () => {
      const markdown = '#  Heading with extra spaces  \n\nParagraph text.';
      const formatted = printer.format(markdown);
      
      expect(formatted).toContain('# Heading with extra spaces');
      expect(formatted).toContain('Paragraph text.');
    });

    it('should normalize list formatting', () => {
      const markdown = '* Item 1\n* Item 2\n* Item 3';
      const formatted = printer.format(markdown);
      
      // Should use consistent bullet style (-)
      expect(formatted).toContain('- Item 1');
      expect(formatted).toContain('- Item 2');
      expect(formatted).toContain('- Item 3');
    });

    it('should normalize emphasis formatting', () => {
      const markdown = '_italic text_ and __bold text__';
      const formatted = printer.format(markdown);
      
      // Should use consistent emphasis style (* and **)
      expect(formatted).toContain('*italic text*');
      expect(formatted).toContain('**bold text**');
    });

    it('should normalize code block formatting', () => {
      const markdown = '~~~javascript\nconst x = 42;\n~~~';
      const formatted = printer.format(markdown);
      
      // Should use consistent fence style (```)
      expect(formatted).toContain('```');
      expect(formatted).toContain('const x = 42;');
    });

    it('should handle empty markdown', () => {
      const markdown = '';
      const formatted = printer.format(markdown);
      
      expect(formatted).toBe('');
    });

    it('should preserve links', () => {
      const markdown = '[Google](https://google.com)';
      const formatted = printer.format(markdown);
      
      expect(formatted).toContain('[Google](https://google.com)');
    });

    it('should preserve images', () => {
      const markdown = '![Alt text](https://example.com/image.jpg)';
      const formatted = printer.format(markdown);
      
      expect(formatted).toContain('![Alt text](https://example.com/image.jpg)');
    });

    it('should normalize ordered list numbering', () => {
      const markdown = '1. First\n1. Second\n1. Third';
      const formatted = printer.format(markdown);
      
      // Should increment list markers
      expect(formatted).toContain('1. First');
      expect(formatted).toContain('2. Second');
      expect(formatted).toContain('3. Third');
    });

    it('should handle tables', () => {
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
      const formatted = printer.format(markdown);
      
      expect(formatted).toContain('Header 1');
      expect(formatted).toContain('Header 2');
      expect(formatted).toContain('Cell 1');
      expect(formatted).toContain('Cell 2');
      expect(formatted).toContain('|');
    });

    it('should handle strikethrough', () => {
      const markdown = '~~strikethrough text~~';
      const formatted = printer.format(markdown);
      
      expect(formatted).toContain('~~strikethrough text~~');
    });
  });
});
