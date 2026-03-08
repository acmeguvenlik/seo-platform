"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Clock, ExternalLink, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { theme, cn } from "@/lib/theme-classes";

interface Analysis {
  id: string;
  toolSlug: string;
  result: any;
  processingMs: number;
  createdAt: string;
}

export function RecentAnalyses() {
  const t = useTranslations("dashboard");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch("/api/dashboard/history?limit=5");
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.history || []);
      }
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn(theme.card.base, theme.card.padding.md)}>
        <div className="animate-pulse space-y-4">
          <div className={cn(theme.loading.skeleton, "h-4 w-1/4")}></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={cn(theme.loading.skeleton, "h-16")}></div>
          ))}
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className={cn(theme.card.base, theme.card.padding.md)}>
        <h2 className={cn(theme.text.heading, "mb-6")}>
          {t("recentAnalyses")}
        </h2>
        <div className={theme.empty.container}>
          <div className={theme.empty.icon}>
            <Clock className="w-8 h-8" />
          </div>
          <p className={cn(theme.empty.title, "text-lg")}>{t("noAnalyses")}</p>
          <Link
            href="/tools"
            className={cn(theme.button.primary, theme.button.withIcon, "mt-4")}
          >
            {t("startAnalyzing")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(theme.card.base, theme.card.padding.md)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={theme.text.heading}>
          {t("recentAnalyses")}
        </h2>
        <Link
          href="/analyses"
          className={cn(theme.text.accent, "hover:underline", theme.button.withIcon, theme.text.small)}
        >
          {t("viewAll")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className={theme.spacing.stack}>
        {analyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </div>
    </div>
  );
}

interface AnalysisCardProps {
  analysis: Analysis;
}

function AnalysisCard({ analysis }: AnalysisCardProps) {
  const t = useTranslations("tools");
  const url = analysis.result?.url || "-";
  const timeAgo = formatDistanceToNow(new Date(analysis.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-teal)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(theme.text.body, "font-medium")}>
            {t(`${analysis.toolSlug}.title`)}
          </span>
          <span className={cn(theme.text.muted, "text-xs")}>•</span>
          <span className={cn(theme.text.small, theme.text.muted)}>{timeAgo}</span>
        </div>
        <div className={cn("flex items-center gap-2", theme.text.small, theme.text.muted)}>
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className={cn("flex items-center gap-2", theme.text.mono, theme.text.muted)}>
        <Clock className="w-4 h-4" />
        <span>{analysis.processingMs}ms</span>
      </div>
    </div>
  );
}
