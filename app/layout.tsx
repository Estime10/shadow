import type { Metadata, Viewport } from "next";
import { Oswald, Space_Mono } from "next/font/google";
import { PageTransition } from "@/components/animations/PageTransition/PageTransition";
import { ViewportLock } from "@/app/ViewportLock/ViewportLock";
import { PwaRegister } from "@/components/pwa/PwaRegister/PwaRegister";
import type { LayoutChildrenProps } from "@/types/layout";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
});

export const metadata: Metadata = {
  title: {
    default: "Ghost Riders — Messages éphémères & Calendrier",
    template: "%s — Ghost Riders",
  },
  description:
    "App privée : messages éphémères 24h, calendrier partagé, notifications realtime. Installable en PWA.",
  icons: {
    apple: "/logo/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#0a0a0a",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Ghost Riders",
  },
};

export default function RootLayout({ children }: Readonly<LayoutChildrenProps>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${oswald.variable} ${spaceMono.variable} antialiased min-h-screen bg-(--bg) text-(--text)`}
      >
        <ViewportLock>
          <PageTransition>{children}</PageTransition>
          <PwaRegister />
        </ViewportLock>
      </body>
    </html>
  );
}
