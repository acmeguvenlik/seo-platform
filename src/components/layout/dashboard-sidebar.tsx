"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Settings,
  CreditCard,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "blog",
    href: "/blog-admin",
    icon: BookOpen,
  },
  {
    key: "tools",
    href: "/tools",
    icon: Wrench,
  },
  {
    key: "analyses",
    href: "/analyses",
    icon: FileText,
  },
  {
    key: "analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: "Yakında",
  },
  {
    key: "billing",
    href: "/billing",
    icon: CreditCard,
    badge: "Yakında",
  },
  {
    key: "settings",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border-default bg-bg-elevated">
      <div className="flex-1 flex flex-col gap-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isDisabled = !!item.badge;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative group",
                isActive
                  ? "bg-accent-teal-dim text-accent-teal border border-border-focus"
                  : isDisabled
                  ? "text-text-muted cursor-not-allowed opacity-50"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
              )}
              onClick={(e) => {
                if (isDisabled) e.preventDefault();
              }}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{t(item.key)}</span>
              {item.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-bg-overlay text-text-muted border border-border-default">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Upgrade Card */}
      <div className="p-4 border-t border-border-default">
        <div className="p-4 rounded-lg bg-gradient-to-br from-accent-teal-dim to-bg-overlay border border-border-default">
          <h3 className="text-sm font-medium text-text-primary mb-1">
            {t("upgradeTitle")}
          </h3>
          <p className="text-xs text-text-muted mb-3">{t("upgradeDesc")}</p>
          <Link href="/pricing">
            <button className="w-full px-3 py-1.5 text-xs font-medium rounded-md bg-accent-teal text-bg-base hover:bg-accent-teal/90 transition-colors">
              {t("upgradeButton")}
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
