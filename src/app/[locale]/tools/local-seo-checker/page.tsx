"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function LocalSeoCheckerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Lütfen bir URL girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/local-seo-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kontrol başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Local SEO Checker"
      description="Yerel SEO'nuzu kontrol edin ve yerel aramalarda öne çıkın."
      icon={<MapPin className="w-6 h-6" />}
      category="SEO Analizi"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="url">Business Website URL</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="mt-2"
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            Yerel SEO kontrol etmek istediğiniz işletme web sitesinin URL'sini girin
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}
