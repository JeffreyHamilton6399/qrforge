"use client";

import * as React from "react";
import { Download, FileDown, Loader2, Move } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DraggableLogo, type LogoPosition } from "./draggable-logo";

export interface QrPreviewProps {
  /** Canvas the QR is rendered onto. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** The encoded payload string (for showing empty state). */
  payload: string;
  /** Logo image src, if a logo is uploaded. */
  logoSrc: string | null;
  /** Current logo position (normalized 0-1). */
  logoPosition: LogoPosition;
  /** Called when the user drags the logo. */
  onLogoPositionChange: (pos: LogoPosition) => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  /** When true, a regeneration is in progress. */
  isBusy: boolean;
}

export function QrPreview({
  canvasRef,
  payload,
  logoSrc,
  logoPosition,
  onLogoPositionChange,
  onDownloadPng,
  onDownloadSvg,
  isBusy,
}: QrPreviewProps) {
  const isEmpty = payload.trim().length === 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-3 sm:p-6">
      {/* QR preview — always on white background for contrast */}
      <div className="relative w-full max-w-[320px]">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-3 shadow-sm">
          {isEmpty ? (
            <EmptyState />
          ) : (
            <canvas
              ref={canvasRef}
              className="h-full w-full"
              role="img"
              aria-label="QR code preview"
            />
          )}
          {!isEmpty && logoSrc && (
            <DraggableLogo
              src={logoSrc}
              position={logoPosition}
              onChange={onLogoPositionChange}
            />
          )}
          {isBusy && (
            <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-black/5">
              <Loader2 className="size-3 animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </div>

      {/* Drag hint */}
      {logoSrc && !isEmpty && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Move className="size-3" />
          Drag the logo to reposition it
        </p>
      )}

      {/* Download buttons */}
      <div className="flex w-full max-w-[320px] flex-col gap-2">
        <Button
          onClick={onDownloadPng}
          disabled={isEmpty}
          className="h-9 w-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-600/40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <Download className="size-4" />
          Download PNG
        </Button>
        <Button
          onClick={onDownloadSvg}
          disabled={isEmpty}
          variant="ghost"
          className="h-9 w-full"
        >
          <FileDown className="size-4" />
          Download SVG
        </Button>
        {logoSrc && (
          <p className="text-center text-[11px] text-muted-foreground">
            Logo embedded — error correction forced to H.
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 text-center text-slate-400">
      <div className="grid grid-cols-7 gap-1 opacity-30">
        {Array.from({ length: 49 }).map((_, i) => (
          <span
            key={i}
            className={
              [0, 1, 2, 5, 6, 7, 8, 10, 12, 14, 16, 20, 22, 24, 28, 30, 32, 34, 35, 36, 40, 41, 42, 45, 46, 47, 48].includes(i)
                ? "size-2.5 rounded-[1px] bg-slate-400"
                : "size-2.5 rounded-[1px] bg-transparent"
            }
          />
        ))}
      </div>
      <p className="text-xs font-medium">Your QR will appear here</p>
      <p className="max-w-[14rem] text-[11px] text-slate-400">
        Type a URL or text on the left to generate a QR code instantly.
      </p>
    </div>
  );
}
