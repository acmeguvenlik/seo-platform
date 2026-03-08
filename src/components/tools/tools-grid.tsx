"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { 
  Search, TrendingUp, FileText, Link2, Image, Globe, BarChart3, Zap, ArrowRight,
  Shield, Code, Heading, Link as LinkIcon, Sparkles, Wand2, Copy, Eye, BookOpen,
  Smartphone, Lock, Users, FileCheck, Bot, Server, Activity, Share, Twitter,
  Share2, Database, Gauge, AlertCircle, CheckCircle, Map, Lightbulb, Key
} from "lucide-react";
import { tools as toolsConfig } from "@/config/tools";
import { theme, cn } from "@/lib/theme-classes";

const iconMap: Record<string, any> = {
  Search, TrendingUp, FileText, Link2, Image, Globe, BarChart3, Zap, Shield, Code,
  Heading, Link: LinkIcon, Sparkles, Wand2, Copy, Eye, BookOpen, Smartphone, Lock,
  Users, FileCheck, Bot, Server, Activity, Share, Twitter, Share2, Database, Gauge,
  AlertCircle, CheckCircle, Map, ArrowRight: ArrowRight, Lightbulb, Key,
};

export function ToolsGrid() {
  const tools = toolsConfig.map(tool => ({
    name: tool.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: tool.slug,
    description: getToolDescription(tool.slug),
    icon: iconMap[tool.icon] || Search,
    href: `/tools/${tool.slug}`,
    color: tool.color,
    category: getCategoryName(tool.category),
    available: !tool.isPremium, // Free tools are available
    badge: tool.isAI ? 'AI' : tool.isPremium ? 'PRO' : undefined,
  }));

  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  return (
    <div className={theme.spacing.section}>
      {/* Header */}
      <div className={cn(theme.spacing.stack, "fade-up")} style={{ "--index": 0 } as React.CSSProperties}>
        <Badge variant="teal">
          <Zap className="h-3 w-3 mr-1" />
          SEO Araçları
        </Badge>
        <h1 className={theme.text.title}>
          Tüm SEO Araçları
        </h1>
        <p className={cn(theme.text.body, theme.text.secondary, "max-w-3xl")}>
          Web sitenizin SEO performansını artırmak için ihtiyacınız olan tüm araçlar tek bir platformda
        </p>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", "fade-up")} style={{ "--index": 1 } as React.CSSProperties}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className={cn(theme.stat.value, theme.text.accent)}>{tools.length}</p>
              <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>Toplam Araç</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className={cn(theme.stat.value, theme.text.success)}>
                {tools.filter(t => t.available).length}
              </p>
              <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>Ücretsiz Araç</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className={cn(theme.stat.value, theme.text.warning)}>{categories.length}</p>
              <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>Kategori</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className={cn(theme.stat.value, theme.text.primary)}>∞</p>
              <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>Analiz Limiti</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools by Category */}
      {categories.map((category, catIndex) => (
        <div key={category} className={cn(theme.spacing.stack, "fade-up")} style={{ "--index": catIndex + 2 } as React.CSSProperties}>
          <div>
            <h2 className={cn(theme.text.heading, "text-2xl mb-2")}>
              {category}
            </h2>
            <div className="h-1 w-20 bg-[var(--accent-teal)] rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => {
                const Icon = tool.icon;
                const colorClasses = {
                  accent: "text-[var(--accent-teal)] bg-[var(--accent-teal-dim)]",
                  success: "text-[var(--success)] bg-[rgba(16,185,129,0.1)]",
                  warning: "text-[var(--accent-amber)] bg-[var(--accent-amber-dim)]",
                  info: "text-[var(--info)] bg-[rgba(59,130,246,0.1)]",
                };

                return (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className={!tool.available ? "pointer-events-none" : ""}
                  >
                    <Card
                      variant={tool.available ? "interactive" : "default"}
                      className={cn(
                        "h-full transition-all duration-200",
                        !tool.available ? "opacity-60" : "hover:scale-[1.02] hover:shadow-lg"
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", colorClasses[tool.color])}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex gap-2">
                            {tool.badge === 'AI' && (
                              <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                                AI
                              </Badge>
                            )}
                            {tool.badge === 'PRO' && (
                              <Badge variant="amber" className="text-xs">
                                PRO
                              </Badge>
                            )}
                            {!tool.available && (
                              <Badge variant="amber" className="text-xs">
                                Yakında
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-xl">{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      {tool.available && (
                        <CardContent>
                          <div className={cn("flex items-center text-sm font-medium", theme.text.accent)}>
                            Şimdi Kullan
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}

      {/* Coming Soon Notice */}
      <Card className={cn("border-[var(--accent-teal)]/20 bg-gradient-to-br from-[var(--accent-teal-dim)] to-transparent", "fade-up")} style={{ "--index": categories.length + 2 } as React.CSSProperties}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--accent-teal)] flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-[#080C0F]" />
            </div>
            <div className="flex-1">
              <h3 className={cn(theme.text.heading, "mb-2")}>
                Daha Fazla Araç Geliyor
              </h3>
              <p className={cn(theme.text.secondary, "mb-4")}>
                Sürekli olarak yeni SEO araçları ekliyoruz. Güncellemelerden haberdar olmak için
                bültenimize abone olun.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className={cn(theme.input.base, "flex-1")}
                />
                <button className={cn(theme.button.primary, "px-6")}>
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    seo: 'SEO Analizi',
    technical: 'Teknik SEO',
    content: 'İçerik Analizi',
    social: 'Sosyal Medya',
    ai: 'AI Araçları',
  };
  return names[category] || category;
}

function getToolDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    'meta-analyzer': 'Web sitenizin meta etiketlerini analiz edin',
    'keyword-density': 'Anahtar kelime yoğunluğunu kontrol edin',
    'image-optimizer': 'Görselleri SEO için optimize edin',
    'backlink-analyzer': 'Backlink profilinizi analiz edin',
    'page-speed': 'Sayfa hızınızı test edin',
    'heading-analyzer': 'Başlık yapınızı kontrol edin',
    'internal-links': 'İç link yapınızı analiz edin',
    'robots-generator': 'Robots.txt dosyası oluşturun',
    'robots-validator': 'Robots.txt dosyanızı doğrulayın',
    'schema-generator': 'Structured data oluşturun',
    'sitemap-generator': 'XML sitemap oluşturun',
    'ai-meta-generator': 'AI ile meta tag oluşturun',
    'ai-content-optimizer': 'AI ile içerik optimize edin',
    'ai-seo-audit': 'AI ile kapsamlı SEO denetimi yapın',
    'ai-title-generator': 'AI ile başlık önerileri alın',
    'ai-blog-outline': 'AI ile blog yazısı taslağı oluşturun',
    'ai-content-ideas': 'AI ile içerik fikirleri üretin',
    'ai-keyword-suggestions': 'AI ile anahtar kelime önerileri alın',
    'url-slug-generator': 'SEO dostu URL slug oluşturun',
    'redirect-checker': 'Redirect zincirlerini kontrol edin',
    'broken-link-checker': 'Kırık linkleri tespit edin',
    'canonical-checker': 'Canonical tag\'leri doğrulayın',
    'hreflang-validator': 'Hreflang tag\'leri kontrol edin',
    'open-graph-checker': 'Open Graph tag\'leri doğrulayın',
    'twitter-card-validator': 'Twitter Card tag\'leri kontrol edin',
    'structured-data-validator': 'Structured data doğrulayın',
    'mobile-friendly-test': 'Mobil uyumluluğu test edin',
    'ssl-checker': 'SSL sertifikasını kontrol edin',
    'domain-authority-checker': 'Domain otoritesini ölçün',
    'competitor-analysis': 'Rakip analizi yapın',
    'keyword-research': 'Anahtar kelime araştırması yapın',
    'serp-preview': 'SERP görünümünü önizleyin',
    'readability-analyzer': 'İçerik okunabilirliğini analiz edin',
    'duplicate-content-checker': 'Kopya içerik tespit edin',
    'xml-sitemap-validator': 'XML sitemap doğrulayın',
    'robots-analyzer': 'Robots.txt analiz edin',
    'http-header-checker': 'HTTP header\'ları kontrol edin',
    'website-speed-test': 'Website hızını test edin',
    'core-web-vitals': 'Core Web Vitals ölçün',
    'social-share-counter': 'Sosyal paylaşım sayılarını görün',
  };
  return descriptions[slug] || 'SEO aracı';
}
