"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!keyword.trim()) {
      setError("Lütfen bir anahtar kelime girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/keyword-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Araştırma başarısız");
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
      title="Keyword Research"
      description="Anahtar kelime araştırması yapın ve SEO stratejinizi güçlendirin."
      icon={<Search className="w-6 h-6" />}
      category="İçerik Analizi"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="keyword">Seed Keyword</Label>
          <Input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="seo tools"
            className="mt-2"
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            Araştırmak istediğiniz ana anahtar kelimeyi girin
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}
