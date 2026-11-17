// Copies only the public site files into dist/ for hosting (Cloudflare Pages output dir).
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const PUBLIC_FILES = [
  'index.html',
  'css/site.css',
  'js/hero.js',
  'assets/fonts/thmanyah-bold.woff2',
  'assets/fonts/thmanyah-medium.woff2',
  'assets/img/reel-arm.webp',
  'assets/img/reel-head.webp',
  'assets/img/proof-ig-30d.webp',
  'assets/img/proof-whistle.webp',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'og.png',
];

export async function build(outDir = join(ROOT, 'dist')) {
  await rm(outDir, { recursive: true, force: true });
  for (const file of PUBLIC_FILES) {
    const target = join(outDir, file);
    await mkdir(dirname(target), { recursive: true });
    await cp(join(ROOT, file), target);
  }
  return outDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = await build();
  console.log(`Built ${PUBLIC_FILES.length} files into ${out}`);
}
