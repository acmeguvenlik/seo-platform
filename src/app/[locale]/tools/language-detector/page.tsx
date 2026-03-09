'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function LanguageDetectorPage() {
  return (
    <ToolPageTemplate
      toolSlug="language-detector"
      apiEndpoint="/api/tools/language-detector"
      inputLabel="Website URL or Text"
      inputPlaceholder="https://example.com"
      buttonText="Detect Language"
      loadingText="Detecting..."
    />
  );
}
