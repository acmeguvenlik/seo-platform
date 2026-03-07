import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardContent />;
}
