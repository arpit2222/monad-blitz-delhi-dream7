import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import AppShell from "@/components/layout/AppShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050A1A",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Dream7 — IPL Prediction Wall on Monad",
  description:
    "Bet YES or NO on IPL moments. Instant, on-chain, cheap. Built on Monad testnet.",
  keywords: ["dream7", "ipl", "prediction", "monad", "cricket", "web3", "betting"],
  authors: [{ name: "Dream7" }],
  openGraph: {
    title: "Dream7 — IPL Prediction Wall on Monad",
    description:
      "Bet YES or NO on IPL moments. Instant, on-chain, cheap.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Dream7",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Dream7 — IPL Prediction Wall on Monad",
    description:
      "Bet YES or NO on IPL moments. Instant, on-chain, cheap.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
