"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, Download, Trash2, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Analysis {
  id: string;
  toolSlug: string;
  result: any;
  processingMs: number;
  createdAt: string;
}

export function AnalysesContent() {
  const t = useTranslations("dashboard");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTool, setFilterTool] = useState<string>("all");

  useEffect(() => {
    fetchAnalyses();
  }, [offset]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/history?limit=20&offset=${offset}`
      );
      if (response.ok) {
        const data = await response.json();
        if (offset === 0) {
          setAnalyses(data.history || []);
        } else {
          setAnalyses((prev) => [...prev, ...(data.history || [])]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setOffset((prev) => prev + 20);
  };

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      searchQuery === "" ||
      analysis.result?.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.toolSlug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterTool === "all" || analysis.toolSlug === filterTool;

    return matchesSearch && matchesFilter;
  });

  const uniqueTools = Array.from(
    new Set(analyses.map((a) => a.toolSlug))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title text-3xl font-semibold mb-2">
          {t("analyses")}
        </h1>
        <p className="text-body text-muted">
          {t("analysesSubtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="card-base p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-bg-base focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <select
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-border bg-bg-base focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer"
            >
              <option value="all">{t("allTools")}</option>
              {uniqueTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>

          {/* Export */}
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted/10 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">{t("export")}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && offset === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-base p-6 animate-pulse">
              <div className="h-4 bg-muted/20 rounded w-1/4 mb-3"></div>
              <div className="h-3 bg-muted/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <p className="text-body text-muted">
            {searchQuery || filterTool !== "all"
              ? t("noResultsFound")
              : t("noAnalyses")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredAnalyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>

          {hasMore && !loading && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="px-6 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                {t("loadMore")}
              </button>
            </div>
          )}

          {loading && offset > 0 && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface AnalysisCardProps {
  analysis: Analysis;
}

function AnalysisCard({ analysis }: AnalysisCardProps) {
  const t = useTranslations("tools");
  const url = analysis.result?.url || "-";
  const score = analysis.result?.score;
  const timeAgo = formatDistanceToNow(new Date(analysis.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="card-base p-6 card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-heading font-semibold">
              {t(`${analysis.toolSlug}.title`)}
            </h3>
            {score !== undefined && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  score >= 80
                    ? "bg-success/10 text-success"
                    : score >= 60
                    ? "bg-warning/10 text-warning"
                    : "bg-error/10 text-error"
                }`}
              >
                {score}/100
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-small text-muted mb-3">
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{url}</span>
          </div>

          <div className="flex items-center gap-4 text-small text-muted">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{analysis.processingMs}ms</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-muted/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-muted hover:text-error" />
          </button>
        </div>
      </div>
    </div>
  );
}
