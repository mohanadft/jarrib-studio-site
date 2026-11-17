# Jarrib Studio site

Static Arabic (RTL) site for Jarrib Studio (jarribstudio.com). No build step: the site is plain files at the repo root (`index.html`, `css/`, `js/`, `assets/`, favicons, `og.png`).

## Develop

    npm install
    npm test

Tests need Google Chrome at `/usr/bin/google-chrome` (path set in `tests/browser.test.mjs`).

## Rebuild assets

    python3 -I tools/build_assets.py

Needs Python with fontTools and brotli, and ImageMagick 7 (`magick`).

Rebuild the OG image with `bash tools/render_og.sh`, then open `og.png` and check it by eye. The script does not detect a bad render.

## Deploying

`npm run build` copies only the public files into `dist/` (the list is in `tools/build.mjs`). Deploy `dist/`, never the repo root.

Hosted on Cloudflare Pages, connected to this repo: production branch `main`, build command `npm run build`, output directory `dist`. Every push to `main` redeploys.

If you add a file the page uses, add it to `PUBLIC_FILES` in `tools/build.mjs`; `tests/build.test.mjs` fails if a referenced file is missing from the build.

Deploying or connecting jarribstudio.com needs the owner's approval first.
