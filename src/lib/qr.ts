import QRCode from "qrcode";

/** Error correction levels supported by QR codes. */
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

/** Options for generating a QR code. */
export interface QRGenerateOptions {
  /** The text/payload to encode. */
  text: string;
  /** Pixel size (width = height) of the generated canvas. */
  size: number;
  /** Quiet-zone margin in modules. */
  margin: number;
  /** Foreground (dark) color as a hex string, e.g. "#000000". */
  foregroundColor: string;
  /** Background (light) color as a hex string, e.g. "#ffffff". */
  backgroundColor: string;
  /** Error correction level. Use "H" when embedding a logo. */
  errorCorrectionLevel: ErrorCorrectionLevel;
}

/**
 * Generate a QR code onto an existing canvas element.
 * Returns the canvas for convenience (already mutated in place).
 */
export async function generateQrToCanvas(
  canvas: HTMLCanvasElement,
  options: QRGenerateOptions,
): Promise<HTMLCanvasElement> {
  const { text, size, margin, foregroundColor, backgroundColor, errorCorrectionLevel } =
    options;
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin,
    color: { dark: foregroundColor, light: backgroundColor },
    errorCorrectionLevel,
  });
  return canvas;
}

/**
 * Generate a QR code as an SVG string.
 */
export async function generateQrSvg(
  options: QRGenerateOptions,
): Promise<string> {
  const { text, margin, foregroundColor, backgroundColor, errorCorrectionLevel } =
    options;
  return QRCode.toString(text, {
    type: "svg",
    margin,
    color: { dark: foregroundColor, light: backgroundColor },
    errorCorrectionLevel,
  });
}

/** Normalized logo position on the QR canvas (0,0 = top-left, 1,1 = bottom-right). */
export interface LogoPosition {
  x: number;
  y: number;
}

export const DEFAULT_LOGO_POSITION: LogoPosition = { x: 0.5, y: 0.5 };

/**
 * Draw a logo image onto a QR canvas at the given normalized position.
 * The logo occupies 20% of the QR width, with a small white padding box
 * behind it for scannability.
 *
 * NOTE: Requires the QR to be generated with errorCorrectionLevel "H"
 * for reliable scanning when a logo is present.
 */
export function drawLogoOnCanvas(
  canvas: HTMLCanvasElement,
  logo: HTMLImageElement,
  position: LogoPosition = DEFAULT_LOGO_POSITION,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const qrWidth = canvas.width;
  const logoBox = Math.floor(qrWidth * 0.2);
  const padding = Math.floor(logoBox * 0.08);
  const totalBox = logoBox + padding * 2;
  const cx = position.x * qrWidth;
  const cy = position.y * qrWidth;
  const x = Math.floor(cx - totalBox / 2);
  const y = Math.floor(cy - totalBox / 2);

  // White rounded background behind the logo.
  ctx.save();
  ctx.fillStyle = "#ffffff";
  roundedRect(ctx, x, y, totalBox, totalBox, Math.floor(totalBox * 0.15));
  ctx.fill();
  ctx.restore();

  // Draw the logo fitted inside the box.
  ctx.save();
  roundedRect(ctx, x + padding, y + padding, logoBox, logoBox, Math.floor(logoBox * 0.12));
  ctx.clip();
  ctx.drawImage(logo, x + padding, y + padding, logoBox, logoBox);
  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Trigger a browser download for a canvas as a PNG file.
 */
export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL("image/png");
  triggerDownload(url, filename);
}

/**
 * Trigger a browser download for an SVG string as a file.
 */
export function downloadSvg(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  // Revoke shortly after to free memory.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Load a File (from an <input type="file">) into an HTMLImageElement.
 */
export function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
