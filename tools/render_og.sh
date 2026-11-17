#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
google-chrome --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --virtual-time-budget=3000 --window-size=1200,630 --screenshot=og.png "file://$PWD/tools/og.html"
magick og.png -colors 256 PNG8:og.png 2>/dev/null || true
