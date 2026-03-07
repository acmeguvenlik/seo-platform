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
        {/* Animated Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 180, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 180, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            animation: "gridMove 20s linear infinite",
          }}
        />

        {/* Multiple Gradient Glows */}
        <div
          className="absolute right-0 top-0 h-[800px] w-[800px] opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 212, 180, 0.3) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-0 bottom-0 h-[600px] w-[600px] opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />

        <div className="container relative mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Eyebrow with pulse animation */}
              <div
                className="animate-fadeUp"
                style={{ animationDelay: "0ms" }}
              >
                <Badge variant="teal" className="animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered SEO Analysis
                </Badge>
              </div>

              {/* Heading with gradient */}
              <h1
                className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight animate-fadeUp"
                style={{ animationDelay: "100ms" }}
              >
                Professional SEO Tools for{" "}
                <span className="bg-gradient-to-r from-accent-teal to-accent-amber bg-clip-text text-transparent">
                  Modern Teams
                </span>
              </h1>

              {/* Subtext */}
              <p
                className="text-lg text-text-secondary max-w-xl animate-fadeUp leading-relaxed"
                style={{ animationDelay: "200ms" }}
              >
                Analyze, optimize, and dominate search rankings with our
                suite of precision-engineered SEO tools powered by Claude AI.
              </p>

              {/* CTAs with hover effects */}
              <div
                className="flex flex-wrap gap-4 animate-fadeUp"
                style={{ animationDelay: "300ms" }}
              >
                <Link href="/tools">
                  <Button size="lg" variant="primary" className="group">
                    Start Analyzing
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Trust Signals with icons */}
              <div
                className="flex flex-wrap gap-6 pt-4 animate-fadeUp"
                style={{ animationDelay: "400ms" }}
              >
                <div className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                  <div className="h-8 w-8 rounded-full bg-accent-teal-dim flex items-center justify-center">
                    <Shield className="h-4 w-4 text-accent-teal" />
                  </div>
                  <span className="text-sm font-medium">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                  <div className="h-8 w-8 rounded-full bg-accent-amber/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-accent-amber" />
                  </div>
                  <span className="text-sm font-medium">Real-time analysis</span>
                </div>
              </div>
            </div>

            {/* Right - Animated Tool Preview */}
            <div
              className="animate-fadeUp"
              style={{ animationDelay: "500ms" }}
            >
              <div className="relative aspect-[4/3] rounded-2xl border border-border-default bg-gradient-to-br from-bg-elevated to-bg-subtle flex items-center justify-center overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-teal via-accent-amber to-accent-teal opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                     style={{ animation: "gradientShift 3s ease infinite" }} />
                
                <div className="text-center space-y-4 z-10">
                  <div className="text-7xl animate-bounce">🎯</div>
                  <p className="text-text-primary font-semibold text-lg">
                    Interactive Tool Preview
                  </p>
                  <p className="text-text-muted text-sm">
                    Coming in Phase 2
                  </p>
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
