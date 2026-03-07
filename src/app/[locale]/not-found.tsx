import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-accent-teal">404</h1>
          <h2 className="text-3xl font-display text-text-primary">
            Sayfa Bulunamadı
          </h2>
          <p className="text-text-secondary">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </div>

        <div className="pt-8 border-t border-border-default">
          <p className="text-sm text-text-muted">
            Yardıma mı ihtiyacınız var?{" "}
            <Link href="/contact" className="text-accent-teal hover:underline">
              İletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
