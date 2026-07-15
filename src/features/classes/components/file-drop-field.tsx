"use client";

import { useId, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  // Get friendly accepted string
  const getAcceptedText = () => {
    if (accept.includes("pdf")) return "PDF document · .pdf";
    if (accept.includes("json")) return "Postman collection · .json";
    if (accept.includes("zip")) return "Project archive · .zip";
    return accept;
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) onChange(event.dataTransfer.files?.[0] ?? null);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024)
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

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
            disabled && "opacity-60",
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
                  <span>{formatFileSize(value.size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2Icon className="size-3" /> Ready
                  </span>
                </div>
              </div>
            </div>

            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Remove file"
                aria-label={`Remove ${value.name}`}
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
            "group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/25 p-6 text-center transition-all",
            "hover:border-primary hover:bg-primary/5",
            isDragging && "border-primary bg-primary/10 ring-4 ring-primary/10",
            disabled && "cursor-not-allowed opacity-60",
            error &&
              "border-destructive/60 hover:border-destructive hover:bg-destructive/5",
          )}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
            <UploadIcon className="size-5" />
          </div>
          <span className="block text-sm font-semibold text-foreground">
            {isDragging ? "Drop file here" : description}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Drag and drop or browse · {getAcceptedText()}
          </span>
        </label>
      )}

      {error && (
        <p className="text-xs text-destructive font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
