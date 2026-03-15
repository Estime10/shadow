/**
 * Génère les icônes PWA (192, 512, 180 pour Apple) depuis public/logo/logo_gr.png.
 * Usage: pnpm run generate-pwa-icons (ou node scripts/generate-pwa-icons.mjs)
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public", "logo", "logo_gr.png");
const outDir = join(root, "public", "logo");

const SIZES = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

async function main() {
  const buffer = readFileSync(src);
  for (const { name, size } of SIZES) {
    const outPath = join(outDir, name);
    await sharp(buffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
