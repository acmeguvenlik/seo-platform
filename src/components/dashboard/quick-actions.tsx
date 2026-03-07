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
    <div className="card-base p-6">
      <h2 className="text-heading text-xl font-semibold mb-6">
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
    accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white",
    success: "bg-success/10 text-success group-hover:bg-success group-hover:text-white",
    warning: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white",
    info: "bg-info/10 text-info group-hover:bg-info group-hover:text-white",
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-all duration-300 hover:scale-105"
    >
      <div
        className={`p-3 rounded-lg transition-all duration-300 ${
          colorClasses[tool.color]
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-small text-center font-medium">
        {t(`${tool.slug}.title`)}
      </span>
      {tool.isAI && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
          AI
        </span>
      )}
    </Link>
  );
}
