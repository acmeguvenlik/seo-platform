"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-context";
import { AlertCircle, TrendingUp } from "lucide-react";

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
    // Refresh every 30 seconds
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
      <div className="card-base p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted/20 rounded w-1/4"></div>
          <div className="h-24 bg-muted/20 rounded"></div>
        </div>
      </div>
    );
  }

  const toolsPercentage = usage?.tools.limit === -1 
    ? 0 
    : ((usage?.tools.used || 0) / (usage?.tools.limit || 1)) * 100;
  
  const aiPercentage = usage?.ai.limit === -1 
    ? 0 
    : ((usage?.ai.used || 0) / (usage?.ai.limit || 1)) * 100;

  const isNearLimit = toolsPercentage > 80 || aiPercentage > 80;

  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading text-xl font-semibold mb-1">
            {t("dailyUsage")}
          </h2>
          <p className="text-small text-muted">
            {t("resetsDaily")}
          </p>
        </div>
        {user?.plan && (
          <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-small font-medium">
            {user.plan}
          </div>
        )}
      </div>

      {isNearLimit && user?.plan === "FREE" && (
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body font-medium text-warning mb-1">
              {t("nearLimit")}
            </p>
            <p className="text-small text-muted">
              {t("upgradeMessage")}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Tools Usage */}
        <UsageBar
          label={t("toolsUsage")}
          used={usage?.tools.used || 0}
          limit={usage?.tools.limit || 0}
          percentage={toolsPercentage}
        />

        {/* AI Usage */}
        <UsageBar
          label={t("aiUsage")}
          used={usage?.ai.used || 0}
          limit={usage?.ai.limit || 0}
          percentage={aiPercentage}
        />
      </div>

      {user?.plan === "FREE" && (
        <div className="mt-6 pt-6 border-t border-border">
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
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
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  const barColor = isAtLimit
    ? "bg-error"
    : isNearLimit
    ? "bg-warning"
    : "bg-accent";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-body font-medium">{label}</span>
        <span className="text-small text-muted">
          {isUnlimited ? (
            <span className="text-accent font-medium">Unlimited</span>
          ) : (
            <>
              {used} / {limit}
            </>
          )}
        </span>
      </div>
      <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: isUnlimited ? "0%" : `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
