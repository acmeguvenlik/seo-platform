'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function CompetitorAnalysisPage() {
  return (
    <ToolPageTemplate
      toolSlug="competitor-analysis"
      apiEndpoint="/api/tools/competitor-analysis"
      inputLabel="Your Website URL"
      inputPlaceholder="https://example.com"
      buttonText="Analyze Competitors"
      loadingText="Analyzing..."
    />
  );
}
