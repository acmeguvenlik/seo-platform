"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-context";
import { AlertCircle, TrendingUp } from "lucide-react";
import { theme, cn, formatProgress, getProgressColor } from "@/lib/theme-classes";

interface UsageData {
  tools: { used: number; limit: number };
  ai: { used: number; limit: number };
}

export function UsageWidget() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/dashboard/usage");
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn(theme.card.base, theme.card.padding.md)}>
        <div className="animate-pulse space-y-4">
          <div className={cn(theme.loading.skeleton, "h-4 w-1/4")}></div>
          <div className={cn(theme.loading.skeleton, "h-24")}></div>
        </div>
      </div>
    );
  }

  const toolsPercentage = formatProgress(usage?.tools.used || 0, usage?.tools.limit || 0);
  const aiPercentage = formatProgress(usage?.ai.used || 0, usage?.ai.limit || 0);
  const isNearLimit = toolsPercentage > 80 || aiPercentage > 80;

  return (
    <div className={cn(theme.card.base, theme.card.padding.md)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={cn(theme.text.heading, "mb-1")}>
            {t("dailyUsage")}
          </h2>
          <p className={theme.text.secondary}>
            {t("resetsDaily")}
          </p>
        </div>
        {user?.plan && (
          <div className={user.plan === "FREE" ? theme.badge.free : user.plan === "PRO" ? theme.badge.pro : theme.badge.enterprise}>
            {user.plan}
          </div>
        )}
      </div>

      {isNearLimit && user?.plan === "FREE" && (
        <div className={cn(theme.alert.warning, "mb-6")}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">
              {t("nearLimit")}
            </p>
            <p className={theme.text.small}>
              {t("upgradeMessage")}
            </p>
          </div>
        </div>
      )}

      <div className={theme.spacing.stack}>
        <UsageBar
          label={t("toolsUsage")}
          used={usage?.tools.used || 0}
          limit={usage?.tools.limit || 0}
          percentage={toolsPercentage}
        />

        <UsageBar
          label={t("aiUsage")}
          used={usage?.ai.used || 0}
          limit={usage?.ai.limit || 0}
          percentage={aiPercentage}
        />
      </div>

      {user?.plan === "FREE" && (
        <div className={cn("mt-6 pt-6", theme.divider.horizontal)}>
          <a
            href="/pricing"
            className={cn(theme.button.primary, theme.button.withIcon, "w-full justify-center")}
          >
            <TrendingUp className="w-4 h-4" />
            {t("upgradePlan")}
          </a>
        </div>
      )}
    </div>
  );
}

interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  percentage: number;
}

function UsageBar({ label, used, limit, percentage }: UsageBarProps) {
  const isUnlimited = limit === -1;
  const barColorClass = getProgressColor(percentage);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={cn(theme.text.body, "font-medium")}>{label}</span>
        <span className={theme.text.mono}>
          {isUnlimited ? (
            <span className={cn(theme.text.accent, "font-medium")}>Unlimited</span>
          ) : (
            <>
              {used} / {limit}
            </>
          )}
        </span>
      </div>
      <div className={theme.progress.container}>
        <div
          className={barColorClass}
          style={{ width: isUnlimited ? "0%" : `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
