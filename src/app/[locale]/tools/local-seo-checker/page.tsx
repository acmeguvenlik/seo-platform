'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function LocalSeoCheckerPage() {
  return (
    <ToolPageTemplate
      toolSlug="local-seo-checker"
      apiEndpoint="/api/tools/local-seo-checker"
      inputLabel="Business Website URL"
      inputPlaceholder="https://example.com"
      buttonText="Check Local SEO"
      loadingText="Checking..."
    />
  );
}
