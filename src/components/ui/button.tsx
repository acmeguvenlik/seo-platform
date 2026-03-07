import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-teal text-bg-base hover:bg-accent-teal/90 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,212,180,0.3)] active:scale-[0.98]",
        secondary:
          "bg-bg-elevated text-text-primary border border-border-strong hover:border-border-focus hover:-translate-y-0.5 active:scale-[0.98]",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-elevated active:scale-[0.98]",
        danger:
          "bg-error text-white hover:bg-error/90 hover:-translate-y-0.5 active:scale-[0.98]",
        outline:
          "border border-border-default text-text-primary hover:border-accent-teal hover:text-accent-teal active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
