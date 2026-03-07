"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Search, TrendingUp, TrendingDown } from "lucide-react";

interface MetaAnalysisResult {
  url: string;
  score: number;
  title: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
    message: string;
  };
  description: {
    content: string;
    length: number;
    status: "good" | "warning" | "error";
    message: string;
  };
  ogTags: {
    hasOgTitle: boolean;
    hasOgDescription: boolean;
    hasOgImage: boolean;
    hasOgUrl: boolean;
  };
  twitterTags: {
    hasTwitterCard: boolean;
    hasTwitterTitle: boolean;
    hasTwitterDescription: boolean;
    hasTwitterImage: boolean;
  };
  suggestions: string[];
  processingTime: number;
}

export function MetaAnalyzerTool() {
  const t = useTranslations("tools.metaAnalyzer");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<MetaAnalysisResult | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
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
    setAiSuggestions(null);

    try {
      const response = await fetch("/api/tools/meta-analyzer", {
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

  const handleAiSuggestions = async () => {
    if (!result) return;

    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/meta-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: result.url,
          currentTitle: result.title.content,
          currentDescription: result.description.content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "AI önerileri alınamadı");
      }

      const data = await response.json();
      setAiSuggestions(data);
    } catch (err: any) {
      setError(err.message || "AI önerileri alınamadı");
    } finally {
      setAiLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent-amber";
    return "text-error";
  };

  const getStatusIcon = (status: "good" | "warning" | "error") => {
    if (status === "good") return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (status === "warning") return <AlertCircle className="h-5 w-5 text-accent-amber" />;
    return <AlertCircle className="h-5 w-5 text-error" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-accent-teal-dim flex items-center justify-center">
            <Search className="h-6 w-6 text-accent-teal" />
          </div>
          <div>
            <h1 className="text-3xl font-display text-text-primary">{t("title")}</h1>
            <p className="text-text-secondary">{t("description")}</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("inputLabel")}</CardTitle>
          <CardDescription>
            Web sitenizin meta etiketlerini analiz edin ve SEO skorunuzu öğrenin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="url"
                variant="url"
                placeholder={t("inputPlaceholder")}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                error={error}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              loading={loading}
              disabled={loading}
              size="lg"
            >
              {loading ? t("analyzing") : t("analyze")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeUp">
          {/* Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">{t("score")}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}
                      </span>
                      <span className="text-2xl text-text-muted">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted mb-1">İşlem Süresi</p>
                    <p className="text-sm text-text-secondary">{result.processingTime}ms</p>
                  </div>
                </div>
                <Progress 
                  value={result.score} 
                  max={100}
                  variant={
                    result.score >= 80 ? "success" : 
                    result.score >= 60 ? "warning" : 
                    "error"
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Title Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Title Tag</CardTitle>
                {getStatusIcon(result.title.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-md bg-bg-subtle border border-border-default">
                <p className="text-sm text-text-primary font-mono">{result.title.content || "Bulunamadı"}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Uzunluk: {result.title.length} karakter</span>
                <Badge variant={result.title.status === "good" ? "success" : result.title.status === "warning" ? "amber" : "error"}>
                  {result.title.message}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Description Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Meta Description</CardTitle>
                {getStatusIcon(result.description.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-md bg-bg-subtle border border-border-default">
                <p className="text-sm text-text-primary font-mono">{result.description.content || "Bulunamadı"}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Uzunluk: {result.description.length} karakter</span>
                <Badge variant={result.description.status === "good" ? "success" : result.description.status === "warning" ? "amber" : "error"}>
                  {result.description.message}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Open Graph Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Open Graph Tags</CardTitle>
              <CardDescription>Sosyal medya paylaşımları için</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {result.ogTags.hasOgTitle ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">og:title</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.ogTags.hasOgDescription ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">og:description</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.ogTags.hasOgImage ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">og:image</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.ogTags.hasOgUrl ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">og:url</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Twitter Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Twitter Card Tags</CardTitle>
              <CardDescription>Twitter paylaşımları için</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {result.twitterTags.hasTwitterCard ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">twitter:card</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.twitterTags.hasTwitterTitle ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">twitter:title</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.twitterTags.hasTwitterDescription ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">twitter:description</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.twitterTags.hasTwitterImage ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-error" />
                  )}
                  <span className="text-sm text-text-secondary">twitter:image</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t("suggestions")}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAiSuggestions}
                    loading={aiLoading}
                    disabled={aiLoading}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    AI Önerileri Al
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <TrendingUp className="h-4 w-4 text-accent-teal mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          {aiSuggestions && (
            <Card className="border-accent-teal/20 bg-gradient-to-br from-accent-teal-dim to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent-teal flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-bg-base" />
                  </div>
                  <CardTitle className="text-lg">AI Destekli Öneriler</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestions.title && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-text-primary">Önerilen Title:</p>
                    <div className="p-3 rounded-md bg-bg-elevated border border-border-default">
                      <p className="text-sm text-text-primary">{aiSuggestions.title}</p>
                    </div>
                  </div>
                )}

                {aiSuggestions.description && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-text-primary">Önerilen Description:</p>
                    <div className="p-3 rounded-md bg-bg-elevated border border-border-default">
                      <p className="text-sm text-text-primary">{aiSuggestions.description}</p>
                    </div>
                  </div>
                )}

                {aiSuggestions.keywords && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-text-primary">Anahtar Kelimeler:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.keywords.split(",").map((keyword: string, index: number) => (
                        <Badge key={index} variant="teal">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiSuggestions.suggestions && aiSuggestions.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-text-primary">Ek Öneriler:</p>
                    <ul className="space-y-2">
                      {aiSuggestions.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="h-4 w-4 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
