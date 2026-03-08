"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToolPageTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  children: React.ReactNode;
  onAnalyze: () => Promise<void>;
  result?: any;
  loading?: boolean;
  error?: string;
}

export function ToolPageTemplate({
  title,
  description,
  icon,
  category,
  children,
  onAnalyze,
  result,
  loading = false,
  error,
}: ToolPageTemplateProps) {
  return (
    <div className={theme.page.base}>
      <div className={cn(theme.page.container, "py-8")}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={cn("mb-8", "fade-up")} style={{ "--index": 0 } as React.CSSProperties}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] flex items-center justify-center">
                {icon}
              </div>
              <Badge variant="teal">{category}</Badge>
            </div>
            <h1 className={theme.text.title}>{title}</h1>
            <p className={cn(theme.text.body, theme.text.secondary, "mt-2 max-w-3xl")}>
              {description}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Input Panel */}
            <div className={cn("lg:col-span-2", "fade-up")} style={{ "--index": 1 } as React.CSSProperties}>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Analiz Ayarları</CardTitle>
                  <CardDescription>Analiz için gerekli bilgileri girin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {children}
                  
                  <Button
                    onClick={onAnalyze}
                    disabled={loading}
                    className={cn(theme.button.primary, "w-full")}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analiz Ediliyor...
                      </>
                    ) : (
                      "Analiz Et"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className={cn("lg:col-span-3", "fade-up")} style={{ "--index": 2 } as React.CSSProperties}>
              {error && (
                <Card className="border-[var(--error)] bg-[rgba(239,68,68,0.1)] mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className={cn(theme.text.body, "font-medium mb-1")}>Hata</h3>
                        <p className={theme.text.small}>{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!result && !loading && !error && (
                <Card>
                  <CardContent className="pt-6">
                    <div className={theme.empty.container}>
                      <div className={theme.empty.icon}>
                        <Info className="w-8 h-8" />
                      </div>
                      <p className={theme.empty.title}>Analiz Bekleniyor</p>
                      <p className={theme.empty.description}>
                        Analiz başlatmak için sol paneldeki formu doldurun
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {loading && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-12 h-12 text-[var(--accent-teal)] animate-spin mb-4" />
                      <p className={cn(theme.text.body, "font-medium")}>Analiz ediliyor...</p>
                      <p className={cn(theme.text.small, theme.text.muted)}>Bu birkaç saniye sürebilir</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result && !loading && (
                <div className="space-y-6">
                  {/* Score Card */}
                  {result.score !== undefined && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>SEO Skoru</p>
                            <p className={cn(theme.stat.value, getScoreColor(result.score))}>
                              {result.score}/100
                            </p>
                          </div>
                          <div className={cn(
                            "h-20 w-20 rounded-full flex items-center justify-center",
                            getScoreBgColor(result.score)
                          )}>
                            <span className={cn("text-3xl font-bold", getScoreColor(result.score))}>
                              {getScoreGrade(result.score)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Status Badge */}
                  {result.status && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <span className={theme.text.body}>Durum:</span>
                          <Badge variant={getStatusVariant(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Issues */}
                  {result.issues && result.issues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-[var(--warning)]" />
                          Sorunlar ({result.issues.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.issues.map((issue: string, index: number) => (
                            <li key={index} className={cn(theme.text.body, "flex items-start gap-2")}>
                              <span className="text-[var(--warning)] mt-1">•</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  {result.recommendations && result.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                          Öneriler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec: string, index: number) => (
                            <li key={index} className={cn(theme.text.body, "flex items-start gap-2")}>
                              <span className="text-[var(--success)] mt-1">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Raw Result */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detaylı Sonuçlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className={cn(
                        theme.text.mono,
                        "text-xs bg-[var(--bg-subtle)] p-4 rounded-lg overflow-x-auto"
                      )}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-[var(--success)]";
  if (score >= 60) return "text-[var(--info)]";
  if (score >= 40) return "text-[var(--warning)]";
  return "text-[var(--error)]";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-[rgba(16,185,129,0.1)]";
  if (score >= 60) return "bg-[rgba(59,130,246,0.1)]";
  if (score >= 40) return "bg-[var(--accent-amber-dim)]";
  return "bg-[rgba(239,68,68,0.1)]";
}

function getScoreGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getStatusVariant(status: string): "default" | "teal" | "success" | "amber" | "error" {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("pass") || statusLower.includes("excellent") || statusLower.includes("good")) {
    return "success";
  }
  if (statusLower.includes("warning") || statusLower.includes("fair")) {
    return "amber";
  }
  if (statusLower.includes("fail") || statusLower.includes("poor")) {
    return "error";
  }
  return "default";
}
