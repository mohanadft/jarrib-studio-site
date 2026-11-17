# Jarrib Studio site: design (short)

The full spec is `HANDOFF.md`; the visual source of truth is `reference/design.dc.html`. This doc records only what
was decided on top of them.

## Intent
Ship the approved one-page marketing site for جرّب ستوديو at jarribstudio.com: dark, RTL, Arabic, the real numbers and
screenshots as proof, one action (email us). Faithful to the approved canvas, not a redesign.

## Goals / non-goals / anti-goals
- Goals: pixel-faithful build of the 8 sections; mobile first (390 px); 4.5:1 text contrast; keyboard focus; reduced
  motion respected; fast (self-hosted woff2, WebP, lazy screenshots); OG/Twitter image, favicon, meta.
- Non-goals: CMS, analytics, forms, prices, English version, deploy.
- Anti-goals: listing websites/ads services; invented numbers or testimonials; em dashes in any copy; redrawing the
  wordmark; gradients, emoji, stock photos.

## Approaches
- **Plain HTML/CSS + small vanilla JS, assets pre-converted and committed** (picked). One page, no runtime deps,
  nothing to maintain; the brief allows it.
- Astro: componentisation and an image pipeline, but a build toolchain for a single static page. Not worth it.
- Port the canvas runtime (`support.js`): not available and not meant for production.

## Decisions
- Contrast fix (owner chose A): keep red `#F0352B` everywhere as approved; any text on red below large-text size
  (under 24 px regular / 18.66 px bold) uses ink `#121111` (4.71:1). Large headings on red stay white (4.0:1, passes
  3:1 for large text). Affects: contact paragraph and "أو تابعنا" line, platform pills on red, the red service card body
  text, the phone screen's «الفيديو الجاي» label.
- Header CTA «احكي معنا» is a red pill: use ink text on it.
- Hero press button: real `<button aria-label="الفيديو الجاي">`; press-down ~100 ms then advance
  reel-arm → reel-head → red «براندك هون» screen → loop; 3 dots with `aria-current`; phone region `aria-live="polite"`.
  Under `prefers-reduced-motion` no press animation, content still advances.
- Fonts: thmanyah Bold/Medium converted to woff2 via fontTools (`font-display: swap`); IBM Plex Sans Arabic from
  Google Fonts.
- Images: WebP via ImageMagick, reels sized for a 260 px phone at 2x, screenshots at their display widths at 2x;
  screenshots `loading="lazy"`; explicit width/height.
- OG image 1200x630 (dark, lockup + H1) rendered from an HTML template with headless Chrome; favicon from
  `button.svg` (SVG + 32 px PNG + 180 px apple-touch).

## Left to the builder
File layout, CSS organisation (custom properties for the palette), exact responsive breakpoints, as long as 390 px and
1440 px both match the reference's intent.
