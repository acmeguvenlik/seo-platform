"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Download, Globe, AlertCircle, CheckCircle2, FileText } from "lucide-react";

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
  const [url, setUrl] = useState("");
  const [maxDepth, setMaxDepth] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SitemapResult | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("maxDepthLabel")}
            </label>
            <select
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-full px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal"
            >
              <option value={1}>1 seviye</option>
              <option value={2}>2 seviye</option>
              <option value={3}>3 seviye</option>
            </select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("generating")}
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                {t("generate")}
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
          {/* Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">
                {t("results")}
              </h3>
              <Button onClick={handleDownload} variant="secondary" size="sm">
                <Download className="mr-2 h-4 w-4" />
                {t("download")}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">
                  {result.totalUrls}
                </div>
                <div className="text-sm text-text-secondary">{t("totalUrls")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">
                  {result.issues.length}
                </div>
                <div className="text-sm text-text-secondary">{t("issues")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">
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
                {t("issuesFound")}
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

          {/* URL List */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-teal" />
              {t("urlList")} ({result.urls.length} / {result.totalUrls})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {result.urls.map((entry, index) => (
                <div
                  key={index}
                  className="p-3 bg-bg-elevated rounded-lg border border-border-default"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">
                        {entry.url}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {entry.priority !== undefined && (
                          <Badge variant="default" className="text-xs">
                            Priority: {entry.priority.toFixed(1)}
                          </Badge>
                        )}
                        {entry.changefreq && (
                          <Badge variant="default" className="text-xs">
                            {entry.changefreq}
                          </Badge>
                        )}
                      </div>
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
