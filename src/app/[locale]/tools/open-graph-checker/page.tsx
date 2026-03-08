"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function OpenGraphCheckerPage() {
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
      const response = await fetch("/api/tools/open-graph-checker", {
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
      title="Open Graph Checker"
      description="Facebook ve diğer sosyal medya platformları için Open Graph tag'lerini kontrol edin."
      icon={<Share2 className="w-6 h-6" />}
      category="Sosyal Medya"
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
            Open Graph tag'lerini kontrol etmek istediğiniz sayfa
          </p>
        </div>

        <div className={cn(theme.alert.info)}>
          <p className={theme.text.small}>
            <strong>Open Graph:</strong> Sosyal medyada paylaşıldığında içeriğinizin nasıl görüneceğini kontrol eden meta tag'ler
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}
