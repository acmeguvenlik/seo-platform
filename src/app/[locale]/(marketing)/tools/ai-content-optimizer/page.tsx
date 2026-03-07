import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { ContentOptimizerTool } from "@/components/ai/content-optimizer-tool";
import { Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Content Optimizer - SEO Tools Platform",
    description: "Optimize your content for SEO using Claude AI with keyword density analysis and readability improvements",
  };
}

export default async function AiContentOptimizerPage() {
  const t = await getTranslations("tools.aiContentOptimizer");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-950/30 dark:to-teal-950/30 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-small font-medium text-blue-900 dark:text-blue-300">
              AI-Powered Tool
            </span>
          </div>
          <h1 className="text-display mb-4">AI Content Optimizer</h1>
          <p className="text-body text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Claude AI kullanarak içeriğinizi SEO için optimize edin. 
            Anahtar kelime yoğunluğu, okunabilirlik ve SEO skorunu artırın.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-heading font-semibold mb-1">SEO Analizi</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              Detaylı SEO skoru ve anahtar kelime yoğunluğu analizi
            </p>
          </div>
          <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="text-heading font-semibold mb-1">Okunabilirlik</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              İçeriğinizin okunabilirliğini artırın
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-heading font-semibold mb-1">Rakip Analizi</h3>
            <p className="text-small text-gray-600 dark:text-gray-400">
              Rakip URL'lerini analiz ederek optimize edin
            </p>
          </div>
        </div>

        {/* Tool */}
        <ContentOptimizerTool />

        {/* Info */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-heading font-semibold mb-4">Nasıl Çalışır?</h3>
          <ol className="space-y-3 text-body text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              <span>Optimize etmek istediğiniz içeriği yapıştırın (min. 100 karakter)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              <span>Hedef anahtar kelimenizi belirtin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
              <span>Rakip URL'leri ekleyin (opsiyonel)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
              <span>Dil seçin ve "AI ile İçeriği Optimize Et" butonuna tıklayın</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">5</span>
              <span>Claude AI içeriğinizi analiz eder ve optimize eder</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">6</span>
              <span>SEO skoru, okunabilirlik ve iyileştirmeleri görün</span>
            </li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <h3 className="text-heading font-semibold mb-4">Faydaları</h3>
          <ul className="space-y-2 text-body text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Anahtar kelime yoğunluğunu optimize edin (1-3% ideal)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Okunabilirlik skorunu artırın</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>SEO skorunu yükseltin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>Rakip analizi ile daha iyi içerik oluşturun</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">✓</span>
              <span>AI destekli öneriler alın</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
