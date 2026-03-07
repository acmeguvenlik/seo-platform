import { useTranslations } from "next-intl";
import { SitemapGeneratorTool } from "@/components/tools/sitemap-generator-tool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "tools.sitemapGenerator" });
  
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SitemapGeneratorPage() {
  const t = useTranslations("tools.sitemapGenerator");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-text-primary mb-2">
          {t("title")}
        </h1>
        <p className="text-text-secondary">{t("description")}</p>
      </div>

      <SitemapGeneratorTool />
    </div>
  );
}
