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
import { Link2, AlertCircle, CheckCircle2, ExternalLink, TrendingUp } from "lucide-react";

interface Backlink {
  sourceUrl: string;
  anchorText: string;
  linkType: "dofollow" | "nofollow";
  isExternal: boolean;
}

interface BacklinkResult {
  url: string;
  totalBacklinks: number;
  dofollowLinks: number;
  nofollowLinks: number;
  externalLinks: number;
  internalLinks: number;
  backlinks: Backlink[];
  domainAuthority: number;
  linkQuality: "excellent" | "good" | "fair" | "poor";
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function BacklinkAnalyzerTool() {
  const t = useTranslations("tools.backlinkAnalyzer");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklinkResult | null>(null);
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
      const response = await fetch("/api/tools/backlink-analyzer", {
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

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent": return "text-success";
      case "good": return "text-accent-teal";
      case "fair": return "text-accent-amber";
      case "poor": return "text-error";
      default: return "text-text-secondary";
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "excellent": return "success";
      case "good": return "teal";
      case "fair": return "amber";
      case "poor": return "error";
      default: return "default";
    }
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
                <Link2 className="mr-2 h-4 w-4" />
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
          {/* Domain Authority */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">
                {t("domainAuthority")}
              </h3>
              <Badge variant={getQualityBadge(result.linkQuality) as any}>
                {t(`quality.${result.linkQuality}`)}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={`text-5xl font-bold ${getQualityColor(result.linkQuality)}`}>
                {result.domainAuthority}
              </div>
              <div className="flex-1">
                <Progress 
                  value={result.domainAuthority} 
                  variant={result.domainAuthority >= 70 ? "success" : result.domainAuthority >= 50 ? "default" : result.domainAuthority >= 30 ? "warning" : "error"}
                />
                <p className="text-sm text-text-muted mt-2">
                  {t("daDescription")}
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
                  {result.totalBacklinks}
                </div>
                <div className="text-sm text-text-secondary">{t("totalBacklinks")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-success mb-1">
                  {result.dofollowLinks}
                </div>
                <div className="text-sm text-text-secondary">{t("dofollowLinks")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-text-muted mb-1">
                  {result.nofollowLinks}
                </div>
                <div className="text-sm text-text-secondary">{t("nofollowLinks")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-amber mb-1">
                  {result.externalLinks}
                </div>
                <div className="text-sm text-text-secondary">{t("externalLinks")}</div>
              </div>

              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">
                  {result.internalLinks}
                </div>
                <div className="text-sm text-text-secondary">{t("internalLinks")}</div>
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

          {/* Backlinks List */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <Link2 className="h-5 w-5 text-accent-teal" />
              {t("backlinksList")} ({result.backlinks.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {result.backlinks.map((backlink, index) => (
                <div
                  key={index}
                  className="p-4 bg-bg-elevated rounded-lg border border-border-default"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate flex items-center gap-2">
                        {backlink.isExternal && (
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        )}
                        <span className="truncate">{backlink.sourceUrl}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={backlink.linkType === "dofollow" ? "success" : "default"}
                      className="text-xs flex-shrink-0"
                    >
                      {backlink.linkType}
                    </Badge>
                  </div>
                  <div className="text-xs text-text-muted">
                    Anchor: {backlink.anchorText}
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
