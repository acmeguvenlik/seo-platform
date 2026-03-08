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
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">
            {t("welcome")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
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
    accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    success: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    info: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
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
