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
import { Code, AlertCircle, CheckCircle2, Copy } from "lucide-react";

interface SchemaResult {
  url: string;
  hasSchema: boolean;
  schemas: Array<{ type: string; found: boolean; data?: any }>;
  totalSchemas: number;
  score: number;
  generatedSchema: any;
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

export function SchemaGeneratorTool() {
  const t = useTranslations("tools.schemaGenerator");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchemaResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
      const response = await fetch("/api/tools/schema-generator", {
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

  const copySchema = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result.generatedSchema, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          <Button onClick={handleGenerate} disabled={loading} variant="primary" className="w-full">
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("generating")}
              </>
            ) : (
              <>
                <Code className="mr-2 h-4 w-4" />
                {t("generate")}
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
            <h3 className="text-lg font-medium text-text-primary mb-4">Schema Score</h3>
            <div className="flex items-center gap-4">
              <div className={`text-5xl font-bold ${result.score >= 80 ? "text-success" : result.score >= 60 ? "text-accent-teal" : "text-error"}`}>
                {result.score}
              </div>
              <div className="flex-1">
                <Progress value={result.score} variant={result.score >= 80 ? "success" : result.score >= 60 ? "default" : "error"} />
                <p className="text-sm text-text-muted mt-2">
                  {result.totalSchemas} schema(s) found
                </p>
              </div>
            </div>
          </Card>

          {result.schemas.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Existing Schemas</h3>
              <div className="space-y-2">
                {result.schemas.map((schema, idx) => (
                  <div key={idx} className="p-3 bg-bg-elevated rounded-lg border border-border-default">
                    <Badge variant="teal">{schema.type}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">Generated Schema</h3>
              <Button onClick={copySchema} variant="secondary" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 bg-bg-base rounded-lg border border-border-default overflow-x-auto text-xs text-text-secondary">
              {JSON.stringify(result.generatedSchema, null, 2)}
            </pre>
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
