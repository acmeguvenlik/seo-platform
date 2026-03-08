"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Search,
  FileText,
  Image,
  Link as LinkIcon,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

const tools = [
  {
    slug: "meta-analyzer",
    icon: Search,
    color: "accent",
  },
  {
    slug: "keyword-density",
    icon: FileText,
    color: "success",
  },
  {
    slug: "image-optimizer",
    icon: Image,
    color: "warning",
  },
  {
    slug: "backlink-analyzer",
    icon: LinkIcon,
    color: "info",
  },
  {
    slug: "page-speed",
    icon: BarChart3,
    color: "accent",
  },
  {
    slug: "ai-meta-generator",
    icon: Sparkles,
    color: "success",
    isAI: true,
  },
];

export function QuickActions() {
  const t = useTranslations("dashboard");

  return (
    <div className={cn(theme.card.base, theme.card.padding.md)}>
      <h2 className={cn(theme.text.heading, "mb-6")}>
        {t("quickActions")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}

interface ToolCardProps {
  tool: {
    slug: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    isAI?: boolean;
  };
}

function ToolCard({ tool }: ToolCardProps) {
  const t = useTranslations("tools");
  const Icon = tool.icon;

  const colorClasses: Record<string, string> = {
    accent: "bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] group-hover:bg-[var(--accent-teal)] group-hover:text-[#080C0F]",
    success: "bg-[rgba(16,185,129,0.1)] text-[var(--success)] group-hover:bg-[var(--success)] group-hover:text-white",
    warning: "bg-[var(--accent-amber-dim)] text-[var(--accent-amber)] group-hover:bg-[var(--accent-amber)] group-hover:text-white",
    info: "bg-[rgba(59,130,246,0.1)] text-[var(--info)] group-hover:bg-[var(--info)] group-hover:text-white",
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col items-center gap-3 p-4 rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-teal)] transition-all duration-300 hover:scale-105 hover:shadow-md"
    >
      <div
        className={cn(
          "p-3 rounded-lg transition-all duration-300",
          colorClasses[tool.color]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className={cn(theme.text.small, "text-center font-medium")}>
        {t(`${tool.slug}.title`)}
      </span>
      {tool.isAI && (
        <span className={cn(theme.badge.teal, "absolute top-2 right-2 text-xs")}>
          AI
        </span>
      )}
    </Link>
  );
}
