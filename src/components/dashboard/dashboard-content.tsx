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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Toplam Analiz</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stats.totalAnalyses}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-accent-teal" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Bu Ay</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stats.thisMonth}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent-amber/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent-amber" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Ortalama Skor</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stats.avgScore}/100</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Aktif Araçlar</p>
                <p className="text-2xl font-bold text-text-primary mt-1">1/12</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                <Zap className="h-6 w-6 text-accent-teal" />
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
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle border border-border-default hover:border-border-strong transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-accent-teal-dim flex items-center justify-center flex-shrink-0">
                          <Search className="h-5 w-5 text-accent-teal" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {analysis.url}
                          </p>
                          <p className="text-xs text-text-muted">{analysis.tool}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-text-primary">
                            {analysis.score}/100
                          </p>
                          <p className="text-xs text-text-muted">{analysis.date}</p>
                        </div>
                        <Button variant="ghost" size="sm">
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

          {/* Upgrade Card */}
          {stats.plan === "FREE" && (
            <Card className="mt-4 border-accent-teal/20 bg-gradient-to-br from-accent-teal-dim to-transparent">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent-teal flex items-center justify-center">
                    <Zap className="h-5 w-5 text-bg-base" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Pro'ya Yükselt</h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Daha fazla analiz, AI önerileri ve öncelikli destek
                    </p>
                  </div>
                  <Link href="/pricing">
                    <Button variant="primary" size="sm" className="w-full">
                      Planları Görüntüle
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
