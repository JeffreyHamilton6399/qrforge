"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, Github, Monitor, Moon, Settings, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/JeffreyHamilton6399/qrforge";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch — next-themes resolves on the client.
  React.useEffect(() => setMounted(true), []);

  const current = theme ?? "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open settings"
          className="size-8 rounded-full border border-border/60 bg-muted/40 hover:bg-muted"
        >
          <Settings className="size-4 text-muted-foreground" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[11rem]">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeItem
          icon={<Sun className="size-4" />}
          label="Light"
          active={mounted && current === "light"}
          onClick={() => setTheme("light")}
        />
        <ThemeItem
          icon={<Moon className="size-4" />}
          label="Dark"
          active={mounted && current === "dark"}
          onClick={() => setTheme("dark")}
        />
        <ThemeItem
          icon={<Monitor className="size-4" />}
          label="System"
          active={mounted && current === "system"}
          onClick={() => setTheme("system")}
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <Github className="size-4" />
            <span className="flex-1">GitHub</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <DropdownMenuItem onClick={onClick} className="gap-2">
      {icon}
      <span className="flex-1">{label}</span>
      <Check
        className={cn(
          "size-4 text-emerald-600 dark:text-emerald-400",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </DropdownMenuItem>
  );
}
