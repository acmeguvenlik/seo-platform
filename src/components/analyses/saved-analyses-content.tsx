"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { 
  Search, 
  Download, 
  Trash2, 
  ExternalLink,
  Calendar,
  TrendingUp,
  Filter
} from "lucide-react";

interface SavedAnalysis {
  id: string;
  name: string;
  url: string;
  toolSlug: string;
  score: number;
  createdAt: string;
}

export function SavedAnalysesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTool, setFilterTool] = useState("all");

  // Mock data - gerçek uygulamada API'den gelecek
  const analyses: SavedAnalysis[] = [
    {
      id: "1",
      name: "Ana Sayfa Analizi",
      url: "https://example.com",
      toolSlug: "meta-analyzer",
      score: 85,
      createdAt: "2026-03-07T10:30:00Z",
    },
    {
      id: "2",
      name: "Blog Sayfası",
      url: "https://example.com/blog",
      toolSlug: "keyword-density",
      score: 72,
      createdAt: "2026-03-06T15:20:00Z",
    },
    {
      id: "3",
      name: "Ürün Sayfası",
      url: "https://example.com/products",
      toolSlug: "meta-analyzer",
      score: 91,
      createdAt: "2026-03-05T09:15:00Z",
    },
  ];

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = 
      analysis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterTool === "all" || analysis.toolSlug === filterTool;

    return matchesSearch && matchesFilter;
  });

  const getToolName = (slug: string) => {
    const tools: Record<string, string> = {
      "meta-analyzer": "Meta Tag Analyzer",
      "keyword-density": "Keyword Density Checker",
    };
    return tools[slug] || slug;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent-amber";
    return "text-error";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display text-text-primary">
              Kayıtlı Analizler
            </h1>
            <p className="text-text-secondary mt-1">
              Geçmiş analizlerinizi görüntüleyin ve yönetin
            </p>
          </div>
          <Button variant="primary">
            <Download className="h-4 w-4 mr-2" />
            Tümünü Dışa Aktar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent-teal">
                  {analyses.length}
                </p>
                <p className="text-sm text-text-muted mt-1">Toplam Analiz</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-success">
                  {analyses.filter(a => a.score >= 80).length}
                </p>
                <p className="text-sm text-text-muted mt-1">Yüksek Skor</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent-amber">
                  {Math.round(analyses.reduce((acc, a) => acc + a.score, 0) / analyses.length)}
                </p>
                <p className="text-sm text-text-muted mt-1">Ortalama Skor</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Analiz ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                options={[
                  { value: "all", label: "Tüm Araçlar" },
                  { value: "meta-analyzer", label: "Meta Tag Analyzer" },
                  { value: "keyword-density", label: "Keyword Density" },
                ]}
                value={filterTool}
                onChange={(e) => setFilterTool(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analyses List */}
        <div className="space-y-4">
          {filteredAnalyses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Search className="h-12 w-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">
                  {searchQuery || filterTool !== "all"
                    ? "Arama kriterlerine uygun analiz bulunamadı"
                    : "Henüz kayıtlı analiz yok"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAnalyses.map((analysis) => (
              <Card key={analysis.id} variant="interactive">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary truncate">
                          {analysis.name}
                        </h3>
                        <Badge variant="default">
                          {getToolName(analysis.toolSlug)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                        <ExternalLink className="h-4 w-4" />
                        <a
                          href={analysis.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent-teal truncate"
                        >
                          {analysis.url}
                        </a>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(analysis.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className={getScoreColor(analysis.score)}>
                            Skor: {analysis.score}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
