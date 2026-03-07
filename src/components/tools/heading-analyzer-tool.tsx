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
import { Heading as HeadingIcon, AlertCircle, CheckCircle2 } from "lucide-react";

interface HeadingResult {
  url: string;
  headings: Array<{ level: number; text: string; length: number }>;
  structure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    total: number;
  };
  score: number;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function HeadingAnalyzerTool() {
  const t = useTranslations("tools.headingAnalyzer");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeadingResult | null>(null);
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
      const response = await fetch("/api/tools/heading-analyzer", {
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
                <HeadingIcon className="mr-2 h-4 w-4" />
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
            <h3 className="text-lg font-medium text-text-primary mb-4">Structure Score</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className={`text-5xl font-bold ${result.score >= 80 ? "text-success" : result.score >= 60 ? "text-accent-teal" : "text-error"}`}>
                {result.score}
              </div>
              <div className="flex-1">
                <Progress value={result.score} variant={result.score >= 80 ? "success" : result.score >= 60 ? "default" : "error"} />
                <p className="text-sm text-text-muted mt-2">{result.structure.total} total headings</p>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <div key={level} className="p-3 bg-bg-elevated rounded-lg border border-border-default text-center">
                  <div className="text-xs text-text-muted mb-1">H{level}</div>
                  <div className="text-xl font-bold text-text-primary">
                    {result.structure[`h${level}Count` as keyof typeof result.structure]}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Heading Hierarchy</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {result.headings.map((heading, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-bg-elevated rounded-lg border border-border-default"
                  style={{ marginLeft: `${(heading.level - 1) * 16}px` }}
                >
                  <div className="flex items-start gap-3">
                    <Badge variant={heading.level === 1 ? "teal" : "default"} className="text-xs flex-shrink-0">
                      H{heading.level}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary truncate">{heading.text}</div>
                      <div className="text-xs text-text-muted">{heading.length} characters</div>
                    </div>
                  </div>
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
