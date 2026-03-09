'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function KeywordResearchPage() {
  return (
    <ToolPageTemplate
      toolSlug="keyword-research"
      apiEndpoint="/api/tools/keyword-research"
      inputLabel="Seed Keyword"
      inputPlaceholder="seo tools"
      buttonText="Research Keywords"
      loadingText="Researching..."
    />
  );
}
