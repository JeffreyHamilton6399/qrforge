"use client";

import * as React from "react";
import { Move } from "lucide-react";

export interface LogoPosition {
  x: number;
  y: number;
}

export interface DraggableLogoProps {
  src: string;
  position: LogoPosition;
  onChange: (pos: LogoPosition) => void;
}

// Keep the logo fully on the QR (it's 20% of width + padding ≈ 21.6%).
const MIN = 0.12;
const MAX = 0.88;

function clamp(v: number): number {
  return Math.min(MAX, Math.max(MIN, v));
}

export function DraggableLogo({ src, position, onChange }: DraggableLogoProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    onChange({ x: clamp(x), y: clamp(y) });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      aria-label="Drag logo to reposition"
    >
      <div
        role="slider"
        aria-label="Logo position"
        aria-valuenow={Math.round(position.x * 100)}
        aria-valuemin={Math.round(MIN * 100)}
        aria-valuemax={Math.round(MAX * 100)}
        aria-valuetext={`x ${Math.round(position.x * 100)}%, y ${Math.round(position.y * 100)}%`}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 touch-none select-none items-center justify-center"
        style={{
          left: `${position.x * 100}%`,
          top: `${position.y * 100}%`,
          width: "21.6%",
          aspectRatio: "1 / 1",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="pointer-events-none flex size-full items-center justify-center rounded-lg bg-white p-[3.2%] shadow-md transition-shadow"
          style={{
            boxShadow: dragging
              ? "0 0 0 2px rgb(16 185 129 / 0.9), 0 8px 20px rgb(0 0 0 / 0.18)"
              : hovered
                ? "0 0 0 2px rgb(16 185 129 / 0.5), 0 4px 12px rgb(0 0 0 / 0.12)"
                : "0 1px 4px rgb(0 0 0 / 0.1)",
          }}
        >
          <img
            src={src}
            alt="Logo (draggable)"
            className="pointer-events-none max-h-full max-w-full object-contain"
            draggable={false}
          />
        </div>
        {dragging && (
          <div className="pointer-events-none absolute -top-7 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-zinc-600 px-2 py-0.5 text-[10px] font-medium text-white shadow">
            <Move className="size-2.5" />
            Drag
          </div>
        )}
      </div>
    </div>
  );
}
