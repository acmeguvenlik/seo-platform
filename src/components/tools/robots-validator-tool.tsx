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
import { Shield, AlertCircle, CheckCircle2, FileText, Download } from "lucide-react";

interface RobotsResult {
  url: string;
  hasRobotsTxt: boolean;
  content: string;
  rules: Array<{ userAgent: string; allows: string[]; disallows: string[] }>;
  sitemaps: string[];
  crawlDelay?: number;
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function RobotsValidatorTool() {
  const t = useTranslations("tools.robotsValidator");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RobotsResult | null>(null);
  const [error, setError] = useState("");

  const handleValidate = async () => {
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
      const response = await fetch("/api/tools/robots-validator", {
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
          <Button onClick={handleValidate} disabled={loading} variant="primary" className="w-full">
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("validating")}
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                {t("validate")}
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
            <h3 className="text-lg font-medium text-text-primary mb-4">Validation Score</h3>
            <div className="flex items-center gap-4">
              <div className={`text-5xl font-bold ${result.score >= 80 ? "text-success" : result.score >= 60 ? "text-accent-teal" : "text-error"}`}>
                {result.score}
              </div>
              <div className="flex-1">
                <Progress value={result.score} variant={result.score >= 80 ? "success" : result.score >= 60 ? "default" : "error"} />
                <p className="text-sm text-text-muted mt-2">
                  {result.hasRobotsTxt ? "robots.txt found" : "robots.txt not found"}
                </p>
              </div>
            </div>
          </Card>

          {result.hasRobotsTxt && (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-medium text-text-primary mb-4">Rules ({result.rules.length})</h3>
                <div className="space-y-3">
                  {result.rules.map((rule, idx) => (
                    <div key={idx} className="p-4 bg-bg-elevated rounded-lg border border-border-default">
                      <div className="font-medium text-text-primary mb-2">User-agent: {rule.userAgent}</div>
                      {rule.disallows.length > 0 && (
                        <div className="text-sm text-text-secondary">
                          Disallow: {rule.disallows.join(", ")}
                        </div>
                      )}
                      {rule.allows.length > 0 && (
                        <div className="text-sm text-success">
                          Allow: {rule.allows.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {result.sitemaps.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-text-primary mb-4">Sitemaps ({result.sitemaps.length})</h3>
                  <div className="space-y-2">
                    {result.sitemaps.map((sitemap, idx) => (
                      <div key={idx} className="p-3 bg-bg-elevated rounded-lg border border-border-default text-sm text-text-secondary truncate">
                        {sitemap}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}

          {result.issues.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-error" />
                Issues Found
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
