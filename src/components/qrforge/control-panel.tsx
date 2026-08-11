"use client";

import * as React from "react";
import {
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Type as TypeIcon,
  Wifi,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { QrType } from "@/lib/formatters";
import { placeholderFor } from "@/lib/formatters";
import type { ErrorCorrectionLevel } from "@/lib/qr";
import { WifiForm } from "./wifi-form";
import { LogoUpload } from "./logo-upload";
import type { WifiData } from "@/lib/formatters";

export interface ControlState {
  type: QrType;
  content: string;
  smsBody: string;
  wifi: WifiData;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
}

export interface ControlPanelProps {
  state: ControlState;
  onChange: (patch: Partial<ControlState>) => void;
  logoPreview: string | null;
  onLogoFile: (file: File | null) => void;
  onLogoClear: () => void;
  hasLogo: boolean;
}

const SIZE_OPTIONS = [128, 256, 512, 1024] as const;
const LEVEL_OPTIONS: { value: ErrorCorrectionLevel; label: string; hint: string }[] = [
  { value: "L", label: "L — 7%", hint: "Low" },
  { value: "M", label: "M — 15%", hint: "Medium" },
  { value: "Q", label: "Q — 25%", hint: "Quartile" },
  { value: "H", label: "H — 30%", hint: "High" },
];

const TYPE_ITEMS: { value: QrType; label: string; icon: React.ReactNode }[] = [
  { value: "url", label: "URL", icon: <Link2 className="size-3.5" /> },
  { value: "text", label: "Text", icon: <TypeIcon className="size-3.5" /> },
  { value: "email", label: "Email", icon: <Mail className="size-3.5" /> },
  { value: "phone", label: "Phone", icon: <Phone className="size-3.5" /> },
  { value: "sms", label: "SMS", icon: <MessageSquare className="size-3.5" /> },
  { value: "wifi", label: "Wi-Fi", icon: <Wifi className="size-3.5" /> },
];

export function ControlPanel({
  state,
  onChange,
  logoPreview,
  onLogoFile,
  onLogoClear,
  hasLogo,
}: ControlPanelProps) {
  const isWifi = state.type === "wifi";
  const isSms = state.type === "sms";
  const effectiveLevel = hasLogo ? "H" : state.errorCorrectionLevel;

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      {/* Type + content */}
      <section className="grid gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Content type
        </Label>
        <Select
          value={state.type}
          onValueChange={(v) => onChange({ type: v as QrType })}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.icon}
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!isWifi && (
          <div className="grid gap-1.5">
            <Label htmlFor="content" className="text-xs font-medium">
              {state.type === "sms" ? "Phone number" : "Content"}
            </Label>
            <Textarea
              id="content"
              value={state.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder={placeholderFor(state.type)}
              className="min-h-[88px] resize-none text-sm"
              autoComplete="off"
              spellCheck={false}
            />
            {isSms && (
              <Input
                value={state.smsBody}
                onChange={(e) => onChange({ smsBody: e.target.value })}
                placeholder="Message body (optional)"
                className="h-9 text-sm"
                autoComplete="off"
              />
            )}
          </div>
        )}

        {isWifi && (
          <WifiForm
            value={state.wifi}
            onChange={(wifi) => onChange({ wifi })}
          />
        )}
      </section>

      {/* Customize */}
      <section className="grid gap-3 rounded-lg border border-border p-3">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-foreground">Customize</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ColorField
            id="fg-color"
            label="Foreground"
            value={state.foregroundColor}
            onChange={(v) => onChange({ foregroundColor: v })}
          />
          <ColorField
            id="bg-color"
            label="Background"
            value={state.backgroundColor}
            onChange={(v) => onChange({ backgroundColor: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="qr-size" className="text-xs font-medium">
              Size
            </Label>
            <Select
              value={String(state.size)}
              onValueChange={(v) => onChange({ size: Number(v) })}
            >
              <SelectTrigger id="qr-size" className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIZE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="qr-level" className="text-xs font-medium">
              Error correction
            </Label>
            <Select
              value={effectiveLevel}
              onValueChange={(v) =>
                onChange({ errorCorrectionLevel: v as ErrorCorrectionLevel })
              }
              disabled={hasLogo}
            >
              <SelectTrigger id="qr-level" className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasLogo && (
          <p className="text-[11px] text-muted-foreground">
            Error correction locked to <strong>H</strong> while a logo is embedded.
          </p>
        )}
      </section>

      {/* Logo upload */}
      <LogoUpload
        logoPreview={logoPreview}
        onFile={onLogoFile}
        onClear={onLogoClear}
      />
    </div>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-2 shadow-xs">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent p-0"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-full min-w-0 bg-transparent text-xs font-mono uppercase outline-none"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}
