'use client';

import { ToolPageTemplate } from '@/components/tools/tool-page-template';

export default function PaginationCheckerPage() {
  return (
    <ToolPageTemplate
      toolSlug="pagination-checker"
      apiEndpoint="/api/tools/pagination-checker"
      inputLabel="Paginated Page URL"
      inputPlaceholder="https://example.com/page/1"
      buttonText="Check Pagination"
      loadingText="Checking..."
    />
  );
}
