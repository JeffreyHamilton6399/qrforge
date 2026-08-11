"use client";

import * as React from "react";
import Image from "next/image";
import { Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const DONATE_URL = "https://buymeacoffee.com/jeffreyscof";

export function Header() {
  return (
    <header className="h-12 shrink-0 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/qr-logo.svg"
            alt="QRForge logo"
            width={24}
            height={24}
            priority
            className="size-6 shrink-0"
          />
          <span className="text-sm font-semibold tracking-tight">
            QRForge
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            private
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 rounded-full gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
          >
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
              <Coffee className="size-3.5" />
              <span className="hidden sm:inline">Donate</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
