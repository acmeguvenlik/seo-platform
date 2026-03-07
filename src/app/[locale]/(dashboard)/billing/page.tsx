import { useTranslations } from "next-intl";
import { CreditCard, Receipt, Download, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function BillingPage() {
  const t = useTranslations("billing");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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

      {/* Current Plan */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-text-primary mb-1">
              {t("currentPlan")}
            </h2>
            <p className="text-sm text-text-secondary">{t("planDesc")}</p>
          </div>
          <Badge variant="teal">Ücretsiz</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing">
            <Button variant="primary" size="sm">
              {t("upgradePlan")}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" disabled>
            {t("managePlan")}
          </Button>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <CreditCard className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.payment")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.paymentDesc")}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <Receipt className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.invoices")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.invoicesDesc")}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent-teal-dim">
              <Calendar className="h-5 w-5 text-accent-teal" />
            </div>
            <h3 className="text-sm font-medium text-text-primary">
              {t("features.subscription")}
            </h3>
          </div>
          <p className="text-xs text-text-muted">{t("features.subscriptionDesc")}</p>
        </Card>
      </div>

      {/* Placeholder */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex p-4 rounded-full bg-accent-teal-dim mb-4">
            <CreditCard className="h-8 w-8 text-accent-teal" />
          </div>
          <h2 className="text-xl font-display text-text-primary mb-2">
            {t("comingSoon")}
          </h2>
          <p className="text-text-secondary mb-6">{t("comingSoonDesc")}</p>
        </div>
      </Card>
    </div>
  );
}
