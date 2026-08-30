/**
 * Local history of recently generated QR payloads.
 *
 * Only the encoded text string is stored (never images) - the QR is
 * re-rendered instantly from the string. Data stays in the browser's
 * localStorage and never leaves the device.
 */

export interface HistoryEntry {
  /** The encoded QR payload string. */
  text: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** The preset type used when this was created. */
  type: string;
}

const STORAGE_KEY = "qrforge.history.v1";
const MAX_ENTRIES = 5;

/** Read the history list (newest first). Returns [] on any error. */
export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Add a new entry to the front of the history. Dedupes by text. */
export function addHistory(text: string, type: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const trimmed = text.trim();
  if (!trimmed) return readHistory();
  const existing = readHistory();
  const withoutDup = existing.filter((e) => e.text !== trimmed);
  const entry: HistoryEntry = {
    text: trimmed,
    createdAt: new Date().toISOString(),
    type,
  };
  const next = [entry, ...withoutDup].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors silently */
  }
  return next;
}

/** Remove all history entries. */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function isValidEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return typeof e.text === "string" && typeof e.createdAt === "string";
}
