"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Clock, ExternalLink, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
      <div className="card-base p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted/20 rounded w-1/4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="card-base p-6">
        <h2 className="text-heading text-xl font-semibold mb-6">
          {t("recentAnalyses")}
        </h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted" />
          </div>
          <p className="text-body text-muted mb-4">{t("noAnalyses")}</p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            {t("startAnalyzing")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-heading text-xl font-semibold">
          {t("recentAnalyses")}
        </h2>
        <Link
          href="/analyses"
          className="text-small text-accent hover:underline flex items-center gap-1"
        >
          {t("viewAll")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
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
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-body font-medium">
            {t(`${analysis.toolSlug}.title`)}
          </span>
          <span className="text-xs text-muted">•</span>
          <span className="text-small text-muted">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-2 text-small text-muted">
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-small text-muted">
        <Clock className="w-4 h-4" />
        <span>{analysis.processingMs}ms</span>
      </div>
    </div>
  );
}
