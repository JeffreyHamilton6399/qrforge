"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  FileText,
  Github,
  Moon,
  ScrollText,
  Settings,
  Shield,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GITHUB_URL = "https://github.com/JeffreyHamilton6399/qrforge";

type LegalDoc = "privacy" | "terms" | null;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [legalOpen, setLegalOpen] = React.useState<LegalDoc>(null);

  React.useEffect(() => setMounted(true), []);

  // In dark mode, offer "Light mode" (switch to light).
  // In light mode, offer "Dark mode" (switch to dark).
  const isDark = mounted && resolvedTheme === "dark";
  const toggleLabel = isDark ? "Light mode" : "Dark mode";
  const ToggleIcon = isDark ? Sun : Moon;

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
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
        <DropdownMenuContent align="end" className="min-w-[10rem] p-1.5">
          <DropdownMenuItem onClick={handleToggleTheme} className="gap-2">
            <ToggleIcon className="size-4" />
            <span>{toggleLabel}</span>
          </DropdownMenuItem>

          <DropdownMenuLabel>Legal</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setLegalOpen("privacy")} className="gap-2">
            <Shield className="size-4" />
            <span>Privacy Policy</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLegalOpen("terms")} className="gap-2">
            <ScrollText className="size-4" />
            <span>Terms of Service</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="size-4" />
              <span>GitHub</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LegalDialog kind={legalOpen} onClose={() => setLegalOpen(null)} />
    </>
  );
}

function LegalDialog({
  kind,
  onClose,
}: {
  kind: LegalDoc;
  onClose: () => void;
}) {
  const isPrivacy = kind === "privacy";
  return (
    <Dialog open={kind !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPrivacy ? (
              <Shield className="size-4 text-emerald-600" />
            ) : (
              <ScrollText className="size-4 text-emerald-600" />
            )}
            {isPrivacy ? "Privacy Policy" : "Terms of Service"}
          </DialogTitle>
          <DialogDescription>
            {isPrivacy
              ? "How QRForge handles your data."
              : "The terms for using QRForge."}
          </DialogDescription>
        </DialogHeader>
        {isPrivacy ? <PrivacyBody /> : <TermsBody />}
      </DialogContent>
    </Dialog>
  );
}

function PrivacyBody() {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>
        <strong className="text-foreground">TL;DR:</strong> We don&apos;t collect
        anything. Ever.
      </p>
      <p>
        QRForge is a 100% client-side application. All QR code generation,
        logo embedding, and customization happens entirely in your browser.
        Your text, URLs, Wi-Fi credentials, and uploaded logos{" "}
        <strong className="text-foreground">never leave your device</strong>.
      </p>
      <ul className="list-disc space-y-1 pl-4">
        <li>No backend servers process your data.</li>
        <li>No analytics, tracking pixels, or cookies.</li>
        <li>No accounts, no sign-up, no login.</li>
        <li>
          The only stored data is your last 5 QR text values and your
          customization settings, both kept in your browser&apos;s{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">localStorage</code>.
        </li>
        <li>
          Every QR code is <strong className="text-foreground">static</strong> —
          there is no server-side redirect, so nothing can be tracked or expire.
        </li>
      </ul>
      <p>
        Clearing your browser data removes everything. We have nothing to sell,
        share, or leak.
      </p>
    </div>
  );
}

function TermsBody() {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>
        By using QRForge, you agree to the following simple terms:
      </p>
      <ul className="list-disc space-y-1 pl-4">
        <li>
          QRForge is provided <strong className="text-foreground">as-is</strong>,
          without warranty of any kind. Use at your own risk.
        </li>
        <li>
          You are responsible for the content you encode into QR codes and for
          ensuring you have the right to use any uploaded logos.
        </li>
        <li>
          The service is free. There are no paid tiers, watermarks, or hidden
          costs.
        </li>
        <li>
          The author is not liable for any damages arising from the use of
          generated QR codes.
        </li>
      </ul>
      <p>
        QRForge is an open-source project by{" "}
        <a
          href="https://github.com/JeffreyHamilton6399/qrforge"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-600 hover:underline"
        >
          Jeffrey Hamilton
        </a>
        .
      </p>
    </div>
  );
}
