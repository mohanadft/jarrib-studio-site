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

Do not deploy these dev-only files: `tests/`, `tools/`, `node_modules`, `package*.json`, `docs/`, `reference/`.

Deploying or connecting jarribstudio.com needs the owner's approval first.
