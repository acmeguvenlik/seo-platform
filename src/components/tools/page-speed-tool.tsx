"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, AlertCircle, CheckCircle2, Activity, Sparkles } from "lucide-react";
import { ModernToolInput } from "./modern-tool-input";

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PageSpeedResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
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
      <ModernToolInput
        placeholder="https://example.com"
        buttonText="Hız Analizi"
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      {result && (
        <div className="space-y-6 animate-fadeUp">
          <Card className="border-2 hover:border-accent-teal/30 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                    <Zap className="h-4 w-4 text-accent-teal" />
                  </div>
                  Performans Skoru
                </h3>
                <Badge variant={getGradeBadge(result.grade) as any} className="hover:scale-105 transition-transform">
                  {result.grade}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-bold ${getGradeColor(result.grade)} transition-all duration-500`}>
                  {result.score}
                </div>
                <div className="flex-1">
                  <Progress 
                    value={result.score} 
                    variant={result.score >= 80 ? "success" : result.score >= 60 ? "default" : "error"} 
                    className="h-3"
                  />
                  <p className="text-sm text-text-muted mt-2">Yüklenme Süresi: {result.loadTime}ms</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-2 hover:border-accent-teal/20 transition-all duration-300">
            <div className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent-teal" />
                Core Web Vitals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm text-text-secondary mb-1">LCP (Largest Contentful Paint)</div>
                  <div className={`text-3xl font-bold transition-all duration-500 ${result.coreWebVitals.lcp <= 2500 ? "text-success" : "text-error"}`}>
                    {result.coreWebVitals.lcp}ms
                  </div>
                  <div className="text-xs text-text-muted mt-1">İdeal: ≤2500ms</div>
                </div>
                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm text-text-secondary mb-1">FID (First Input Delay)</div>
                  <div className={`text-3xl font-bold transition-all duration-500 ${result.coreWebVitals.fid <= 100 ? "text-success" : "text-error"}`}>
                    {result.coreWebVitals.fid}ms
                  </div>
                  <div className="text-xs text-text-muted mt-1">İdeal: ≤100ms</div>
                </div>
                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-sm text-text-secondary mb-1">CLS (Cumulative Layout Shift)</div>
                  <div className={`text-3xl font-bold transition-all duration-500 ${result.coreWebVitals.cls <= 0.1 ? "text-success" : "text-error"}`}>
                    {result.coreWebVitals.cls}
                  </div>
                  <div className="text-xs text-text-muted mt-1">İdeal: ≤0.1</div>
                </div>
              </div>
            </div>
          </Card>

          {result.issues.length > 0 && (
            <Card className="border-2 border-error/20 hover:border-error/40 transition-all duration-300">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-error/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-error" />
                  </div>
                  Tespit Edilen Sorunlar
                </h3>
                <div className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="p-3 bg-bg-elevated rounded-lg border border-border-default hover:border-error/30 hover:bg-error/5 transition-all text-sm text-text-secondary">
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {result.suggestions.length > 0 && (
            <Card className="border-2 border-success/20 hover:border-success/40 transition-all duration-300">
              <div className="p-6">
                <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  Öneriler
                </h3>
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-bg-elevated rounded-lg border border-border-default hover:border-success/30 hover:bg-success/5 transition-all text-sm text-text-secondary">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
