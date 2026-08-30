"use client";

import * as React from "react";
import { Eye, EyeOff, Wifi } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { WifiData } from "@/lib/formatters";

export interface WifiFormProps {
  value: WifiData;
  onChange: (next: WifiData) => void;
}

export function WifiForm({ value, onChange }: WifiFormProps) {
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-muted/30 p-3">
      <div className="grid gap-1.5">
        <Label htmlFor="wifi-ssid" className="text-xs font-medium">
          Network name (SSID)
        </Label>
        <Input
          id="wifi-ssid"
          value={value.ssid}
          onChange={(e) => onChange({ ...value, ssid: e.target.value })}
          placeholder="MyHomeNetwork"
          className="h-9"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="wifi-password" className="text-xs font-medium">
          Password
        </Label>
        <PasswordInput
          id="wifi-password"
          value={value.password}
          disabled={value.security === "nopass"}
          onChange={(pw) => onChange({ ...value, password: pw })}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label htmlFor="wifi-security" className="mb-1.5 block text-xs font-medium">
            Security
          </Label>
          <Select
            value={value.security}
            onValueChange={(v) =>
              onChange({ ...value, security: v as WifiData["security"] })
            }
          >
            <SelectTrigger id="wifi-security" className="h-8 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">None (open)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label
          htmlFor="wifi-hidden"
          className="flex h-8 cursor-pointer items-center gap-2 self-end pb-1.5 text-xs font-medium text-muted-foreground"
        >
          <Checkbox
            id="wifi-hidden"
            checked={value.hidden}
            onCheckedChange={(c) => onChange({ ...value, hidden: c === true })}
          />
          Hidden
        </label>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Wifi className="size-3" />
        Phones will auto-fill Wi-Fi settings from this QR.
      </p>
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={disabled ? "Open network, no password" : "••••••••"}
        className="h-9 pr-9"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        disabled={disabled}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
