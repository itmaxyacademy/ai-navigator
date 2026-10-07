import os
import cv2
import numpy as np

# 1. Compute exact smooth Bezier curves for the official Maxy M and teardrop dot
orig = cv2.imread('public/m-logo-downloaded.png', cv2.IMREAD_UNCHANGED)
mask = ((orig[:, :, 0] > 180) & (orig[:, :, 1] > 180) & (orig[:, :, 2] > 180)).astype(np.uint8) * 255
up = cv2.resize(mask, (84 * 8, 84 * 8), interpolation=cv2.INTER_CUBIC)
up = cv2.GaussianBlur(up, (11, 11), 0)
_, up_thresh = cv2.threshold(up, 128, 255, cv2.THRESH_BINARY)

contours, _ = cv2.findContours(up_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c_dot = min(contours, key=cv2.contourArea).reshape(-1, 2)
c_m = max(contours, key=cv2.contourArea).reshape(-1, 2)

def smooth_contour_to_bezier(pts, num_sample_pts=52, blur_sigma=1.2):
    diffs = np.diff(pts, axis=0, append=pts[:1])
    dists = np.sqrt((diffs**2).sum(axis=1))
    cum_dist = np.cumsum(dists)
    total_len = cum_dist[-1]
    cum_dist = np.insert(cum_dist[:-1], 0, 0)
    
    samples = np.linspace(0, total_len, num_sample_pts, endpoint=False)
    rx = np.interp(samples, cum_dist, pts[:, 0], period=total_len) / 8.0
    ry = np.interp(samples, cum_dist, pts[:, 1], period=total_len) / 8.0
    
    k_size = int(blur_sigma * 6) | 1
    kernel = cv2.getGaussianKernel(k_size, blur_sigma).flatten()
    pad = k_size // 2
    rx_smooth = np.convolve(np.pad(rx, pad, mode='wrap'), kernel, mode='valid')
    ry_smooth = np.convolve(np.pad(ry, pad, mode='wrap'), kernel, mode='valid')
    
    P = np.stack([rx_smooth, ry_smooth], axis=1)
    N = len(P)
    
    d_str = f"M {P[0][0]:.2f},{P[0][1]:.2f}"
    for i in range(N):
        p0 = P[(i - 1) % N]
        p1 = P[i]
        p2 = P[(i + 1) % N]
        p3 = P[(i + 2) % N]
        c1 = p1 + (p2 - p0) / 6.0
        c2 = p2 - (p3 - p1) / 6.0
        d_str += f" C {c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} {p2[0]:.2f},{p2[1]:.2f}"
    d_str += " Z"
    return d_str

D_M = smooth_contour_to_bezier(c_m, num_sample_pts=64, blur_sigma=1.2)
D_DOT = smooth_contour_to_bezier(c_dot, num_sample_pts=24, blur_sigma=1.0)

# Helper function to generate the inline custom Maxy M. vector mark + MAXY ACADEMY text
def make_brand_lockup(color="#fbb041", brand_text="MAXY ACADEMY"):
    # Exactly centered horizontally at x=256
    return f'''
  <!-- Brand Lockup: Custom Maxy M. Vector Mark + {brand_text} -->
  <g id="brand_lockup">
    <!-- Custom Maxy M. Vector Icon (Angled strokes + teardrop dot) -->
    <g transform="translate(163, 431) scale(0.39)">
      <g transform="translate(-12, -19)">
        <path d="{D_M}" fill="{color}"/>
        <path d="{D_DOT}" fill="{color}"/>
      </g>
    </g>
    <!-- Brand Name Text -->
    <text x="195" y="446" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" fill="{color}" letter-spacing="2.5">{brand_text}</text>
  </g>'''

OUT_SVG_DIR = "maxy-ai-logos/svg"
OUT_PNG_DIR = "maxy-ai-logos/png"
PUBLIC_SVG_DIR = "public/logos/maxy-ai/svg"
PUBLIC_PNG_DIR = "public/logos/maxy-ai/png"

for d in [OUT_SVG_DIR, OUT_PNG_DIR, PUBLIC_SVG_DIR, PUBLIC_PNG_DIR]:
    os.makedirs(d, exist_ok=True)

# 2. All 10 Logos with Unobstructed Illustrations & Custom M Brand Lockup
LOGOS = {
    "maxy-box": {
        "title": "MAXY BOX",
        "desc": "Interactive AI Sandbox & Code Developer Toolbox",
        "url": "https://ai.maxy.academy/maxybox/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_box" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2e1065"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="codeAmber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbb041"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="codeCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="glow_box" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_box)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#6366f1" stroke-width="4" stroke-opacity="0.35"/>

  <!-- Code Terminal Window Frame (Unobstructed & Clean) -->
  <rect x="80" y="75" width="352" height="270" rx="36" fill="#1e1b4b" fill-opacity="0.85" stroke="#4338ca" stroke-width="3"/>
  
  <circle cx="120" cy="110" r="8" fill="#ef4444"/>
  <circle cx="146" cy="110" r="8" fill="#f59e0b"/>
  <circle cx="172" cy="110" r="8" fill="#10b981"/>
  <line x1="80" y1="135" x2="432" y2="135" stroke="#312e81" stroke-width="2"/>

  <!-- Hero Code Brackets < / > in Amber, White, and Cyan -->
  <path d="M 185 185 L 135 235 L 185 285" fill="none" stroke="url(#codeAmber)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow_box)"/>
  <line x1="230" y1="285" x2="282" y2="185" stroke="#ffffff" stroke-width="22" stroke-linecap="round" filter="url(#glow_box)"/>
  <path d="M 327 185 L 377 235 L 327 285" fill="none" stroke="url(#codeCyan)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow_box)"/>

  <path d="M 395 100 Q 395 115 410 115 Q 395 115 395 130 Q 395 115 380 115 Q 395 115 395 100 Z" fill="#fbb041"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="4">MAXY BOX</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    },

    "maxagile": {
        "title": "MAXAGILE",
        "desc": "Agile Sprint & Scrum Task Velocity Intelligence",
        "url": "https://ai.maxy.academy/maxagile/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_agile" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a00"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <filter id="shadow_card" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#7c2d12" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_agile)"/>
  <rect x="96" y="75" width="320" height="270" rx="64" fill="#ffffff" filter="url(#shadow_card)"/>

  <!-- Agile Velocity Speed Arc -->
  <path d="M 145 190 A 110 110 0 0 1 320 130" fill="none" stroke="#ea580c" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 10" stroke-opacity="0.3"/>

  <!-- Dynamic Agile Sprint Checkmark (Clean & Unobstructed) -->
  <path d="M 170 230 L 230 290 L 340 165" fill="none" stroke="#ea580c" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="362" cy="140" r="18" fill="#ea580c"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">MAXAGILE</text>
  {make_brand_lockup("#ffedd5")}
</svg>'''
    },

    "max-quizverse": {
        "title": "MAX QUIZVERSE",
        "desc": "Gamified Quiz Multiverse & Interactive Knowledge Arena",
        "url": "https://ai.maxy.academy/quiz-multiverse/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_quiz" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e0b36"/>
      <stop offset="100%" stop-color="#080312"/>
    </linearGradient>
    <linearGradient id="layerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e879f9"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <linearGradient id="layerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
    <filter id="glow_quiz" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_quiz)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#a855f7" stroke-width="4" stroke-opacity="0.3"/>

  <!-- 3 Layered Floating Isometric Diamonds -->
  <polygon points="256,260 380,295 256,330 132,295" fill="none" stroke="#7e22ce" stroke-width="16" stroke-linejoin="round" stroke-opacity="0.6"/>
  <polygon points="256,195 380,230 256,265 132,230" fill="none" stroke="url(#layerGrad2)" stroke-width="18" stroke-linejoin="round" filter="url(#glow_quiz)"/>
  <polygon points="256,130 380,165 256,200 132,165" fill="#2e1065" stroke="url(#layerGrad1)" stroke-width="20" stroke-linejoin="round" filter="url(#glow_quiz)"/>
  <circle cx="256" cy="165" r="10" fill="#fbb041" filter="url(#glow_quiz)"/>

  <path d="M 120 110 Q 120 120 130 120 Q 120 120 120 130 Q 120 120 110 120 Q 120 120 120 110 Z" fill="#e879f9"/>
  <path d="M 395 115 Q 395 125 405 125 Q 395 125 395 135 Q 395 125 385 125 Q 395 125 395 115 Z" fill="#fbb041"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="4">MAX QUIZVERSE</text>
  {make_brand_lockup("#c084fc")}
</svg>'''
    },

    "maxyber": {
        "title": "MAXYBER",
        "desc": "Cybersecurity & Intelligent AI Threat Defense",
        "url": "https://ai.maxy.academy/maxyber/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_cyber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a101f"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="glow_cyber" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_cyber)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#0891b2" stroke-width="4" stroke-opacity="0.3"/>

  <!-- Cyber Grid -->
  <line x1="80" y1="120" x2="432" y2="120" stroke="#0e7490" stroke-width="1.5" stroke-opacity="0.25"/>
  <line x1="80" y1="200" x2="432" y2="200" stroke="#0e7490" stroke-width="1.5" stroke-opacity="0.25"/>
  <line x1="80" y1="280" x2="432" y2="280" stroke="#0e7490" stroke-width="1.5" stroke-opacity="0.25"/>
  <line x1="160" y1="60" x2="160" y2="340" stroke="#0e7490" stroke-width="1.5" stroke-opacity="0.25"/>
  <line x1="256" y1="60" x2="256" y2="340" stroke="#0e7490" stroke-width="1.5" stroke-opacity="0.25"/>
  <line x1="352" y1="60" x2="352" y2="340" stroke="#0e7490" stroke-width="1.5" stroke-opacity="0.25"/>

  <!-- Cyber Shield -->
  <path d="M 256 75 L 375 115 C 375 230 330 295 256 345 C 182 295 137 230 137 115 Z" fill="#082f49" fill-opacity="0.6" stroke="url(#neonCyan)" stroke-width="18" stroke-linejoin="round" filter="url(#glow_cyber)"/>

  <!-- Cyber M Geometric Defense Crest -->
  <path d="M 195 240 L 222 170 L 256 215 L 290 170 L 317 240" fill="none" stroke="#38bdf8" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="265" r="9" fill="#fbb041"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#22d3ee" text-anchor="middle" letter-spacing="4">MAXYBER</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    },

    "maxy-canvas": {
        "title": "MAXY CANVAS",
        "desc": "AI Creative Canvas & Smart Whiteboard Workspace",
        "url": "https://ai.maxy.academy/canvas/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_canvas" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <filter id="shadow_canvas" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1e1b4b" flood-opacity="0.3"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_canvas)"/>

  <!-- Kanban Board Canvas (Unobstructed & Clean) -->
  <rect x="96" y="75" width="320" height="270" rx="48" fill="#ffffff" filter="url(#shadow_canvas)"/>
  <line x1="126" y1="115" x2="386" y2="115" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>

  <!-- Column 1 (Cyan) -->
  <rect x="126" y="140" width="60" height="170" rx="16" fill="#e0f2fe"/>
  <rect x="138" y="155" width="36" height="8" rx="4" fill="#38bdf8"/>
  <rect x="138" y="175" width="36" height="40" rx="10" fill="#bae6fd"/>

  <!-- Column 2 (Center Active Card - Vibrant Indigo/Blue with clean task bars) -->
  <rect x="198" y="135" width="116" height="180" rx="22" fill="#0284c7"/>
  <rect x="214" y="155" width="84" height="10" rx="5" fill="#bae6fd"/>
  <rect x="214" y="180" width="84" height="50" rx="12" fill="#0369a1"/>
  <rect x="226" y="195" width="60" height="8" rx="4" fill="#7dd3fc"/>
  <rect x="226" y="212" width="40" height="6" rx="3" fill="#38bdf8"/>
  <rect x="214" y="245" width="84" height="50" rx="12" fill="#38bdf8"/>

  <!-- Column 3 (Pastel Amber) -->
  <rect x="326" y="140" width="60" height="170" rx="16" fill="#fef3c7"/>
  <rect x="338" y="155" width="36" height="8" rx="4" fill="#f59e0b"/>
  <rect x="338" y="175" width="36" height="50" rx="10" fill="#fde68a"/>

  <!-- Golden Sparkle in header -->
  <path d="M 375 100 Q 375 115 390 115 Q 375 115 375 130 Q 375 115 360 115 Q 375 115 375 100 Z" fill="#fbb041"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">MAXY CANVAS</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    },

    "maxy-block": {
        "title": "MAXY BLOCK",
        "desc": "Kids Coding Sandbox & Visual Block Programming",
        "url": "https://ai.maxy.academy/maxyblock/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_block" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
    <filter id="glow_block" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_block)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.3"/>

  <!-- 3D Cube -->
  <polygon points="256,160 366,215 256,270 146,215" fill="url(#cubeTop)" stroke="#7dd3fc" stroke-width="4"/>
  <polygon points="146,215 256,270 256,350 146,295" fill="url(#cubeLeft)" stroke="#38bdf8" stroke-width="4"/>
  <polygon points="256,270 366,215 366,295 256,350" fill="url(#cubeRight)" stroke="#38bdf8" stroke-width="4"/>

  <!-- Robot Coder -->
  <rect x="200" y="75" width="112" height="85" rx="28" fill="#1e293b" stroke="#38bdf8" stroke-width="6" filter="url(#glow_block)"/>
  <ellipse cx="232" cy="117" rx="12" ry="16" fill="#38bdf8"/>
  <ellipse cx="280" cy="117" rx="12" ry="16" fill="#38bdf8"/>
  <circle cx="236" cy="113" r="4" fill="#ffffff"/>
  <circle cx="284" cy="113" r="4" fill="#ffffff"/>
  <line x1="256" y1="75" x2="256" y2="55" stroke="#fbb041" stroke-width="6" stroke-linecap="round"/>
  <circle cx="256" cy="49" r="8" fill="#fbb041"/>

  <!-- Code Blocks Notch Pattern on Front -->
  <rect x="180" y="280" width="50" height="14" rx="7" fill="#7dd3fc"/>
  <rect x="280" y="280" width="50" height="14" rx="7" fill="#fbb041"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="4">MAXY BLOCK</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    },

    "maritime-apps": {
        "title": "MARITIME APPS",
        "desc": "Maritime Navigation, Port & Ocean Vessel Intelligence",
        "url": "https://ai.maxy.academy/maritime/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_marine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042f2e"/>
      <stop offset="100%" stop-color="#021a1b"/>
    </linearGradient>
    <linearGradient id="tealGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
    <filter id="glow_marine" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_marine)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#14b8a6" stroke-width="4" stroke-opacity="0.3"/>

  <path d="M 80 300 Q 168 280 256 300 Q 344 320 432 300 L 432 340 L 80 340 Z" fill="#0f766e" fill-opacity="0.3"/>

  <!-- Sonar Reef Tree -->
  <path d="M 256 310 L 256 210" stroke="url(#tealGlow)" stroke-width="22" stroke-linecap="round"/>
  <path d="M 256 220 C 220 180 160 170 140 120" fill="none" stroke="url(#tealGlow)" stroke-width="16" stroke-linecap="round" filter="url(#glow_marine)"/>
  <path d="M 256 220 C 292 180 352 170 372 120" fill="none" stroke="url(#tealGlow)" stroke-width="16" stroke-linecap="round" filter="url(#glow_marine)"/>
  <path d="M 256 210 C 245 160 220 150 210 110" fill="none" stroke="url(#tealGlow)" stroke-width="14" stroke-linecap="round" filter="url(#glow_marine)"/>
  <path d="M 256 210 C 267 160 292 150 302 110" fill="none" stroke="url(#tealGlow)" stroke-width="14" stroke-linecap="round" filter="url(#glow_marine)"/>

  <circle cx="256" cy="95" r="14" fill="#fbb041" filter="url(#glow_marine)"/>
  <circle cx="140" cy="116" r="9" fill="#5eead4" filter="url(#glow_marine)"/>
  <circle cx="210" cy="106" r="8" fill="#5eead4" filter="url(#glow_marine)"/>
  <circle cx="302" cy="106" r="8" fill="#5eead4" filter="url(#glow_marine)"/>
  <circle cx="372" cy="116" r="9" fill="#5eead4" filter="url(#glow_marine)"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#2dd4bf" text-anchor="middle" letter-spacing="4">MARITIME APPS</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    },

    "maxy-chat": {
        "title": "MAXY CHAT",
        "desc": "Conversational AI Copilot & Smart Chat Assistant",
        "url": "https://ai.maxy.academy/chat/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_chat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="amberChat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow_chat" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_chat)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#f59e0b" stroke-width="4" stroke-opacity="0.3"/>

  <!-- Back Speech Bubble -->
  <path d="M 170 190 C 170 140 220 120 280 120 C 350 120 390 150 390 200 C 390 260 330 280 270 280 L 220 310 L 230 280 C 190 280 170 240 170 190 Z" fill="#1e1b4b" fill-opacity="0.8" stroke="#4338ca" stroke-width="6"/>

  <!-- Front Golden Speech Bubble -->
  <path d="M 115 170 C 115 110 170 95 240 95 C 310 95 365 125 365 180 C 365 235 310 265 240 265 L 180 295 L 190 265 C 145 265 115 225 115 170 Z" fill="#1e293b" stroke="url(#amberChat)" stroke-width="16" stroke-linejoin="round" filter="url(#glow_chat)"/>

  <!-- Dialogue Soundwave Bars -->
  <line x1="160" y1="180" x2="160" y2="180" stroke="#fbb041" stroke-width="14" stroke-linecap="round"/>
  <line x1="190" y1="160" x2="190" y2="200" stroke="#fbb041" stroke-width="14" stroke-linecap="round"/>
  <line x1="220" y1="140" x2="220" y2="220" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
  <line x1="250" y1="150" x2="250" y2="210" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
  <line x1="280" y1="165" x2="280" y2="195" stroke="#fbb041" stroke-width="14" stroke-linecap="round"/>
  <line x1="310" y1="175" x2="310" y2="185" stroke="#fbb041" stroke-width="14" stroke-linecap="round"/>

  <path d="M 375 100 Q 375 115 390 115 Q 375 115 375 130 Q 375 115 360 115 Q 375 115 375 100 Z" fill="#fbbf24"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="4">MAXY CHAT</text>
  {make_brand_lockup("#fde68a")}
</svg>'''
    },

    "prompt-builder": {
        "title": "PROMPT BUILDER",
        "desc": "Prompt Engineering Studio & AI Output Optimizer",
        "url": "https://ai.maxy.academy/maxprompter/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_prompt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0c24"/>
      <stop offset="100%" stop-color="#04030a"/>
    </linearGradient>
    <linearGradient id="wandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="50%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
    <filter id="glow_prompt" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_prompt)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#818cf8" stroke-width="4" stroke-opacity="0.3"/>

  <circle cx="256" cy="205" r="140" fill="#1e1b4b" fill-opacity="0.5" stroke="#312e81" stroke-width="3"/>
  <line x1="200" y1="280" x2="280" y2="280" stroke="#818cf8" stroke-width="14" stroke-linecap="round"/>

  <!-- Magic Wand -->
  <line x1="160" y1="290" x2="290" y2="160" stroke="url(#wandGrad)" stroke-width="22" stroke-linecap="round" filter="url(#glow_prompt)"/>
  <line x1="160" y1="290" x2="215" y2="235" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>

  <path d="M 330 110 Q 330 130 350 130 Q 330 130 330 150 Q 330 130 310 130 Q 330 130 330 110 Z" fill="#ffffff" filter="url(#glow_prompt)"/>
  <path d="M 250 115 Q 250 125 260 125 Q 250 125 250 135 Q 250 125 240 125 Q 250 125 250 115 Z" fill="#fbb041"/>
  <circle cx="340" cy="175" r="7" fill="#67e8f9"/>
  <circle cx="225" cy="155" r="6" fill="#f472b6"/>
  <path d="M 130 185 L 155 200 L 130 215" fill="none" stroke="#67e8f9" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#c084fc" text-anchor="middle" letter-spacing="4">PROMPT BUILDER</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    },

    "maxy-navigator": {
        "title": "AI NAVIGATOR",
        "desc": "Applied AI Multi-Tool Learning Roadmap & Interactive Simulator",
        "url": "https://ai.maxy.academy/",
        "svg": f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_nav" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffbd4a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow_nav" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bg_nav)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#6366f1" stroke-width="4" stroke-opacity="0.35"/>

  <!-- Interconnected AI Learning Roadmap Network (Belajar Berbagai Macam AI & Tools) -->
  <!-- Learning Roadmap Connecting Pathways -->
  <line x1="256" y1="205" x2="256" y2="95" stroke="#6366f1" stroke-width="5" stroke-linecap="round" stroke-dasharray="8 6"/>
  <line x1="256" y1="205" x2="140" y2="135" stroke="#f43f5e" stroke-width="5" stroke-linecap="round" stroke-opacity="0.75"/>
  <line x1="256" y1="205" x2="372" y2="135" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" stroke-opacity="0.75"/>
  <line x1="256" y1="205" x2="150" y2="285" stroke="#10b981" stroke-width="5" stroke-linecap="round" stroke-opacity="0.75"/>
  <line x1="256" y1="205" x2="362" y2="285" stroke="#a855f7" stroke-width="5" stroke-linecap="round" stroke-opacity="0.75"/>

  <!-- Orbiting Multi-Tool Learning Path Ring -->
  <ellipse cx="256" cy="205" rx="155" ry="105" fill="none" stroke="#4338ca" stroke-width="2.5" stroke-dasharray="6 8" stroke-opacity="0.4"/>

  <!-- Node 1: Vision / Creative AI (Top-Left) -->
  <g transform="translate(140, 135)">
    <circle cx="0" cy="0" r="28" fill="#1e1b4b" stroke="#f43f5e" stroke-width="4" filter="url(#glow_nav)"/>
    <circle cx="0" cy="0" r="10" fill="#f43f5e"/>
    <circle cx="3" cy="-3" r="3" fill="#ffffff"/>
  </g>

  <!-- Node 2: LLM & Prompt Engineering Hub (Top Center) -->
  <g transform="translate(256, 95)">
    <circle cx="0" cy="0" r="32" fill="#1e1b4b" stroke="#fbb041" stroke-width="5" filter="url(#glow_nav)"/>
    <path d="M 0 -14 Q 0 0 14 0 Q 0 0 0 14 Q 0 0 -14 0 Q 0 0 0 -14 Z" fill="#fbb041"/>
  </g>

  <!-- Node 3: Coding & Dev AI (Top-Right) -->
  <g transform="translate(372, 135)">
    <circle cx="0" cy="0" r="28" fill="#1e1b4b" stroke="#38bdf8" stroke-width="4" filter="url(#glow_nav)"/>
    <path d="M -8 -6 L -14 0 L -8 6" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <path d="M 8 -6 L 14 0 L 8 6" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <line x1="-3" y1="8" x2="3" y2="-8" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  </g>

  <!-- Node 4: Audio / Voice AI (Bottom-Left) -->
  <g transform="translate(150, 285)">
    <circle cx="0" cy="0" r="26" fill="#1e1b4b" stroke="#10b981" stroke-width="4" filter="url(#glow_nav)"/>
    <line x1="-8" y1="-2" x2="-8" y2="2" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
    <line x1="-3" y1="-7" x2="-3" y2="7" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
    <line x1="3" y1="-11" x2="3" y2="11" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <line x1="8" y1="-5" x2="8" y2="5" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Node 5: Autonomous AI Agents & Workflows (Bottom-Right) -->
  <g transform="translate(362, 285)">
    <circle cx="0" cy="0" r="26" fill="#1e1b4b" stroke="#a855f7" stroke-width="4" filter="url(#glow_nav)"/>
    <circle cx="0" cy="0" r="7" fill="#a855f7"/>
    <circle cx="-10" cy="-6" r="3" fill="#c084fc"/>
    <circle cx="10" cy="-6" r="3" fill="#c084fc"/>
    <circle cx="0" cy="11" r="3" fill="#c084fc"/>
  </g>

  <!-- Centerpiece: AI Learning Core / Brain Hub -->
  <g transform="translate(256, 205)">
    <circle cx="0" cy="0" r="44" fill="#0f172a" stroke="url(#coreGrad)" stroke-width="6" filter="url(#glow_nav)"/>
    <circle cx="0" cy="0" r="34" fill="#1e1b4b"/>
    <!-- Interconnected Neural Core -->
    <path d="M -16 -12 Q -22 0 -12 12 Q -4 16 0 14 Q 4 16 12 12 Q 22 0 16 -12 Q 10 -20 0 -16 Q -10 -20 -16 -12 Z" fill="none" stroke="#fbb041" stroke-width="4" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="6" fill="#ffffff" filter="url(#glow_nav)"/>
  </g>

  <!-- Title -->
  <text x="256" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">AI NAVIGATOR</text>
  {make_brand_lockup("#fbb041")}
</svg>'''
    }
}

print("Writing 10 clean SVGs with custom M brand lockup...")
for slug, data in LOGOS.items():
    svg_content = data["svg"]
    p1 = f"{OUT_SVG_DIR}/{slug}.svg"
    p2 = f"{PUBLIC_SVG_DIR}/{slug}.svg"
    with open(p1, "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open(p2, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"  [OK] {slug}.svg")

print("All SVGs written successfully!")
