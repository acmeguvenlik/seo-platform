"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Image as ImageIcon, AlertCircle, CheckCircle2, FileImage, Sparkles } from "lucide-react";
import { ModernToolInput } from "./modern-tool-input";

interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  hasAlt: boolean;
  hasTitle: boolean;
  isLazy: boolean;
  issues: string[];
}

interface ImageOptimizerResult {
  url: string;
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  lazyLoadedImages: number;
  images: ImageData[];
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function ImageOptimizerTool() {
  const t = useTranslations("tools.imageOptimizer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageOptimizerResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/image-optimizer", {
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

  const getScoreColor = (score: number): "default" | "success" | "warning" | "error" => {
    if (score >= 80) return "success";
    if (score >= 60) return "default";
    if (score >= 40) return "warning";
    return "error";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <ModernToolInput
        placeholder="https://example.com"
        buttonText="Görselleri Analiz Et"
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeUp">
          {/* Score */}
          <Card className="border-2 hover:border-accent-teal/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-accent-teal" />
                </div>
                Optimizasyon Skoru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-bold transition-all duration-500 ${
                  result.score >= 80 ? "text-success" : 
                  result.score >= 60 ? "text-accent-teal" : 
                  result.score >= 40 ? "text-accent-amber" : "text-error"
                }`}>
                  {result.score}
                </div>
                <div className="flex-1">
                  <Progress 
                    value={result.score} 
                    variant={getScoreColor(result.score)}
                    className="h-3"
                  />
                  <p className="text-sm text-text-muted mt-2">
                    Görsel optimizasyon performansı
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-2 hover:border-accent-teal/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-teal" />
                İstatistikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-accent-teal/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-teal mb-1 transition-all duration-500">
                    {result.totalImages}
                  </div>
                  <div className="text-sm text-text-secondary">Toplam Görsel</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-success/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-success mb-1 transition-all duration-500">
                    {result.imagesWithAlt}
                  </div>
                  <div className="text-sm text-text-secondary">Alt Metni Var</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-error/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-error mb-1 transition-all duration-500">
                    {result.imagesWithoutAlt}
                  </div>
                  <div className="text-sm text-text-secondary">Alt Metni Yok</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-teal mb-1 transition-all duration-500">
                    {result.lazyLoadedImages}
                  </div>
                  <div className="text-sm text-text-secondary">Lazy Loading</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-3xl font-bold text-text-primary mb-1 transition-all duration-500">
                    {Math.round((result.imagesWithAlt / result.totalImages) * 100)}%
                  </div>
                  <div className="text-sm text-text-secondary">Alt Kapsama</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-3xl font-bold text-text-primary mb-1 transition-all duration-500">
                    {result.processingTime}ms
                  </div>
                  <div className="text-sm text-text-secondary">İşlem Süresi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          {result.issues.length > 0 && (
            <Card className="border-2 border-error/20 hover:border-error/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-error/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-error" />
                  </div>
                  Tespit Edilen Sorunlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="p-3 bg-bg-elevated rounded-lg border border-border-default hover:border-error/30 hover:bg-error/5 transition-all text-sm text-text-secondary"
                    >
                      {issue}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="border-2 border-success/20 hover:border-success/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  Öneriler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-bg-elevated rounded-lg border border-border-default hover:border-success/30 hover:bg-success/5 transition-all text-sm text-text-secondary"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images List */}
          <Card className="border-2 border-border-default hover:border-accent-teal/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                  <FileImage className="h-5 w-5 text-accent-teal" />
                </div>
                Görsel Listesi ({result.images.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.images.map((image, index) => (
                  <div
                    key={index}
                    className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:border-accent-teal/30 hover:bg-bg-overlay transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-bg-subtle rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                          src={image.src} 
                          alt={image.alt || "Image"} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate mb-1 group-hover:text-accent-teal transition-colors">
                          {image.src}
                        </div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {image.hasAlt ? (
                            <Badge variant="success" className="text-xs hover:scale-105 transition-transform">
                              Alt: {image.alt}
                            </Badge>
                          ) : (
                            <Badge variant="error" className="text-xs hover:scale-105 transition-transform">
                              Alt eksik
                            </Badge>
                          )}
                          {image.isLazy && (
                            <Badge variant="teal" className="text-xs hover:scale-105 transition-transform">
                              Lazy
                            </Badge>
                          )}
                          {image.format && (
                            <Badge variant="default" className="text-xs hover:scale-105 transition-transform">
                              {image.format.toUpperCase()}
                            </Badge>
                          )}
                          {image.width && image.height && (
                            <Badge variant="default" className="text-xs hover:scale-105 transition-transform">
                              {image.width}x{image.height}
                            </Badge>
                          )}
                        </div>
                        {image.issues.length > 0 && (
                          <div className="space-y-1">
                            {image.issues.map((issue, idx) => (
                              <div key={idx} className="text-xs text-error">
                                • {issue}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
