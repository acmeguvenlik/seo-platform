"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Globe, AlertCircle, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { ModernToolInput } from "./modern-tool-input";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

interface SitemapResult {
  baseUrl: string;
  totalUrls: number;
  urls: SitemapEntry[];
  xmlSitemap: string;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function SitemapGeneratorTool() {
  const t = useTranslations("tools.sitemapGenerator");
  const [maxDepth, setMaxDepth] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (url: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/sitemap-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, maxDepth }),
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

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result.xmlSitemap], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <ModernToolInput
        placeholder="https://example.com"
        buttonText="Sitemap Oluştur"
        onAnalyze={handleGenerate}
        loading={loading}
        error={error}
      />

      {/* Depth Selector */}
      <Card className="border-2 border-border-default hover:border-accent-teal/30 transition-all duration-300">
        <div className="p-6">
          <label className="block text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-teal" />
            Tarama Derinliği
          </label>
          <select
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="w-full px-4 py-3 bg-bg-elevated border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-accent-teal transition-all hover:border-accent-teal/50"
          >
            <option value={1}>1 seviye (Hızlı)</option>
            <option value={2}>2 seviye (Önerilen)</option>
            <option value={3}>3 seviye (Detaylı)</option>
          </select>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeUp">
          {/* Summary */}
          <Card className="border-2 border-border-default hover:border-accent-teal/30 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent-teal" />
                  Sitemap Oluşturuldu
                </h3>
                <Button onClick={handleDownload} variant="secondary" size="sm" className="group/dl">
                  <Download className="mr-2 h-4 w-4 group-hover/dl:scale-110 transition-transform" />
                  İndir
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-accent-teal/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-teal mb-1 transition-all duration-500">
                    {result.totalUrls}
                  </div>
                  <div className="text-sm text-text-secondary">Toplam URL</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-error/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-error mb-1 transition-all duration-500">
                    {result.issues.length}
                  </div>
                  <div className="text-sm text-text-secondary">Sorun</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-success/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-success mb-1 transition-all duration-500">
                    {result.processingTime}ms
                  </div>
                  <div className="text-sm text-text-secondary">İşlem Süresi</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Issues */}
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
                    <div
                      key={index}
                      className="p-3 bg-bg-elevated rounded-lg border border-border-default hover:border-error/30 hover:bg-error/5 transition-all text-sm text-text-secondary"
                    >
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Suggestions */}
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
                    <div
                      key={index}
                      className="p-3 bg-bg-elevated rounded-lg border border-border-default hover:border-success/30 hover:bg-success/5 transition-all text-sm text-text-secondary"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* URL List */}
          <Card className="border-2 border-border-default hover:border-accent-teal/30 transition-all duration-300">
            <div className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent-teal" />
                </div>
                URL Listesi ({result.urls.length} / {result.totalUrls})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {result.urls.map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:border-accent-teal/30 hover:bg-bg-overlay transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate group-hover:text-accent-teal transition-colors">
                          {entry.url}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {entry.priority !== undefined && (
                            <Badge variant="default" className="text-xs hover:scale-105 transition-transform">
                              Priority: {entry.priority.toFixed(1)}
                            </Badge>
                          )}
                          {entry.changefreq && (
                            <Badge variant="teal" className="text-xs hover:scale-105 transition-transform">
                              {entry.changefreq}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
