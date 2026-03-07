// Common API response types

export interface ApiError {
  error: string;
  limit?: number;
  remaining?: number;
  reset?: number;
}

export interface ApiSuccess<T> {
  data: T;
  cached?: boolean;
  processingTime?: number;
}

// Tool result types
export interface MetaAnalysisResult {
  url: string;
  score: number;
  title: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
    message: string;
  };
  description: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
    message: string;
  };
  ogTags: {
    hasOgTitle: boolean;
    hasOgDescription: boolean;
    hasOgImage: boolean;
    hasOgUrl: boolean;
  };
  twitterTags: {
    hasTwitterCard: boolean;
    hasTwitterTitle: boolean;
    hasTwitterDescription: boolean;
    hasTwitterImage: boolean;
  };
  suggestions: string[];
  processingTime: number;
}

export interface KeywordDensityResult {
  keywords: Array<{
    keyword: string;
    count: number;
    density: number;
  }>;
  totalWords: number;
  uniqueWords: number;
  suggestions: string[];
  processingTime: number;
}

export interface SitemapResult {
  xml: string;
  urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  }>;
  totalUrls: number;
  suggestions: string[];
  processingTime: number;
}

export interface BacklinkResult {
  totalBacklinks: number;
  domains: number;
  topBacklinks: Array<{
    url: string;
    domain: string;
    anchor: string;
    dofollow: boolean;
  }>;
  suggestions: string[];
  processingTime: number;
}

export interface PageSpeedResult {
  score: number;
  metrics: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    ttfb: number;
  };
  opportunities: Array<{
    title: string;
    description: string;
    savings: string;
  }>;
  suggestions: string[];
  processingTime: number;
}

export interface ImageOptimizerResult {
  images: Array<{
    url: string;
    size: number;
    format: string;
    alt: string;
    hasAlt: boolean;
    optimizationPotential: number;
  }>;
  totalImages: number;
  totalSize: number;
  suggestions: string[];
  processingTime: number;
}

export interface RobotsResult {
  content: string;
  isValid: boolean;
  rules: Array<{
    userAgent: string;
    allow: string[];
    disallow: string[];
  }>;
  sitemaps: string[];
  suggestions: string[];
  processingTime: number;
}

export interface SchemaResult {
  jsonLd: string;
  isValid: boolean;
  type: string;
  suggestions: string[];
  processingTime: number;
}

export interface HeadingAnalysisResult {
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export interface InternalLinksResult {
  totalLinks: number;
  internalLinks: Array<{
    url: string;
    anchor: string;
    depth: number;
  }>;
  externalLinks: Array<{
    url: string;
    anchor: string;
  }>;
  brokenLinks: string[];
  suggestions: string[];
  processingTime: number;
}

// AI tool result types
export interface AiMetaGeneratorResult {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  suggestions: string[];
}

export interface AiContentOptimizerResult {
  score: number;
  keywordDensity: number;
  missingKeywords: string[];
  headingRecommendations: string[];
  contentGaps: string[];
  optimizedIntro: string;
  suggestions: string[];
  processingTime: number;
}

// User data types
export interface UserUsageStats {
  todayUsage: number;
  totalUsage: number;
  toolBreakdown: Array<{
    toolSlug: string;
    count: number;
  }>;
}

export interface UserHistory {
  history: Array<{
    id: string;
    toolSlug: string;
    result: any;
    processingMs: number;
    createdAt: Date;
  }>;
  total: number;
  hasMore: boolean;
}

export interface RateLimitInfo {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Plan types
export type Plan = "FREE" | "PRO" | "ENTERPRISE";

export interface PlanLimits {
  tools: number;
  ai: number;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    tools: 10,
    ai: 3,
  },
  PRO: {
    tools: 500,
    ai: 100,
  },
  ENTERPRISE: {
    tools: -1, // unlimited
    ai: -1,
  },
};
