"""Regenerate the original geometric icon (development only; requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / "deepseek-arabic" / "icons"
root.mkdir(parents=True, exist_ok=True)
image = Image.new("RGBA", (512, 512))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((0, 0, 511, 511), radius=120, fill="#143e35")
draw.line([(128, 177), (376, 177)], fill="#8cdec0", width=24)
draw.line([(128, 177), (180, 129)], fill="#8cdec0", width=24)
draw.line([(128, 177), (180, 225)], fill="#8cdec0", width=24)
draw.line([(136, 335), (384, 335)], fill="#f0f6df", width=24)
draw.line([(384, 335), (332, 287)], fill="#f0f6df", width=24)
draw.line([(384, 335), (332, 383)], fill="#f0f6df", width=24)
for size in (16, 32, 48, 128):
    image.resize((size, size), Image.Resampling.LANCZOS).save(root / f"icon-{size}.png")
print("Generated four extension icons.")
