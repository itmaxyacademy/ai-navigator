import cv2
import numpy as np

# Load mask
orig = cv2.imread('public/m-logo-downloaded.png', cv2.IMREAD_UNCHANGED)
mask = ((orig[:, :, 0] > 180) & (orig[:, :, 1] > 180) & (orig[:, :, 2] > 180)).astype(np.uint8) * 255

# Upsample 8x first with cubic interpolation to subpixel resolution
up = cv2.resize(mask, (84 * 8, 84 * 8), interpolation=cv2.INTER_CUBIC)
up = cv2.GaussianBlur(up, (11, 11), 0)
_, up_thresh = cv2.threshold(up, 128, 255, cv2.THRESH_BINARY)

contours, _ = cv2.findContours(up_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c_dot = min(contours, key=cv2.contourArea).reshape(-1, 2)
c_m = max(contours, key=cv2.contourArea).reshape(-1, 2)

def smooth_contour_to_bezier(pts, num_sample_pts=52, blur_sigma=1.2):
    # Arc-length parameterization
    diffs = np.diff(pts, axis=0, append=pts[:1])
    dists = np.sqrt((diffs**2).sum(axis=1))
    cum_dist = np.cumsum(dists)
    total_len = cum_dist[-1]
    cum_dist = np.insert(cum_dist[:-1], 0, 0)
    
    # Resample uniformly
    samples = np.linspace(0, total_len, num_sample_pts, endpoint=False)
    rx = np.interp(samples, cum_dist, pts[:, 0], period=total_len)
    ry = np.interp(samples, cum_dist, pts[:, 1], period=total_len)
    
    # Scale back to 84x84 space (divide by 8)
    rx = rx / 8.0
    ry = ry / 8.0
    
    # Smooth with circular 1D Gaussian
    k_size = int(blur_sigma * 6) | 1
    kernel = cv2.getGaussianKernel(k_size, blur_sigma).flatten()
    
    pad = k_size // 2
    rx_padded = np.pad(rx, pad, mode='wrap')
    ry_padded = np.pad(ry, pad, mode='wrap')
    
    rx_smooth = np.convolve(rx_padded, kernel, mode='valid')
    ry_smooth = np.convolve(ry_padded, kernel, mode='valid')
    
    P = np.stack([rx_smooth, ry_smooth], axis=1)
    N = len(P)
    
    # Convert Catmull-Rom spline to Cubic Bezier segments
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

d_m = smooth_contour_to_bezier(c_m, num_sample_pts=64, blur_sigma=1.2)
d_dot = smooth_contour_to_bezier(c_dot, num_sample_pts=24, blur_sigma=1.0)

svg_code = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84" width="512" height="512">
  <rect width="84" height="84" rx="20" fill="#FBB041"/>
  <path d="{d_m}" fill="#18181B"/>
  <path d="{d_dot}" fill="#18181B"/>
</svg>'''

with open('public/test_smooth_m.svg', 'w', encoding='utf-8') as f:
    f.write(svg_code)

print("Saved public/test_smooth_m.svg successfully!")
