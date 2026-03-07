import * as React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: "default" | "url";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, variant = "default", ...props }, ref) => {
    const inputId = React.useId();
    const isUrl = variant === "url" || type === "url";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {isUrl && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Globe className="h-4 w-4" />
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-bg-elevated px-3 py-2 text-sm text-text-primary transition-colors duration-200",
              "placeholder:text-text-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-error focus-visible:ring-error/50"
                : "border-border-default hover:border-border-strong",
              isUrl && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(helperText || error) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-error" : "text-text-muted"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
