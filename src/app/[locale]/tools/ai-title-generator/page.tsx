"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Heading, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { theme, cn } from "@/lib/theme-classes";

export default function AITitleGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!topic) {
      setError("Lütfen bir konu girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/title-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Başlık oluşturma başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolPageTemplate
      title="AI Başlık Oluşturucu"
      description="Yapay zeka ile SEO-optimized, dikkat çekici başlıklar oluşturun. 10 farklı başlık önerisi alın."
      icon={<Heading className="w-6 h-6" />}
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
            placeholder="Örn: WordPress SEO Optimizasyonu"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Anahtar Kelimeler (Opsiyonel)</Label>
          <Textarea
            id="keywords"
            placeholder="SEO, WordPress, optimizasyon"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={theme.input.base}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Ton</Label>
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            options={[
              { value: "professional", label: "Profesyonel" },
              { value: "casual", label: "Gündelik" },
              { value: "friendly", label: "Samimi" },
              { value: "authoritative", label: "Otoriter" },
              { value: "enthusiastic", label: "Coşkulu" },
            ]}
            className={theme.input.base}
          />
        </div>
      </div>

      {result && !loading && result.titles && (
        <div className="mt-6 space-y-3">
          {result.titles.map((item: any, index: number) => (
            <Card key={index} className="hover:border-[var(--accent-teal)] transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={cn(theme.text.body, "font-medium mb-2")}>{item.title}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">{item.style}</Badge>
                      <Badge variant="teal">{item.length} karakter</Badge>
                      <Badge variant={item.score >= 80 ? "success" : item.score >= 60 ? "amber" : "default"}>
                        Skor: {item.score}/100
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.title, index)}
                    className="flex-shrink-0"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ToolPageTemplate>
  );
}
