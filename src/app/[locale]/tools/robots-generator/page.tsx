"use client";

import { useState } from "react";
import { ToolPageTemplate } from "@/components/tools/tool-page-template";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileCode, Plus, X, Copy, CheckCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { theme, cn } from "@/lib/theme-classes";

export default function RobotsGeneratorPage() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [allowAll, setAllowAll] = useState(true);
  const [disallowPaths, setDisallowPaths] = useState<string[]>(["/admin/", "/api/"]);
  const [allowPaths, setAllowPaths] = useState<string[]>([]);
  const [crawlDelay, setCrawlDelay] = useState("");
  const [userAgents, setUserAgents] = useState<string[]>(["*"]);
  const [newPath, setNewPath] = useState("");
  const [newAgent, setNewAgent] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/robots-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sitemapUrl: sitemapUrl || undefined,
          allowAll,
          disallowPaths,
          allowPaths,
          crawlDelay: crawlDelay ? parseInt(crawlDelay) : undefined,
          userAgents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Robots.txt oluşturma başarısız");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const addDisallowPath = () => {
    if (newPath && !disallowPaths.includes(newPath)) {
      setDisallowPaths([...disallowPaths, newPath]);
      setNewPath("");
    }
  };

  const removeDisallowPath = (path: string) => {
    setDisallowPaths(disallowPaths.filter(p => p !== path));
  };

  const addUserAgent = () => {
    if (newAgent && !userAgents.includes(newAgent)) {
      setUserAgents([...userAgents, newAgent]);
      setNewAgent("");
    }
  };

  const removeUserAgent = (agent: string) => {
    if (userAgents.length > 1) {
      setUserAgents(userAgents.filter(a => a !== agent));
    }
  };

  const copyToClipboard = async () => {
    if (result?.content) {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadFile = () => {
    if (result?.content) {
      const blob = new Blob([result.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "robots.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ToolPageTemplate
      title="Robots.txt Oluşturucu"
      description="SEO-friendly robots.txt dosyası oluşturun. Arama motorlarının sitenizi nasıl tarayacağını kontrol edin."
      icon={<FileCode className="w-6 h-6" />}
      category="Teknik SEO"
      onAnalyze={handleAnalyze}
      result={result}
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sitemapUrl">Sitemap URL (Opsiyonel)</Label>
          <Input
            id="sitemapUrl"
            type="url"
            placeholder="https://example.com/sitemap.xml"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowAll"
            checked={allowAll}
            onCheckedChange={(checked: boolean) => setAllowAll(checked)}
          />
          <Label htmlFor="allowAll" className="cursor-pointer">
            Tüm sayfalara izin ver (Allow: /)
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Engellenecek Yollar (Disallow)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="/admin/"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addDisallowPath()}
              className={theme.input.base}
            />
            <Button onClick={addDisallowPath} size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {disallowPaths.map((path) => (
              <div
                key={path}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-sm"
              >
                <span>{path}</span>
                <button
                  onClick={() => removeDisallowPath(path)}
                  className="text-[var(--error)] hover:text-[var(--error)]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="crawlDelay">Tarama Gecikmesi (saniye, opsiyonel)</Label>
          <Input
            id="crawlDelay"
            type="number"
            min="0"
            max="60"
            placeholder="0"
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            className={theme.input.base}
          />
        </div>

        <div className="space-y-2">
          <Label>User-Agent'lar</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Googlebot"
              value={newAgent}
              onChange={(e) => setNewAgent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addUserAgent()}
              className={theme.input.base}
            />
            <Button onClick={addUserAgent} size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {userAgents.map((agent) => (
              <div
                key={agent}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] text-sm"
              >
                <span>{agent}</span>
                {userAgents.length > 1 && (
                  <button
                    onClick={() => removeUserAgent(agent)}
                    className="hover:text-[var(--error)]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && !loading && (
        <div className="mt-6 space-y-4">
          {/* Generated Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Oluşturulan robots.txt</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} size="sm" variant="outline">
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button onClick={downloadFile} size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className={cn(
                theme.text.mono,
                "text-xs bg-[var(--bg-subtle)] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap"
              )}>
                {result.content}
              </pre>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Öneriler</CardTitle>
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
