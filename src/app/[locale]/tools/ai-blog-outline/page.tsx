"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function AIBlogOutlinePage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [targetLength, setTargetLength] = useState("1500");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!topic) {
      setError("Lütfen bir konu girin");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/blog-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic, 
          keywords, 
          targetLength: parseInt(targetLength),
          tone 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Taslak oluşturma başarısız");
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
      title="AI Blog Taslağı Oluşturucu"
      description="Yapay zeka ile detaylı blog yazısı taslağı oluşturun. SEO-optimized başlıklar ve yapı önerileri alın."
      icon={<FileText className="w-6 h-6" />}
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
            placeholder="Örn: E-ticaret SEO Stratejileri"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Hedef Anahtar Kelimeler (Opsiyonel)</Label>
          <Textarea
            id="keywords"
            placeholder="e-ticaret SEO, online mağaza optimizasyonu"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={theme.input.base}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Hedef Uzunluk (Kelime)</Label>
          <Select
            value={targetLength}
            onChange={(e) => setTargetLength(e.target.value)}
            options={[
              { value: "800", label: "800 kelime (Kısa)" },
              { value: "1500", label: "1500 kelime (Orta)" },
              { value: "2500", label: "2500 kelime (Uzun)" },
              { value: "4000", label: "4000+ kelime (Kapsamlı)" },
            ]}
            className={theme.input.base}
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
              { value: "educational", label: "Eğitici" },
            ]}
            className={theme.input.base}
          />
        </div>
      </div>

      {result && !loading && result.outline && (
        <div className="mt-6 space-y-4">
          {/* Title & Meta */}
          <Card>
            <CardHeader>
              <CardTitle>Başlık & Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className={theme.text.small}>Başlık</Label>
                <p className={cn(theme.text.body, "font-medium mt-1")}>{result.outline.title}</p>
              </div>
              <div>
                <Label className={theme.text.small}>Meta Açıklama</Label>
                <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
                  {result.outline.metaDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Introduction */}
          {result.outline.introduction && (
            <Card>
              <CardHeader>
                <CardTitle>Giriş</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className={theme.text.small}>Açılış</Label>
                  <p className={cn(theme.text.small, "mt-1")}>{result.outline.introduction.hook}</p>
                </div>
                <div>
                  <Label className={theme.text.small}>Bağlam</Label>
                  <p className={cn(theme.text.small, "mt-1")}>{result.outline.introduction.context}</p>
                </div>
                <div>
                  <Label className={theme.text.small}>Önizleme</Label>
                  <p className={cn(theme.text.small, "mt-1")}>{result.outline.introduction.preview}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sections */}
          {result.outline.sections && result.outline.sections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ana Bölümler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.outline.sections.map((section: any, index: number) => (
                  <div key={index} className="border-l-4 border-[var(--accent-teal)] pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={cn(theme.text.body, "font-semibold")}>{section.heading}</h3>
                      <Badge variant="teal">{section.wordCount} kelime</Badge>
                    </div>
                    
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="mt-3 space-y-3 ml-4">
                        {section.subsections.map((sub: any, subIndex: number) => (
                          <div key={subIndex} className="border-l-2 border-[var(--border)] pl-3">
                            <p className={cn(theme.text.small, "font-medium mb-2")}>{sub.heading}</p>
                            {sub.keyPoints && sub.keyPoints.length > 0 && (
                              <ul className="space-y-1">
                                {sub.keyPoints.map((point: string, pointIndex: number) => (
                                  <li key={pointIndex} className={cn(theme.text.small, theme.text.muted, "flex items-start gap-2")}>
                                    <ChevronRight className="w-3 h-3 mt-1 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          {result.outline.conclusion && (
            <Card>
              <CardHeader>
                <CardTitle>Sonuç</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className={theme.text.small}>Özet</Label>
                  <p className={cn(theme.text.small, "mt-1")}>{result.outline.conclusion.summary}</p>
                </div>
                <div>
                  <Label className={theme.text.small}>Harekete Geçirici Mesaj</Label>
                  <p className={cn(theme.text.small, "mt-1")}>{result.outline.conclusion.cta}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Tips */}
          {result.outline.seoTips && result.outline.seoTips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>SEO İpuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.outline.seoTips.map((tip: string, index: number) => (
                    <li key={index} className={cn(theme.text.small, "flex items-start gap-2")}>
                      <span className="text-[var(--accent-teal)] mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Internal Link Opportunities */}
          {result.outline.internalLinkOpportunities && result.outline.internalLinkOpportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>İç Bağlantı Fırsatları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.outline.internalLinkOpportunities.map((topic: string, index: number) => (
                    <Badge key={index} variant="default">{topic}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolPageTemplate>
  );
}
