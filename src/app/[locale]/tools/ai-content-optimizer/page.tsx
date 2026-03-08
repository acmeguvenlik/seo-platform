"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Wand2, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function AIContentOptimizerPage() {
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [language, setLanguage] = useState("tr");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!content || !targetKeyword) {
      setError("Lütfen içerik ve hedef anahtar kelime girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const urls = competitorUrls ? competitorUrls.split("\n").map(u => u.trim()).filter(Boolean) : [];
      
      const response = await fetch("/api/ai/content-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content, 
          targetKeyword, 
          competitorUrls: urls,
          language 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "İçerik optimizasyonu başarısız");
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
      title="AI İçerik Optimize Edici"
      description="Yapay zeka ile içeriğinizi SEO için optimize edin. Anahtar kelime yoğunluğu, okunabilirlik ve SEO skoru iyileştirmeleri."
      icon={<Wand2 className="w-6 h-6" />}
      category="AI Araçları"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">İçerik</Label>
          <Textarea
            id="content"
            placeholder="Optimize edilecek içeriği buraya yapıştırın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={theme.input.base}
            rows={8}
          />
          <p className={cn(theme.text.small, theme.text.muted)}>
            {content.length} karakter
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetKeyword">Hedef Anahtar Kelime</Label>
          <Input
            id="targetKeyword"
            placeholder="Örn: SEO optimizasyonu"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitorUrls">Rakip URL'leri (Opsiyonel)</Label>
          <Textarea
            id="competitorUrls"
            placeholder="Her satıra bir URL&#10;https://competitor1.com&#10;https://competitor2.com"
            value={competitorUrls}
            onChange={(e) => setCompetitorUrls(e.target.value)}
            className={theme.input.base}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Dil</Label>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: "tr", label: "Türkçe" },
              { value: "en", label: "İngilizce" },
              { value: "de", label: "Almanca" },
              { value: "es", label: "İspanyolca" },
              { value: "fr", label: "Fransızca" },
            ]}
            className={theme.input.base}
          />
        </div>
      </div>

      {result && !loading && (
        <div className="mt-6 space-y-4">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>SEO Skoru</p>
                <p className={cn(theme.stat.value, getScoreColor(result.seoScore))}>
                  {result.seoScore}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Okunabilirlik</p>
                <p className={cn(theme.stat.value, getScoreColor(result.readabilityScore))}>
                  {result.readabilityScore}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className={cn(theme.text.small, theme.text.muted, "mb-1")}>Kelime Yoğunluğu</p>
                <p className={cn(theme.stat.value, "text-[var(--accent-teal)]")}>
                  {result.keywordDensity.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Optimized Content */}
          <Card>
            <CardHeader>
              <CardTitle>Optimize Edilmiş İçerik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "p-4 rounded-lg bg-[var(--bg-subtle)]",
                theme.text.small,
                "whitespace-pre-wrap"
              )}>
                {result.optimizedContent}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="default">
                  Orijinal: {result.originalLength} karakter
                </Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge variant="teal">
                  Optimize: {result.optimizedLength} karakter
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          {result.improvements && result.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  İyileştirmeler ({result.improvements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.improvements.map((improvement: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--accent-teal)] pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">{improvement.category}</Badge>
                      <Badge variant={getImpactVariant(improvement.impact)}>
                        {improvement.impact}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className={cn(theme.text.small, "font-medium mb-1")}>Önce:</p>
                        <p className={cn(theme.text.small, theme.text.muted, "italic")}>
                          {improvement.before}
                        </p>
                      </div>
                      <div>
                        <p className={cn(theme.text.small, "font-medium mb-1")}>Sonra:</p>
                        <p className={cn(theme.text.small, "text-[var(--success)]")}>
                          {improvement.after}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ek Öneriler</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className={cn(theme.text.small, "flex items-start gap-2")}>
                      <span className="text-[var(--accent-teal)] mt-1">•</span>
                      <span>{suggestion}</span>
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

function getImpactVariant(impact: string): "default" | "teal" | "success" | "amber" | "error" {
  if (impact === "high") return "error";
  if (impact === "medium") return "amber";
  return "success";
}
