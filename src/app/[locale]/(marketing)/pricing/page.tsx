import { getTranslations } from "next-intl/server";
import { PricingContent } from "@/components/pricing/pricing-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return {
    title: `${t("title")} - SEO Tools Platform`,
    description: t("description"),
  };
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <PricingContent />
    </div>
  );
}
