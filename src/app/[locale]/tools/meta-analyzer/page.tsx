import { getTranslations } from "next-intl/server";
import { MetaAnalyzerTool } from "@/components/tools/meta-analyzer-tool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.metaAnalyzer" });

  return {
    title: `${t("title")} - SEO Tools Platform`,
    description: t("description"),
  };
}

export default function MetaAnalyzerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <MetaAnalyzerTool />
    </div>
  );
}
