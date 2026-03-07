import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SavedAnalysesContent } from "@/components/analyses/saved-analyses-content";

export const metadata = {
  title: "Kayıtlı Analizler - SEO Tools Platform",
  description: "Kayıtlı SEO analizlerinizi görüntüleyin ve yönetin",
};

export default async function SavedAnalysesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <SavedAnalysesContent />;
}
