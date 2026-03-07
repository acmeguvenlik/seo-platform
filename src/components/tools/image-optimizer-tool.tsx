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
import { Image as ImageIcon, AlertCircle, CheckCircle2, FileImage } from "lucide-react";

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
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageOptimizerResult | null>(null);
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

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                {t("analyze")}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              {t("optimizationScore")}
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className={`text-5xl font-bold ${
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
                />
                <p className="text-sm text-text-muted mt-2">
                  {t("scoreDescription")}
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              {t("statistics")}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">
                  {result.totalImages}
                </div>
                <div className="text-sm text-text-secondary">{t("totalImages")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-success mb-1">
                  {result.imagesWithAlt}
                </div>
                <div className="text-sm text-text-secondary">{t("withAlt")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-error mb-1">
                  {result.imagesWithoutAlt}
                </div>
                <div className="text-sm text-text-secondary">{t("withoutAlt")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">
                  {result.lazyLoadedImages}
                </div>
                <div className="text-sm text-text-secondary">{t("lazyLoaded")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {Math.round((result.imagesWithAlt / result.totalImages) * 100)}%
                </div>
                <div className="text-sm text-text-secondary">{t("altCoverage")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {result.processingTime}ms
                </div>
                <div className="text-sm text-text-secondary">{t("processingTime")}</div>
              </div>
            </div>
          </Card>

          {/* Issues */}
          {result.issues.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-error" />
                {t("issues")}
              </h3>
              <div className="space-y-2">
                {result.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary"
                  >
                    {issue}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                {t("suggestions")}
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Images List */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <FileImage className="h-5 w-5 text-accent-teal" />
              {t("imagesList")} ({result.images.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {result.images.map((image, index) => (
                <div
                  key={index}
                  className="p-4 bg-bg-elevated rounded-lg border border-border-default"
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
                      <div className="text-sm text-text-primary truncate mb-1">
                        {image.src}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {image.hasAlt ? (
                          <Badge variant="success" className="text-xs">
                            Alt: {image.alt}
                          </Badge>
                        ) : (
                          <Badge variant="error" className="text-xs">
                            Alt eksik
                          </Badge>
                        )}
                        {image.isLazy && (
                          <Badge variant="teal" className="text-xs">
                            Lazy
                          </Badge>
                        )}
                        {image.format && (
                          <Badge variant="default" className="text-xs">
                            {image.format.toUpperCase()}
                          </Badge>
                        )}
                        {image.width && image.height && (
                          <Badge variant="default" className="text-xs">
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
          </Card>
        </div>
      )}
    </div>
  );
}
