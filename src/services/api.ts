const API_BASE = (import.meta as unknown as { env?: { VITE_MAXY_API_URL?: string } }).env?.VITE_MAXY_API_URL || 'https://api.maxy.academy/api/v1';

export async function fetchUserProfile(token: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error('API fetchUserProfile failed:', err);
    return { success: false, message: 'Gagal mengambil profil user dari api.maxy.academy' };
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('maxy_refresh_token');
    if (!refreshToken) return null;

    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();
    if (data.success && data.data?.access_token) {
      localStorage.setItem('maxy_access_token', data.data.access_token);
      return data.data.access_token;
    }
    return null;
  } catch (err) {
    console.error('API refreshAccessToken failed:', err);
    return null;
  }
}

export async function checkoutUpgrade(tier: 'tier_1' | 'tier_2') {
  try {
    const token = localStorage.getItem('maxy_access_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/payments/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        description: `Upgrade Paket ${tier === 'tier_1' ? 'Tier 1' : 'Tier 2'} AI Navigator`,
        redirect_url: 'https://navigator.maxy.academy/app',
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('API checkoutUpgrade failed:', err);
    return { success: false, message: 'Gagal membuat checkout upgrade' };
  }
}
