import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata = {
  title: "Ayarlar - SEO Tools Platform",
  description: "Hesap ayarlarınızı yönetin",
};

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <SettingsContent />;
}
