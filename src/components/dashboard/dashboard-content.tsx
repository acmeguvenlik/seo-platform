"use client";

import { useTranslations } from "next-intl";
import { useUser } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Search, 
  TrendingUp, 
  Zap, 
  Clock,
  ArrowRight,
  Activity,
  Globe,
  FileText
} from "lucide-react";
import { Link } from "@/i18n/routing";

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const { user } = useUser();

  // Mock data - gerçek uygulamada API'den gelecek
  const stats = {
    totalAnalyses: 24,
    thisMonth: 12,
    avgScore: 78,
    plan: "FREE",
  };

  const recentAnalyses = [
    {
      id: "1",
      url: "https://example.com",
      tool: "Meta Analyzer",
      score: 85,
      date: "2 saat önce",
    },
    {
      id: "2",
      url: "https://mysite.com",
      tool: "Meta Analyzer",
      score: 72,
      date: "5 saat önce",
    },
    {
      id: "3",
      url: "https://demo.com",
      tool: "Meta Analyzer",
      score: 91,
      date: "1 gün önce",
    },
  ];

  const tools = [
    {
      name: "Meta Tag Analyzer",
      description: "Meta etiketlerinizi analiz edin",
      icon: Search,
      href: "/tools/meta-analyzer",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal-dim",
    },
    {
      name: "Keyword Research",
      description: "Anahtar kelime araştırması yapın",
      icon: TrendingUp,
      href: "/tools/keyword-research",
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
      disabled: true,
    },
    {
      name: "Sitemap Generator",
      description: "XML sitemap oluşturun",
      icon: FileText,
      href: "/tools/sitemap-generator",
      color: "text-success",
      bgColor: "bg-success/10",
      disabled: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-text-primary">
            {t("welcome")}, {user?.name || user?.email}
          </h1>
          <p className="text-text-secondary mt-1">
            SEO araçlarınızı yönetin ve performansınızı takip edin
          </p>
        </div>
        <Badge variant={stats.plan === "PRO" ? "pro" : stats.plan === "ENTERPRISE" ? "enterprise" : "default"}>
          {stats.plan} Plan
        </Badge>
      </div>

      {/* Stats Grid with animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-accent-teal/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Toplam Analiz</p>
                <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-accent-teal transition-colors">
                  {stats.totalAnalyses}
                </p>
                <p className="text-xs text-success mt-1">+12% bu ay</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center group-hover:bg-accent-teal group-hover:scale-110 transition-all">
                <BarChart3 className="h-6 w-6 text-accent-teal group-hover:text-bg-base transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-accent-amber/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Bu Ay</p>
                <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-accent-amber transition-colors">
                  {stats.thisMonth}
                </p>
                <p className="text-xs text-text-muted mt-1">Son 30 gün</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent-amber/10 flex items-center justify-center group-hover:bg-accent-amber group-hover:scale-110 transition-all">
                <Clock className="h-6 w-6 text-accent-amber group-hover:text-bg-base transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Ortalama Skor</p>
                <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-success transition-colors">
                  {stats.avgScore}/100
                </p>
                <p className="text-xs text-success mt-1">+5 puan</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success group-hover:scale-110 transition-all">
                <Activity className="h-6 w-6 text-success group-hover:text-bg-base transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-accent-teal/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Aktif Araçlar</p>
                <p className="text-2xl font-bold text-text-primary mt-1 group-hover:text-accent-teal transition-colors">
                  1/12
                </p>
                <p className="text-xs text-text-muted mt-1">11 araç daha</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center group-hover:bg-accent-teal group-hover:scale-110 transition-all">
                <Zap className="h-6 w-6 text-accent-teal group-hover:text-bg-base transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Analyses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("recentAnalyses")}</CardTitle>
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary">{t("noAnalyses")}</p>
                  <Link href="/tools/meta-analyzer">
                    <Button variant="primary" size="sm" className="mt-4">
                      İlk Analizini Yap
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAnalyses.map((analysis, index) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle border border-border-default hover:border-accent-teal/50 hover:bg-bg-elevated transition-all duration-300 group cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-accent-teal-dim flex items-center justify-center flex-shrink-0 group-hover:bg-accent-teal group-hover:scale-110 transition-all">
                          <Search className="h-5 w-5 text-accent-teal group-hover:text-bg-base transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent-teal transition-colors">
                            {analysis.url}
                          </p>
                          <p className="text-xs text-text-muted">{analysis.tool}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-bg-base rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-accent-teal to-success transition-all duration-500"
                                style={{ width: `${analysis.score}%` }}
                              />
                            </div>
                            <p className="text-sm font-semibold text-text-primary">
                              {analysis.score}
                            </p>
                          </div>
                          <p className="text-xs text-text-muted mt-1">{analysis.date}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
              <CardDescription>SEO araçlarınıza hızlıca erişin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className={tool.disabled ? "pointer-events-none" : ""}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border border-border-default transition-all ${
                        tool.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-border-strong hover:bg-bg-subtle cursor-pointer"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg ${tool.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${tool.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary flex items-center gap-2">
                          <span>{tool.name}</span>
                          {tool.disabled && (
                            <Badge variant="default" className="text-xs">
                              Yakında
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-text-muted">{tool.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Upgrade Card with gradient animation */}
          {stats.plan === "FREE" && (
            <Card className="mt-4 border-accent-teal/30 bg-gradient-to-br from-accent-teal-dim via-bg-elevated to-accent-amber/5 relative overflow-hidden group">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/20 to-accent-amber/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="pt-6 relative z-10">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent-teal flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5 text-bg-base" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent-teal transition-colors">
                      Pro'ya Yükselt
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Daha fazla analiz, AI önerileri ve öncelikli destek
                    </p>
                  </div>
                  <Link href="/pricing">
                    <Button variant="primary" size="sm" className="w-full group-hover:scale-105 transition-transform">
                      Planları Görüntüle
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
