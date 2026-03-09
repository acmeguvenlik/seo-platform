'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function AmpValidatorPage() {
  return (
    <ToolPageTemplate
      toolSlug="amp-validator"
      apiEndpoint="/api/tools/amp-validator"
      inputLabel="AMP Page URL"
      inputPlaceholder="https://example.com/amp"
      buttonText="Validate AMP"
      loadingText="Validating..."
    />
  );
}
