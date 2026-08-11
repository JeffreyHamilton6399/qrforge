/**
 * QR payload formatters.
 *
 * Each preset type produces a single string that is encoded into the QR code.
 * These formats follow common conventions so phone camera apps handle them.
 */

export type QrType = "url" | "text" | "email" | "phone" | "sms" | "wifi";

export interface WifiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

/**
 * Escape a value inside a Wi-Fi payload per the WIFI: scheme spec.
 * Backslash-escape: \ ; , : "
 */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

/** Format a URL payload. Adds https:// if no scheme is present. */
export function formatUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Plain text — returned as-is. */
export function formatText(input: string): string {
  return input;
}

/** Email payload as a mailto: link. */
export function formatEmail(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return `mailto:${trimmed}`;
}

/** Phone payload as a tel: link. */
export function formatPhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return `tel:${trimmed}`;
}

/** SMS payload: sms:number?body=message (body optional). */
export function formatSms(input: string, body: string): string {
  const number = input.trim();
  if (!number) return "";
  const cleanBody = body.trim();
  const base = `sms:${number}`;
  return cleanBody ? `${base}?body=${encodeURIComponent(cleanBody)}` : base;
}

/** Wi-Fi payload per the WIFI: scheme. */
export function formatWifi(data: WifiData): string {
  if (!data.ssid) return "";
  const parts: string[] = [];
  parts.push(`T:${data.security}`);
  parts.push(`S:${escapeWifi(data.ssid)}`);
  if (data.security !== "nopass") {
    parts.push(`P:${escapeWifi(data.password)}`);
  }
  if (data.hidden) {
    parts.push("H:true");
  }
  return `WIFI:${parts.join(";")};;`;
}

/** Placeholder text for the content input based on the selected type. */
export function placeholderFor(type: QrType): string {
  switch (type) {
    case "url":
      return "https://example.com";
    case "text":
      return "Any text to encode…";
    case "email":
      return "name@example.com";
    case "phone":
      return "+1 234 567 890";
    case "sms":
      return "+1 234 567 890";
    case "wifi":
      return "Network name (SSID)";
    default:
      return "";
  }
}
