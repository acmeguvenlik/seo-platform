"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function FaviconCheckerPage() {
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
      const response = await fetch("/api/tools/favicon-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Favicon kontrolü başarısız");
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
      title="Favicon Kontrolü"
      description="Website favicon'larını kontrol edin. Tüm boyutlar ve formatlar için doğrulama."
      icon={<Image className="w-6 h-6" />}
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
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Skor</p>
                  <p className={cn(theme.stat.value, getScoreColor(result.score))}>
                    {result.score}
                  </p>
                </div>
                <div>
                  <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Toplam</p>
                  <p className={cn(theme.stat.value, "text-[var(--accent-teal)]")}>
                    {result.summary.total}
                  </p>
                </div>
                <div>
                  <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Durum</p>
                  <Badge variant={result.summary.hasStandard ? "success" : "error"}>
                    {result.summary.hasStandard ? "Mevcut" : "Eksik"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.favicons && result.favicons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Bulunan Favicon'lar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.favicons.map((favicon: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-subtle)]">
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                    <div className="flex-1">
                      <p className={cn(theme.text.small, "font-medium")}>{favicon.type}</p>
                      <p className={cn(theme.text.small, theme.text.muted, "break-all")}>
                        {favicon.url}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {result.issues && result.issues.length > 0 && (
            <Card className="border-[var(--error)]">
              <CardHeader>
                <CardTitle className="text-[var(--error)]">Sorunlar</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.issues.map((issue: string, index: number) => (
                    <li key={index} className={cn(theme.text.small, "flex items-start gap-2")}>
                      <XCircle className="w-4 h-4 text-[var(--error)] mt-1 flex-shrink-0" />
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
  return "text-[var(--warning)]";
}
