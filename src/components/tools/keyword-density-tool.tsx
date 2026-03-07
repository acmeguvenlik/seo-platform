"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { ModernToolInput } from "./modern-tool-input";

interface KeywordData {
  keyword: string;
  count: number;
  density: number;
}

interface AnalysisResult {
  url: string;
  totalWords: number;
  uniqueWords: number;
  keywords: KeywordData[];
  topKeywords: KeywordData[];
  suggestions: string[];
}

export function KeywordDensityTool() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/keyword-density", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analiz başarısız");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Analiz sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getDensityColor = (density: number) => {
    if (density >= 2 && density <= 3) return "text-success";
    if (density >= 1 && density < 2) return "text-accent-amber";
    if (density > 3 && density <= 5) return "text-accent-amber";
    return "text-error";
  };

  const getDensityVariant = (density: number) => {
    if (density >= 2 && density <= 3) return "success";
    if (density >= 1 && density < 2) return "warning";
    if (density > 3 && density <= 5) return "warning";
    return "error";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-accent-amber/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-3xl font-display text-text-primary">
              Keyword Density Checker
            </h1>
            <p className="text-text-secondary">
              Anahtar kelime yoğunluğunu analiz edin ve SEO için optimize edin
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <ModernToolInput
        placeholder="https://example.com"
        buttonText="Analiz Et"
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      <Alert variant="info" icon={false} className="border-accent-teal/20 bg-accent-teal-dim">
        <AlertDescription className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-accent-teal mt-0.5 flex-shrink-0" />
          <span>
            <strong>İpucu:</strong> İdeal anahtar kelime yoğunluğu %2-3 arasındadır. 
            Çok düşük veya çok yüksek yoğunluk SEO performansını olumsuz etkileyebilir.
          </span>
        </AlertDescription>
      </Alert>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeUp">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:scale-[1.02] transition-transform duration-300 hover:border-accent-teal/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent-teal transition-all duration-500">
                    {result.totalWords.toLocaleString()}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Toplam Kelime</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:scale-[1.02] transition-transform duration-300 hover:border-accent-amber/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent-amber transition-all duration-500">
                    {result.uniqueWords.toLocaleString()}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Benzersiz Kelime</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:scale-[1.02] transition-transform duration-300 hover:border-success/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-success transition-all duration-500">
                    {result.topKeywords.length}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Önemli Anahtar Kelime</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Keywords */}
          <Card className="hover:border-accent-teal/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                  <FileText className="h-4 w-4 text-accent-teal" />
                </div>
                En Çok Kullanılan Anahtar Kelimeler
              </CardTitle>
              <CardDescription>
                Sayfanızda en sık geçen anahtar kelimeler ve yoğunlukları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.topKeywords.slice(0, 10).map((keyword, index) => (
                  <div key={index} className="space-y-2 p-3 rounded-lg hover:bg-bg-subtle transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="w-8 justify-center group-hover:scale-110 transition-transform">
                          {index + 1}
                        </Badge>
                        <span className="font-medium text-text-primary">
                          {keyword.keyword}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-text-muted">
                          {keyword.count} kez
                        </span>
                        <span className={`text-sm font-semibold ${getDensityColor(keyword.density)}`}>
                          %{keyword.density.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={keyword.density}
                      max={5}
                      variant={getDensityVariant(keyword.density)}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Density Guide */}
          <Card className="border-2 border-border-default hover:border-accent-teal/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-teal" />
                Yoğunluk Rehberi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 hover:bg-success/20 transition-colors">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-text-secondary">
                    <strong>%2-3:</strong> İdeal yoğunluk - SEO için optimize
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-amber/10 hover:bg-accent-amber/20 transition-colors">
                  <div className="h-3 w-3 rounded-full bg-accent-amber" />
                  <span className="text-sm text-text-secondary">
                    <strong>%1-2 veya %3-5:</strong> Kabul edilebilir - İyileştirilebilir
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-error/10 hover:bg-error/20 transition-colors">
                  <div className="h-3 w-3 rounded-full bg-error" />
                  <span className="text-sm text-text-secondary">
                    <strong>%1'den az veya %5'ten fazla:</strong> Sorunlu - Optimizasyon gerekli
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="hover:border-accent-teal/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent-teal" />
                  Öneriler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary p-2 rounded-lg hover:bg-bg-subtle transition-colors">
                      <TrendingUp className="h-4 w-4 text-accent-teal mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
