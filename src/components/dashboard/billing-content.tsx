"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-context";
import { CreditCard, Calendar, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";

export function BillingContent() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();

  const planFeatures = {
    FREE: [
      "10 tool uses per day",
      "3 AI tool uses per day",
      "7 days history",
      "Community support",
    ],
    PRO: [
      "500 tool uses per day",
      "100 AI tool uses per day",
      "Unlimited history",
      "API access (1000 calls/day)",
      "Priority support",
      "PDF reports",
    ],
    ENTERPRISE: [
      "Unlimited tool uses",
      "Unlimited AI uses",
      "Unlimited history",
      "Unlimited API access",
      "Team members (up to 5)",
      "White-label reports",
      "Dedicated support",
      "SLA guarantee",
    ],
  };

  const currentPlan = (user?.plan as keyof typeof planFeatures) || "FREE";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-title text-3xl font-semibold mb-2">
          {t("billing")}
        </h1>
        <p className="text-body text-muted">
          {t("billingSubtitle")}
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="card-base p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-heading text-xl font-semibold mb-2">
              {t("currentPlan")}
            </h2>
            <p className="text-body text-muted">
              {t("planDescription")}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-accent/10 text-accent font-medium">
            {currentPlan}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {planFeatures[currentPlan].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-body">{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        {currentPlan === "FREE" && (
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              {t("upgradeToPro")}
            </Link>
          </div>
        )}

        {(currentPlan === "PRO" || currentPlan === "ENTERPRISE") && (
          <div className="flex gap-3">
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-muted/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ExternalLink className="w-4 h-4" />
              {t("manageSubscription")}
            </button>
            <button
              disabled
              className="px-4 py-3 rounded-lg border border-border hover:bg-muted/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("cancelSubscription")}
            </button>
          </div>
        )}
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          icon={<CreditCard className="w-5 h-5" />}
          title={t("paymentMethod")}
          description={t("noPaymentMethod")}
          color="accent"
        />
        <InfoCard
          icon={<Calendar className="w-5 h-5" />}
          title={t("billingCycle")}
          description={currentPlan === "FREE" ? t("noSubscription") : "Monthly"}
          color="success"
        />
        <InfoCard
          icon={<TrendingUp className="w-5 h-5" />}
          title={t("nextBilling")}
          description={currentPlan === "FREE" ? "-" : "N/A"}
          color="info"
        />
      </div>

      {/* Coming Soon Notice */}
      <div className="card-base p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-heading text-xl font-semibold mb-2">
          {t("stripeComingSoon")}
        </h3>
        <p className="text-body text-muted max-w-md mx-auto">
          {t("stripeComingSoonDesc")}
        </p>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "accent" | "success" | "info";
}

function InfoCard({ icon, title, description, color }: InfoCardProps) {
  const colorClasses = {
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
  };

  return (
    <div className="card-base p-6">
      <div className={`p-3 rounded-lg ${colorClasses[color]} inline-flex mb-4`}>
        {icon}
      </div>
      <h3 className="text-body font-semibold mb-1">{title}</h3>
      <p className="text-small text-muted">{description}</p>
    </div>
  );
}
