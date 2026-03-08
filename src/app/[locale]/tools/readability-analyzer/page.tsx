"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

export default function ReadabilityAnalyzerPage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("Lütfen içerik girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/readability-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
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
      title="Readability Analyzer"
      description="İçeriğinizin okunabilirliğini analiz edin. Flesch Reading Ease skoru ve okuma seviyesi hesaplayın."
      icon={<BookOpen className="w-6 h-6" />}
      category="İçerik Analizi"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="content">İçerik</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Analiz etmek istediğiniz içeriği buraya yapıştırın..."
            className="mt-2 font-mono"
            rows={15}
          />
          <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
            {content.split(/\s+/).filter(w => w.length > 0).length} kelime
          </p>
        </div>
      </div>
    </ToolPageTemplate>
  );
}
