import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Search, FileText, TrendingUp, Zap, Code } from "lucide-react";
import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Dokümantasyon - SEO Tools Platform",
  description: "SEO Tools Platform kullanım kılavuzu ve API dokümantasyonu",
};

export default function DocsPage() {
  const sections = [
    {
      title: "Başlangıç",
      icon: Book,
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      items: [
        { title: "Hızlı Başlangıç", href: "#quick-start" },
        { title: "Hesap Oluşturma", href: "#account" },
        { title: "İlk Analiziniz", href: "#first-analysis" },
        { title: "Planlar ve Fiyatlandırma", href: "#pricing" },
      ],
    },
    {
      title: "SEO Araçları",
      icon: Search,
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
      items: [
        { title: "Meta Tag Analyzer", href: "#meta-analyzer" },
        { title: "Keyword Density Checker", href: "#keyword-density" },
        { title: "AI Meta Generator", href: "#ai-generator" },
        { title: "Tüm Araçlar", href: "/tools" },
      ],
    },
    {
      title: "API Dokümantasyonu",
      icon: Code,
      color: "text-success",
      bgColor: "bg-success/10",
      items: [
        { title: "API Anahtarı Alma", href: "#api-key" },
        { title: "Authentication", href: "#auth" },
        { title: "Rate Limiting", href: "#rate-limit" },
        { title: "API Endpoints", href: "#endpoints" },
      ],
    },
    {
      title: "En İyi Uygulamalar",
      icon: TrendingUp,
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
      items: [
        { title: "SEO Temelleri", href: "#seo-basics" },
        { title: "Meta Tag Optimizasyonu", href: "#meta-optimization" },
        { title: "Keyword Stratejisi", href: "#keyword-strategy" },
        { title: "İçerik Optimizasyonu", href: "#content-optimization" },
      ],
    },
  ];

  const guides = [
    {
      title: "Meta Tag Analyzer Kullanımı",
      description: "Web sitenizin meta etiketlerini nasıl analiz edeceğinizi öğrenin",
      icon: Search,
      href: "#meta-analyzer",
    },
    {
      title: "Keyword Density Optimizasyonu",
      description: "Anahtar kelime yoğunluğunu optimize etme rehberi",
      icon: FileText,
      href: "#keyword-density",
    },
    {
      title: "AI ile Meta Tag Oluşturma",
      description: "Claude AI kullanarak otomatik meta tag oluşturun",
      icon: Zap,
      href: "#ai-generator",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="teal">
            <Book className="h-3 w-3 mr-1" />
            Dokümantasyon
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display text-text-primary">
            Kullanım Kılavuzu
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            SEO Tools Platform'u kullanmaya başlamak için ihtiyacınız olan her şey
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Dokümantasyonda ara..."
                className="w-full h-12 pl-10 pr-4 rounded-md border border-border-default bg-bg-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-teal"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Guides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display text-text-primary">
            Hızlı Başlangıç Rehberleri
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <a key={index} href={guide.href}>
                  <Card variant="interactive" className="h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-accent-teal" />
                      </div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a
                          href={item.href}
                          className="text-sm text-text-secondary hover:text-accent-teal transition-colors flex items-center gap-2"
                        >
                          <span className="text-accent-teal">→</span>
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Guides */}
        <div className="space-y-8">
          <h2 className="text-2xl font-display text-text-primary">
            Detaylı Rehberler
          </h2>

          {/* Meta Analyzer Guide */}
          <Card id="meta-analyzer">
            <CardHeader>
              <CardTitle className="text-xl">Meta Tag Analyzer Kullanımı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">1. URL Girin</h4>
                <p className="text-sm text-text-secondary">
                  Analiz etmek istediğiniz web sayfasının URL'sini girin. URL'nin tam olması gerekir (https:// ile başlamalı).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">2. Analiz Sonuçlarını İnceleyin</h4>
                <p className="text-sm text-text-secondary">
                  SEO skoru, title tag, meta description, Open Graph ve Twitter Card etiketlerini kontrol edin.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">3. AI Önerileri Alın</h4>
                <p className="text-sm text-text-secondary">
                  "AI Önerileri Al" butonuna tıklayarak Claude AI'dan optimize edilmiş meta tag önerileri alın.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Density Guide */}
          <Card id="keyword-density">
            <CardHeader>
              <CardTitle className="text-xl">Keyword Density Checker Kullanımı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">İdeal Yoğunluk</h4>
                <p className="text-sm text-text-secondary">
                  Anahtar kelime yoğunluğu %2-3 arasında olmalıdır. Çok düşük veya çok yüksek yoğunluk SEO'ya zarar verebilir.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Keyword Stuffing'den Kaçının</h4>
                <p className="text-sm text-text-secondary">
                  Aynı anahtar kelimeyi çok sık kullanmak (keyword stuffing) arama motorları tarafından cezalandırılabilir.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Need Help */}
        <Card className="border-accent-teal/20 bg-gradient-to-br from-accent-teal-dim to-transparent">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-display text-text-primary">
              Yardıma mı İhtiyacınız Var?
            </h3>
            <p className="text-text-secondary max-w-xl mx-auto">
              Dokümantasyonda aradığınızı bulamadınız mı? Destek ekibimiz size yardımcı olmaktan mutluluk duyar.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact">
                <button className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-accent-teal text-bg-base font-medium text-sm hover:bg-accent-teal/90 transition-colors">
                  İletişime Geç
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
