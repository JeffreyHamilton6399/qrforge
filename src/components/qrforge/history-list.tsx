"use client";

import * as React from "react";
import { History, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HistoryEntry } from "@/lib/history";

export interface HistoryListProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryList({ entries, onSelect, onClear }: HistoryListProps) {
  if (entries.length === 0) return null;

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <History className="size-3.5" />
          Recent
          <span className="text-[10px] text-muted-foreground/70">
            ({entries.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-[11px] text-muted-foreground hover:text-destructive"
          onClick={onClear}
        >
          <Trash2 className="size-3" />
          Clear
        </Button>
      </div>
      <ScrollArea className="max-h-40 rounded-lg border border-border">
        <ul className="divide-y divide-border">
          {entries.map((entry, i) => (
            <li key={`${entry.text}-${i}`}>
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-accent"
              >
                <span className="truncate text-xs font-medium">
                  {entry.text}
                </span>
                <span className="ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
                  {entry.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
