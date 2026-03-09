"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Braces, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { theme, cn } from "@/lib/theme-classes";

export default function AISchemaGeneratorPage() {
  const [url, setUrl] = useState("");
  const [schemaType, setSchemaType] = useState("Organization");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!url) {
      setError("Lütfen bir URL girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/schema-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, schemaType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Schema oluşturma başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const copySchema = async () => {
    if (result?.schema) {
      await navigator.clipboard.writeText(JSON.stringify(result.schema, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolPageTemplate
      title="AI Schema Oluşturucu"
      description="Yapay zeka ile otomatik schema markup (JSON-LD) oluşturun. SEO için yapılandırılmış veri."
      icon={<Braces className="w-6 h-6" />}
      category="AI Araçları"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schemaType">Schema Tipi</Label>
          <Select
            value={schemaType}
            onChange={(e) => setSchemaType(e.target.value)}
            options={[
              { value: "Organization", label: "Organization (Kuruluş)" },
              { value: "LocalBusiness", label: "Local Business (Yerel İşletme)" },
              { value: "Product", label: "Product (Ürün)" },
              { value: "Article", label: "Article (Makale)" },
              { value: "Person", label: "Person (Kişi)" },
              { value: "Event", label: "Event (Etkinlik)" },
              { value: "Recipe", label: "Recipe (Tarif)" },
              { value: "Course", label: "Course (Kurs)" },
            ]}
            className={theme.input.base}
          />
        </div>
      </div>

      {result && !loading && (
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Oluşturulan Schema</CardTitle>
                <Button onClick={copySchema} size="sm" variant="outline">
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className={cn(
                theme.text.mono,
                "text-xs bg-[var(--bg-subtle)] p-4 rounded-lg overflow-x-auto"
              )}>
                {JSON.stringify(result.schema, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {result.recommendations && result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Öneriler</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className={cn(theme.text.small, "flex items-start gap-2")}>
                      <span className="text-[var(--accent-teal)] mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolPageTemplate>
  );
}
