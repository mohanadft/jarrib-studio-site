"""Build web assets from sources. Run: python3 -I tools/build_assets.py"""
import shutil
import subprocess
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
IMG = ROOT / "assets" / "img"
QUALITY = "78"
ICON_BG = "#121111"


def magick(*args):
    subprocess.run(["magick", *map(str, args)], check=True)


def build_fonts():
    for src, out in [("thmanyahseriftext-Bold.otf", "thmanyah-bold.woff2"),
                     ("thmanyahseriftext-Medium.otf", "thmanyah-medium.woff2")]:
        font = TTFont(FONTS / src)
        font.flavor = "woff2"
        font.save(FONTS / out)


def build_images():
    for name in ("reel-arm", "reel-head"):
        # Fill 520x924 exactly: resize to cover, centre-crop.
        magick(IMG / f"{name}.jpg", "-resize", "520x924^", "-gravity", "center",
               "-extent", "520x924", "-quality", QUALITY, IMG / f"{name}.webp")
    for name in ("proof-ig-30d", "proof-whistle"):
        magick(IMG / f"{name}.jpg", "-quality", QUALITY, IMG / f"{name}.webp")


def build_favicons():
    svg = IMG / "button.svg"
    shutil.copyfile(svg, ROOT / "favicon.svg")
    magick("-background", "none", "-density", 384, svg, "-resize", "32x32",
           "-gravity", "center", "-extent", "32x32", ROOT / "favicon-32.png")
    # Button centred on ink, with padding.
    magick("-background", ICON_BG, "-density", 384, svg, "-resize", "132x132",
           "-gravity", "center", "-extent", "180x180", ROOT / "apple-touch-icon.png")


if __name__ == "__main__":
    build_fonts()
    build_images()
    build_favicons()
