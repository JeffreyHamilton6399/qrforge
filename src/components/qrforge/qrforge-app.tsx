"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";

import { Header } from "./header";
import { Footer } from "./footer";
import { ControlPanel, type ControlState } from "./control-panel";
import { QrPreview } from "./qr-preview";
import { HistoryList } from "./history-list";

import {
  formatUrl,
  formatText,
  formatEmail,
  formatPhone,
  formatSms,
  formatWifi,
  type QrType,
  type WifiData,
} from "@/lib/formatters";
import {
  generateQrToCanvas,
  generateQrSvg,
  drawLogoOnCanvas,
  downloadCanvasPng,
  downloadSvg,
  fileToImage,
  type ErrorCorrectionLevel,
} from "@/lib/qr";
import { readHistory, addHistory, clearHistory, type HistoryEntry } from "@/lib/history";

const SETTINGS_KEY = "qrforge.settings.v1";
const HISTORY_DEBOUNCE_MS = 600;

const DEFAULT_WIFI: WifiData = {
  ssid: "",
  password: "",
  security: "WPA",
  hidden: false,
};

const DEFAULT_STATE: ControlState = {
  type: "url",
  content: "",
  smsBody: "",
  wifi: DEFAULT_WIFI,
  foregroundColor: "#0f172a",
  backgroundColor: "#ffffff",
  size: 512,
  errorCorrectionLevel: "M",
  margin: 2,
};

export function QrForgeApp() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const logoImgRef = React.useRef<HTMLImageElement | null>(null);

  const [state, setState] = React.useState<ControlState>(DEFAULT_STATE);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [isBusy, setIsBusy] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // ---- Hydration: load persisted settings + history ----
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((prev) => ({ ...prev, ...parsed, wifi: { ...prev.wifi, ...(parsed.wifi || {}) } }));
      }
    } catch {
      /* ignore */
    }
    setHistory(readHistory());
    setHydrated(true);
  }, []);

  // ---- Persist settings ----
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state, hydrated]);

  // ---- Derive the QR payload from state ----
  const payload = React.useMemo(() => buildPayload(state), [state]);

  const hasLogo = logoPreview !== null;
  const effectiveLevel: ErrorCorrectionLevel =
    hasLogo ? "H" : state.errorCorrectionLevel;

  // ---- Regenerate the QR on the preview canvas ----
  React.useEffect(() => {
    if (!hydrated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const text = payload;

    // 100ms debounce on text changes for snappy-but-safe live preview.
    const handle = window.setTimeout(() => {
      if (!text.trim()) {
        // Clear canvas
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
        return;
      }

      setIsBusy(true);
      generateQrToCanvas(canvas, {
        text,
        size: state.size,
        margin: state.margin,
        foregroundColor: state.foregroundColor,
        backgroundColor: state.backgroundColor,
        errorCorrectionLevel: effectiveLevel,
      })
        .then(() => {
          if (logoImgRef.current) {
            drawLogoOnCanvas(canvas, logoImgRef.current);
          }
        })
        .catch(() => {
          /* invalid input — silently ignore */
        })
        .finally(() => setIsBusy(false));
    }, 100);

    return () => window.clearTimeout(handle);
  }, [
    payload,
    state.size,
    state.margin,
    state.foregroundColor,
    state.backgroundColor,
    effectiveLevel,
    hydrated,
    logoPreview,
  ]);

  // ---- History: record payload (debounced, text only) ----
  React.useEffect(() => {
    if (!hydrated) return;
    if (!payload.trim()) return;
    const handle = window.setTimeout(() => {
      setHistory(addHistory(payload, state.type));
    }, HISTORY_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [payload, hydrated]);

  // ---- Handlers ----
  const patch = React.useCallback((p: Partial<ControlState>) => {
    setState((prev) => ({ ...prev, ...p }));
  }, []);

  const handleLogoFile = React.useCallback((file: File | null) => {
    if (!file) {
      logoImgRef.current = null;
      setLogoPreview(null);
      return;
    }
    fileToImage(file)
      .then((img) => {
        logoImgRef.current = img;
        setLogoPreview(img.src);
      })
      .catch(() => {
        logoImgRef.current = null;
        setLogoPreview(null);
      });
  }, []);

  const handleLogoClear = React.useCallback(() => {
    logoImgRef.current = null;
    setLogoPreview(null);
  }, []);

  const handleDownloadPng = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !payload.trim()) return;
    // The visible canvas already has the QR (+ optional logo) composited.
    downloadCanvasPng(canvas, filename("qrcode", "png"));
  }, [payload]);

  const handleDownloadSvg = React.useCallback(async () => {
    if (!payload.trim()) return;
    try {
      const svg = await generateQrSvg({
        text: payload,
        size: state.size,
        margin: state.margin,
        foregroundColor: state.foregroundColor,
        backgroundColor: state.backgroundColor,
        errorCorrectionLevel: effectiveLevel,
      });
      downloadSvg(svg, filename("qrcode", "svg"));
    } catch {
      /* ignore */
    }
  }, [
    payload,
    state.size,
    state.margin,
    state.foregroundColor,
    state.backgroundColor,
    effectiveLevel,
  ]);

  const handleHistorySelect = React.useCallback((entry: HistoryEntry) => {
    // Decode the payload back into the most likely state.
    const decoded = decodePayload(entry.text, entry.type as QrType);
    setState((prev) => ({ ...prev, ...decoded }));
  }, []);

  const handleHistoryClear = React.useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <Header />

      <main className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left: controls */}
        <div className="flex flex-1 flex-col overflow-y-auto border-b border-border md:max-w-md md:flex-none md:w-[420px] md:border-b-0 md:border-r">
          <ControlPanel
            state={state}
            onChange={patch}
            logoPreview={logoPreview}
            onLogoFile={handleLogoFile}
            onLogoClear={handleLogoClear}
            hasLogo={logoPreview !== null}
          />
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <HistoryList
              entries={history}
              onSelect={handleHistorySelect}
              onClear={handleHistoryClear}
            />
          </div>
          <PrivacyNote />
        </div>

        {/* Right: QR preview */}
        <div className="flex flex-1 items-stretch justify-center bg-muted/20">
          <QrPreview
            canvasRef={canvasRef}
            payload={payload}
            hasLogo={logoPreview !== null}
            onDownloadPng={handleDownloadPng}
            onDownloadSvg={handleDownloadSvg}
            isBusy={isBusy}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PrivacyNote() {
  return (
    <div className="mx-3 mb-3 sm:mx-4 sm:mb-4">
      <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-200/80">
          <strong className="font-semibold">100% private.</strong> QR generators
          charge $35/month and track your scans. We don&apos;t. Everything runs
          in your browser — your data never leaves this device.
        </p>
      </div>
    </div>
  );
}

function buildPayload(state: ControlState): string {
  switch (state.type) {
    case "url":
      return formatUrl(state.content);
    case "text":
      return formatText(state.content);
    case "email":
      return formatEmail(state.content);
    case "phone":
      return formatPhone(state.content);
    case "sms":
      return formatSms(state.content, state.smsBody);
    case "wifi":
      return formatWifi(state.wifi);
    default:
      return "";
  }
}

function decodePayload(text: string, type: QrType): Partial<ControlState> {
  const next: Partial<ControlState> = { type };
  switch (type) {
    case "url":
      next.content = text.replace(/^https?:\/\//, "");
      break;
    case "email":
      next.content = text.replace(/^mailto:/i, "");
      break;
    case "phone":
      next.content = text.replace(/^tel:/i, "");
      break;
    case "sms": {
      const m = text.match(/^sms:([^?]+)(?:\?body=(.*))?$/);
      next.content = m ? m[1] : text.replace(/^sms:/, "");
      next.smsBody = m && m[2] ? decodeURIComponent(m[2]) : "";
      break;
    }
    case "wifi": {
      // WIFI:T:WPA;S:ssid;P:password;H:true;;
      const ssid = text.match(/S:((?:[^;\\]|\\.)*)/);
      const password = text.match(/P:((?:[^;\\]|\\.)*)/);
      const security = text.match(/T:([^;]*)/);
      next.wifi = {
        ssid: ssid ? unescapeWifi(ssid[1]) : "",
        password: password ? unescapeWifi(password[1]) : "",
        security: (security?.[1] as WifiData["security"]) || "WPA",
        hidden: text.includes("H:true"),
      };
      break;
    }
    case "text":
    default:
      next.content = text;
      break;
  }
  return next;
}

function unescapeWifi(value: string): string {
  return value.replace(/\\(.)/g, "$1");
}

function filename(base: string, ext: string): string {
  const stamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-");
  return `${base}-${stamp}.${ext}`;
}
