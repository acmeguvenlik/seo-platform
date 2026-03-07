"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, TrendingUp, Zap, Clock } from "lucide-react";
import { UsageWidget } from "./usage-widget";
import { RecentAnalyses } from "./recent-analyses";
import { QuickActions } from "./quick-actions";

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-title text-3xl font-semibold mb-2">
          {t("welcome")}
        </h1>
        <p className="text-body text-muted">
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
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label={t("totalUsage")}
          value={stats?.totalUsage || 0}
          color="success"
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label={t("mostUsedTool")}
          value={stats?.toolBreakdown[0]?.toolSlug || "-"}
          color="warning"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label={t("avgResponseTime")}
          value="<200ms"
          color="info"
        />
      </div>

      {/* Usage Widget */}
      <UsageWidget />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Analyses */}
      <RecentAnalyses />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "accent" | "success" | "warning" | "info";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
  };

  return (
    <div className="card-base p-6 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-small text-muted mb-1">{label}</p>
          <p className="text-heading text-2xl font-semibold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
