import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalysesContent } from "@/components/dashboard/analyses-content";

export const metadata = {
  title: "Analizler - SEO Tools Platform",
  description: "Geçmiş SEO analizlerinizi görüntüleyin ve yönetin",
};

export default async function AnalysesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <AnalysesContent />;
}
