const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MAX_DAILY_LIMIT = 5;

function getDailyUsage(): number {
  if (typeof window === 'undefined') return 0;
  
  const dataStr = localStorage.getItem('maxy_ai_usage');
  if (!dataStr) return 0;
  
  try {
    const data = JSON.parse(dataStr);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (data.date !== today) {
      return 0; // reset jika sudah ganti hari
    }
    return data.count || 0;
  } catch (e) {
    return 0;
  }
}

function incrementDailyUsage() {
  if (typeof window === 'undefined') return;
  const currentCount = getDailyUsage();
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('maxy_ai_usage', JSON.stringify({
    date: today,
    count: currentCount + 1
  }));
}

export async function generateWithGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn("API Key Gemini tidak ditemukan. Pastikan .env VITE_GEMINI_API_KEY diisi dengan benar.");
    return null;
  }

  const usageCount = getDailyUsage();
  if (usageCount >= MAX_DAILY_LIMIT) {
    console.warn(`Limit harian AI tercapai (${MAX_DAILY_LIMIT}/${MAX_DAILY_LIMIT}). Fallback ke simulasi.`);
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API Error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      incrementDailyUsage(); // Tambah limit HANYA JIKA berhasil memanggil AI
      return data.candidates[0].content.parts[0].text;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to generate with Gemini:', error);
    return null;
  }
}
