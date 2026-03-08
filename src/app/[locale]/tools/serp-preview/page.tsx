"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function SerpPreviewPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Lütfen başlık ve açıklama girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/serp-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url }),
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
      title="SERP Preview"
      description="Sayfanızın Google arama sonuçlarında nasıl görüneceğini önizleyin. Title ve description'ınızı optimize edin."
      icon={<Eye className="w-6 h-6" />}
      category="SEO Analizi"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Sayfa Başlığı (Title)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="En İyi SEO Araçları 2024"
            className="mt-2"
            maxLength={70}
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            {title.length}/70 karakter (optimal: 50-60)
          </p>
        </div>

        <div>
          <Label htmlFor="description">Meta Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="SEO için en iyi araçları keşfedin..."
            className="mt-2"
            rows={3}
            maxLength={180}
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            {description.length}/180 karakter (optimal: 120-160)
          </p>
        </div>

        <div>
          <Label htmlFor="url">URL (Opsiyonel)</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/seo-araclari"
            className="mt-2"
          />
        </div>
      </div>
    </ToolPageTemplate>
  );
}
