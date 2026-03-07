import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default:
          "bg-bg-subtle text-text-secondary border-border-default",
        teal:
          "bg-accent-teal-dim text-accent-teal border-accent-teal/20",
        amber:
          "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
        success:
          "bg-success/10 text-success border-success/20",
        error:
          "bg-error/10 text-error border-error/20",
        pro:
          "bg-gradient-to-r from-accent-teal/20 to-accent-amber/20 text-accent-teal border-accent-teal/30",
        enterprise:
          "bg-gradient-to-r from-accent-amber/20 to-error/20 text-accent-amber border-accent-amber/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
