"""Regenerate Android adaptive launcher icons with proper safe-zone padding
so the logo looks correct in any launcher shape (circle/squircle/square/rounded-square/teardrop)."""
from PIL import Image, ImageDraw
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "assets", "icon.png")
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

src = Image.open(SRC).convert("RGBA")
print(f"Source: {src.size}, mode={src.mode}")

BG = (0x1A, 0x1A, 0x2E, 255)  # matches iconBackground / adaptiveIcon backgroundColor

FG_SIZES = {
    "mipmap-mdpi":    108,
    "mipmap-hdpi":    162,
    "mipmap-xhdpi":   216,
    "mipmap-xxhdpi":  324,
    "mipmap-xxxhdpi": 432,
}
LG_SIZES = {
    "mipmap-mdpi":    48,
    "mipmap-hdpi":    72,
    "mipmap-xhdpi":   96,
    "mipmap-xxhdpi":  144,
    "mipmap-xxxhdpi": 192,
}

# Full-bleed: logo fills the entire 108dp foreground canvas so it covers any
# launcher mask (circle, squircle, square, rounded-square, teardrop) edge-to-
# edge. User explicitly requested "cover entire shape".
FILL = 1.0

def make_foreground(size):
    canvas = Image.new("RGBA", (size, size), BG)
    inner = int(size * FILL)
    logo = src.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.paste(logo, (off, off), logo)
    return canvas

def make_legacy(size, rounded=False):
    canvas = Image.new("RGBA", (size, size), BG)
    inner = int(size * 1.0)
    logo = src.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.paste(logo, (off, off), logo)
    if rounded:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    else:
        r = max(2, size // 8)
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, size, size), radius=r, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(canvas, (0, 0), mask)
    return out

count = 0
for d, sz in FG_SIZES.items():
    out_path = os.path.join(RES, d, "ic_launcher_foreground.webp")
    make_foreground(sz).save(out_path, "WEBP", quality=95, method=6)
    count += 1
    print(f"wrote {out_path} ({sz}x{sz})")

for d, sz in LG_SIZES.items():
    out_sq = os.path.join(RES, d, "ic_launcher.webp")
    out_rd = os.path.join(RES, d, "ic_launcher_round.webp")
    make_legacy(sz, rounded=False).save(out_sq, "WEBP", quality=95, method=6)
    make_legacy(sz, rounded=True).save(out_rd, "WEBP", quality=95, method=6)
    count += 2
    print(f"wrote {out_sq} & {out_rd} ({sz}x{sz})")

print(f"\nTotal files written: {count}")
