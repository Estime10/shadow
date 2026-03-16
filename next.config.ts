import type { NextConfig } from "next";
import path from "path";

// Racine du projet (shadow) : toujours absolue ; si cwd = parent "creativity", pointer vers shadow
const projectRoot = path.resolve(
  process.cwd().endsWith("shadow") ? process.cwd() : path.join(process.cwd(), "shadow")
);

// Plugins optionnels chargés dynamiquement (API CJS)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bundleAnalyzer = require("@next/bundle-analyzer");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
  cleanupOutdatedCaches: true,
});

const nextConfig: NextConfig = {
  // Racine du projet pour Turbopack (dossier du config = shadow, pas le parent creativity)
  turbopack: {
    root: projectRoot,
  },
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
  // Force la racine du projet pour webpack (shadow) : context + modules pour la résolution
  webpack: (config) => {
    config.context = projectRoot;
    config.resolve = config.resolve ?? {};
    config.resolve.modules = [
      path.join(projectRoot, "node_modules"),
      ...(config.resolve.modules ?? ["node_modules"]),
    ];
    return config;
  },
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withPWA(withBundleAnalyzer(nextConfig));
