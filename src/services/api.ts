const API_BASE = (import.meta as unknown as { env?: { VITE_MAXY_API_URL?: string } }).env?.VITE_MAXY_API_URL || 'https://api.maxy.academy/api/v1';

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
      if (data.data.refresh_token) {
        localStorage.setItem('maxy_refresh_token', data.data.refresh_token);
      }
      return data.data.access_token;
    }
    return null;
  } catch (err) {
    console.error('API refreshAccessToken failed:', err);
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('maxy_access_token');
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  options.headers = headers;

  let res = await fetch(url, options);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = new Headers(options.headers || {});
      retryHeaders.set('Authorization', `Bearer ${newToken}`);
      options.headers = retryHeaders;
      res = await fetch(url, options);
    }
  }

  return res;
}

export async function fetchUserProfile(token?: string) {
  try {
    const res = await fetchWithAuth(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err) {
    console.error('API fetchUserProfile failed:', err);
    return { success: false, message: 'Gagal mengambil profil user dari api.maxy.academy' };
  }
}

export async function loadCloudProgress(token?: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchWithAuth(`${API_BASE}/progress`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await res.json();
    if (result.success && result.data) {
      let progressObj = result.data as Record<string, unknown>;
      while (progressObj && typeof progressObj === 'object' && 'data' in progressObj && progressObj.data && typeof progressObj.data === 'object') {
        progressObj = progressObj.data as Record<string, unknown>;
      }
      delete progressObj.success;
      delete progressObj.data;
      delete progressObj.message;
      delete progressObj.error;
      return progressObj;
    }
    return null;
  } catch (err) {
    console.error('API loadCloudProgress failed:', err);
    return null;
  }
}

export async function saveCloudProgress(token: string, progress: Record<string, unknown>): Promise<void> {
  try {
    const cleanProgress = { ...progress };
    delete cleanProgress.success;
    delete cleanProgress.data;
    delete cleanProgress.message;
    delete cleanProgress.error;
    delete cleanProgress.userTier;
    delete cleanProgress.tier;
    delete cleanProgress.maxAllowedModuleId;
    delete cleanProgress.packageName;
    delete cleanProgress.subscriptionExpiredAt;
    delete cleanProgress.userName;
    delete cleanProgress.userEmail;

    await fetchWithAuth(`${API_BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: cleanProgress }),
    });
  } catch (err) {
    console.error('API saveCloudProgress failed:', err);
  }
}

export async function checkoutUpgrade(tier: 'tier1' | 'tier2' | 'tier_1' | 'tier_2', amount?: number) {
  try {
    const isTier1 = tier === 'tier1' || tier === 'tier_1';
    const finalAmount = amount || (isTier1 ? 49500 : 299500);
    const description = `Upgrade Paket ${isTier1 ? 'Tier 1' : 'Tier 2'} AI Navigator`;

    const res = await fetchWithAuth(`${API_BASE}/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: finalAmount,
        description,
        redirect_url: typeof window !== 'undefined' ? `${window.location.origin}/app` : 'https://ainavigator.maxy.academy/app',
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('API checkoutUpgrade failed:', err);
    return { success: false, message: 'Gagal membuat checkout upgrade' };
  }
}

export async function fetchAiNavigatorPackages() {
  try {
    const res = await fetch(`${API_BASE}/packages/ai-navigator`);
    return await res.json();
  } catch (err) {
    console.error('API fetchAiNavigatorPackages failed:', err);
    return { success: false };
  }
}

export async function issueCertificateApi(name: string, email: string) {
  try {
    const res = await fetchWithAuth(`${API_BASE}/certificates/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    return await res.json();
  } catch (err) {
    console.error('API issueCertificateApi failed:', err);
    return { success: false, message: 'Gagal menerbitkan sertifikat' };
  }
}

