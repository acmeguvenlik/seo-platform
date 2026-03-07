import { getTranslations } from "next-intl/server";
import { ToolsGrid } from "@/components/tools/tools-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return {
    title: `${t("tools")} - SEO Tools Platform`,
    description: "Profesyonel SEO araçları ile web sitenizi optimize edin",
  };
}

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <ToolsGrid />
    </div>
  );
}
