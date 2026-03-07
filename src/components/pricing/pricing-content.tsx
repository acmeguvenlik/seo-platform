"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export function PricingContent() {
  const t = useTranslations("pricing");

  const plans = [
    {
      name: t("free.name"),
      price: t("free.price"),
      period: t("free.period"),
      description: "Bireysel kullanıcılar ve küçük projeler için",
      icon: Zap,
      iconColor: "text-text-secondary",
      iconBg: "bg-bg-subtle",
      features: [
        "Saatte 10 analiz",
        "Temel SEO araçları",
        "Meta tag analizi",
        "Topluluk desteği",
        "Temel raporlar",
      ],
      cta: "Ücretsiz Başla",
      href: "/sign-up",
      popular: false,
      variant: "secondary" as const,
    },
    {
      name: t("pro.name"),
      price: t("pro.price"),
      period: t("pro.period"),
      description: "Profesyonel kullanıcılar ve ajanslar için",
      icon: Crown,
      iconColor: "text-accent-teal",
      iconBg: "bg-accent-teal-dim",
      features: [
        "Saatte 100 analiz",
        "Tüm SEO araçları",
        "AI destekli öneriler",
        "Öncelikli destek",
        "Detaylı raporlar",
        "API erişimi",
        "Takım işbirliği",
        "Özel entegrasyonlar",
      ],
      cta: "Pro'ya Geç",
      href: "/sign-up?plan=pro",
      popular: true,
      variant: "primary" as const,
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      period: t("enterprise.period"),
      description: "Büyük şirketler ve kurumsal çözümler",
      icon: Building2,
      iconColor: "text-accent-amber",
      iconBg: "bg-accent-amber/10",
      features: [
        "Sınırsız analiz",
        "Tüm Pro özellikler",
        "Özel AI modelleri",
        "7/24 özel destek",
        "SLA garantisi",
        "Özel eğitim",
        "Beyaz etiket çözümü",
        "Özel geliştirme",
      ],
      cta: "İletişime Geç",
      href: "/contact",
      popular: false,
      variant: "outline" as const,
    },
  ];

  const features = [
    {
      category: "Temel Özellikler",
      items: [
        { name: "Meta Tag Analizi", free: true, pro: true, enterprise: true },
        { name: "Keyword Research", free: false, pro: true, enterprise: true },
        { name: "Sitemap Generator", free: false, pro: true, enterprise: true },
        { name: "Backlink Analizi", free: false, pro: true, enterprise: true },
        { name: "Rakip Analizi", free: false, pro: true, enterprise: true },
      ],
    },
    {
      category: "AI Özellikleri",
      items: [
        { name: "AI İçerik Önerileri", free: false, pro: true, enterprise: true },
        { name: "Otomatik Meta Oluşturma", free: false, pro: true, enterprise: true },
        { name: "Özel AI Modelleri", free: false, pro: false, enterprise: true },
      ],
    },
    {
      category: "Destek & Hizmetler",
      items: [
        { name: "Topluluk Desteği", free: true, pro: true, enterprise: true },
        { name: "E-posta Desteği", free: false, pro: true, enterprise: true },
        { name: "Öncelikli Destek", free: false, pro: true, enterprise: true },
        { name: "7/24 Özel Destek", free: false, pro: false, enterprise: true },
        { name: "SLA Garantisi", free: false, pro: false, enterprise: true },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="teal" className="mb-2">
          <Zap className="h-3 w-3 mr-1" />
          Fiyatlandırma
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display text-text-primary">
          {t("title")}
        </h1>
        <p className="text-lg text-text-secondary">
          {t("description")}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card
              key={plan.name}
              variant={plan.popular ? "interactive" : "default"}
              className={`relative ${
                plan.popular
                  ? "border-accent-teal shadow-[0_0_30px_rgba(0,212,180,0.15)]"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="teal" className="shadow-lg">
                    En Popüler
                  </Badge>
                </div>
              )}
              
              <CardHeader className="space-y-4">
                <div className={`h-12 w-12 rounded-lg ${plan.iconBg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${plan.iconColor}`} />
                </div>
                
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-muted">/ {plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Link href={plan.href}>
                  <Button
                    variant={plan.variant}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent-teal flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-text-primary mb-2">
            Detaylı Karşılaştırma
          </h2>
          <p className="text-text-secondary">
            Tüm planların özelliklerini karşılaştırın
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-default">
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">
                      Özellikler
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-text-primary">
                      Free
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-text-primary">
                      Pro
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-text-primary">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`} className="bg-bg-subtle">
                        <td
                          colSpan={4}
                          className="p-4 text-sm font-semibold text-text-primary"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr
                          key={`item-${categoryIndex}-${itemIndex}`}
                          className="border-b border-border-default last:border-0"
                        >
                          <td className="p-4 text-sm text-text-secondary">
                            {item.name}
                          </td>
                          <td className="text-center p-4">
                            {item.free ? (
                              <Check className="h-5 w-5 text-accent-teal mx-auto" />
                            ) : (
                              <span className="text-text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center p-4">
                            {item.pro ? (
                              <Check className="h-5 w-5 text-accent-teal mx-auto" />
                            ) : (
                              <span className="text-text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center p-4">
                            {item.enterprise ? (
                              <Check className="h-5 w-5 text-accent-teal mx-auto" />
                            ) : (
                              <span className="text-text-muted">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-text-primary mb-2">
            Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Ücretsiz plan için kredi kartı gerekli mi?",
              a: "Hayır, ücretsiz plan için kredi kartı bilgisi gerekmez. Hemen kayıt olup kullanmaya başlayabilirsiniz.",
            },
            {
              q: "Planımı istediğim zaman değiştirebilir miyim?",
              a: "Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklikler anında geçerli olur.",
            },
            {
              q: "İptal politikanız nedir?",
              a: "İstediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar hizmetiniz devam eder.",
            },
            {
              q: "Enterprise plan için nasıl iletişime geçebilirim?",
              a: "Enterprise planı için özel fiyatlandırma ve özellikler sunuyoruz. İletişim sayfamızdan bize ulaşabilirsiniz.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
