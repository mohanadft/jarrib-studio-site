# جرّب ستوديو: website handoff

Build the real marketing site for **جرّب ستوديو** (Jarrib Studio) from this file. The design was approved on a
Claude Design canvas on Nov 17 2026; `reference/design.dc.html` is that page's source and the visual reference.

## Who we are
The studio of the Arabic experiments channel **جرّب** (Instagram @jarrib1). Proof, from real Instagram screenshots
(in `assets/img/`): 31,092,324 views and 111,123 followers in the last 30 days (Oct 18 to Nov 16 2026), +58,675 net
followers; one reel (the whistle) 13,815,474 views, 209K shares, 42,358 follows.

## What we do
Videos ONLY: short Arabic motion reels that hook in the first second, explain fast, and spread.
We do NOT do websites or ad management. Never list them.

## Lines
- Hero: «فيديوهات بتنحضر للآخر.»
- Sub: «الفيديو اللي جاب 15 مليون مشاهدة، صار لبراندك.»
- Symbol and CTA: the red button, «كبسة زر وبنبلّش».

## Audience
ستارتبات وتطبيقات، براندات تعليم وصحة وتقنية، جمعيات، ووكالات بتعطي شغل لبرّا.

## Feel
Smart, curious, simple, not a "traditional agency". The work and the numbers speak.

## Identity (fixed)
- Logo: `جرّب | ستوديو`. The word جرّب is the frozen wordmark (`assets/img/logo-jarrib-paper.svg` on dark,
  `logo-jarrib-ink.svg` on light); its beh dot is the red push button. Never redraw or edit it. Then a 1 px divider
  `#3A3836` and «ستوديو» in thmanyah Medium, `#9C9893`.
- Colours: ink `#121111` (page ground), paper `#EEEBE5`, red `#F0352B` (button, key words, CTA only), shade
  `#B8231B`, muted `#9C9893`, body grey `#C9C4BD`, card `#1E1D1C`, lines `#2E2C2B` / `#3A3836`, on-red text
  `#FFE1DE`.
- Type: thmanyah serif text Bold (700) and Medium (500) for headings and numbers (`assets/fonts/`, self-host, convert
  to woff2); IBM Plex Sans Arabic 400/500/600 for body (Google Fonts or self-host).
- DARK theme, to stand apart from the channel's paper look. No gradients, no emoji, no stock photos.

## Page (RTL, `lang="ar" dir="rtl"`), top to bottom
1. **Header**: logo lockup; links الأرقام (#proof), الخدمات (#packages), لمين (#who); red pill «احكي معنا» →
   `mailto:hello@jarribstudio.com`.
2. **Hero**: small line «الستوديو التابع لقناة جرّب» with a red dot; H1; sub; buttons «كبسة زر وبنبلّش» (mailto)
   and «شوف الأرقام» (#proof). Beside it a phone frame (260x462, 8 px border `#2A2827`, radius 36) and the big red
   button (`assets/img/button.svg`). Pressing the button: it presses down (~100 ms), then the phone shows the next
   item: `reel-arm.jpg` → `reel-head.jpg` → a red screen «الفيديو الجاي / براندك هون» → loop. Three small dots
   show which. Real `<button>` with `aria-label`.
3. **Numbers strip**: «ما بنحكي عن حالنا. الأرقام بتحكي.» + «+31 مليون» (red) «مشاهدة بآخر 30 يوم على إنستغرام» +
   «+111 ألف» «متابع على @jarrib1».
4. **Proof (#proof)**: «الأرقام بتحكي. وهاي هي.» Two real screenshots side by side with captions:
   `proof-ig-30d.jpg` («آخر 30 يوم») and `proof-whistle.jpg` («ريل واحد: الصفارة»). Note: «سكرينشوتات حقيقية من
   إنستغرام جرّب، بدون تعديل.»
5. **Services (#packages)**, 4 cards, NO prices (not set yet): ١ ريل شرح (30 لـ45 ثانية) on paper card; ٢ ريل تجربة
   (المشاهد بيجرّب على حاله، للبراندات اللي بتناسبها) on red card; ٣ الشهري (4 ريلز بالشهر من النوعين); ٤ فيديو شرح
   (60 لـ90 ثانية).
6. **Who (#who)**: «مناسب إلك إذا إنت...» + pills: ستارتب أو تطبيق، براند تعليم، براند صحة، براند تقنية، جمعية،
   وكالة بتعطي شغل لبرّا.
7. **Contact (red section)**: ink button icon, «كبسة زر وبنبلّش.», «احكيلنا عن براندك وفكرتك، وبنرجعلك بفكرة فيديو.»,
   ONE big button `hello@jarribstudio.com`, then «أو تابعنا وشوف شغلنا على كل المنصات» and the platform pills.
8. **Footer**: lockup + platform links.

## Platforms
- Instagram: https://instagram.com/jarrib1
- TikTok: https://www.tiktok.com/@jarrib2026
- YouTube: https://www.youtube.com/@jarrib2026
- Facebook: https://www.facebook.com/profile.php?id=61595338556208
- Threads: https://www.threads.net/@jarrib1

## Build
- Static, fast, no framework needed (plain HTML/CSS + a few lines of JS, or Astro). Mobile first; check 390 px.
- Domain: jarribstudio.com. Add `<title>`, meta description, OG/Twitter image (1200x630, dark, lockup + H1), favicon
  from the button.
- Compress images (webp), lazy-load the screenshots, `alt` text on all images (in Arabic).
- Accessibility: text contrast 4.5:1, focus styles, real links and buttons.
- The reference uses `/_blob/...` urls from the canvas. Map them: `0bdb5f0f…` = thmanyah Bold,
  `b88ab547…` = thmanyah Medium, `b686a341…` = reel-arm.jpg, `09f39430…` = reel-head.jpg,
  `b4d22429…` = proof-ig-30d.jpg, `10a42cf7…` = proof-whistle.jpg. `{{...}}` holes and `<sc-if>`/`<sc-for>` are the
  canvas's template syntax: rewrite them as plain HTML/JS.

## Rules
- Arabic only, Palestinian/Levantine wording as written above. No em dashes anywhere.
- No prices, no web/ads services, no invented numbers or testimonials.
- Ask the owner before deploying or connecting the domain.
