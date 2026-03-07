"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { 
  Search, 
  TrendingUp, 
  FileText, 
  Link2, 
  Image, 
  Globe,
  BarChart3,
  Zap,
  ArrowRight,
  Shield,
  Code,
  Heading,
  Link as LinkIcon
} from "lucide-react";

export function ToolsGrid() {
  const tools = [
    {
      name: "Meta Tag Analyzer",
      description: "Web sitenizin meta etiketlerini analiz edin, title ve description optimizasyonu yapın",
      icon: Search,
      href: "/tools/meta-analyzer",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      category: "On-Page SEO",
      available: true,
    },
    {
      name: "Keyword Density Checker",
      description: "Anahtar kelime yoğunluğunu analiz edin ve SEO için optimize edin",
      icon: TrendingUp,
      href: "/tools/keyword-density",
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
      category: "Keyword Tools",
      available: true,
    },
    {
      name: "Sitemap Generator",
      description: "XML sitemap oluşturun ve arama motorlarına kolayca gönderin",
      icon: FileText,
      href: "/tools/sitemap-generator",
      color: "text-success",
      bgColor: "bg-success/10",
      category: "Technical SEO",
      available: true,
    },
    {
      name: "Backlink Analyzer",
      description: "Backlink profilinizi analiz edin ve rakiplerinizle karşılaştırın",
      icon: Link2,
      href: "/tools/backlink-analyzer",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      category: "Off-Page SEO",
      available: true,
    },
    {
      name: "Image Optimizer",
      description: "Görselleri SEO için optimize edin, alt text ve boyut önerileri alın",
      icon: Image,
      href: "/tools/image-optimizer",
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
      category: "On-Page SEO",
      available: true,
    },
    {
      name: "Page Speed Analyzer",
      description: "Sayfa hızınızı analiz edin ve performans önerileri alın",
      icon: Zap,
      href: "/tools/page-speed",
      color: "text-success",
      bgColor: "bg-success/10",
      category: "Technical SEO",
      available: true,
    },
    {
      name: "Robots.txt Validator",
      description: "Robots.txt dosyanızı doğrulayın ve optimize edin",
      icon: Shield,
      href: "/tools/robots-validator",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      category: "Technical SEO",
      available: true,
    },
    {
      name: "Schema Markup Generator",
      description: "Structured data oluşturun ve zengin snippet'ler kazanın",
      icon: Code,
      href: "/tools/schema-generator",
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
      category: "On-Page SEO",
      available: true,
    },
    {
      name: "Heading Structure Analyzer",
      description: "H1-H6 başlık yapınızı analiz edin ve optimize edin",
      icon: Heading,
      href: "/tools/heading-analyzer",
      color: "text-success",
      bgColor: "bg-success/10",
      category: "On-Page SEO",
      available: true,
    },
    {
      name: "Internal Link Analyzer",
      description: "İç link yapınızı analiz edin ve SEO gücünü artırın",
      icon: LinkIcon,
      href: "/tools/internal-links",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      category: "On-Page SEO",
      available: true,
    },
    {
      name: "Competitor Analysis",
      description: "Rakiplerinizin SEO stratejilerini analiz edin ve karşılaştırın",
      icon: BarChart3,
      href: "/tools/competitor-analysis",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      category: "Analysis",
      available: false,
    },
    {
      name: "Domain Authority Checker",
      description: "Domain otoritesi ve güvenilirlik skorunu kontrol edin",
      icon: Globe,
      href: "/tools/domain-authority",
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
      category: "Analysis",
      available: false,
    },
  ];

  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="teal">
          <Zap className="h-3 w-3 mr-1" />
          SEO Araçları
        </Badge>
        <h1 className="text-4xl font-display text-text-primary">
          Tüm SEO Araçları
        </h1>
        <p className="text-lg text-text-secondary max-w-3xl">
          Web sitenizin SEO performansını artırmak için ihtiyacınız olan tüm araçlar tek bir platformda
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-teal">{tools.length}</p>
              <p className="text-sm text-text-muted mt-1">Toplam Araç</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">
                {tools.filter(t => t.available).length}
              </p>
              <p className="text-sm text-text-muted mt-1">Aktif Araç</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-amber">{categories.length}</p>
              <p className="text-sm text-text-muted mt-1">Kategori</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">∞</p>
              <p className="text-sm text-text-muted mt-1">Analiz Limiti</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools by Category */}
      {categories.map((category) => (
        <div key={category} className="space-y-6">
          <div>
            <h2 className="text-2xl font-display text-text-primary mb-2">
              {category}
            </h2>
            <div className="h-1 w-20 bg-accent-teal rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className={!tool.available ? "pointer-events-none" : ""}
                  >
                    <Card
                      variant={tool.available ? "interactive" : "default"}
                      className={`h-full transition-all duration-200 ${
                        !tool.available
                          ? "opacity-60"
                          : "hover:scale-[1.02] hover:shadow-lg"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`h-12 w-12 rounded-lg ${tool.bgColor} flex items-center justify-center`}
                          >
                            <Icon className={`h-6 w-6 ${tool.color}`} />
                          </div>
                          {!tool.available && (
                            <Badge variant="amber" className="text-xs">
                              Yakında
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      {tool.available && (
                        <CardContent>
                          <div className="flex items-center text-accent-teal text-sm font-medium">
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
      <Card className="border-accent-teal/20 bg-gradient-to-br from-accent-teal-dim to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent-teal flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-bg-base" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Daha Fazla Araç Geliyor
              </h3>
              <p className="text-text-secondary mb-4">
                Sürekli olarak yeni SEO araçları ekliyoruz. Güncellemelerden haberdar olmak için
                bültenimize abone olun.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 h-10 px-4 rounded-md border border-border-default bg-bg-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal"
                />
                <button className="h-10 px-6 rounded-md bg-accent-teal text-bg-base font-medium text-sm hover:bg-accent-teal/90 transition-colors">
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
