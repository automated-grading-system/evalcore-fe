"use client";

import { useId } from "react";

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

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={cn(
          "block cursor-pointer rounded-lg border border-dashed border-zinc-700 bg-zinc-950/40 p-4 transition-colors hover:border-zinc-500 hover:bg-zinc-900/50",
          disabled && "cursor-not-allowed opacity-60",
          error && "border-destructive/60",
        )}
      >
        <span className="block text-sm font-medium text-zinc-100">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
          {value ? value.name : description}
        </span>
        {value && (
          <span className="mt-2 block font-mono text-[11px] text-zinc-500">
            {(value.size / 1024).toFixed(1)} KB
          </span>
        )}
      </label>
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
