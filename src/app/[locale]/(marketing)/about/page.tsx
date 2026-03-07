import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Users, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Hakkımızda - SEO Tools Platform",
  description: "SEO Tools Platform hakkında bilgi edinin",
};

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Hız ve Performans",
      description: "En hızlı SEO analiz araçlarını sunuyoruz. Saniyeler içinde sonuç alın.",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
    },
    {
      icon: Target,
      title: "Doğruluk",
      description: "AI destekli analizlerimiz ile en doğru ve güncel SEO önerilerini alın.",
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
    },
    {
      icon: Users,
      title: "Kullanıcı Odaklı",
      description: "Kullanıcı deneyimini ön planda tutarak sezgisel araçlar geliştiriyoruz.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: TrendingUp,
      title: "Sürekli Gelişim",
      description: "Her gün yeni özellikler ekliyor ve mevcut araçları geliştiriyoruz.",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
    },
  ];

  const stats = [
    { label: "Aktif Kullanıcı", value: "10,000+" },
    { label: "Günlük Analiz", value: "50,000+" },
    { label: "Desteklenen Dil", value: "5" },
    { label: "Müşteri Memnuniyeti", value: "98%" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="teal">
            <Zap className="h-3 w-3 mr-1" />
            Hakkımızda
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display text-text-primary">
            SEO'yu Herkes İçin Erişilebilir Kılıyoruz
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            SEO Tools Platform, web sitelerinin arama motoru performansını artırmak için 
            profesyonel araçlar sunan modern bir SaaS platformudur.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-accent-teal mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="space-y-6">
          <h2 className="text-3xl font-display text-text-primary">Misyonumuz</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-text-secondary leading-relaxed">
                SEO Tools Platform olarak misyonumuz, her büyüklükteki işletmenin web sitelerini 
                arama motorları için optimize etmesini kolaylaştırmaktır. Karmaşık SEO süreçlerini 
                basitleştirerek, herkesin profesyonel düzeyde SEO analizi yapabilmesini sağlıyoruz.
              </p>
              <p className="text-text-secondary leading-relaxed mt-4">
                AI destekli araçlarımız ve kullanıcı dostu arayüzümüz ile SEO'yu daha erişilebilir, 
                daha hızlı ve daha etkili hale getiriyoruz. Sürekli gelişen teknolojimiz sayesinde, 
                kullanıcılarımıza her zaman en güncel ve en doğru SEO önerilerini sunuyoruz.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="space-y-6">
          <h2 className="text-3xl font-display text-text-primary">Değerlerimiz</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-3">
                    <div className={`h-12 w-12 rounded-lg ${value.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      {value.title}
                    </h3>
                    <p className="text-text-secondary">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology */}
        <div className="space-y-6">
          <h2 className="text-3xl font-display text-text-primary">Teknolojimiz</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-text-secondary leading-relaxed">
                En son teknolojileri kullanarak güçlü ve güvenilir bir platform oluşturduk:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-text-secondary">
                  <span className="text-accent-teal mt-1">•</span>
                  <span><strong>Next.js 14</strong> - Modern, hızlı ve SEO dostu web framework</span>
                </li>
                <li className="flex items-start gap-2 text-text-secondary">
                  <span className="text-accent-teal mt-1">•</span>
                  <span><strong>Claude AI</strong> - Anthropic'in güçlü AI modeli ile akıllı öneriler</span>
                </li>
                <li className="flex items-start gap-2 text-text-secondary">
                  <span className="text-accent-teal mt-1">•</span>
                  <span><strong>PostgreSQL</strong> - Güvenilir ve ölçeklenebilir veritabanı</span>
                </li>
                <li className="flex items-start gap-2 text-text-secondary">
                  <span className="text-accent-teal mt-1">•</span>
                  <span><strong>Redis</strong> - Hızlı cache ve rate limiting</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="border-accent-teal/20 bg-gradient-to-br from-accent-teal-dim to-transparent">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-display text-text-primary">
              Hemen Başlayın
            </h3>
            <p className="text-text-secondary max-w-xl mx-auto">
              Ücretsiz hesap oluşturun ve web sitenizin SEO performansını artırmaya bugün başlayın.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-accent-teal text-bg-base font-medium text-sm hover:bg-accent-teal/90 transition-colors"
              >
                Ücretsiz Başla
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-10 px-6 rounded-md border border-border-default text-text-primary font-medium text-sm hover:border-border-strong transition-colors"
              >
                İletişime Geç
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
