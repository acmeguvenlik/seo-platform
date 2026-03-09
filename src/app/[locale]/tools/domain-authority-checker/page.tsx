'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function DomainAuthorityCheckerPage() {
  return (
    <ToolPageTemplate
      toolSlug="domain-authority-checker"
      apiEndpoint="/api/tools/domain-authority-checker"
      inputLabel="Website URL"
      inputPlaceholder="https://example.com"
      buttonText="Check Authority"
      loadingText="Checking..."
    />
  );
}
