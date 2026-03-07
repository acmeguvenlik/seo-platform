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
import { Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";

interface InternalLinksResult {
  url: string;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
  emptyAnchors: number;
  links: Array<{ href: string; anchorText: string; isNofollow: boolean }>;
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function InternalLinksTool() {
  const t = useTranslations("tools.internalLinks");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InternalLinksResult | null>(null);
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
      const response = await fetch("/api/tools/internal-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <div className="space-y-6">
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
          <Button onClick={handleAnalyze} disabled={loading} variant="primary" className="w-full">
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                {t("analyze")}
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
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Link Score</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className={`text-5xl font-bold ${result.score >= 80 ? "text-success" : result.score >= 60 ? "text-accent-teal" : "text-error"}`}>
                {result.score}
              </div>
              <div className="flex-1">
                <Progress value={result.score} variant={result.score >= 80 ? "success" : result.score >= 60 ? "default" : "error"} />
                <p className="text-sm text-text-muted mt-2">{result.internalLinks} internal links</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-teal mb-1">{result.totalLinks}</div>
                <div className="text-sm text-text-secondary">Total Links</div>
              </div>
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-success mb-1">{result.internalLinks}</div>
                <div className="text-sm text-text-secondary">Internal</div>
              </div>
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-accent-amber mb-1">{result.externalLinks}</div>
                <div className="text-sm text-text-secondary">External</div>
              </div>
              <div className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                <div className="text-2xl font-bold text-error mb-1">{result.emptyAnchors}</div>
                <div className="text-sm text-text-secondary">Empty Anchors</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Internal Links ({result.links.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {result.links.map((link, idx) => (
                <div key={idx} className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">{link.href}</div>
                    </div>
                    {link.isNofollow && (
                      <Badge variant="default" className="text-xs flex-shrink-0">nofollow</Badge>
                    )}
                  </div>
                  <div className="text-xs text-text-muted">Anchor: {link.anchorText}</div>
                </div>
              ))}
            </div>
          </Card>

          {result.issues.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-error" />
                Issues
              </h3>
              <div className="space-y-2">
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary">
                    {issue}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Suggestions
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary">
                    {suggestion}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
