"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { theme, cn } from "@/lib/theme-classes";

export default function AIContentIdeasPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("blog post");
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
      const response = await fetch("/api/ai/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, contentType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "İçerik fikirleri oluşturma başarısız");
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
      title="AI İçerik Fikirleri"
      description="Yapay zeka ile 15 benzersiz içerik fikri oluşturun. Blog yazıları, videolar, infografikler ve daha fazlası."
      icon={<Lightbulb className="w-6 h-6" />}
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
            placeholder="Örn: Dijital Pazarlama"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Hedef Kitle (Opsiyonel)</Label>
          <Input
            id="audience"
            placeholder="Örn: Küçük işletme sahipleri"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentType">İçerik Tipi</Label>
          <Select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            options={[
              { value: "blog post", label: "Blog Yazısı" },
              { value: "video", label: "Video" },
              { value: "infographic", label: "İnfografik" },
              { value: "social media", label: "Sosyal Medya" },
              { value: "email", label: "E-posta" },
              { value: "podcast", label: "Podcast" },
            ]}
            className={theme.input.base}
          />
        </div>
      </div>

      {result && !loading && result.ideas && (
        <div className="mt-6 space-y-3">
          {result.ideas.map((idea: any, index: number) => (
            <Card key={index} className="hover:border-[var(--accent-teal)] transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className={cn(theme.text.body, "font-semibold mb-2")}>{idea.title}</h3>
                    <p className={cn(theme.text.small, theme.text.muted)}>{idea.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{idea.type}</Badge>
                    <Badge variant="teal">{idea.wordCount} kelime</Badge>
                    <Badge variant={getDifficultyVariant(idea.difficulty)}>{idea.difficulty}</Badge>
                    <Badge variant={getSEOPotentialVariant(idea.seoPotential)}>
                      SEO: {idea.seoPotential}
                    </Badge>
                  </div>

                  {idea.angle && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <p className={cn(theme.text.small)}>
                        <span className="font-medium">Açı:</span> {idea.angle}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ToolPageTemplate>
  );
}

function getDifficultyVariant(difficulty: string): "default" | "teal" | "success" | "amber" | "error" {
  if (difficulty === "beginner") return "success";
  if (difficulty === "intermediate") return "amber";
  return "error";
}

function getSEOPotentialVariant(potential: string): "default" | "teal" | "success" | "amber" | "error" {
  if (potential === "high") return "success";
  if (potential === "medium") return "amber";
  return "default";
}
