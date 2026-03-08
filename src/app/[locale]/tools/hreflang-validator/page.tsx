"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function HreflangValidatorPage() {
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
      const response = await fetch("/api/tools/hreflang-validator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analiz başarısız");
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
      title="Hreflang Validator"
      description="Çok dilli web siteleri için hreflang tag'lerini doğrulayın. Uluslararası SEO'nuzu optimize edin."
      icon={<Globe className="w-6 h-6" />}
      category="SEO Analizi"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="mt-2"
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            Hreflang tag'lerini kontrol etmek istediğiniz sayfa
          </p>
        </div>

        <div className={cn(theme.alert.info)}>
          <p className={theme.text.small}>
            <strong>Hreflang:</strong> Arama motorlarına sayfanızın hangi dil ve bölge için olduğunu bildiren tag'ler
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}
