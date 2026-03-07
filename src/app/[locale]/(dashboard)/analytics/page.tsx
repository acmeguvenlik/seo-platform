import { useTranslations } from "next-intl";
import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-display text-text-primary">
            {t("title")}
          </h1>
          <Badge variant="amber">Yakında</Badge>
        </div>
        <p className="text-text-secondary">{t("description")}</p>
      </div>

      {/* Coming Soon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <BarChart3 className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.performance")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.performanceDesc")}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <TrendingUp className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.trends")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.trendsDesc")}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <Users className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.audience")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.audienceDesc")}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <Globe className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.geographic")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.geographicDesc")}</p>
        </Card>
      </div>

      {/* Placeholder */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex p-4 rounded-full bg-accent-teal-dim mb-4">
            <BarChart3 className="h-8 w-8 text-accent-teal" />
          </div>
          <h2 className="text-xl font-display text-text-primary mb-2">
            {t("comingSoon")}
          </h2>
          <p className="text-text-secondary mb-6">{t("comingSoonDesc")}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-border-default">
            <span className="text-sm text-text-muted">{t("notify")}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
