import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, ...props }, ref) => {
    const textareaId = React.useId();

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-bg-elevated px-3 py-2 text-sm text-text-primary transition-colors duration-200",
            "placeholder:text-text-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            error
              ? "border-error focus-visible:ring-error/50"
              : "border-border-default hover:border-border-strong",
            className
          )}
          ref={ref}
          {...props}
        />
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
Textarea.displayName = "Textarea";

export { Textarea };
