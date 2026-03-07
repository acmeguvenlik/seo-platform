import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata = {
  title: "Ayarlar - SEO Tools Platform",
  description: "Hesap ayarlarınızı yönetin",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <SettingsContent />;
}
