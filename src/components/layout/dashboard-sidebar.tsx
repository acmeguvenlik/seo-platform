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
import { theme, cn } from "@/lib/theme-classes";

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
    <aside className={cn(
      "hidden lg:flex lg:flex-col lg:w-64",
      "border-r border-[var(--border-default)]",
      "bg-[var(--bg-elevated)]"
    )}>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group",
                theme.text.body,
                isActive
                  ? "bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] border-l-2 border-[var(--accent-teal)]"
                  : isDisabled
                  ? "text-[var(--text-muted)] cursor-not-allowed opacity-50"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
              onClick={(e) => {
                if (isDisabled) e.preventDefault();
              }}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{t(item.key)}</span>
              {item.badge && (
                <span className={cn(
                  theme.badge.base,
                  "text-xs bg-[var(--bg-overlay)] text-[var(--text-muted)] border border-[var(--border-default)]"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Upgrade Card */}
      <div className="p-4 border-t border-[var(--border-default)]">
        <div className={cn(
          "p-4 rounded-lg",
          "bg-gradient-to-br from-[var(--accent-teal-dim)] to-[var(--bg-overlay)]",
          "border border-[var(--border-default)]"
        )}>
          <h3 className={cn(theme.text.body, "font-medium mb-1")}>
            {t("upgradeTitle")}
          </h3>
          <p className={cn(theme.text.small, theme.text.muted, "mb-3")}>
            {t("upgradeDesc")}
          </p>
          <Link href="/pricing">
            <button className={cn(
              "w-full px-3 py-1.5 text-xs font-medium rounded-md",
              "bg-[var(--accent-teal)] text-[#080C0F]",
              "hover:opacity-90 transition-opacity"
            )}>
              {t("upgradeButton")}
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
