"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Zap, AlertCircle, CheckCircle2, Activity } from "lucide-react";

interface PageSpeedResult {
  url: string;
  loadTime: number;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  metrics: {
    ttfb: number;
    domContentLoaded: number;
    totalResources: number;
    totalSize: number;
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
  };
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  resources: Array<{ type: string; count: number; totalSize: number }>;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function PageSpeedTool() {
  const t = useTranslations("tools.pageSpeed");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PageSpeedResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url) {
      setError(t("errors.invalidUrl"));
      return;
    }

    try {
      new URL(url);
    } catch {
      setError(t("errors.invalidUrl"));
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/page-speed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("errors.fetchFailed"));
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-success";
      case "B": return "text-accent-teal";
      case "C": return "text-accent-amber";
      case "D": return "text-warning";
      case "F": return "text-error";
      default: return "text-text-secondary";
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A": return "success";
      case "B": return "teal";
      case "C": return "amber";
      case "D": return "amber";
      case "F": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("inputLabel")}
            </label>
            <Input
              type="url"
              placeholder={t("inputPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="url"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={loading} variant="primary" className="w-full">
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {t("analyze")}
              </>
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">{t("performanceScore")}</h3>
              <Badge variant={getGradeBadge(result.grade) as any}>{result.grade}</Badge>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-5xl font-bold ${getGradeColor(result.grade)}`}>
                {result.score}
              </div>
              <div className="flex-1">
                <Progress value={result.score} variant={result.score >= 80 ? "success" : result.score >= 60 ? "default" : "error"} />
                <p className="text-sm text-text-muted mt-2">{t("loadTime")}: {result.loadTime}ms</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">{t("coreWebVitals")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-sm text-text-secondary mb-1">LCP</div>
                <div className={`text-2xl font-bold ${result.coreWebVitals.lcp <= 2500 ? "text-success" : "text-error"}`}>
                  {result.coreWebVitals.lcp}ms
                </div>
              </div>
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-sm text-text-secondary mb-1">FID</div>
                <div className={`text-2xl font-bold ${result.coreWebVitals.fid <= 100 ? "text-success" : "text-error"}`}>
                  {result.coreWebVitals.fid}ms
                </div>
              </div>
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-sm text-text-secondary mb-1">CLS</div>
                <div className={`text-2xl font-bold ${result.coreWebVitals.cls <= 0.1 ? "text-success" : "text-error"}`}>
                  {result.coreWebVitals.cls}
                </div>
              </div>
            </div>
          </Card>

          {result.issues.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-error" />
                {t("issues")}
              </h3>
              <div className="space-y-2">
                {result.issues.map((issue, index) => (
                  <div key={index} className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary">
                    {issue}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                {t("suggestions")}
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary">
                    {suggestion}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
