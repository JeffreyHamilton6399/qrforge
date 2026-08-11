import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRForge — Fast, private QR code generator",
  description:
    "Generate QR codes instantly. Customize colors, add a logo, download as PNG or SVG. 100% client-side — your data never leaves your browser. No sign-up, no tracking, no ads.",
  keywords: [
    "QR code",
    "QR generator",
    "free QR code",
    "private QR",
    "QR code maker",
    "PNG QR",
    "SVG QR",
  ],
  authors: [{ name: "Jeffrey Hamilton" }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    title: "QRForge — Fast, private QR code generator",
    description:
      "Type a URL or text, get a QR code instantly. 100% client-side. No tracking.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QRForge",
    description: "Fast, private QR code generator.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
