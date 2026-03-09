'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function LighthouseAnalyzerPage() {
  return (
    <ToolPageTemplate
      toolSlug="lighthouse-analyzer"
      apiEndpoint="/api/tools/lighthouse-analyzer"
      inputLabel="Website URL"
      inputPlaceholder="https://example.com"
      buttonText="Run Lighthouse"
      loadingText="Analyzing..."
    />
  );
}
