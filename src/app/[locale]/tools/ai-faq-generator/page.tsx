"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { HelpCircle, Copy, CheckCircle, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { theme, cn } from "@/lib/theme-classes";

export default function AIFAQGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("10");
  const [language, setLanguage] = useState("tr");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleAnalyze = async () => {
    if (!topic) {
      setError("Lütfen bir konu girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/faq-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic, 
          targetAudience, 
          numberOfQuestions: parseInt(numberOfQuestions),
          language 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "FAQ oluşturma başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const copyFAQ = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copySchema = async () => {
    if (result?.schemaMarkup) {
      await navigator.clipboard.writeText(JSON.stringify(result.schemaMarkup, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  return (
    <ToolPageTemplate
      title="AI SSS Oluşturucu"
      description="Yapay zeka ile SEO-friendly sıkça sorulan sorular oluşturun. Schema markup ile birlikte."
      icon={<HelpCircle className="w-6 h-6" />}
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
            placeholder="Örn: WordPress Güvenliği"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Hedef Kitle (Opsiyonel)</Label>
          <Input
            id="audience"
            placeholder="Örn: Yeni başlayanlar"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="count">Soru Sayısı</Label>
          <Select
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(e.target.value)}
            options={[
              { value: "5", label: "5 Soru" },
              { value: "10", label: "10 Soru" },
              { value: "15", label: "15 Soru" },
              { value: "20", label: "20 Soru" },
            ]}
            className={theme.input.base}
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
            ]}
            className={theme.input.base}
          />
        </div>
      </div>

      {result && !loading && result.faqs && (
        <div className="mt-6 space-y-4">
          {result.faqs.map((faq: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={cn(theme.text.body, "font-semibold")}>{faq.question}</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyFAQ(`Q: ${faq.question}\nA: ${faq.answer}`, index)}
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className={cn(theme.text.small, theme.text.muted)}>{faq.answer}</p>
                  <div className="flex gap-2">
                    <Badge variant={getCategoryVariant(faq.category)}>{faq.category}</Badge>
                    <Badge variant={getVolumeVariant(faq.searchVolume)}>
                      Arama: {faq.searchVolume}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {result.schemaMarkup && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Schema Markup (JSON-LD)
                  </CardTitle>
                  <Button onClick={copySchema} size="sm" variant="outline">
                    {copiedSchema ? (
                      <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className={cn(
                  theme.text.mono,
                  "text-xs bg-[var(--bg-subtle)] p-4 rounded-lg overflow-x-auto"
                )}>
                  {JSON.stringify(result.schemaMarkup, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolPageTemplate>
  );
}

function getCategoryVariant(category: string): "default" | "teal" | "success" | "amber" | "error" {
  if (category === "basic") return "success";
  if (category === "intermediate") return "amber";
  return "error";
}

function getVolumeVariant(volume: string): "default" | "teal" | "success" | "amber" | "error" {
  if (volume === "high") return "success";
  if (volume === "medium") return "amber";
  return "default";
}
