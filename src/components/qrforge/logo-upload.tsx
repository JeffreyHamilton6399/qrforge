"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface LogoUploadProps {
  logoPreview: string | null;
  onFile: (file: File | null) => void;
  onClear: () => void;
}

export function LogoUpload({ logoPreview, onFile, onClear }: LogoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    onFile(file);
  };

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {logoPreview ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Logo added</p>
            <p className="text-[11px] text-muted-foreground">
              Centered at 20% of QR width
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={onClear}
            aria-label="Remove logo"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={
            "flex h-16 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-xs font-medium transition-colors " +
            (dragOver
              ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground")
          }
        >
          <Upload className="size-3.5" />
          Upload logo (optional)
        </button>
      )}
    </div>
  );
}
