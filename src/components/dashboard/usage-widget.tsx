"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-context";
import { AlertCircle, TrendingUp } from "lucide-react";
import { themeClasses } from "@/lib/theme-classes";

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
      <div className={themeClasses.card.base + ' ' + themeClasses.card.padding}>
        <div className="animate-pulse space-y-4">
          <div className={themeClasses.loading.skeleton + ' h-4 w-1/4'}></div>
          <div className={themeClasses.loading.skeleton + ' h-24'}></div>
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
    <div className={themeClasses.card.base + ' ' + themeClasses.card.padding}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={themeClasses.text.subheading + ' mb-1'}>
            {t("dailyUsage")}
          </h2>
          <p className={themeClasses.text.secondary}>
            {t("resetsDaily")}
          </p>
        </div>
        {user?.plan && (
          <div className={themeClasses.badge.primary}>
            {user.plan}
          </div>
        )}
      </div>

      {isNearLimit && user?.plan === "FREE" && (
        <div className={themeClasses.alert.warning + ' mb-6 flex items-start gap-3'}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">
              {t("nearLimit")}
            </p>
            <p className="text-sm">
              {t("upgradeMessage")}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
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
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/pricing"
            className={themeClasses.button.primary + ' flex items-center justify-center gap-2 w-full'}
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
    ? "bg-red-600"
    : isNearLimit
    ? "bg-yellow-600"
    : "bg-blue-600";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isUnlimited ? (
            <span className="text-blue-600 dark:text-blue-400 font-medium">Unlimited</span>
          ) : (
            <>
              {used} / {limit}
            </>
          )}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: isUnlimited ? "0%" : `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
