import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return {
    title: `${t("title")} - SEO Tools Platform`,
    description: "SEO araçlarınızı yönetin ve analizlerinizi görüntüleyin",
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardContent />;
}
