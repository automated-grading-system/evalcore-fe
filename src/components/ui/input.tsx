import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm text-foreground shadow-xs transition-all",
          "placeholder:text-muted-foreground",
          "hover:border-border/100",
          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
