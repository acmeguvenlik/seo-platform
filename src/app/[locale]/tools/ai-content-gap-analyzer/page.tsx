'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function AiContentGapAnalyzerPage() {
  return (
    <ToolPageTemplate
      toolSlug="ai-content-gap-analyzer"
      apiEndpoint="/api/tools/ai-content-gap-analyzer"
      inputLabel="Your Website URL"
      inputPlaceholder="https://example.com"
      buttonText="Analyze Content Gaps"
      loadingText="Analyzing..."
    />
  );
}
