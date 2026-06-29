"use client";

import { useId } from "react";
import { FileIcon, UploadIcon, XIcon, CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropFieldProps {
  label: string;
  description: string;
  accept: string;
  value: File | null;
  error?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}

export function FileDropField({
  label,
  description,
  accept,
  value,
  error,
  disabled,
  onChange,
}: FileDropFieldProps) {
  const id = useId();

  // Get friendly accepted string
  const getAcceptedText = () => {
    if (accept.includes("pdf")) return "PDF Document (.pdf)";
    if (accept.includes("json")) return "Postman Collection (.json)";
    if (accept.includes("zip")) return "Project ZIP Archive (.zip)";
    return accept;
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
          {label}
        </span>
      </div>

      <input
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
        }}
      />

      {value ? (
        // SELECTED FILE STATE (Solid, high-contrast container)
        <div
          className={cn(
            "relative rounded-xl border border-primary/30 bg-primary/5 p-4 transition-all hover:border-primary/50",
            disabled && "opacity-60"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <FileIcon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate max-w-[200px] md:max-w-[280px]">
                  {value.name}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <span>{(value.size / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2Icon className="size-3" /> Ready
                  </span>
                </div>
              </div>
            </div>

            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex size-7 items-center justify-center rounded-lg border border-border/80 bg-zinc-900/50 hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Remove file"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
          
          <label
            htmlFor={id}
            className="mt-3 block cursor-pointer text-center text-xs font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            Change file
          </label>
        </div>
      ) : (
        // EMPTY DROPZONE STATE (Dashed border, friendly description)
        <label
          htmlFor={id}
          className={cn(
            "group flex flex-col items-center justify-center text-center cursor-pointer rounded-xl border border-dashed border-border bg-zinc-950/40 p-6 transition-all",
            "hover:border-primary hover:bg-primary/5",
            disabled && "cursor-not-allowed opacity-60",
            error && "border-destructive/60 hover:border-destructive hover:bg-destructive/5",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-zinc-900/50 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 group-hover:bg-primary/10 transition-all mb-3">
            <UploadIcon className="size-5" />
          </div>
          <span className="block text-sm font-semibold text-foreground">
            {description}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {getAcceptedText()}
          </span>
        </label>
      )}

      {error && <p className="text-xs text-destructive font-medium mt-1">{error}</p>}
    </div>
  );
}
