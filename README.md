# QRForge

Type a URL or some text, get a QR code. Set the colours, drop a logo in the
middle, download it as PNG or SVG.

The code renders as you type. For most inputs that's under a millisecond, so
there's no generate button.

## Static, not tracked

Every code here is a direct, static encoding of whatever you typed. There is no
redirect through a server in the middle, which means nothing can expire, be
changed after the fact, or count your scans.

That's the difference from most QR services, where the code points at their
domain and they own what happens next. It also means you can't edit a code after
it's printed. That trade is the point.

## What it does

- Six input types: URL, plain text, email, phone, SMS and Wi-Fi
- Foreground and background colour pickers
- 128, 256, 512 or 1024 px output
- Error correction at L, M, Q or H
- An optional logo in the centre, which forces error correction to `H`
- PNG with the logo composited in, or SVG
- The last 5 codes you made, kept locally
- Light, dark and system themes

## Payloads

| Type  | Encoded as                                       |
| ----- | ------------------------------------------------ |
| URL   | `https://example.com`, with `https://` prepended if missing |
| Text  | raw text                                         |
| Email | `mailto:name@example.com`                        |
| Phone | `tel:+1234567890`                                |
| SMS   | `sms:number?body=message`                        |
| Wi-Fi | `WIFI:T:WPA;S:network;P:password;;`              |

## Privacy

There's no backend: no API routes, no database, no analytics, no accounts. Your
text, URLs and Wi-Fi passwords are encoded in the tab.

The only things stored are the last 5 QR values and your settings, both in
`localStorage`. Clearing site data removes them.

## Running it

```bash
bun install
bun run dev     # http://localhost:3000
bun run lint
bun run build
```

## Built with

- [Next.js 16](https://nextjs.org) (App Router), TypeScript
- [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- [qrcode](https://www.npmjs.com/package/qrcode)
- [next-themes](https://github.com/pacocoursey/next-themes), [lucide-react](https://lucide.dev)
- bun

## Layout

```
src/
├── app/
│   ├── globals.css        Tailwind theme, scrollbar and colour-input tweaks
│   ├── layout.tsx         root layout, metadata, ThemeProvider
│   └── page.tsx
├── components/
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── qrforge/
│       ├── qrforge-app.tsx    state, payload derivation, generation, downloads
│       ├── header.tsx
│       ├── footer.tsx
│       ├── control-panel.tsx  type selector, input, customise, logo upload
│       ├── wifi-form.tsx      SSID, password, security, hidden
│       ├── qr-preview.tsx     canvas preview and download buttons
│       ├── history-list.tsx
│       └── logo-upload.tsx
└── lib/
    ├── qr.ts            QR to canvas and SVG, logo compositing, downloads
    ├── formatters.ts    payload formatters per type
    └── history.ts       localStorage history
```

## Deploying

Import the repo on Vercel and keep the defaults. Next.js is auto-detected and
there are no environment variables, so the whole thing ships as static and
client-rendered assets.

## License

MIT.

---

Jeffrey Hamilton · [GitHub](https://github.com/JeffreyHamilton6399) ·
[buy me a coffee](https://buymeacoffee.com/jeffreyscof)
