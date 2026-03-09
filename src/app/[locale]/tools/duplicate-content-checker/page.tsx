'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function DuplicateContentCheckerPage() {
  return (
    <ToolPageTemplate
      toolSlug="duplicate-content-checker"
      apiEndpoint="/api/tools/duplicate-content-checker"
      inputLabel="Website URL"
      inputPlaceholder="https://example.com"
      buttonText="Check Duplicate Content"
      loadingText="Checking..."
    />
  );
}
