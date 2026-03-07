import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return {
    title: "SEO Tools Platform - Professional SEO Analysis & Optimization",
    description:
      "Premium SaaS platform for SEO tools, webmaster tools, and AI-powered content optimization",
  };
}

export default function HomePage() {
  const tools = [
    {
      name: "Meta Tag Analyzer",
      description: "Web sitenizin meta etiketlerini analiz edin ve SEO skorunuzu öğrenin",
      icon: "🎯",
      href: "/tools/meta-analyzer",
    },
    {
      name: "Keyword Density Checker",
      description: "Anahtar kelime yoğunluğunu analiz edin ve optimize edin",
      icon: "📊",
      href: "/tools/keyword-density",
    },
    {
      name: "Sitemap Generator",
      description: "XML sitemap oluşturun ve arama motorlarına gönderin",
      icon: "🗺️",
      href: "/tools/sitemap-generator",
      comingSoon: true,
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial Gradient Glow */}
        <div
          className="absolute right-0 top-0 h-[600px] w-[600px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 212, 180, 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="container relative mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Eyebrow */}
              <div
                className="animate-fadeUp"
                style={{ animationDelay: "0ms" }}
              >
                <Badge variant="teal">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered SEO Analysis
                </Badge>
              </div>

              {/* Heading */}
              <h1
                className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight animate-fadeUp"
                style={{ animationDelay: "100ms" }}
              >
                Professional SEO Tools for{" "}
                <span className="text-accent-teal">Modern Teams</span>
              </h1>

              {/* Subtext */}
              <p
                className="text-lg text-text-secondary max-w-xl animate-fadeUp"
                style={{ animationDelay: "200ms" }}
              >
                Analyze, optimize, and dominate search rankings with our
                suite of precision-engineered SEO tools powered by Claude AI.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-4 animate-fadeUp"
                style={{ animationDelay: "300ms" }}
              >
                <Link href="/tools">
                  <Button size="lg" variant="primary">
                    Start Analyzing
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="secondary">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Trust Signals */}
              <div
                className="flex flex-wrap gap-6 pt-4 animate-fadeUp"
                style={{ animationDelay: "400ms" }}
              >
                <div className="flex items-center gap-2 text-text-secondary">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Shield className="h-5 w-5 text-accent-teal" />
                  <span className="text-sm">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Zap className="h-5 w-5 text-accent-amber" />
                  <span className="text-sm">Real-time analysis</span>
                </div>
              </div>
            </div>

            {/* Right - Tool Preview Placeholder */}
            <div
              className="animate-fadeUp"
              style={{ animationDelay: "500ms" }}
            >
              <div className="relative aspect-[4/3] rounded-lg border-2 border-dashed border-border-default bg-bg-elevated flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-6xl">🎯</div>
                  <p className="text-text-muted font-mono text-sm">
                    Tool Preview Card
                  </p>
                  <p className="text-text-muted text-xs">Phase 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-bg-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="teal" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              SEO Araçları
            </Badge>
            <h2 className="text-4xl font-display text-text-primary mb-4">
              Güçlü SEO Araçları
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Web sitenizin SEO performansını artırmak için ihtiyacınız olan tüm araçlar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tools.map((tool, index) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={tool.comingSoon ? "pointer-events-none" : ""}
              >
                <Card
                  variant="interactive"
                  className={`h-full transition-all duration-200 ${
                    tool.comingSoon ? "opacity-60" : "hover:scale-[1.02]"
                  }`}
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-5xl">{tool.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        {tool.name}
                        {tool.comingSoon && (
                          <Badge variant="amber" className="ml-2 text-xs">
                            Yakında
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {tool.description}
                      </p>
                    </div>
                    {!tool.comingSoon && (
                      <div className="flex items-center text-accent-teal text-sm font-medium">
                        Şimdi Dene
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display text-text-primary mb-4">
              Neden SEO Tools?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Profesyonel SEO analizi için ihtiyacınız olan her şey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-lg bg-accent-teal-dim flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-accent-teal" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                Hızlı Analiz
              </h3>
              <p className="text-text-secondary">
                Saniyeler içinde detaylı SEO analizi alın
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-lg bg-accent-amber/10 flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-accent-amber" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                AI Destekli
              </h3>
              <p className="text-text-secondary">
                Claude AI ile akıllı öneriler ve içerik optimizasyonu
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-lg bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                Kolay Kullanım
              </h3>
              <p className="text-text-secondary">
                Sezgisel arayüz ile hemen kullanmaya başlayın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bg-elevated">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-display text-text-primary">
              SEO Yolculuğunuza Bugün Başlayın
            </h2>
            <p className="text-lg text-text-secondary">
              Ücretsiz hesap oluşturun ve web sitenizin SEO performansını artırın
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/tools/meta-analyzer">
                <Button size="lg" variant="primary">
                  Ücretsiz Dene
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary">
                  Fiyatları Görüntüle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
