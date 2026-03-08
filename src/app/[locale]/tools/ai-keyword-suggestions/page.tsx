"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function AIKeywordSuggestionsPage() {
  const [topic, setTopic] = useState("");
  const [seedKeywords, setSeedKeywords] = useState("");
  const [language, setLanguage] = useState("tr");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!topic && !seedKeywords) {
      setError("Lütfen bir konu veya tohum anahtar kelime girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/keyword-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, seedKeywords, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Anahtar kelime önerileri oluşturma başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const renderKeywordGroup = (title: string, keywords: any[], icon: React.ReactNode) => {
    if (!keywords || keywords.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title} ({keywords.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {keywords.map((kw: any, index: number) => (
            <div key={index} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[var(--bg-subtle)]">
              <div className="flex-1">
                <p className={cn(theme.text.body, "font-medium mb-2")}>{kw.keyword}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getVolumeVariant(kw.volume)}>
                    Hacim: {kw.volume}
                  </Badge>
                  <Badge variant={getCompetitionVariant(kw.competition)}>
                    Rekabet: {kw.competition}
                  </Badge>
                  <Badge variant="default">{kw.intent}</Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <ToolPageTemplate
      title="AI Anahtar Kelime Önerileri"
      description="Yapay zeka ile kapsamlı anahtar kelime araştırması yapın. Birincil, uzun kuyruk, LSI ve soru tabanlı anahtar kelimeler."
      icon={<Key className="w-6 h-6" />}
      category="AI Araçları"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Konu</Label>
          <Input
            id="topic"
            placeholder="Örn: Web Tasarım Hizmetleri"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seedKeywords">Tohum Anahtar Kelimeler (Opsiyonel)</Label>
          <Textarea
            id="seedKeywords"
            placeholder="web tasarım, responsive tasarım, UI/UX"
            value={seedKeywords}
            onChange={(e) => setSeedKeywords(e.target.value)}
            className={theme.input.base}
            rows={2}
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

      {result && !loading && result.keywords && (
        <div className="mt-6 space-y-4">
          {renderKeywordGroup(
            "Birincil Anahtar Kelimeler",
            result.keywords.primary,
            <Key className="w-5 h-5 text-[var(--accent-teal)]" />
          )}
          {renderKeywordGroup(
            "Uzun Kuyruk Anahtar Kelimeler",
            result.keywords.longTail,
            <Key className="w-5 h-5 text-[var(--success)]" />
          )}
          {renderKeywordGroup(
            "LSI Anahtar Kelimeler",
            result.keywords.lsi,
            <Key className="w-5 h-5 text-[var(--info)]" />
          )}
          {renderKeywordGroup(
            "Soru Tabanlı Anahtar Kelimeler",
            result.keywords.questions,
            <Key className="w-5 h-5 text-[var(--warning)]" />
          )}
          {result.keywords.local && result.keywords.local.length > 0 && renderKeywordGroup(
            "Yerel Anahtar Kelimeler",
            result.keywords.local,
            <Key className="w-5 h-5 text-[var(--accent-teal)]" />
          )}
        </div>
      )}
    </ToolPageTemplate>
  );
}

function getVolumeVariant(volume: string): "default" | "teal" | "success" | "amber" | "error" {
  if (volume === "high") return "success";
  if (volume === "medium") return "amber";
  return "default";
}

function getCompetitionVariant(competition: string): "default" | "teal" | "success" | "amber" | "error" {
  if (competition === "low") return "success";
  if (competition === "medium") return "amber";
  return "error";
}
