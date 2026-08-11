# QRForge

**Fast, private QR code generator.** Type a URL or text, get a QR code instantly.
Customize colors, add a logo, download as PNG or SVG. No sign-up, no tracking, no ads.

> QR generators charge $35/month and track your scans. We don't.

---

## Why QRForge

- **100% private** — every QR is generated in your browser. Your text, URLs,
  and Wi-Fi passwords never leave your device. There is no server, no database,
  and no analytics.
- **Static & permanent** — every QR code is a direct, static encoding. There is
  no server-side redirect, so nothing can ever expire, change, or be tracked.
- **Instant** — the QR renders as you type, in under a millisecond for most inputs.
- **Yours** — download as a high-resolution PNG (up to 1024px) or an infinitely
  scalable SVG. No watermark, no paid tier.

## Features

- Six preset types: **URL, Plain Text, Email, Phone, SMS, Wi-Fi**
- Foreground & background color pickers
- Adjustable size: 128 / 256 / 512 / 1024px
- Error correction levels: L / M / Q / H
- Optional **logo** embedded in the center (auto-locks error correction to `H`)
- **Download as PNG** (with embedded logo) or **SVG**
- **History** — last 5 generated codes (text only, stored locally)
- Light / Dark / System theme
- Mobile-first, responsive layout
- Settings persist via `localStorage`

## Privacy

QRForge has no backend. There are:

- ❌ No API routes
- ❌ No database
- ❌ No analytics or tracking
- ❌ No dynamic (redirect) QR codes
- ❌ No accounts

The only data stored is the last 5 QR text values and your customization
settings, both in your browser's `localStorage`. Clearing your browser data
removes everything.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [qrcode](https://www.npmjs.com/package/qrcode) for QR generation
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- [lucide-react](https://lucide.dev) for icons
- `bun` as the package manager

## Local Development

```bash
bun install
bun run dev
```

The app runs at `http://localhost:3000`.

```bash
bun run lint   # ESLint
bun run build  # Production build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — keep the defaults:
   - **Framework preset:** Next.js
   - **Build command:** `next build` (from `package.json`)
   - **Output directory:** `.next`
   - **Install command:** `bun install` (or leave default)
4. Click **Deploy**. No environment variables are needed — QRForge is fully
   client-side and requires zero configuration.

> Because there is no backend, the entire app ships as static + client-rendered
> assets. Deploy time is a few seconds.

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind theme + scrollbar/color-input polish
│   ├── layout.tsx         # Root layout, metadata, ThemeProvider
│   └── page.tsx           # Renders <QrForgeApp />
├── components/
│   ├── theme-provider.tsx # next-themes wrapper
│   ├── theme-toggle.tsx   # Light/Dark/System dropdown
│   └── qrforge/
│       ├── qrforge-app.tsx    # State, payload derivation, generation, downloads
│       ├── header.tsx         # Logo · Donate · Theme toggle
│       ├── footer.tsx         # V1 · Jeffrey Hamilton
│       ├── control-panel.tsx  # Type selector, input, customize, logo upload
│       ├── wifi-form.tsx      # SSID / password / security / hidden
│       ├── qr-preview.tsx     # Canvas preview + download buttons
│       ├── history-list.tsx   # Last 5 codes
│       └── logo-upload.tsx    # Drag/drop logo
└── lib/
    ├── qr.ts            # QR → canvas / SVG, logo compositing, downloads
    ├── formatters.ts    # URL / email / phone / SMS / Wi-Fi payload formatters
    └── history.ts       # localStorage history (last 5)
```

## QR Formats

| Type    | Payload                                            |
| ------- | -------------------------------------------------- |
| URL     | `https://example.com` (auto-prepends `https://`)   |
| Text    | raw text                                           |
| Email   | `mailto:name@example.com`                          |
| Phone   | `tel:+1234567890`                                  |
| SMS     | `sms:number?body=message`                          |
| Wi-Fi   | `WIFI:T:WPA;S:network;P:password;;`               |

## Author

**Jeffrey Hamilton** — [GitHub: JeffreyHamilton6399](https://github.com/JeffreyHamilton6399)

☕ Donate: [buymeacoffee.com/jeffreyscof](https://buymeacoffee.com/jeffreyscof)

## License

MIT
