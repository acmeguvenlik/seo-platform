"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, TrendingUp, Zap, Clock } from "lucide-react";
import { UsageWidget } from "./usage-widget";
import { RecentAnalyses } from "./recent-analyses";
import { QuickActions } from "./quick-actions";
import { theme, cn } from "@/lib/theme-classes";

interface DashboardStats {
  todayUsage: number;
  totalUsage: number;
  toolBreakdown: Array<{
    toolSlug: string;
    count: number;
  }>;
}

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={theme.page.base}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className={cn(theme.loading.spinner, "h-12 w-12")}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(theme.page.base, "p-8")}>
      <div className={theme.spacing.section}>
        {/* Header */}
        <div className="fade-up" style={{ "--index": 0 } as React.CSSProperties}>
          <h1 className={cn(theme.text.title, "mb-2")}>
            {t("welcome")}
          </h1>
          <p className={theme.text.secondary}>
            {t("subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label={t("todayUsage")}
            value={stats?.todayUsage || 0}
            color="accent"
            index={1}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label={t("totalUsage")}
            value={stats?.totalUsage || 0}
            color="success"
            index={2}
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label={t("mostUsedTool")}
            value={stats?.toolBreakdown[0]?.toolSlug || "-"}
            color="warning"
            index={3}
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label={t("avgResponseTime")}
            value="<200ms"
            color="info"
            index={4}
          />
        </div>

        {/* Usage Widget */}
        <div className="fade-up" style={{ "--index": 5 } as React.CSSProperties}>
          <UsageWidget />
        </div>

        {/* Quick Actions */}
        <div className="fade-up" style={{ "--index": 6 } as React.CSSProperties}>
          <QuickActions />
        </div>

        {/* Recent Analyses */}
        <div className="fade-up" style={{ "--index": 7 } as React.CSSProperties}>
          <RecentAnalyses />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "accent" | "success" | "warning" | "info";
  index: number;
}

function StatCard({ icon, label, value, color, index }: StatCardProps) {
  const colorClasses = {
    accent: "text-[var(--accent-teal)] bg-[var(--accent-teal-dim)]",
    success: "text-[var(--success)] bg-[rgba(16,185,129,0.1)]",
    warning: "text-[var(--accent-amber)] bg-[var(--accent-amber-dim)]",
    info: "text-[var(--info)] bg-[rgba(59,130,246,0.1)]",
  };

  return (
    <div 
      className={cn(theme.stat.card, theme.card.hover, "fade-up")}
      style={{ "--index": index } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={theme.stat.label}>{label}</p>
          <p className={theme.stat.value}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
