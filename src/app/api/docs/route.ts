import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "SEO Tools Platform API",
    version: "1.0.0",
    description: "Professional SEO analysis and optimization tools API",
    contact: {
      name: "API Support",
      email: "support@seotools.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      description: "Production server",
    },
  ],
  tags: [
    { name: "Tools", description: "SEO analysis tools" },
    { name: "AI", description: "AI-powered SEO tools" },
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Dashboard", description: "User dashboard data" },
  ],
  paths: {
    "/api/tools/meta-analyzer": {
      post: {
        tags: ["Tools"],
        summary: "Analyze meta tags",
        description: "Analyzes title, description, Open Graph, and Twitter Card tags",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string" },
                    score: { type: "number" },
                    title: {
                      type: "object",
                      properties: {
                        content: { type: "string" },
                        length: { type: "number" },
                        status: { type: "string", enum: ["good", "warning", "error"] },
                        message: { type: "string" },
                      },
                    },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                    },
                    processingTime: { type: "number" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid URL" },
          429: { description: "Rate limit exceeded" },
        },
      },
    },
    "/api/tools/keyword-density": {
      post: {
        tags: ["Tools"],
        summary: "Analyze keyword density",
        description: "Calculates word frequency and keyword density",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string", format: "uri" },
                  content: { type: "string" },
                },
                oneOf: [
                  { required: ["url"] },
                  { required: ["content"] },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalWords: { type: "number" },
                    uniqueWords: { type: "number" },
                    keywords: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          keyword: { type: "string" },
                          count: { type: "number" },
                          density: { type: "number" },
                        },
                      },
                    },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/page-speed": {
      post: {
        tags: ["Tools"],
        summary: "Analyze page speed",
        description: "Analyzes page speed using Google PageSpeed Insights API",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                  strategy: {
                    type: "string",
                    enum: ["mobile", "desktop"],
                    default: "mobile",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
                    coreWebVitals: {
                      type: "object",
                      properties: {
                        lcp: { type: "number" },
                        fid: { type: "number" },
                        cls: { type: "number" },
                      },
                    },
                    usingRealApi: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ai/meta-generator": {
      post: {
        tags: ["AI"],
        summary: "Generate meta tags with AI",
        description: "Uses Claude AI to generate optimized meta tags",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                  currentTitle: { type: "string" },
                  currentDescription: { type: "string" },
                  content: { type: "string" },
                  targetKeywords: {
                    type: "array",
                    items: { type: "string" },
                  },
                  language: {
                    type: "string",
                    enum: ["en", "tr", "de", "es", "fr"],
                    default: "en",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Generated meta tags",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    keywords: { type: "string" },
                    ogTitle: { type: "string" },
                    ogDescription: { type: "string" },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Authentication required" },
          429: { description: "Rate limit exceeded" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                        name: { type: "string" },
                        plan: { type: "string", enum: ["FREE", "PRO", "ENTERPRISE"] },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Get user statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    todayUsage: { type: "number" },
                    totalUsage: { type: "number" },
                    toolBreakdown: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          toolSlug: { type: "string" },
                          count: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Authentication required" },
        },
      },
    },
    "/api/tools/sitemap-generator": {
      post: {
        tags: ["Tools"],
        summary: "Generate XML sitemap",
        description: "Crawls website and generates XML sitemap",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                  maxPages: { type: "number", minimum: 1, maximum: 1000, default: 100 },
                  includeImages: { type: "boolean", default: true },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Generated sitemap",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    xml: { type: "string" },
                    urlCount: { type: "number" },
                    imageCount: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/backlink-analyzer": {
      post: {
        tags: ["Tools"],
        summary: "Analyze backlinks",
        description: "Analyzes all links on a page with dofollow/nofollow detection",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Backlink analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalLinks: { type: "number" },
                    internalLinks: { type: "number" },
                    externalLinks: { type: "number" },
                    dofollowLinks: { type: "number" },
                    nofollowLinks: { type: "number" },
                    links: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          url: { type: "string" },
                          text: { type: "string" },
                          type: { type: "string", enum: ["internal", "external"] },
                          rel: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/image-optimizer": {
      post: {
        tags: ["Tools"],
        summary: "Analyze images",
        description: "Analyzes images for SEO optimization opportunities",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Image analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalImages: { type: "number" },
                    withAlt: { type: "number" },
                    withoutAlt: { type: "number" },
                    lazyLoaded: { type: "number" },
                    score: { type: "number" },
                    images: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          src: { type: "string" },
                          alt: { type: "string" },
                          hasAlt: { type: "boolean" },
                          isLazyLoaded: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/heading-analyzer": {
      post: {
        tags: ["Tools"],
        summary: "Analyze heading structure",
        description: "Analyzes H1-H6 heading hierarchy",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string", format: "uri" },
                  content: { type: "string" },
                },
                oneOf: [
                  { required: ["url"] },
                  { required: ["content"] },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Heading analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    h1Count: { type: "number" },
                    totalHeadings: { type: "number" },
                    score: { type: "number" },
                    headings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          level: { type: "string" },
                          text: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/robots-generator": {
      post: {
        tags: ["Tools"],
        summary: "Generate robots.txt",
        description: "Generates robots.txt file with custom rules",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  allowAll: { type: "boolean", default: true },
                  disallowPaths: {
                    type: "array",
                    items: { type: "string" },
                  },
                  sitemapUrl: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Generated robots.txt",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/robots-validator": {
      post: {
        tags: ["Tools"],
        summary: "Validate robots.txt",
        description: "Validates robots.txt syntax and rules",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: { type: "string", format: "uri" },
                  content: { type: "string" },
                },
                oneOf: [
                  { required: ["url"] },
                  { required: ["content"] },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Validation result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    isValid: { type: "boolean" },
                    errors: {
                      type: "array",
                      items: { type: "string" },
                    },
                    warnings: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/schema-generator": {
      post: {
        tags: ["Tools"],
        summary: "Generate JSON-LD schema",
        description: "Generates structured data for various schema types",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["type", "data"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["Article", "Product", "LocalBusiness", "Organization", "Person", "Event", "Recipe", "FAQ"],
                  },
                  data: {
                    type: "object",
                    additionalProperties: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Generated schema",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    schema: { type: "object" },
                    scriptTag: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tools/internal-links": {
      post: {
        tags: ["Tools"],
        summary: "Analyze internal links",
        description: "Analyzes internal link structure and depth",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri" },
                  maxDepth: { type: "number", minimum: 1, maximum: 5, default: 3 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Internal link analysis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalLinks: { type: "number" },
                    uniquePages: { type: "number" },
                    maxDepth: { type: "number" },
                    brokenLinks: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ai/content-optimizer": {
      post: {
        tags: ["AI"],
        summary: "Optimize content with AI",
        description: "Uses Claude AI to optimize content for SEO",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content", "targetKeyword"],
                properties: {
                  content: { type: "string", minLength: 100 },
                  targetKeyword: { type: "string", minLength: 2 },
                  competitorUrls: {
                    type: "array",
                    items: { type: "string", format: "uri" },
                    maxItems: 3,
                  },
                  language: {
                    type: "string",
                    enum: ["en", "tr", "de", "es", "fr"],
                    default: "en",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Optimized content",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    optimizedContent: { type: "string" },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                    },
                    keywordDensity: { type: "number" },
                    readabilityScore: { type: "number" },
                  },
                },
              },
            },
          },
          401: { description: "Authentication required" },
          429: { description: "Rate limit exceeded" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec);
}
