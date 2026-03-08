"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, AlertCircle, CheckCircle, TrendingUp, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function AISEOAuditPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url) {
      setError("Lütfen bir URL girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analiz başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageTemplate
      title="AI SEO Denetimi"
      description="Yapay zeka destekli kapsamlı SEO analizi. Sitenizin SEO performansını detaylı olarak inceleyin ve öneriler alın."
      icon={<Search className="w-6 h-6" />}
      category="AI Araçları"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={theme.input.base}
        />
      </div>

      {result && !loading && (
        <div className="mt-6 space-y-4">
          {/* Score Display */}
          {result.audit && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={cn("text-5xl font-bold mb-2", getScoreColor(result.audit.score))}>
                    {result.audit.score}/100
                  </div>
                  <Badge variant={getGradeVariant(result.audit.grade)} className="text-lg px-4 py-1">
                    {result.audit.grade}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Critical Issues */}
          {result.audit?.critical && result.audit.critical.length > 0 && (
            <Card className="border-[var(--error)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--error)]">
                  <AlertCircle className="w-5 h-5" />
                  Kritik Sorunlar ({result.audit.critical.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.audit.critical.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--error)] pl-4">
                    <p className={cn(theme.text.body, "font-medium mb-1")}>{item.issue}</p>
                    <p className={cn(theme.text.small, theme.text.muted)}>{item.recommendation}</p>
                    <Badge variant="error" className="mt-2">{item.impact}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {result.audit?.warnings && result.audit.warnings.length > 0 && (
            <Card className="border-[var(--warning)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--warning)]">
                  <AlertCircle className="w-5 h-5" />
                  Uyarılar ({result.audit.warnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.audit.warnings.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--warning)] pl-4">
                    <p className={cn(theme.text.body, "font-medium mb-1")}>{item.issue}</p>
                    <p className={cn(theme.text.small, theme.text.muted)}>{item.recommendation}</p>
                    <Badge variant="amber" className="mt-2">{item.impact}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Opportunities */}
          {result.audit?.opportunities && result.audit.opportunities.length > 0 && (
            <Card className="border-[var(--info)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--info)]">
                  <Lightbulb className="w-5 h-5" />
                  Fırsatlar ({result.audit.opportunities.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.audit.opportunities.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--info)] pl-4">
                    <p className={cn(theme.text.body, "font-medium mb-1")}>{item.issue}</p>
                    <p className={cn(theme.text.small, theme.text.muted)}>{item.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Strengths */}
          {result.audit?.strengths && result.audit.strengths.length > 0 && (
            <Card className="border-[var(--success)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--success)]">
                  <CheckCircle className="w-5 h-5" />
                  Güçlü Yönler ({result.audit.strengths.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.audit.strengths.map((item: any, index: number) => (
                    <li key={index} className={cn(theme.text.body, "flex items-start gap-2")}>
                      <CheckCircle className="w-4 h-4 text-[var(--success)] mt-1 flex-shrink-0" />
                      <span>{typeof item === 'string' ? item : item.issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Action Items */}
          {result.audit?.actionItems && result.audit.actionItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Eylem Planı ({result.audit.actionItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.audit.actionItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-subtle)]">
                    <div className="flex-1">
                      <p className={cn(theme.text.body, "font-medium mb-1")}>{item.task}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getPriorityVariant(item.priority)}>{item.priority}</Badge>
                        <Badge variant="default">{item.effort}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolPageTemplate>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-[var(--success)]";
  if (score >= 60) return "text-[var(--info)]";
  if (score >= 40) return "text-[var(--warning)]";
  return "text-[var(--error)]";
}

function getGradeVariant(grade: string): "default" | "teal" | "success" | "amber" | "error" {
  if (grade === "A" || grade === "A+") return "success";
  if (grade === "B") return "teal";
  if (grade === "C") return "amber";
  return "error";
}

function getPriorityVariant(priority: string): "default" | "teal" | "success" | "amber" | "error" {
  if (priority === "high") return "error";
  if (priority === "medium") return "amber";
  return "success";
}
