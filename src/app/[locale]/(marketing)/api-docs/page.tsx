import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "API Documentation - SEO Tools Platform",
    description: "Complete API documentation for SEO Tools Platform with interactive examples",
  };
}

export default async function ApiDocsPage() {
  const t = await getTranslations("apiDocs");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-display mb-4">API Documentation</h1>
          <p className="text-body text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete REST API documentation for all SEO tools and AI-powered features
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="#authentication"
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
          >
            <h3 className="text-heading font-semibold mb-2">Authentication</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">JWT-based auth</p>
          </a>
          <a
            href="#tools"
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
          >
            <h3 className="text-heading font-semibold mb-2">SEO Tools</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">11 analysis tools</p>
          </a>
          <a
            href="#ai-tools"
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
          >
            <h3 className="text-heading font-semibold mb-2">AI Tools</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">Claude-powered</p>
          </a>
          <a
            href="#rate-limits"
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
          >
            <h3 className="text-heading font-semibold mb-2">Rate Limits</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">Plan-based limits</p>
          </a>
        </div>

        {/* Base URL */}
        <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-title font-semibold mb-4">Base URL</h2>
          <code className="text-mono text-teal-600 dark:text-teal-400">
            {process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com"}/api
          </code>
        </div>

        {/* Authentication */}
        <section id="authentication" className="mb-16">
          <h2 className="text-title font-semibold mb-6">Authentication</h2>
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-heading font-semibold mb-4">POST /auth/login</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                Authenticate user and receive JWT token
              </p>
              
              <div className="mb-4">
                <h4 className="text-small font-semibold mb-2">Request Body</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "email": "user@example.com",
  "password": "your-password"
}`}</code>
                </pre>
              </div>

              <div>
                <h4 className="text-small font-semibold mb-2">Response</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "plan": "FREE"
  }
}`}</code>
                </pre>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-small text-blue-900 dark:text-blue-300">
                <strong>Note:</strong> Include the JWT token in subsequent requests using the Authorization header:
                <code className="ml-2 text-mono">Authorization: Bearer YOUR_TOKEN</code>
              </p>
            </div>
          </div>
        </section>

        {/* SEO Tools */}
        <section id="tools" className="mb-16">
          <h2 className="text-title font-semibold mb-6">SEO Tools</h2>
          <div className="space-y-6">
            {/* Meta Analyzer */}
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-heading font-semibold mb-4">POST /tools/meta-analyzer</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                Analyze meta tags, Open Graph, and Twitter Card tags
              </p>
              
              <div className="mb-4">
                <h4 className="text-small font-semibold mb-2">Request Body</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "url": "https://example.com"
}`}</code>
                </pre>
              </div>

              <div>
                <h4 className="text-small font-semibold mb-2">Response</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "url": "https://example.com",
  "score": 85,
  "title": {
    "content": "Page Title",
    "length": 45,
    "status": "good",
    "message": "Title length is optimal"
  },
  "suggestions": ["Add more descriptive keywords"],
  "processingTime": 1234
}`}</code>
                </pre>
              </div>
            </div>

            {/* Keyword Density */}
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-heading font-semibold mb-4">POST /tools/keyword-density</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                Calculate keyword density and word frequency
              </p>
              
              <div className="mb-4">
                <h4 className="text-small font-semibold mb-2">Request Body</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "url": "https://example.com"
  // OR
  "content": "Your content text here..."
}`}</code>
                </pre>
              </div>
            </div>

            {/* Page Speed */}
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-heading font-semibold mb-4">POST /tools/page-speed</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                Analyze page speed using Google PageSpeed Insights API
              </p>
              
              <div className="mb-4">
                <h4 className="text-small font-semibold mb-2">Request Body</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "url": "https://example.com",
  "strategy": "mobile" // or "desktop"
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-small text-gray-600 dark:text-gray-400">
              <strong>Other available tools:</strong> sitemap-generator, backlink-analyzer, image-optimizer, 
              heading-analyzer, robots-generator, robots-validator, schema-generator, internal-links
            </p>
            <a 
              href="/api/docs" 
              className="text-small text-teal-600 dark:text-teal-400 hover:underline mt-2 inline-block"
            >
              View complete OpenAPI specification →
            </a>
          </div>
        </section>

        {/* AI Tools */}
        <section id="ai-tools" className="mb-16">
          <h2 className="text-title font-semibold mb-6">AI Tools</h2>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg mb-6">
            <p className="text-small text-yellow-900 dark:text-yellow-300">
              <strong>Authentication Required:</strong> AI tools require a valid JWT token
            </p>
          </div>

          <div className="space-y-6">
            {/* AI Meta Generator */}
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-heading font-semibold mb-4">POST /ai/meta-generator</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                Generate optimized meta tags using Claude AI
              </p>
              
              <div className="mb-4">
                <h4 className="text-small font-semibold mb-2">Request Body</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "url": "https://example.com",
  "targetKeywords": ["seo", "optimization"],
  "language": "en"
}`}</code>
                </pre>
              </div>
            </div>

            {/* AI Content Optimizer */}
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <h3 className="text-heading font-semibold mb-4">POST /ai/content-optimizer</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
                Optimize content for SEO using Claude AI
              </p>
              
              <div className="mb-4">
                <h4 className="text-small font-semibold mb-2">Request Body</h4>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-mono text-sm">{`{
  "content": "Your content here...",
  "targetKeyword": "seo optimization",
  "language": "en"
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="mb-16">
          <h2 className="text-title font-semibold mb-6">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-800 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-small font-semibold">Plan</th>
                  <th className="px-6 py-3 text-left text-small font-semibold">SEO Tools</th>
                  <th className="px-6 py-3 text-left text-small font-semibold">AI Tools</th>
                  <th className="px-6 py-3 text-left text-small font-semibold">Reset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4 text-body">FREE</td>
                  <td className="px-6 py-4 text-body">10 / day</td>
                  <td className="px-6 py-4 text-body">3 / day</td>
                  <td className="px-6 py-4 text-body">Daily</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-body">PRO</td>
                  <td className="px-6 py-4 text-body">500 / day</td>
                  <td className="px-6 py-4 text-body">100 / day</td>
                  <td className="px-6 py-4 text-body">Daily</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-body">ENTERPRISE</td>
                  <td className="px-6 py-4 text-body">Unlimited</td>
                  <td className="px-6 py-4 text-body">Unlimited</td>
                  <td className="px-6 py-4 text-body">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-small font-semibold mb-2">Rate Limit Headers</h4>
            <p className="text-small text-gray-600 dark:text-gray-400 mb-2">
              All API responses include rate limit information in headers:
            </p>
            <ul className="text-small text-gray-600 dark:text-gray-400 space-y-1">
              <li><code className="text-mono">X-RateLimit-Limit</code> - Total requests allowed</li>
              <li><code className="text-mono">X-RateLimit-Remaining</code> - Requests remaining</li>
              <li><code className="text-mono">X-RateLimit-Reset</code> - Reset timestamp</li>
            </ul>
          </div>
        </section>

        {/* Error Codes */}
        <section id="errors" className="mb-16">
          <h2 className="text-title font-semibold mb-6">Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-800 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-small font-semibold">Code</th>
                  <th className="px-6 py-3 text-left text-small font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4 text-mono">400</td>
                  <td className="px-6 py-4 text-body">Bad Request - Invalid input</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-mono">401</td>
                  <td className="px-6 py-4 text-body">Unauthorized - Authentication required</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-mono">429</td>
                  <td className="px-6 py-4 text-body">Too Many Requests - Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-mono">500</td>
                  <td className="px-6 py-4 text-body">Internal Server Error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* OpenAPI Spec Link */}
        <div className="text-center p-8 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
          <h3 className="text-heading font-semibold mb-4">Complete OpenAPI Specification</h3>
          <p className="text-body text-gray-600 dark:text-gray-400 mb-6">
            Download the complete OpenAPI 3.0 specification for use with Postman, Insomnia, or other API clients
          </p>
          <a
            href="/api/docs"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download OpenAPI Spec
          </a>
        </div>
      </div>
    </div>
  );
}
