import type { Metadata, Viewport } from "next";
import { Oswald, Space_Mono } from "next/font/google";
import { AppNav } from "@/components/layout/AppNav/AppNav";
import { PageTransition } from "@/components/animations/PageTransition/PageTransition";
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
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Ghost Riders — Messages éphémères & Calendrier",
    template: "%s — Ghost Riders",
  },
  description:
    "App privée : messages éphémères 24h, calendrier partagé, notifications realtime. Installable en PWA.",
};

export default function RootLayout({ children }: Readonly<LayoutChildrenProps>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${oswald.variable} ${spaceMono.variable} antialiased min-h-screen bg-(--bg) text-(--text)`}
      >
        <div className="flex min-h-screen flex-col pb-20">
          <PageTransition>{children}</PageTransition>
        </div>
        <AppNav />
      </body>
    </html>
  );
}
