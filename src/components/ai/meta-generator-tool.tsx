"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Sparkles, AlertCircle, Copy, CheckCircle2 } from "lucide-react";

interface MetaGeneratorResult {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  suggestions: string[];
  processingTime: number;
}

export function MetaGeneratorTool() {
  const t = useTranslations("tools.aiMetaGenerator");
  const [url, setUrl] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MetaGeneratorResult | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url) {
      setError("Lütfen geçerli bir URL giriniz");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Lütfen geçerli bir URL giriniz");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/meta-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          targetKeywords: targetKeywords.split(",").map(k => k.trim()).filter(Boolean),
          language,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Meta tag oluşturma başarısız");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Meta tag oluşturma başarısız");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-heading font-semibold">AI Meta Tag Generator</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              Claude AI ile optimize edilmiş meta tag'ler oluşturun
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL
            </label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hedef Anahtar Kelimeler (virgülle ayırın)
            </label>
            <Input
              type="text"
              placeholder="seo, optimization, meta tags"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dil
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                AI ile Oluşturuluyor...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI ile Meta Tag Oluştur
              </>
            )}
          </Button>
        </div>
      </Card>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Title */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Title Tag
              </h3>
              <Button
                onClick={() => copyToClipboard(result.title, "title")}
                variant="secondary"
                size="sm"
              >
                {copiedField === "title" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-body">{result.title}</p>
              <p className="text-small text-gray-500 mt-2">{result.title.length} karakter</p>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-heading font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Meta Description
              </h3>
              <Button
                onClick={() => copyToClipboard(result.description, "description")}
                variant="secondary"
                size="sm"
              >
                {copiedField === "description" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-body">{result.description}</p>
              <p className="text-small text-gray-500 mt-2">{result.description.length} karakter</p>
            </div>
          </Card>

          {/* Keywords */}
          <Card className="p-6">
            <h3 className="text-heading font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Anahtar Kelimeler
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="teal" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Open Graph */}
          <Card className="p-6">
            <h3 className="text-heading font-semibold mb-4">Open Graph Tags</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-small font-medium text-gray-700 dark:text-gray-300">
                    og:title
                  </label>
                  <Button
                    onClick={() => copyToClipboard(result.ogTitle, "ogTitle")}
                    variant="secondary"
                    size="sm"
                  >
                    {copiedField === "ogTitle" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <code className="text-small">{result.ogTitle}</code>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-small font-medium text-gray-700 dark:text-gray-300">
                    og:description
                  </label>
                  <Button
                    onClick={() => copyToClipboard(result.ogDescription, "ogDescription")}
                    variant="secondary"
                    size="sm"
                  >
                    {copiedField === "ogDescription" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <code className="text-small">{result.ogDescription}</code>
                </div>
              </div>
            </div>
          </Card>

          {/* Twitter Card */}
          <Card className="p-6">
            <h3 className="text-heading font-semibold mb-4">Twitter Card Tags</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-small font-medium text-gray-700 dark:text-gray-300">
                    twitter:title
                  </label>
                  <Button
                    onClick={() => copyToClipboard(result.twitterTitle, "twitterTitle")}
                    variant="secondary"
                    size="sm"
                  >
                    {copiedField === "twitterTitle" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <code className="text-small">{result.twitterTitle}</code>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-small font-medium text-gray-700 dark:text-gray-300">
                    twitter:description
                  </label>
                  <Button
                    onClick={() => copyToClipboard(result.twitterDescription, "twitterDescription")}
                    variant="secondary"
                    size="sm"
                  >
                    {copiedField === "twitterDescription" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <code className="text-small">{result.twitterDescription}</code>
                </div>
              </div>
            </div>
          </Card>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-heading font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Önerileri
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900 text-small"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="text-center text-small text-gray-500">
            İşlem süresi: {result.processingTime}ms
          </div>
        </div>
      )}
    </div>
  );
}
