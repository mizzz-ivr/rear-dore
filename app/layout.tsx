import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const defaultSiteUrl = "https://reardore.ivrm.jp";

function resolveSiteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl);
  } catch {
    return new URL(defaultSiteUrl);
  }
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "レアどれ？",
    template: "%s | レアどれ？",
  },
  description: "みんなが選ばなそうな答えを選べ。少数派を狙うデイリー選択ゲーム。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "レアどれ？",
    description: "みんなが選ばなそうな答えを選べ。",
    url: "/",
    siteName: "レアどれ？",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "レアどれ？",
    description: "みんなが選ばなそうな答えを選べ。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
