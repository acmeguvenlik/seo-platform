"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function UrlSlugGeneratorPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Lütfen bir metin girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/url-slug-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
      title="URL Slug Generator"
      description="SEO dostu URL slug'ları oluşturun. Başlıklarınızı otomatik olarak temiz, okunabilir URL'lere dönüştürün."
      icon={<Link className="w-6 h-6" />}
      category="Teknik SEO"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="text">Metin veya Başlık</Label>
          <Input
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Örn: En İyi SEO Araçları 2024"
            className="mt-2"
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            Başlığınızı veya metninizi girin
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}
