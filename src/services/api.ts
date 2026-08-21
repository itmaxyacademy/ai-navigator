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

async function fetchWithAuth(url: string, options: RequestInit = {}, customToken?: string): Promise<Response> {
  const token = customToken || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('token') || localStorage.getItem('maxy_access_token')) : null);
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  options.headers = headers;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  options.signal = controller.signal;

  let res;
  try {
    res = await fetch(url, options);
  } finally {
    clearTimeout(timeoutId);
  }

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = new Headers(options.headers || {});
      retryHeaders.set('Authorization', `Bearer ${newToken}`);
      options.headers = retryHeaders;
      const retryController = new AbortController();
      const retryTimeoutId = setTimeout(() => retryController.abort(), 10000);
      options.signal = retryController.signal;
      try {
        res = await fetch(url, options);
      } finally {
        clearTimeout(retryTimeoutId);
      }
    }
  }

  return res;
}

export async function fetchUserProfile(token?: string) {
  try {
    const res = await fetchWithAuth(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, token);
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
    }, token);
    if (!res.ok) return null;
    const result = await res.json();
    if (result?.success && result?.data) {
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
  } catch (err: unknown) {
    const error = err as { name?: string };
    if (error?.name === 'AbortError') return null;
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
    delete cleanProgress.paidTiers;
    delete cleanProgress.hasTier1;
    delete cleanProgress.hasTier2;
    delete cleanProgress.packageName;
    delete cleanProgress.subscriptionExpiredAt;
    delete cleanProgress.userName;
    delete cleanProgress.userEmail;

    const res = await fetchWithAuth(`${API_BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: cleanProgress }),
    });
    if (!res.ok && res.status !== 502) {
      console.warn(`[CloudSync] Background sync status: ${res.status}`);
    }
  } catch (err: unknown) {
    const error = err as { name?: string };
    if (error?.name === 'AbortError') return; // Debounce abort
    // Non-critical background sync silent fallback
  }
}

export async function verifyVoucher(code: string, amount?: number, packageId?: number, tierKey?: string) {
  try {
    const res = await fetch(`${API_BASE}/payments/verify-voucher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount, package_id: packageId, tier_key: tierKey }),
    });
    return await res.json();
  } catch (err) {
    console.error('API verifyVoucher failed:', err);
    return { success: false, message: 'Gagal verifikasi voucher' };
  }
}

export async function checkoutUpgrade(tier: 'tier1' | 'tier2' | 'tier_1' | 'tier_2', amount?: number, voucherCode?: string) {
  try {
    const isTier1 = tier === 'tier1' || tier === 'tier_1';
    const finalAmount = amount !== undefined ? amount : (isTier1 ? 49500 : 299500);
    const description = `Upgrade Paket ${isTier1 ? 'Tier 1' : 'Tier 2'} AI Navigator`;

    const payload: Record<string, any> = {
      tier_key: isTier1 ? 'tier1' : 'tier2',
      amount: finalAmount,
      description,
      redirect_url: typeof window !== 'undefined' ? `${window.location.origin}/app` : 'https://ainavigator.maxy.academy/app',
    };

    if (voucherCode) {
      payload.voucher_code = voucherCode;
    }

    const res = await fetchWithAuth(`${API_BASE}/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    // Normalise: pastikan order_id dan payment_url selalu ada di top-level
    if (json && json.success) {
      const data = json.data || {};
      json.order_id = json.order_id || data.order_number || data.external_id || null;
      json.payment_url = json.payment_url || data.payment_url || data.invoice_url || null;
    }

    return json;
  } catch (err) {
    console.error('API checkoutUpgrade failed:', err);
    return { success: false, message: 'Gagal membuat checkout upgrade' };
  }
}

/**
 * Poll status pembayaran berdasarkan order_id (external_id / order_number).
 * Dipanggil frontend setelah kembali dari halaman Xendit dengan ?payment=success
 */
export async function verifyPaymentOrder(orderId: string): Promise<{ isPaid: boolean; status: string }> {
  try {
    const res = await fetchWithAuth(`${API_BASE}/payments/status/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    const status = json?.data?.status || json?.status || 'pending';
    const isPaid = status === 'paid' || status === 'PAID' || status === 'SETTLED' || status === 'settled';
    return { isPaid, status };
  } catch (err) {
    console.error('API verifyPaymentOrder failed:', err);
    return { isPaid: false, status: 'error' };
  }
}

export async function fetchAiNavigatorPackages() {
  try {
    const endpoints = [
      `${API_BASE}/packages/ai-navigator`,
      `${API_BASE}/ai-navigator/packages`,
      'https://cms.maxy.academy/api/m2m/ai-navigator/packages',
      'https://ainavigator.maxy.academy/api/m2m/ai-navigator/packages',
      'https://ainavigator.maxy.academy/api/packages/ai-navigator'
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            return json;
          }
        }
      } catch (_) {
        // try next endpoint
      }
    }
    return { success: false };
  } catch (err) {
    console.error('API fetchAiNavigatorPackages failed:', err);
    return { success: false };
  }
}

export async function issueCertificateApi(name: string, email: string, certType: 'standard' | 'capstone' | 'completion' = 'standard') {
  try {
    const token = localStorage.getItem('maxy_access_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s max

    const res = await fetch(`${API_BASE}/certificates/issue`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, type: certType }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await res.json();
  } catch (err) {
    console.error('API issueCertificateApi failed:', err);
    return { success: false, message: 'Gagal menerbitkan sertifikat' };
  }
}

