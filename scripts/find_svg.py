import urllib.request
import re

urls = [
    'https://maxy.academy/css/style.css',
    'https://maxy.academy/css/app.css',
    'https://maxy.academy/css/landing.css',
    'https://maxy.academy/'
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        content = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'([^\s"\'\(\)]+\.(?:svg|png|jpg|webp))', content, re.I)
        logo_matches = [m for m in matches if 'logo' in m.lower() or 'maxy' in m.lower() or 'brand' in m.lower()]
        print(u, 'Matches:', set(logo_matches[:10]))
    except Exception as e:
        print(u, 'error:', e)
