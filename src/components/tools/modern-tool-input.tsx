"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Sparkles, Loader2 } from "lucide-react";

interface ModernToolInputProps {
  placeholder?: string;
  buttonText?: string;
  onAnalyze: (url: string) => void;
  loading?: boolean;
  error?: string;
}

export function ModernToolInput({
  placeholder = "https://example.com",
  buttonText = "Analiz Et",
  onAnalyze,
  loading = false,
  error,
}: ModernToolInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <Card className="border-2 border-border-default hover:border-accent-teal/50 transition-all duration-300 relative overflow-hidden group">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-teal via-accent-amber to-accent-teal opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />
      
      <CardContent className="pt-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={placeholder}
                className="pl-10 h-12 text-base border-border-default focus:border-accent-teal transition-colors"
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !url.trim()}
              className="h-12 px-8 group/btn relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2 group-hover/btn:rotate-12 transition-transform" />
                  {buttonText}
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm animate-fadeIn">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Gerçek zamanlı analiz</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-accent-teal" />
              <span>AI destekli öneriler</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-accent-amber" />
              <span>Detaylı raporlama</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
