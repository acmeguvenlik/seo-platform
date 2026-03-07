import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { MetaGeneratorTool } from "@/components/ai/meta-generator-tool";
import { Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Meta Tag Generator - SEO Tools Platform",
    description: "Generate optimized meta tags using Claude AI for better SEO performance",
  };
}

export default async function AiMetaGeneratorPage() {
  const t = await getTranslations("tools.aiMetaGenerator");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-small font-medium text-purple-900 dark:text-purple-300">
              AI-Powered Tool
            </span>
          </div>
          <h1 className="text-display mb-4">AI Meta Tag Generator</h1>
          <p className="text-body text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Claude AI kullanarak SEO için optimize edilmiş meta tag'ler oluşturun. 
            Title, description, Open Graph ve Twitter Card tag'lerini otomatik olarak oluşturur.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-heading font-semibold mb-1">Hedefli Optimizasyon</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              Anahtar kelimelerinize göre optimize edilmiş meta tag'ler
            </p>
          </div>
          <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-900">
            <div className="text-2xl mb-2">🌍</div>
            <h3 className="text-heading font-semibold mb-1">Çoklu Dil Desteği</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              5 farklı dilde meta tag oluşturma
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-heading font-semibold mb-1">Hızlı Sonuçlar</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              Saniyeler içinde profesyonel meta tag'ler
            </p>
          </div>
        </div>

        {/* Tool */}
        <MetaGeneratorTool />

        {/* Info */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-heading font-semibold mb-4">Nasıl Çalışır?</h3>
          <ol className="space-y-3 text-body text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              <span>Website URL'nizi girin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              <span>Hedef anahtar kelimelerinizi belirtin (opsiyonel)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
              <span>Dil seçin ve "AI ile Meta Tag Oluştur" butonuna tıklayın</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
              <span>Claude AI optimize edilmiş meta tag'leri oluşturur</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">5</span>
              <span>Sonuçları kopyalayın ve sitenize ekleyin</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
