/**
 * SEO Tools Configuration
 * Complete list of all available SEO tools with metadata
 */

export interface ToolConfig {
  slug: string;
  category: 'seo' | 'technical' | 'content' | 'social' | 'ai';
  isPremium: boolean;
  isAI: boolean;
  icon: string;
  color: 'accent' | 'success' | 'warning' | 'info';
}

export const tools: ToolConfig[] = [
  // Existing Tools
  {
    slug: 'meta-analyzer',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'Search',
    color: 'accent',
  },
  {
    slug: 'keyword-density',
    category: 'content',
    isPremium: false,
    isAI: false,
    icon: 'FileText',
    color: 'success',
  },
  {
    slug: 'image-optimizer',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Image',
    color: 'warning',
  },
  {
    slug: 'backlink-analyzer',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'Link',
    color: 'info',
  },
  {
    slug: 'page-speed',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Zap',
    color: 'accent',
  },
  {
    slug: 'heading-analyzer',
    category: 'content',
    isPremium: false,
    isAI: false,
    icon: 'Heading',
    color: 'success',
  },
  {
    slug: 'internal-links',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'Link2',
    color: 'info',
  },
  {
    slug: 'robots-generator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'FileCode',
    color: 'warning',
  },
  {
    slug: 'robots-validator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'CheckCircle',
    color: 'success',
  },
  {
    slug: 'schema-generator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Code',
    color: 'accent',
  },
  {
    slug: 'sitemap-generator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Map',
    color: 'info',
  },
  
  // AI Tools
  {
    slug: 'ai-meta-generator',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'Sparkles',
    color: 'accent',
  },
  {
    slug: 'ai-content-optimizer',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'Wand2',
    color: 'success',
  },
  {
    slug: 'ai-seo-audit',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'Search',
    color: 'accent',
  },
  {
    slug: 'ai-title-generator',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'Heading',
    color: 'info',
  },
  {
    slug: 'ai-blog-outline',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'FileText',
    color: 'success',
  },
  {
    slug: 'ai-content-ideas',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'Lightbulb',
    color: 'warning',
  },
  {
    slug: 'ai-keyword-suggestions',
    category: 'ai',
    isPremium: false,
    isAI: true,
    icon: 'Key',
    color: 'accent',
  },

  // New Tools (20+)
  {
    slug: 'url-slug-generator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Link',
    color: 'accent',
  },
  {
    slug: 'redirect-checker',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'ArrowRight',
    color: 'warning',
  },
  {
    slug: 'broken-link-checker',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'AlertCircle',
    color: 'warning',
  },
  {
    slug: 'canonical-checker',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'Copy',
    color: 'info',
  },
  {
    slug: 'hreflang-validator',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'Globe',
    color: 'accent',
  },
  {
    slug: 'open-graph-checker',
    category: 'social',
    isPremium: false,
    isAI: false,
    icon: 'Share2',
    color: 'success',
  },
  {
    slug: 'twitter-card-validator',
    category: 'social',
    isPremium: false,
    isAI: false,
    icon: 'Twitter',
    color: 'info',
  },
  {
    slug: 'structured-data-validator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Database',
    color: 'accent',
  },
  {
    slug: 'mobile-friendly-test',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Smartphone',
    color: 'success',
  },
  {
    slug: 'ssl-checker',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Lock',
    color: 'success',
  },
  {
    slug: 'domain-authority-checker',
    category: 'seo',
    isPremium: true,
    isAI: false,
    icon: 'TrendingUp',
    color: 'accent',
  },
  {
    slug: 'competitor-analysis',
    category: 'seo',
    isPremium: true,
    isAI: false,
    icon: 'Users',
    color: 'warning',
  },
  {
    slug: 'keyword-research',
    category: 'content',
    isPremium: true,
    isAI: false,
    icon: 'Search',
    color: 'accent',
  },
  {
    slug: 'serp-preview',
    category: 'seo',
    isPremium: false,
    isAI: false,
    icon: 'Eye',
    color: 'info',
  },
  {
    slug: 'readability-analyzer',
    category: 'content',
    isPremium: false,
    isAI: false,
    icon: 'BookOpen',
    color: 'success',
  },
  {
    slug: 'duplicate-content-checker',
    category: 'content',
    isPremium: true,
    isAI: false,
    icon: 'Copy',
    color: 'warning',
  },
  {
    slug: 'xml-sitemap-validator',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'FileCheck',
    color: 'success',
  },
  {
    slug: 'robots-analyzer',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Bot',
    color: 'info',
  },
  {
    slug: 'http-header-checker',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Server',
    color: 'accent',
  },
  {
    slug: 'website-speed-test',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Gauge',
    color: 'warning',
  },
  {
    slug: 'core-web-vitals',
    category: 'technical',
    isPremium: false,
    isAI: false,
    icon: 'Activity',
    color: 'accent',
  },
  {
    slug: 'social-share-counter',
    category: 'social',
    isPremium: false,
    isAI: false,
    icon: 'Share',
    color: 'success',
  },
];

export const toolCategories = {
  seo: 'SEO Analysis',
  technical: 'Technical SEO',
  content: 'Content Analysis',
  social: 'Social Media',
  ai: 'AI-Powered',
} as const;

export function getToolsByCategory(category: keyof typeof toolCategories) {
  return tools.filter(tool => tool.category === category);
}

export function getToolBySlug(slug: string) {
  return tools.find(tool => tool.slug === slug);
}

export function getFreeTools() {
  return tools.filter(tool => !tool.isPremium);
}

export function getPremiumTools() {
  return tools.filter(tool => tool.isPremium);
}

export function getAITools() {
  return tools.filter(tool => tool.isAI);
}
