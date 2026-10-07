import os
import subprocess

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE_DIR = os.path.abspath(".")
SVG_DIR = os.path.join(BASE_DIR, "maxy-ai-logos", "svg")
PNG_DIR = os.path.join(BASE_DIR, "maxy-ai-logos", "png")
PUBLIC_PNG_DIR = os.path.join(BASE_DIR, "public", "logos", "maxy-ai", "png")

os.makedirs(PNG_DIR, exist_ok=True)
os.makedirs(PUBLIC_PNG_DIR, exist_ok=True)

# Temporary HTML wrapper template to render pure 512x512 with transparent background
HTML_WRAPPER = """<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body, html {{ width: 512px; height: 512px; overflow: hidden; background: transparent; }}
  img {{ width: 512px; height: 512px; display: block; }}
</style>
</head>
<body>
  <img src="{svg_path}" />
</body>
</html>
"""

temp_html = os.path.join(BASE_DIR, "scripts", "temp_render.html")

svg_files = [f for f in os.listdir(SVG_DIR) if f.endswith(".svg")]
print(f"Rendering {len(svg_files)} SVGs to 512x512 high-resolution PNGs via Edge...")

for f in svg_files:
    slug = os.path.splitext(f)[0]
    svg_abs = os.path.join(SVG_DIR, f).replace("\\", "/")
    png_abs = os.path.join(PNG_DIR, f"{slug}.png")
    pub_png_abs = os.path.join(PUBLIC_PNG_DIR, f"{slug}.png")
    
    with open(temp_html, "w", encoding="utf-8") as tf:
        tf.write(HTML_WRAPPER.format(svg_path=svg_abs))
        
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--default-background-color=00000000",
        f"--screenshot={png_abs}",
        "--window-size=512,512",
        f"file:///{temp_html.replace(chr(92), '/')}"
    ]
    subprocess.run(cmd, capture_output=True)
    
    # Also copy to public directory
    if os.path.exists(png_abs):
        import shutil
        shutil.copy(png_abs, pub_png_abs)
        print(f"  [OK] Rendered {slug}.png ({os.path.getsize(png_abs)} bytes)")
    else:
        print(f"  [FAIL] Failed {slug}.png")

if os.path.exists(temp_html):
    os.remove(temp_html)

print("All PNGs rendered successfully!")
