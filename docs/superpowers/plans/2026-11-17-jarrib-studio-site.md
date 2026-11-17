# Jarrib Studio site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved one-page RTL Arabic marketing site for جرّب ستوديو as static files ready to host at jarribstudio.com.

**Architecture:** One `index.html`, one `css/site.css` (palette as custom properties), one `js/hero.js` for the press-button carousel. Assets are converted once by `tools/build_assets.py` and the outputs are committed next to the sources. Tests use `node --test`; browser tests drive the system Chrome through `puppeteer-core` (dev dependency only; the site ships zero JS deps).

**Tech Stack:** HTML, CSS, vanilla JS (ES module), Python 3 + fontTools/brotli + ImageMagick (`magick`) for assets, Node 22 `node:test`, `puppeteer-core` with `/usr/bin/google-chrome`.

**Spec:** `docs/superpowers/specs/2026-11-17-jarrib-studio-site-design.md`, which defers to `HANDOFF.md` (full brief, copy) and `reference/design.dc.html` (approved visual source; inline styles there are the exact sizes, spacing and colours to reproduce).

## Global Constraints

- `<html lang="ar" dir="rtl">`. Arabic only. Copy exactly as in `HANDOFF.md` / reference; no em dash `—` and no `--` in any site text.
- Palette: ink `#121111`, paper `#EEEBE5`, red `#F0352B`, shade `#B8231B`, muted `#9C9893`, body `#C9C4BD`, card `#1E1D1C`, lines `#2E2C2B` / `#3A3836`, on-red `#FFE1DE`, phone border `#2A2827`, screenshot ground `#0D0F12`.
- Contrast decision A: text on red smaller than 24 px regular / 18.66 px bold uses ink `#121111`. Large headings on red stay `#FFFFFF`.
- Never redraw the wordmark: inline the paths from `assets/img/logo-jarrib-paper.svg` / `button.svg` unchanged.
- Fonts: Thmanyah 700/500 self-hosted woff2 (`font-display: swap`); IBM Plex Sans Arabic 400/500/600 from Google Fonts.
- No prices, no web/ads services, no invented numbers or testimonials, no gradients, no emoji.
- Mailto: `mailto:hello@jarribstudio.com`. Platform URLs exactly as in `HANDOFF.md` "Platforms".
- Mobile first; no horizontal scroll from 320 px up; check 390 px and 1440 px.
- Do not deploy, push, or touch DNS.

## Review Focus

1. Mixed-direction strings (`@jarrib1`, `hello@jarribstudio.com`, `+31 مليون`) must render in the right order inside RTL text: wrap Latin runs in `<bdi dir="ltr">` / `dir="ltr"`. Pinned by Task 2 test `ltr runs are isolated`.
2. Rapid repeated presses (5 clicks in < 500 ms) must land on index `5 % 3` with the button not stuck pressed. Pinned by Task 3 test `rapid presses do not desync`.
3. Keyboard: Tab reaches every link and the press button, Enter and Space advance the phone, and the focus ring is visible on dark, paper and red grounds (on red use an ink ring). Pinned by Task 3 test `keyboard advances` and Task 2 test `focus ring defined per ground`.
4. 320 px viewport: the 56 px H1 floor, phone + button row and pills must not overflow. Pinned by Task 3 test `no horizontal overflow at 320 and 390`.
5. `prefers-reduced-motion: reduce`: no press/hover transforms, content still advances. Pinned by Task 3 test `reduced motion still advances`.

---

### Task 1: Asset pipeline (fonts, images, favicons)

**Model:** haiku (mechanical conversion).

**Files:**
- Create: `tools/build_assets.py`, `package.json`, `tests/assets.test.mjs`, `.gitignore` (`node_modules/`)
- Produces (committed): `assets/fonts/thmanyah-bold.woff2`, `assets/fonts/thmanyah-medium.woff2`, `assets/img/reel-arm.webp`, `assets/img/reel-head.webp` (520x924), `assets/img/proof-ig-30d.webp` (1242x770), `assets/img/proof-whistle.webp` (1242x1820), `favicon.svg` (copy of `assets/img/button.svg`), `favicon-32.png`, `apple-touch-icon.png` (180x180, button centred on `#121111`)

**Interfaces:**
- Produces: the file paths above; `npm test` runs `node --test tests/`.

- [ ] **Step 1: Write `tests/assets.test.mjs`**: for each produced file assert it exists and size > 0; each webp starts with `RIFF....WEBP`; each woff2 starts with `wOF2`; reel webp each < 120 KB; proof webp each < 160 KB; `favicon-32.png` IHDR width/height = 32; `apple-touch-icon.png` = 180.
- [ ] **Step 2: Run** `npm test` → FAIL (files missing).
- [ ] **Step 3: Implement `tools/build_assets.py`** (run with `python3 -I tools/build_assets.py`): fontTools `TTFont(path); font.flavor = "woff2"; font.save(out)`; images via `subprocess.run(["magick", src, "-resize", WxH, "-quality", "78", out])`; PNG favicons via `magick -background none -density 384 button.svg ...` (if ImageMagick cannot render the SVG, render with `google-chrome --headless --screenshot`). `package.json`: `"type": "module"`, `"scripts": {"test": "node --test tests/"}`, devDependency `puppeteer-core`.
- [ ] **Step 4: Run** `python3 -I tools/build_assets.py && npm install && npm test` → PASS.
- [ ] **Step 5: Commit** `feat: add asset pipeline and converted assets`.

### Task 2: Page markup and styles

**Model:** opus (fidelity to the reference, RTL typography craft).

**Files:**
- Create: `index.html`, `css/site.css`, `tests/page.test.mjs`

**Interfaces:**
- Consumes: Task 1 asset paths.
- Produces for Task 3: in `index.html` the elements `#phone` (container, `aria-live="polite"`), `#phone-screen` (where the active slide renders), `button#press` (`aria-label="الفيديو الجاي"`, contains the button SVG in `.press-art`), `#dots` with three `<span>` children, and `<script type="module" src="js/hero.js">`. Initial markup shows slide 0 (`reel-arm.webp`, alt «غلاف تجربة الإيد اللي بتطلع لحالها») so the page works without JS. CSS class `.is-down` on `#press` = pressed state; `.dot.is-active` = red dot.

- [ ] **Step 1: Write `tests/page.test.mjs`** (string/regex checks on the files, no browser):
  - `html root`: `<html lang="ar" dir="rtl">`.
  - `no dashes in copy`: text content (`<style>`, `<script>` and tags stripped) contains no `—` and no `--`.
  - `sections present`: ids `top`, `proof`, `packages`, `who`, `contact`; header links `href="#proof"`, `#packages`, `#who`.
  - `copy`: contains «فيديوهات», «بتنحضر», «للآخر.», «الفيديو اللي جاب 15 مليون مشاهدة، صار لبراندك.», «كبسة زر وبنبلّش», «+31 مليون», «+111 ألف», «الأرقام بتحكي.», «وهاي هي.», «سكرينشوتات حقيقية من إنستغرام جرّب، بدون تعديل.», the four service titles, the six who pills, «احكيلنا عن براندك وفكرتك، وبنرجعلك بفكرة فيديو.».
  - `forbidden content`: no `مواقع`, `إعلانات`, `$`, `₪`, `دينار`, `سعر`.
  - `links`: at least 3 `href="mailto:hello@jarribstudio.com"`; each of the 5 platform URLs appears at least twice (contact + footer).
  - `images`: every `<img>` has non-empty Arabic `alt` (matches `/[؀-ۿ]/`), `width`, `height`; the two proof images have `loading="lazy"`.
  - `ltr runs are isolated`: `@jarrib1`, `@jarrib2026` and `hello@jarribstudio.com` each sit inside an element with `dir="ltr"` (or `<bdi>`).
  - `head`: `<title>`, `meta name="description"`, `og:title`, `og:description`, `og:image` = `https://jarribstudio.com/og.png`, `twitter:card` = `summary_large_image`, `link rel="icon"` to `favicon.svg`, `apple-touch-icon`, `<link rel="preload"` for `thmanyah-bold.woff2`.
  - `palette`: `css/site.css` defines `--ink:#121111`, `--paper:#EEEBE5`, `--red:#F0352B` (case-insensitive, whitespace-tolerant) and contains no `gradient`.
  - `focus ring defined per ground`: CSS has a `:focus-visible` rule and a separate `#contact :focus-visible` (or `.on-red :focus-visible`) rule using ink.
  - `contrast A`: a contrast helper (WCAG relative luminance) asserts `#121111` on `#F0352B` ≥ 4.5 and every small-text colour declared under `#contact` / `.card-red` rules is `var(--ink)` or `#121111`.
- [ ] **Step 2: Run** `npm test` → page tests FAIL.
- [ ] **Step 3: Build `index.html` + `css/site.css`** reproducing `reference/design.dc.html` section by section (inline styles there are the spec; move them to classes). Apply decision A to: contact paragraph and «أو تابعنا» line, platform pills on red (ink text, ink-tinted border), red service card body text, phone «الفيديو الجاي» label, header «احكي معنا» pill. Meta description: «الستوديو التابع لقناة جرّب. ريلز موشن قصيرة بالعربي، بتمسك المشاهد من أول ثانية، بتشرح بسرعة، وبتنتشر.» Hover/press transforms only inside `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: build page markup and styles`.

### Task 3: Hero press interaction and browser checks

**Model:** sonnet.

**Files:**
- Create: `js/hero.js`, `tests/browser.test.mjs`, `tests/helpers/serve.mjs` (tiny `node:http` static server on a random port, returns `{url, close()}`)

**Interfaces:**
- Consumes: Task 2 element ids/classes.
- Produces: `js/hero.js` exports `SLIDES` (array of 3: `{kind:'reel', src:'assets/img/reel-arm.webp', alt:'غلاف تجربة الإيد اللي بتطلع لحالها'}`, `{kind:'reel', src:'assets/img/reel-head.webp', alt:'غلاف تجربة الراس اللي بيميل لحاله'}`, `{kind:'brand'}`) and `nextIndex(i: number): number` (`(i+1) % 3`); on load it wires `#press`. Press: add `.is-down`, after 100 ms remove it and advance. Advancing is computed from current state at press time, not at timeout, so rapid presses never desync. Reduced motion: skip `.is-down` delay, advance immediately. Brand slide markup: red screen, label «الفيديو الجاي» (ink), «براندك<br>هون» (white, Thmanyah 700, 44 px). Preload the second reel after first idle.

- [ ] **Step 1: Write `tests/browser.test.mjs`** (puppeteer-core, `executablePath: '/usr/bin/google-chrome'`, headless):
  - `nextIndex wraps`: import `js/hero.js` in page, `nextIndex(2) === 0`.
  - `click cycles`: click `#press` 3 times waiting 200 ms each; after 1 `#phone-screen img` src ends `reel-head.webp`; after 2 text includes «براندك»; after 3 src ends `reel-arm.webp`; `.dot.is-active` index matches each time.
  - `rapid presses do not desync`: 5 clicks with no wait, wait 400 ms → screen shows slide `5 % 3 = 2` (brand) and `#press` lacks `.is-down`.
  - `keyboard advances`: focus `#press`, press Enter → slide 1; Space → slide 2.
  - `reduced motion still advances`: `page.emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}])`, click → slide 1 within 50 ms.
  - `no horizontal overflow at 320 and 390`: at widths 320, 390, 1440 `document.documentElement.scrollWidth <= innerWidth`.
  - `no console errors and no 404s`: collect `pageerror` and failed responses over a full load → empty.
- [ ] **Step 2: Run** `npm test` → browser tests FAIL.
- [ ] **Step 3: Implement `js/hero.js`** per Interfaces.
- [ ] **Step 4: Run** `npm test` → PASS (fix CSS overflow in `css/site.css` if the overflow test fails).
- [ ] **Step 5: Commit** `feat: add hero press interaction with browser tests`.

### Task 4: OG image

**Model:** haiku.

**Files:**
- Create: `tools/og.html` (1200x630, `#121111` ground, lockup top-right, H1 «فيديوهات بتنحضر للآخر.» with «للآخر.» red, using the woff2 fonts and the paper logo), `tools/render_og.sh`, `og.png`, extend `tests/assets.test.mjs`

- [ ] **Step 1: Add test `og image`**: `og.png` exists, PNG IHDR 1200x630, < 300 KB.
- [ ] **Step 2: Run** `npm test` → FAIL.
- [ ] **Step 3: Implement** `render_og.sh`: `google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot=og.png file://$PWD/tools/og.html`.
- [ ] **Step 4: Run** `bash tools/render_og.sh && npm test` → PASS; view `og.png` and confirm text is not clipped.
- [ ] **Step 5: Commit** `feat: add OG image`.

### Task 5: Visual fidelity pass (orchestrator)

**Model:** orchestrator + opus reviewer.

- [ ] Screenshot `index.html` at 390 and 1440 (puppeteer full page) next to the reference's intent; check against Global Constraints and Review Focus; run an `/impeccable audit`-style pass (a11y, responsive, motion).
- [ ] Fix findings, `npm test` → PASS, commit `fix: visual polish`.
- [ ] Add a short `README.md`: how to run tests, regenerate assets/OG, and that deploy needs owner approval.
