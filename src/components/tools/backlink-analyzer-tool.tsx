"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link2, AlertCircle, CheckCircle2, ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import { ModernToolInput } from "./modern-tool-input";

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklinkResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
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
      <ModernToolInput
        placeholder="https://example.com"
        buttonText="Backlink Analizi"
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fadeUp">
          {/* Domain Authority */}
          <Card className="border-2 hover:border-accent-teal/30 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-accent-teal" />
                  </div>
                  Domain Authority
                </h3>
                <Badge variant={getQualityBadge(result.linkQuality) as any} className="hover:scale-105 transition-transform">
                  {t(`quality.${result.linkQuality}`)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-bold ${getQualityColor(result.linkQuality)} transition-all duration-500`}>
                  {result.domainAuthority}
                </div>
                <div className="flex-1">
                  <Progress 
                    value={result.domainAuthority} 
                    variant={result.domainAuthority >= 70 ? "success" : result.domainAuthority >= 50 ? "default" : result.domainAuthority >= 30 ? "warning" : "error"}
                    className="h-3"
                  />
                  <p className="text-sm text-text-muted mt-2">
                    Domain otoritesi SEO performansınızı etkiler
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="border-2 hover:border-accent-teal/20 transition-all duration-300">
            <div className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-accent-teal" />
                İstatistikler
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-accent-teal/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-teal mb-1 transition-all duration-500">
                    {result.totalBacklinks}
                  </div>
                  <div className="text-sm text-text-secondary">Toplam Backlink</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-success/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-success mb-1 transition-all duration-500">
                    {result.dofollowLinks}
                  </div>
                  <div className="text-sm text-text-secondary">Dofollow</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-text-muted/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-text-muted mb-1 transition-all duration-500">
                    {result.nofollowLinks}
                  </div>
                  <div className="text-sm text-text-secondary">Nofollow</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-accent-amber/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-amber mb-1 transition-all duration-500">
                    {result.externalLinks}
                  </div>
                  <div className="text-sm text-text-secondary">Dış Linkler</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] hover:border-accent-teal/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-accent-teal mb-1 transition-all duration-500">
                    {result.internalLinks}
                  </div>
                  <div className="text-sm text-text-secondary">İç Linkler</div>
                </div>

                <div className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:scale-[1.02] transition-all duration-300">
                  <div className="text-3xl font-bold text-text-primary mb-1 transition-all duration-500">
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

          {/* Backlinks List */}
          <Card className="border-2 border-border-default hover:border-accent-teal/30 transition-all duration-300">
            <div className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent-teal-dim flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-accent-teal" />
                </div>
                Backlink Listesi ({result.backlinks.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {result.backlinks.map((backlink, index) => (
                  <div
                    key={index}
                    className="p-4 bg-bg-elevated rounded-lg border border-border-default hover:border-accent-teal/30 hover:bg-bg-overlay transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate flex items-center gap-2 group-hover:text-accent-teal transition-colors">
                          {backlink.isExternal && (
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          )}
                          <span className="truncate">{backlink.sourceUrl}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={backlink.linkType === "dofollow" ? "success" : "default"}
                        className="text-xs flex-shrink-0 hover:scale-105 transition-transform"
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
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
