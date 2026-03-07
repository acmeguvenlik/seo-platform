import { getTranslations } from "next-intl/server";
import { KeywordDensityTool } from "@/components/tools/keyword-density-tool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return {
    title: "Keyword Density Checker - SEO Tools Platform",
    description: "Anahtar kelime yoğunluğunu analiz edin ve optimize edin",
  };
}

export default function KeywordDensityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <KeywordDensityTool />
    </div>
  );
}
