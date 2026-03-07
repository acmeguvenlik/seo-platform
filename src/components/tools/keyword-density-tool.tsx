"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, TrendingUp, AlertCircle } from "lucide-react";

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
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url) {
      setError("Lütfen geçerli bir URL girin");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Lütfen geçerli bir URL girin");
      return;
    }

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
      <Card>
        <CardHeader>
          <CardTitle>URL Girin</CardTitle>
          <CardDescription>
            Analiz etmek istediğiniz web sayfasının URL'sini girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="url"
                variant="url"
                placeholder="https://example.com"
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
              {loading ? "Analiz Ediliyor..." : "Analiz Et"}
            </Button>
          </div>

          <Alert variant="info" icon={false}>
            <AlertDescription>
              <strong>İpucu:</strong> İdeal anahtar kelime yoğunluğu %2-3 arasındadır. 
              Çok düşük veya çok yüksek yoğunluk SEO performansını olumsuz etkileyebilir.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeUp">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent-teal">
                    {result.totalWords.toLocaleString()}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Toplam Kelime</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent-amber">
                    {result.uniqueWords.toLocaleString()}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Benzersiz Kelime</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-success">
                    {result.topKeywords.length}
                  </p>
                  <p className="text-sm text-text-muted mt-1">Önemli Anahtar Kelime</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>En Çok Kullanılan Anahtar Kelimeler</CardTitle>
              <CardDescription>
                Sayfanızda en sık geçen anahtar kelimeler ve yoğunlukları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.topKeywords.slice(0, 10).map((keyword, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="w-8 justify-center">
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
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Density Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Yoğunluk Rehberi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span className="text-sm text-text-secondary">
                    <strong>%2-3:</strong> İdeal yoğunluk - SEO için optimize
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent-amber" />
                  <span className="text-sm text-text-secondary">
                    <strong>%1-2 veya %3-5:</strong> Kabul edilebilir - İyileştirilebilir
                  </span>
                </div>
                <div className="flex items-center gap-3">
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
            <Card>
              <CardHeader>
                <CardTitle>Öneriler</CardTitle>
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
        </div>
      )}
    </div>
  );
}
