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
import { Sparkles, AlertCircle, Copy, CheckCircle2, TrendingUp } from "lucide-react";

interface ContentOptimizerResult {
  optimizedContent: string;
  originalLength: number;
  optimizedLength: number;
  keywordDensity: number;
  readabilityScore: number;
  seoScore: number;
  improvements: {
    category: string;
    before: string;
    after: string;
    impact: "high" | "medium" | "low";
  }[];
  suggestions: string[];
  processingTime: number;
}

export function ContentOptimizerTool() {
  const t = useTranslations("tools.aiContentOptimizer");
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentOptimizerResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!content || content.length < 100) {
      setError("İçerik en az 100 karakter olmalıdır");
      return;
    }

    if (!targetKeyword) {
      setError("Hedef anahtar kelime gereklidir");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/content-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          targetKeyword,
          competitorUrls: competitorUrls.split(",").map(u => u.trim()).filter(Boolean),
          language,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "İçerik optimizasyonu başarısız");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "İçerik optimizasyonu başarısız");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 dark:text-red-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "low": return "text-blue-600 dark:text-blue-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 border-blue-200 dark:border-blue-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-heading font-semibold">AI Content Optimizer</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              Claude AI ile içeriğinizi SEO için optimize edin
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              İçerik (minimum 100 karakter)
            </label>
            <textarea
              placeholder="Optimize edilecek içeriğinizi buraya yapıştırın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-small text-gray-500 mt-1">{content.length} karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hedef Anahtar Kelime
            </label>
            <Input
              type="text"
              placeholder="seo optimization"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rakip URL'ler (opsiyonel, virgülle ayırın)
            </label>
            <Input
              type="text"
              placeholder="https://competitor1.com, https://competitor2.com"
              value={competitorUrls}
              onChange={(e) => setCompetitorUrls(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dil
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <Button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                AI ile Optimize Ediliyor...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI ile İçeriği Optimize Et
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
        <div className="space-y-6 animate-fadeIn">
          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-small font-medium text-gray-600 dark:text-gray-400">SEO Score</h4>
                <TrendingUp className="h-5 w-5 text-teal-500" />
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(result.seoScore)}`}>
                {result.seoScore}
              </div>
              <Progress value={result.seoScore} className="mt-3" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-small font-medium text-gray-600 dark:text-gray-400">Readability</h4>
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(result.readabilityScore)}`}>
                {result.readabilityScore}
              </div>
              <Progress value={result.readabilityScore} className="mt-3" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-small font-medium text-gray-600 dark:text-gray-400">Keyword Density</h4>
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {result.keywordDensity.toFixed(1)}%
              </div>
              <p className="text-small text-gray-500 mt-2">Optimal: 1-3%</p>
            </Card>
          </div>

          {/* Stats */}
          <Card className="p-6">
            <h3 className="text-heading font-semibold mb-4">İçerik İstatistikleri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-small text-gray-600 dark:text-gray-400 mb-1">Orijinal Uzunluk</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {result.originalLength}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-small text-gray-600 dark:text-gray-400 mb-1">Optimize Edilmiş Uzunluk</div>
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {result.optimizedLength}
                </div>
              </div>
            </div>
          </Card>

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <Card className="p-6">
              <h3 className="text-heading font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Yapılan İyileştirmeler
              </h3>
              <div className="space-y-4">
                {result.improvements.map((improvement, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="teal">{improvement.category}</Badge>
                      <Badge variant={improvement.impact === "high" ? "error" : improvement.impact === "medium" ? "default" : "teal"}>
                        {improvement.impact} impact
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-small font-medium text-gray-600 dark:text-gray-400 mb-2">Önce:</div>
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900 text-small">
                          {improvement.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-small font-medium text-gray-600 dark:text-gray-400 mb-2">Sonra:</div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900 text-small">
                          {improvement.after}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Optimized Content */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Optimize Edilmiş İçerik
              </h3>
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                size="sm"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 max-h-96 overflow-y-auto">
              <p className="text-body whitespace-pre-wrap">{result.optimizedContent}</p>
            </div>
          </Card>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-heading font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                AI Önerileri
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900 text-small"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="text-center text-small text-gray-500">
            İşlem süresi: {result.processingTime}ms
          </div>
        </div>
      )}
    </div>
  );
}
