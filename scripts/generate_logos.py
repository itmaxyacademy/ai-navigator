import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# 1. AI Tool metadata list
AI_TOOLS = [
    {
        "id": "maxy-block",
        "name": "Maxy Block",
        "subtext": "MAXY BLOCK",
        "url": "https://ai.maxy.academy/maxyblock/",
        "description": "Kids Coding Sandbox & Visual Block Programming"
    },
    {
        "id": "maxy-box",
        "name": "Maxy Box",
        "subtext": "MAXY BOX",
        "url": "https://ai.maxy.academy/maxybox/",
        "description": "Smart AI Multi-Tool & Utility Suite"
    },
    {
        "id": "maxy-canvas",
        "name": "Maxy Canvas",
        "subtext": "MAXY CANVAS",
        "url": "https://ai.maxy.academy/canvas/",
        "description": "AI Creative Canvas & Generative Design Studio"
    },
    {
        "id": "maxyber",
        "name": "MaXyber",
        "subtext": "MAXYBER",
        "url": "https://ai.maxy.academy/maxyber/",
        "description": "Cybersecurity & Intelligent Threat Defense"
    },
    {
        "id": "maxy-chat",
        "name": "Maxy Chat",
        "subtext": "MAXY CHAT",
        "url": "https://ai.maxy.academy/chat/",
        "description": "Conversational AI & Smart Copilot Assistant"
    },
    {
        "id": "maxagile",
        "name": "MaxAgile",
        "subtext": "MAXAGILE",
        "url": "https://ai.maxy.academy/maxagile/",
        "description": "Agile Sprint & Scrum Management Intelligence"
    },
    {
        "id": "max-quizverse",
        "name": "Max Quizverse",
        "subtext": "MAX QUIZVERSE",
        "url": "https://ai.maxy.academy/quiz-multiverse/",
        "description": "Gamified Quiz & Interactive AI Arena"
    },
    {
        "id": "maritime-apps",
        "name": "Maritime Apps",
        "subtext": "MARITIME APPS",
        "url": "https://ai.maxy.academy/maritime/",
        "description": "Maritime Navigation, Port & Vessel AI"
    },
    {
        "id": "prompt-builder",
        "name": "Prompt Builder",
        "subtext": "PROMPT BUILDER",
        "url": "https://ai.maxy.academy/maxprompter/",
        "description": "Prompt Engineering Studio & Prompt Optimizer"
    },
    {
        "id": "maxy-navigator",
        "name": "Maxy Navigator",
        "subtext": "MAXY NAVIGATOR",
        "url": "https://ai.maxy.academy/",
        "description": "Applied AI Learning Roadmap & Interactive Simulator"
    }
]

# Paths
OUT_DIR = "maxy-ai-logos"
PUBLIC_DIR = "public/logos/maxy-ai"
os.makedirs(f"{OUT_DIR}/svg", exist_ok=True)
os.makedirs(f"{OUT_DIR}/png", exist_ok=True)
os.makedirs(f"{PUBLIC_DIR}/svg", exist_ok=True)
os.makedirs(f"{PUBLIC_DIR}/png", exist_ok=True)

# 2. Extract and prepare vector M paths from m-logo-downloaded.png
orig = cv2.imread("public/m-logo-downloaded.png", cv2.IMREAD_UNCHANGED)
mask = ((orig[:, :, 0] > 180) & (orig[:, :, 1] > 180) & (orig[:, :, 2] > 180)).astype(np.uint8) * 255
up = cv2.resize(mask, (84 * 8, 84 * 8), interpolation=cv2.INTER_CUBIC)
up = cv2.GaussianBlur(up, (9, 9), 0)
_, up_thresh = cv2.threshold(up, 128, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(up_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)

c_dot = min(contours, key=cv2.contourArea)
c_m = max(contours, key=cv2.contourArea)

pts_all = np.vstack([c_dot, c_m]).reshape(-1, 2)
min_x, min_y = pts_all.min(axis=0)
max_x, max_y = pts_all.max(axis=0)
w = max_x - min_x
h = max_y - min_y

# Scale to fit nicely in 512x512 with space below for text
target_w = 260
scale = target_w / w
target_h = h * scale
offset_x = (512 - target_w) / 2 - (min_x * scale)
offset_y = 86 - (min_y * scale)

def transform_pts(c, eps=1.1):
    approx = cv2.approxPolyDP(c, eps, True).reshape(-1, 2)
    transformed = approx * scale + np.array([offset_x, offset_y])
    return "M " + " L ".join(f"{pt[0]:.1f},{pt[1]:.1f}" for pt in transformed) + " Z"

dot_svg = transform_pts(c_dot)
m_svg = transform_pts(c_m)

# 3. Also prepare high-res mask for PIL PNG rendering
y_idx, x_idx = np.where(up_thresh > 0)
m_crop = up_thresh[y_idx.min():y_idx.max()+1, x_idx.min():x_idx.max()+1]
target_w_int = int(target_w)
target_h_int = int(m_crop.shape[0] * (target_w / m_crop.shape[1]))
m_resized_mask = cv2.resize(m_crop, (target_w_int, target_h_int), interpolation=cv2.INTER_AREA)

font_path = "C:/Windows/Fonts/segoeuib.ttf"
if not os.path.exists(font_path):
    font_path = "C:/Windows/Fonts/arialbd.ttf"

print("Generating 10 Maxy AI logos (SVG and PNG)...")

for item in AI_TOOLS:
    slug = item["id"]
    text = item["subtext"]
    
    # --- Generate SVG ---
    # Font size adjusted based on text length
    font_size = 32 if len(text) > 13 else 35
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Maxy Signature Warm Golden-Yellow Gradient -->
    <linearGradient id="maxyGrad_{slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFBD4A"/>
      <stop offset="100%" stop-color="#F5A321"/>
    </linearGradient>
    <filter id="shadow_{slug}" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background Yellow Rounded Squircle -->
  <rect x="20" y="20" width="472" height="472" rx="112" fill="url(#maxyGrad_{slug})" filter="url(#shadow_{slug})"/>

  <!-- Maxy Iconic M Monogram (Dark Charcoal for High-Contrast & Premium Look) -->
  <g fill="#18181B">
    <path d="{m_svg}"/>
    <path d="{dot_svg}"/>
  </g>

  <!-- Subtitle Text below M -->
  <text x="256" y="372"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        font-size="{font_size}"
        font-weight="900"
        fill="#18181B"
        text-anchor="middle"
        letter-spacing="1.5">{text}</text>
</svg>'''

    svg_path_1 = f"{OUT_DIR}/svg/{slug}.svg"
    svg_path_2 = f"{PUBLIC_DIR}/svg/{slug}.svg"
    with open(svg_path_1, "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(svg_path_2, "w", encoding="utf-8") as f:
        f.write(svg_content)

    # --- Generate High-Resolution 512x512 PNG ---
    img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw rounded squircle
    draw.rounded_rectangle([20, 20, 492, 492], radius=112, fill=(251, 176, 65, 255))

    # Paste M mark in dark charcoal (#18181B)
    charcoal_layer = Image.new("RGBA", (target_w_int, target_h_int), (24, 24, 27, 255))
    mask_layer = Image.fromarray(m_resized_mask)
    paste_x = (512 - target_w_int) // 2
    paste_y = int(offset_y + (min_y * scale))
    img.paste(charcoal_layer, (paste_x, paste_y), mask_layer)

    # Draw text below M
    font = ImageFont.truetype(font_path, font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((512 - text_w) // 2, 342), text, font=font, fill=(24, 24, 27, 255))

    png_path_1 = f"{OUT_DIR}/png/{slug}.png"
    png_path_2 = f"{PUBLIC_DIR}/png/{slug}.png"
    img.save(png_path_1, "PNG")
    img.save(png_path_2, "PNG")

    print(f"Generated {slug}: SVG & PNG")

print("All 10 Maxy AI logos generated successfully!")
