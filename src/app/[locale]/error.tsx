"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-lg bg-error/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-error" />
            </div>
            <CardTitle className="text-2xl">Bir Hata Oluştu</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-secondary">
            Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
          </p>

          {error.message && (
            <div className="p-3 rounded-md bg-bg-subtle border border-border-default">
              <p className="text-sm text-text-muted font-mono">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={reset} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tekrar Dene
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="secondary" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
          </div>

          {error.digest && (
            <p className="text-xs text-text-muted text-center">
              Hata Kodu: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
