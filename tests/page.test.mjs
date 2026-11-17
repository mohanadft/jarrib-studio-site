import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const load = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = load("index.html");
const css = load("css/site.css");

const MAIL = 'href="mailto:hello@jarribstudio.com"';
const PLATFORMS = [
  "https://instagram.com/jarrib1",
  "https://www.tiktok.com/@jarrib2026",
  "https://www.youtube.com/@jarrib2026",
  "https://www.facebook.com/profile.php?id=61595338556208",
  "https://www.threads.net/@jarrib1",
];

// Visible copy: drop style, script, comments, then tags; collapse whitespace.
const text = html
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ");

const count = (hay, needle) => hay.split(needle).length - 1;

// CSS rules as [selector, body] pairs, with @media wrappers flattened.
const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
  ([, sel, body]) => [sel.trim(), body],
);
const decl = (body, prop) => body.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`))?.[1].trim();

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("html root", () => {
  assert.match(html, /<html lang="ar" dir="rtl">/);
});

test("no dashes in copy", () => {
  assert.ok(!text.includes("—"), "em dash in copy");
  assert.ok(!text.includes("--"), "double hyphen in copy");
});

test("no dashes in attribute copy and hero.js strings", () => {
  const attrs = [...html.matchAll(/\b(?:content|alt|aria-label)="([^"]*)"/g)].map((m) => m[1]);
  const literals = [...load("js/hero.js").matchAll(/'([^'\n]*)'|"([^"\n]*)"/g)].map((m) => m[1] ?? m[2]);
  for (const s of [...attrs, ...literals]) {
    assert.ok(!s.includes("—"), `em dash in: ${s}`);
    assert.ok(!s.includes("--"), `double hyphen in: ${s}`);
  }
});

test("no canvas template syntax left", () => {
  for (const s of ["{{", "/_blob/", "<sc-if", "<sc-for", "<x-dc"]) assert.ok(!html.includes(s), s);
});

test("sections present", () => {
  for (const id of ["top", "proof", "packages", "who", "contact"]) assert.match(html, new RegExp(`id="${id}"`));
  for (const h of ["#proof", "#packages", "#who"]) assert.ok(html.includes(`href="${h}"`), h);
});

test("copy", () => {
  const lines = [
    "فيديوهات", "بتنحضر", "للآخر.",
    "الفيديو اللي جاب 15 مليون مشاهدة، صار لبراندك.",
    "كبسة زر وبنبلّش", "+31 مليون", "+111 ألف", "الأرقام بتحكي.", "وهاي هي.",
    "سكرينشوتات حقيقية من إنستغرام جرّب، بدون تعديل.",
    "ريل شرح", "ريل تجربة", "الشهري", "فيديو شرح",
    "ستارتب أو تطبيق", "براند تعليم", "براند صحة", "براند تقنية", "جمعية", "وكالة بتعطي شغل لبرّا",
    "احكيلنا عن براندك وفكرتك، وبنرجعلك بفكرة فيديو.",
  ];
  for (const l of lines) assert.ok(text.includes(l), `missing: ${l}`);
});

test("forbidden content", () => {
  for (const s of ["مواقع", "إعلانات", "$", "₪", "دينار", "سعر"]) assert.ok(!html.includes(s), s);
});

test("links", () => {
  assert.ok(count(html, MAIL) >= 2, "mailto count");
  assert.match(html, /<a class="pill pill--red" href="https:\/\/wa\.me\/970597837283"[^>]*>احكي معنا<\/a>/, "header CTA opens WhatsApp");
  for (const u of PLATFORMS) assert.ok(count(html, `href="${u}"`) >= 2, u);
});

test("images", () => {
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  assert.ok(imgs.length >= 3);
  for (const img of imgs) {
    const alt = img.match(/\balt="([^"]*)"/)?.[1] ?? "";
    assert.match(alt, /[؀-ۿ]/, img);
    assert.match(img, /\bwidth="\d+"/, img);
    assert.match(img, /\bheight="\d+"/, img);
  }
  for (const name of ["proof-ig-30d.webp", "proof-whistle.webp"]) {
    const img = imgs.find((i) => i.includes(name));
    assert.ok(img, name);
    assert.match(img, /loading="lazy"/, name);
  }
});

test("hero hooks for js", () => {
  assert.match(html, /id="phone"[^>]*aria-live="polite"|aria-live="polite"[^>]*id="phone"/);
  assert.match(html, /id="phone-screen"/);
  assert.match(html, /<button[^>]*id="press"[^>]*aria-label="الفيديو الجاي"/);
  assert.match(html, /class="press-art"/);
  const dots = html.match(/<div[^>]*id="dots"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.equal(count(dots, "<span"), 3);
  assert.match(dots, /^\s*<span class="dot is-active"[^>]*>/);
  assert.match(html, /<script type="module" src="js\/hero\.js"><\/script>/);
  const screen = html.match(/id="phone-screen"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.match(screen, /src="assets\/img\/reel-arm\.webp"/);
  assert.match(screen, /alt="غلاف تجربة الإيد اللي بتطلع لحالها"/);
});

test("ltr runs are isolated", () => {
  for (const token of ["@jarrib1", "@jarrib2026", "hello@jarribstudio.com"]) {
    const segments = [...html.matchAll(/(<[^>]+>)([^<]*)/g)].filter(([, , t]) => t.includes(token));
    assert.ok(segments.length > 0, `${token} not shown`);
    for (const [, tag] of segments) assert.match(tag, /dir="ltr"|^<bdi\b/, `${token} in ${tag}`);
  }
});

test("head", () => {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /property="og:title" content="[^"]+"/);
  assert.match(html, /property="og:description" content="[^"]+"/);
  assert.match(html, /property="og:image" content="https:\/\/jarribstudio\.com\/og\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /<link rel="icon"[^>]*href="favicon\.svg"/);
  assert.match(html, /<link rel="apple-touch-icon"[^>]*href="apple-touch-icon\.png"/);
  assert.match(html, /<link rel="preload"[^>]*thmanyah-bold\.woff2/);
});

test("palette", () => {
  assert.match(css, /--ink\s*:\s*#121111/i);
  assert.match(css, /--paper\s*:\s*#EEEBE5/i);
  assert.match(css, /--red\s*:\s*#F0352B/i);
  assert.ok(!/gradient/i.test(css), "gradient in css");
});

test("focus ring defined per ground", () => {
  assert.ok(rules.some(([s, b]) => /(^|,)\s*:focus-visible/.test(s) && decl(b, "outline")), "base ring");
  assert.ok(
    rules.some(([s, b]) => /(#contact|\.on-red) :focus-visible/.test(s) && /var\(--ink\)|#121111/i.test(b)),
    "ink ring on red",
  );
});

test("contrast A", () => {
  assert.ok(contrast("#121111", "#F0352B") >= 4.5);
  const onRed = rules.filter(([s]) => /#contact|\.card-red/.test(s) && !s.includes(":focus-visible"));
  assert.ok(onRed.length > 0);
  for (const [sel, body] of onRed) {
    const color = decl(body, "color");
    if (!color || /var\(--ink\)|#121111/i.test(color)) continue;
    // Allowed exceptions: large headings (__title) and text that sits on its own ink ground.
    const onInk = /var\(--ink\)|#121111/i.test(decl(body, "background") ?? "");
    assert.ok(/__title\b/.test(sel) || onInk, `small text on red not ink: ${sel} { color: ${color} }`);
  }
});

test("motion only when allowed", () => {
  const outside = css.replace(/@media \(prefers-reduced-motion: no-preference\)\s*\{[\s\S]*?\n\}/g, "");
  assert.ok(!/transform\s*:/.test(outside), "transform outside no-preference media query");
});
