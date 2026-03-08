"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Sparkles, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { theme, cn } from "@/lib/theme-classes";

export default function AIMetaGeneratorPage() {
  const [url, setUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("tr");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) {
      setError("Lütfen bir URL girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const targetKeywords = keywords ? keywords.split(",").map(k => k.trim()) : [];
      
      const response = await fetch("/api/ai/meta-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url, 
          currentTitle, 
          currentDescription, 
          content,
          targetKeywords,
          language 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Meta etiket oluşturma başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderMetaField = (title: string, value: string, field: string, maxLength?: number) => {
    if (!value) return null;

    const length = value.length;
    const isOptimal = maxLength ? length >= maxLength * 0.8 && length <= maxLength : true;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className={theme.text.small}>{title}</Label>
          <div className="flex items-center gap-2">
            {maxLength && (
              <span className={cn(
                theme.text.small,
                isOptimal ? "text-[var(--success)]" : "text-[var(--warning)]"
              )}>
                {length}/{maxLength}
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(value, field)}
            >
              {copiedField === field ? (
                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-lg bg-[var(--bg-subtle)]",
          theme.text.small
        )}>
          {value}
        </div>
      </div>
    );
  };

  return (
    <ToolPageTemplate
      title="AI Meta Etiket Oluşturucu"
      description="Yapay zeka ile SEO-optimized meta başlık, açıklama ve sosyal medya etiketleri oluşturun."
      icon={<Sparkles className="w-6 h-6" />}
      category="AI Araçları"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentTitle">Mevcut Başlık (Opsiyonel)</Label>
          <Input
            id="currentTitle"
            placeholder="Mevcut meta başlık"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentDescription">Mevcut Açıklama (Opsiyonel)</Label>
          <Textarea
            id="currentDescription"
            placeholder="Mevcut meta açıklama"
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            className={theme.input.base}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Sayfa İçeriği (Opsiyonel)</Label>
          <Textarea
            id="content"
            placeholder="Sayfa içeriğinin bir kısmını yapıştırın"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={theme.input.base}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Hedef Anahtar Kelimeler (Opsiyonel)</Label>
          <Input
            id="keywords"
            placeholder="anahtar1, anahtar2, anahtar3"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
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
          {/* Basic Meta Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Meta Etiketler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderMetaField("Meta Başlık", result.title, "title", 60)}
              {renderMetaField("Meta Açıklama", result.description, "description", 160)}
              {result.keywords && result.keywords.length > 0 && (
                <div className="space-y-2">
                  <Label className={theme.text.small}>Anahtar Kelimeler</Label>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] text-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Open Graph Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Open Graph (Facebook)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderMetaField("OG Başlık", result.ogTitle, "ogTitle")}
              {renderMetaField("OG Açıklama", result.ogDescription, "ogDescription")}
            </CardContent>
          </Card>

          {/* Twitter Card Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Twitter Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderMetaField("Twitter Başlık", result.twitterTitle, "twitterTitle")}
              {renderMetaField("Twitter Açıklama", result.twitterDescription, "twitterDescription")}
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Önerileri</CardTitle>
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
