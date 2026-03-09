"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function SecurityHeadersCheckerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url) {
      setError("Lütfen bir URL girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/security-headers-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Güvenlik başlıkları kontrolü başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Güvenlik Başlıkları Kontrolü"
      description="HTTP güvenlik başlıklarını kontrol edin. HSTS, CSP, X-Frame-Options ve daha fazlası."
      icon={<Shield className="w-6 h-6" />}
      category="Teknik SEO"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
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

      {result && !loading && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Skor</p>
                <p className={cn(theme.stat.value, getScoreColor(result.score))}>
                  {result.score}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Not</p>
                <Badge variant={getGradeVariant(result.grade)} className="text-lg px-4 py-1">
                  {result.grade}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Mevcut</p>
                <p className={cn(theme.stat.value, "text-[var(--accent-teal)]")}>
                  {result.summary.present}/{result.summary.total}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Başlıkları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(result.headers).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[var(--bg-subtle)]">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[var(--error)]" />
                      )}
                      <span className={cn(theme.text.small, "font-medium")}>{key}</span>
                    </div>
                    {value && (
                      <p className={cn(theme.text.small, theme.text.muted, "ml-6 break-all")}>
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {result.issues && result.issues.length > 0 && (
            <Card className="border-[var(--error)]">
              <CardHeader>
                <CardTitle className="text-[var(--error)]">Sorunlar</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.issues.map((issue: string, index: number) => (
                    <li key={index} className={cn(theme.text.small, "flex items-start gap-2")}>
                      <span className="text-[var(--error)] mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

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

function getScoreColor(score: number): string {
  if (score >= 80) return "text-[var(--success)]";
  if (score >= 60) return "text-[var(--info)]";
  if (score >= 40) return "text-[var(--warning)]";
  return "text-[var(--error)]";
}

function getGradeVariant(grade: string): "default" | "teal" | "success" | "amber" | "error" {
  if (grade === "A") return "success";
  if (grade === "B") return "teal";
  if (grade === "C") return "amber";
  return "error";
}
