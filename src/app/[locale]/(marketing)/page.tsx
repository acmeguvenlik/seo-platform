import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { WebApplicationSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld";
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Search,
  BarChart3,
  Globe,
  FileText,
  Image as ImageIcon,
  Link2,
  Code,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Star
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return {
    title: "Ücretsiz SEO Araçları | Meta Tag, Anahtar Kelime, Sitemap Analizi - SEO Tools",
    description:
      "30+ ücretsiz SEO aracı ile web sitenizi analiz edin. Meta tag analizi, anahtar kelime yoğunluğu, sitemap oluşturucu, backlink analizi ve AI destekli içerik optimizasyonu. Kayıt gerektirmez!",
    keywords: "seo araçları, meta tag analizi, anahtar kelime analizi, sitemap generator, backlink checker, seo analiz, ücretsiz seo tools",
    openGraph: {
      title: "Ücretsiz SEO Araçları - Profesyonel Web Sitesi Analizi",
      description: "30+ ücretsiz SEO aracı ile web sitenizin performansını artırın. AI destekli analiz ve öneriler.",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: "Ücretsiz SEO Araçları - SEO Tools",
      description: "30+ ücretsiz SEO aracı ile web sitenizi optimize edin",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'tr': '/tr',
        'de': '/de',
        'es': '/es',
        'fr': '/fr',
      },
    },
  };
}

export default function HomePage() {
  const seoTools = [
    {
      name: "Meta Tag Analyzer",
      description: "Title, description ve Open Graph etiketlerinizi analiz edin. SEO skorunuzu öğrenin ve eksiklikleri tespit edin.",
      icon: Search,
      href: "/tools/meta-analyzer",
      color: "teal",
      features: ["Title analizi", "Meta description", "OG tags", "Twitter cards"]
    },
    {
      name: "Keyword Density Checker",
      description: "Anahtar kelime yoğunluğunu ölçün ve içeriğinizi SEO için optimize edin. İdeal %2-3 yoğunluk kontrolü.",
      icon: BarChart3,
      href: "/tools/keyword-density",
      color: "amber",
      features: ["Kelime sayısı", "Yoğunluk analizi", "Öneriler", "Raporlama"]
    },
    {
      name: "Sitemap Generator",
      description: "XML sitemap oluşturun ve arama motorlarına gönderin. Otomatik URL keşfi ve önceliklendirme.",
      icon: Globe,
      href: "/tools/sitemap-generator",
      color: "blue",
      features: ["XML sitemap", "URL keşfi", "Önceliklendirme", "İndirme"]
    },
    {
      name: "Backlink Analyzer",
      description: "Backlink profilinizi analiz edin. Dofollow/nofollow oranı, domain authority ve link kalitesi kontrolü.",
      icon: Link2,
      href: "/tools/backlink-analyzer",
      color: "purple",
      features: ["Link profili", "Domain authority", "Anchor text", "Link kalitesi"]
    },
    {
      name: "Image Optimizer",
      description: "Görsellerin alt text, boyut ve format optimizasyonunu kontrol edin. Lazy loading ve performans analizi.",
      icon: ImageIcon,
      href: "/tools/image-optimizer",
      color: "green",
      features: ["Alt text", "Boyut analizi", "Format kontrolü", "Lazy loading"]
    },
    {
      name: "Page Speed Analyzer",
      description: "Sayfa hızını ölçün ve Core Web Vitals skorlarını öğrenin. LCP, FID, CLS metrikleri ve optimizasyon önerileri.",
      icon: Zap,
      href: "/tools/page-speed",
      color: "orange",
      features: ["Core Web Vitals", "LCP/FID/CLS", "Performans skoru", "Optimizasyon"]
    },
    {
      name: "Robots.txt Validator",
      description: "Robots.txt dosyanızı doğrulayın ve arama motoru botlarının erişimini kontrol edin.",
      icon: Shield,
      href: "/tools/robots-validator",
      color: "red",
      features: ["Syntax kontrolü", "Bot erişimi", "Sitemap referansı", "Hata tespiti"]
    },
    {
      name: "Schema Markup Generator",
      description: "Structured data oluşturun ve zengin snippet'ler için schema markup ekleyin. JSON-LD formatı.",
      icon: Code,
      href: "/tools/schema-generator",
      color: "indigo",
      features: ["JSON-LD", "Rich snippets", "Schema types", "Validation"]
    },
    {
      name: "Heading Structure Analyzer",
      description: "H1-H6 başlık hiyerarşinizi analiz edin. SEO dostu başlık yapısı ve içerik organizasyonu kontrolü.",
      icon: FileText,
      href: "/tools/heading-analyzer",
      color: "pink",
      features: ["H1-H6 analizi", "Hiyerarşi kontrolü", "Başlık sayısı", "Optimizasyon"]
    },
    {
      name: "Internal Link Analyzer",
      description: "İç link yapınızı analiz edin. Anchor text, link dağılımı ve sayfa otoritesi aktarımı kontrolü.",
      icon: Link2,
      href: "/tools/internal-links",
      color: "cyan",
      features: ["Link yapısı", "Anchor text", "Link dağılımı", "Optimizasyon"]
    },
  ];

  const stats = [
    { value: "2.4M+", label: "Analiz Yapıldı", icon: BarChart3 },
    { value: "30+", label: "SEO Aracı", icon: Zap },
    { value: "5", label: "Dil Desteği", icon: Globe },
    { value: "<200ms", label: "Ortalama Yanıt", icon: Clock },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Destekli Analiz",
      description: "Claude AI ile akıllı içerik önerileri, meta tag oluşturma ve SEO optimizasyonu. Yapay zeka destekli detaylı raporlar."
    },
    {
      icon: Zap,
      title: "Gerçek Zamanlı Sonuçlar",
      description: "Saniyeler içinde detaylı SEO analizi. Hızlı ve güvenilir sonuçlar için optimize edilmiş altyapı."
    },
    {
      icon: Shield,
      title: "Güvenli ve Gizli",
      description: "Verileriniz şifrelenir ve saklanmaz. GDPR uyumlu, güvenli analiz platformu."
    },
    {
      icon: TrendingUp,
      title: "Detaylı Raporlama",
      description: "Kapsamlı SEO raporları, görselleştirmeler ve actionable öneriler. PDF export desteği."
    },
    {
      icon: Users,
      title: "Çoklu Dil Desteği",
      description: "Türkçe, İngilizce, Almanca, İspanyolca ve Fransızca arayüz desteği."
    },
    {
      icon: CheckCircle2,
      title: "Kayıt Gerektirmez",
      description: "Temel araçları ücretsiz kullanın. Kayıt olmadan hemen analiz yapmaya başlayın."
    },
  ];

  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      <WebApplicationSchema url={process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com"} />
      <FAQSchema
        faqs={[
          {
            question: "SEO araçları ücretsiz mi?",
            answer: "Evet, temel SEO araçlarımız tamamen ücretsiz. Kayıt olmadan kullanabilirsiniz. Pro plan ile daha fazla özellik ve yüksek kullanım limitleri elde edebilirsiniz.",
          },
          {
            question: "Hangi SEO araçları mevcut?",
            answer: "Meta tag analizi, anahtar kelime yoğunluğu, sitemap oluşturucu, backlink analizi, sayfa hızı testi, görsel optimizasyonu, robots.txt validator ve daha fazlası. Toplam 30+ araç.",
          },
          {
            question: "AI destekli özellikler nelerdir?",
            answer: "Claude AI ile meta tag oluşturma, içerik optimizasyonu, SEO önerileri ve otomatik raporlama. AI araçları Pro plan ile kullanılabilir.",
          },
          {
            question: "Verilerim güvende mi?",
            answer: "Evet, tüm veriler şifrelenir ve saklanmaz. GDPR uyumlu güvenli platform. Analiz sonuçları sadece sizinle paylaşılır.",
          },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: process.env.NEXT_PUBLIC_APP_URL || "https://seotools.com" },
        ]}
      />
      
      {/* Hero Section - SEO Optimized */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-bg-base via-bg-base to-bg-elevated">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Gradient Glows */}
        <div
          className="absolute right-0 top-0 h-[600px] w-[600px] opacity-20 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0, 212, 180, 0.4) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />

        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Eyebrow */}
            <div className="animate-fadeUp" style={{ animationDelay: "0ms" }}>
              <Badge variant="teal" className="text-sm px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                30+ Ücretsiz SEO Aracı - Kayıt Gerektirmez
              </Badge>
            </div>

            {/* Main Heading - SEO Optimized H1 */}
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight animate-fadeUp"
              style={{ animationDelay: "100ms" }}
            >
              Profesyonel{" "}
              <span className="bg-gradient-to-r from-accent-teal via-accent-teal to-accent-amber bg-clip-text text-transparent">
                SEO Araçları
              </span>
              {" "}ile Web Sitenizi Optimize Edin
            </h1>

            {/* Subheading - SEO Rich Description */}
            <p
              className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto animate-fadeUp leading-relaxed"
              style={{ animationDelay: "200ms" }}
            >
              Meta tag analizi, anahtar kelime yoğunluğu, sitemap oluşturucu, backlink checker ve 30+ SEO aracı. 
              AI destekli analiz ve önerilerle arama motoru sıralamanızı yükseltin.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 justify-center animate-fadeUp"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="/tools/meta-analyzer">
                <Button size="lg" variant="primary" className="group text-lg px-8 py-6">
                  Ücretsiz Analiz Başlat
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Tüm Araçları Gör
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div
              className="flex flex-wrap gap-8 justify-center pt-8 animate-fadeUp"
              style={{ animationDelay: "400ms" }}
            >
              <div className="flex items-center gap-2 text-text-secondary">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Kayıt Gerektirmez</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Shield className="h-5 w-5 text-accent-teal" />
                <span className="text-sm font-medium">GDPR Uyumlu</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Zap className="h-5 w-5 text-accent-amber" />
                <span className="text-sm font-medium">Gerçek Zamanlı Sonuçlar</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Star className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">4.8/5 Kullanıcı Puanı</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-bg-elevated border-y border-border-default">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-accent-teal" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-text-primary font-mono">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Tools Grid - Main Content */}
      <section className="py-20 bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge variant="teal" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Tüm SEO Araçları
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-6">
              30+ Profesyonel SEO Aracı
            </h2>
            <p className="text-lg text-text-secondary">
              Web sitenizin SEO performansını artırmak için ihtiyacınız olan tüm araçlar tek platformda. 
              Ücretsiz başlayın, kayıt gerektirmez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {seoTools.map((tool, index) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group"
              >
                <Card className="h-full border-2 border-border-default hover:border-accent-teal/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-teal/10 hover:-translate-y-1">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`h-12 w-12 rounded-lg bg-${tool.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-6 w-6 text-accent-teal" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-accent-teal group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent-teal transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="default" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/tools">
              <Button size="lg" variant="secondary" className="group">
                Tüm Araçları Keşfet
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-6">
              Neden SEO Tools Platformu?
            </h2>
            <p className="text-lg text-text-secondary">
              Profesyonel SEO analizi için ihtiyacınız olan her şey. Hızlı, güvenilir ve kullanımı kolay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="space-y-4 p-6 rounded-xl border border-border-default hover:border-accent-teal/30 transition-all hover:shadow-lg bg-bg-base">
                <div className="h-14 w-14 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-accent-teal" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section - For Search Engines */}
      <section className="py-20 bg-bg-base">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-display text-text-primary mb-6">
              SEO Araçları Nedir ve Neden Önemlidir?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              SEO (Search Engine Optimization) araçları, web sitenizin arama motorlarında daha iyi sıralanmasını sağlayan 
              profesyonel analiz ve optimizasyon araçlarıdır. Meta tag analizi, anahtar kelime yoğunluğu kontrolü, 
              sitemap oluşturma, backlink analizi gibi kritik SEO işlemlerini kolaylaştırır.
            </p>

            <h3 className="text-2xl font-display text-text-primary mb-4 mt-8">
              En Popüler SEO Araçları
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li><strong>Meta Tag Analyzer:</strong> Title, description ve Open Graph etiketlerinizi analiz eder</li>
              <li><strong>Keyword Density Checker:</strong> Anahtar kelime yoğunluğunu ölçer ve optimize eder</li>
              <li><strong>Sitemap Generator:</strong> XML sitemap oluşturur ve arama motorlarına gönderir</li>
              <li><strong>Backlink Analyzer:</strong> Backlink profilinizi analiz eder ve link kalitesini değerlendirir</li>
              <li><strong>Page Speed Analyzer:</strong> Sayfa hızını ölçer ve Core Web Vitals skorlarını gösterir</li>
            </ul>

            <h3 className="text-2xl font-display text-text-primary mb-4 mt-8">
              SEO Araçları Nasıl Kullanılır?
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              SEO araçlarını kullanmak çok basittir. Web sitenizin URL'sini girin, analiz butonuna tıklayın ve 
              saniyeler içinde detaylı SEO raporunuzu alın. Raporlar, sorunları, önerileri ve optimizasyon 
              fırsatlarını içerir. AI destekli öneriler ile içeriğinizi daha da geliştirebilirsiniz.
            </p>
          </article>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent-teal-dim via-bg-elevated to-accent-amber/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-display text-text-primary">
              SEO Yolculuğunuza Bugün Başlayın
            </h2>
            <p className="text-xl text-text-secondary">
              Ücretsiz hesap oluşturun ve web sitenizin SEO performansını artırın. 
              30+ profesyonel araca anında erişim.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/tools/meta-analyzer">
                <Button size="lg" variant="primary" className="text-lg px-8 py-6 group">
                  Ücretsiz Başla
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Fiyatları Görüntüle
                </Button>
              </Link>
            </div>
            <p className="text-sm text-text-muted">
              Kredi kartı gerektirmez • 5 dakikada kurulum • 24/7 destek
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
