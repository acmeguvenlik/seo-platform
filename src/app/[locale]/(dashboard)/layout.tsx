import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 bg-bg-base">{children}</main>
      </div>
    </div>
  );
}
