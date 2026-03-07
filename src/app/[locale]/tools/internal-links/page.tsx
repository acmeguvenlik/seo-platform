import { useTranslations } from "next-intl";
import { InternalLinksTool } from "@/components/tools/internal-links-tool";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "tools.internalLinks" });
  
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function InternalLinksPage() {
  const t = useTranslations("tools.internalLinks");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-text-primary mb-2">
          {t("title")}
        </h1>
        <p className="text-text-secondary">{t("description")}</p>
      </div>

      <InternalLinksTool />
    </div>
  );
}
