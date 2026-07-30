import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "offline-interactive" });
});

// AI Image Generation Endpoint
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, style, aspectRatio, excludedWords } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }

    const stylePrefix = style && style !== 'auto' ? `, ${style} style` : '';
    const negativePrompt = excludedWords ? `, avoiding ${excludedWords}` : '';
    const fullPrompt = `${prompt.trim()}${stylePrefix}${negativePrompt}`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback generator using Pollinations AI if GEMINI_API_KEY is not configured
      const encoded = encodeURIComponent(fullPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
      return res.json({
        imageUrl: fallbackUrl,
        prompt: fullPrompt,
        provider: "pollinations-fallback",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      let ar = "1:1";
      if (["16:9", "9:16", "4:3", "3:4"].includes(aspectRatio)) {
        ar = aspectRatio;
      }

      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: ar as any,
          outputMimeType: "image/jpeg",
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Image = response.generatedImages[0].image?.imageBytes;
        if (base64Image) {
          return res.json({
            imageUrl: `data:image/jpeg;base64,${base64Image}`,
            prompt: fullPrompt,
            provider: "imagen-3.0",
          });
        }
      }

      throw new Error("Tidak ada data gambar yang diterima dari API.");
    } catch (apiErr: any) {
      console.error("Gemini Imagen API Error:", apiErr);
      const errMsg = apiErr?.message || String(apiErr);

      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        return res.status(429).json({
          error: "Batas kuota API tercapai (Rate limit/Quota exceeded). Silakan coba lagi nanti atau tunggu beberapa saat.",
        });
      }

      // Fallback if API returns error
      const encoded = encodeURIComponent(fullPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
      return res.json({
        imageUrl: fallbackUrl,
        prompt: fullPrompt,
        provider: "pollinations-fallback",
        warning: "Menggunakan mesin cadangan karena Imagen API mengalami kendala.",
      });
    }
  } catch (err: any) {
    console.error("Server generate-image error:", err);
    res.status(500).json({ error: err.message || "Terjadi kesalahan internal pada server saat membuat gambar." });
  }
});

// Helper to convert base64 PCM buffer to base64 Data URL WAV
function pcmToWavDataUrl(base64Pcm: string, sampleRate = 24000, numChannels = 1): string {
  const pcmBuffer = Buffer.from(base64Pcm, "base64");
  const wavHeader = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const fileSize = 36 + dataSize;
  const byteRate = sampleRate * numChannels * 2;

  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(fileSize, 4);
  wavHeader.write("WAVE", 8);
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20); // PCM
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(numChannels * 2, 32);
  wavHeader.writeUInt16LE(16, 34);
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(dataSize, 40);

  const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
  return `data:audio/wav;base64,${wavBuffer.toString("base64")}`;
}

// Generate a rich speech-synthesized WAV buffer as fallback
function generateSynthesizedSpeechWav(text: string, voiceName: string = 'Aria'): { audioUrl: string; duration: number } {
  const sampleRate = 22050;
  const durationInSeconds = Math.max(3, Math.min(30, Math.ceil(text.length * 0.08)));
  const totalSamples = Math.floor(sampleRate * durationInSeconds);
  const pcmBuffer = Buffer.alloc(totalSamples * 2);

  let baseFreq = 220;
  if (voiceName.toLowerCase().includes('adam') || voiceName.toLowerCase().includes('marcus')) {
    baseFreq = 130;
  } else if (voiceName.toLowerCase().includes('serena')) {
    baseFreq = 240;
  }

  for (let i = 0; i < totalSamples; i++) {
    const time = i / sampleRate;
    const syllableEnv = Math.abs(Math.sin(time * Math.PI * 4.5)) * Math.max(0, Math.sin(time * Math.PI * 0.8));
    
    const f1 = Math.sin(2 * Math.PI * baseFreq * time);
    const f2 = 0.5 * Math.sin(2 * Math.PI * (baseFreq * 1.5) * time);
    const f3 = 0.25 * Math.sin(2 * Math.PI * (baseFreq * 2.1) * time);
    const vibrato = 1 + 0.03 * Math.sin(2 * Math.PI * 5 * time);

    const sampleValue = Math.floor((f1 + f2 + f3) * vibrato * syllableEnv * 8000);
    const clamped = Math.max(-32768, Math.min(32767, sampleValue));
    pcmBuffer.writeInt16LE(clamped, i * 2);
  }

  const audioUrl = pcmToWavDataUrl(pcmBuffer.toString("base64"), sampleRate, 1);
  return { audioUrl, duration: durationInSeconds };
}

// AI Text-to-Speech Generation Endpoint
app.post("/api/generate-speech", async (req, res) => {
  try {
    const { text, voice, model } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Teks skrip tidak boleh kosong." });
    }

    if (text.length > 2500) {
      return res.status(400).json({ error: "Teks skrip melebihi kuota maksimum 2.500 karakter!" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = generateSynthesizedSpeechWav(text, voice);
      return res.json({
        audioUrl: fallback.audioUrl,
        duration: fallback.duration,
        provider: "synthesizer-fallback",
        voice: voice || "Aria - Maxy Educator",
        model: model || "Eleven Multilingual v2",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const voiceMap: Record<string, string> = {
      "Aria - Maxy Educator": "Aoede",
      "Adam - Tech Narrator": "Puck",
      "Serena - Warm Guide": "Kore",
      "Marcus - Executive Pitch": "Fenrir",
    };

    const targetVoice = voiceMap[voice] || "Puck";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Silakan bacakan teks berikut secara jernih, alami, dan ekspresif dengan artikulasi tepat: "${text.trim()}"`,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: targetVoice,
              },
            },
          },
        },
      });

      const candidate = response.candidates?.[0];
      const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/"));

      if (audioPart && audioPart.inlineData) {
        const { mimeType, data } = audioPart.inlineData;
        let finalAudioUrl = "";
        
        if (mimeType.includes("pcm")) {
          finalAudioUrl = pcmToWavDataUrl(data, 24000, 1);
        } else {
          finalAudioUrl = `data:${mimeType};base64,${data}`;
        }

        const estDuration = Math.max(3, Math.ceil(text.length * 0.08));

        return res.json({
          audioUrl: finalAudioUrl,
          duration: estDuration,
          provider: "gemini-2.5-flash-tts",
          voice: voice || "Aria - Maxy Educator",
          model: model || "Eleven Multilingual v2",
        });
      }

      const fallback = generateSynthesizedSpeechWav(text, voice);
      return res.json({
        audioUrl: fallback.audioUrl,
        duration: fallback.duration,
        provider: "gemini-text-fallback",
        voice: voice || "Aria - Maxy Educator",
        model: model || "Eleven Multilingual v2",
      });
    } catch (apiErr: any) {
      console.error("Gemini TTS Error:", apiErr);
      const fallback = generateSynthesizedSpeechWav(text, voice);
      return res.json({
        audioUrl: fallback.audioUrl,
        duration: fallback.duration,
        provider: "synthesizer-fallback",
        voice: voice || "Aria - Maxy Educator",
        model: model || "Eleven Multilingual v2",
        warning: "Menggunakan pemrosesan audio lokal karena respons API terhambat.",
      });
    }
  } catch (err: any) {
    console.error("Server generate-speech error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses pembuatan speech audio." });
  }
});

// AI Suno Song Generation Endpoint (Lyrics & Metadata)
app.post("/api/generate-song", async (req, res) => {
  try {
    const { prompt, mode, isInstrumental, customLyrics, customStyle, customTitle } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Helper to generate 2 versions fallback
    const createFallbackVersions = () => {
      const baseTitle = customTitle?.trim() || prompt?.trim().slice(0, 30) || "Lagu Maxy AI";
      const styleTag = customStyle?.trim() || "Upbeat Indie Pop, 128 BPM, Synthwave";

      const lyrics1 = isInstrumental
        ? "(Instrumental Track - Tanpa Vokal)"
        : customLyrics?.trim() ||
          `[Intro - Upbeat Synth]\n\n[Verse 1]\n${prompt || "Langkah awal belajar AI di Maxy Academy"}\nPersiapan matang menuju karir cemerlang\nCoding dan AI menyatu dalam harmoni!\n\n[Chorus]\nKita wujudkan karya musik AI generasi baru!\nSemangat tanpa batas bersama Maxy Academy!\n\n[Outro - Fade Out]`;

      const lyrics2 = isInstrumental
        ? "(Instrumental Track - Tanpa Vokal)"
        : customLyrics?.trim()
        ? `${customLyrics}\n\n[Alternative Acoustic Outro]`
        : `[Verse 1]\nSuasana malam penuh inspirasi\n${prompt || "Merancang lagu dengan AI Studio"}\nMembawa ide menjadi nada berharga\n\n[Chorus]\nSing along! Nada gembira ciptaan AI\nSuno AI v4.5 melodi Maxy Academy!\n\n[Outro]`;

      return [
        {
          title: `${baseTitle} (v1)`,
          style: styleTag,
          duration: "2:45",
          isInstrumental: Boolean(isInstrumental),
          lyrics: lyrics1,
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 55) + 40),
        },
        {
          title: `${baseTitle} (v2 Chill Remix)`,
          style: `${styleTag}, Chill Lofi Remix, 95 BPM`,
          duration: "3:12",
          isInstrumental: Boolean(isInstrumental),
          lyrics: lyrics2,
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 30),
        },
      ];
    };

    if (!apiKey) {
      return res.json({ versions: createFallbackVersions() });
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const systemInstruction = `Kamu adalah Suno AI v4.5 Songwriter & Producer. Hasilkan JSON array berisi tepat 2 objek versi lagu.
Setiap objek harus memiliki properti:
- "title": string (judul lagu yang kreatif)
- "style": string (genre, tempo bpm, instrumen)
- "duration": string (misal "2:38")
- "lyrics": string (lirik lagu lengkap dengan tag [Verse], [Chorus], [Outro])

Respons HARUS valid JSON array saja tanpa format markdown extra.`;

      const userPromptText = mode === "custom"
        ? `Buat 2 variasi lagu berdasarkan: Judul: "${customTitle}", Gaya: "${customStyle}", Lirik: "${customLyrics}", Instrumental: ${isInstrumental}`
        : `Buat 2 variasi lagu berdasarkan prompt: "${prompt}", Instrumental: ${isInstrumental}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}\n\n${userPromptText}`,
      });

      const responseText = response.text || "";
      const cleanedJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

      let parsed = JSON.parse(cleanedJson);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        const versions = parsed.slice(0, 2).map((item: any, idx: number) => ({
          title: item.title || `${customTitle || "Lagu Maxy AI"} v${idx + 1}`,
          style: item.style || customStyle || "Indie Pop, 128 BPM",
          duration: item.duration || (idx === 0 ? "2:40" : "3:05"),
          isInstrumental: Boolean(isInstrumental),
          lyrics: isInstrumental ? "(Instrumental Track - Tanpa Vokal)" : (item.lyrics || customLyrics || "[Verse]\nLagu AI Maxy"),
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 60) + 35),
        }));

        return res.json({ versions });
      }

      return res.json({ versions: createFallbackVersions() });
    } catch (apiErr) {
      console.error("Gemini Song Generation error:", apiErr);
      return res.json({ versions: createFallbackVersions() });
    }
  } catch (err: any) {
    console.error("Server generate-song error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses generasi lagu." });
  }
});

// Fathom AI Assistant Cross-Meeting Endpoint
app.post("/api/fathom-ask", async (req, res) => {
  try {
    const { question, meetingsContext, scope } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Pertanyaan tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const meetingsListText = Array.isArray(meetingsContext)
      ? meetingsContext.map((m: any) => `- Judul: "${m.title}", Tanggal: ${m.date || m.fullDate}, Durasi: ${m.durationMins} menit, Peserta: ${(m.participants || []).map((p: any) => p.name).join(', ')}, Tujuan: "${m.summary?.objective || ''}"`).join('\n')
      : 'Review Kurikulum & Demo AI Maxy Academy, Evaluasi Dashboard Penjualan Pak Budi, Workshop Gemini 3 Engine, Perencanaan Strategis Kuartal 3';

    const systemPrompt = `Kamu adalah "Fathom AI Assistant" (Cross-Meeting Assistant). 
Kamu bertugas menjawab pertanyaan pengguna seolah-olah kamu memiliki akses penuh ke seluruh transkrip dan rekaman rapat.
Lingkup pencarian rapat saat ini: ${scope || 'My Calls'}.

Berikut adalah daftar rapat yang tersedia dalam sistem:
${meetingsListText}

Instruksi Jawaban:
1. Jawablah pertanyaan dengan profesional, terstruktur, ringkas, dan sangat informatif.
2. Aculah judul rapat, tanggal, dan peserta spesifik yang relevan dari daftar di atas.
3. Sediakan poin-poin bertanda centang atau nomor jika memberikan daftar tugas/ringkasan.
4. Di akhir jawaban, sertakan pesan kecil dalam tanda kurung: "(Simulasi analisis bertenaga Fathom Gemini AI Engine)".`;

    if (!apiKey) {
      // Fallback AI response
      let fallbackAnswer = '';
      const q = question.toLowerCase();
      if (q.includes('summarize') || q.includes('ringkas') || q.includes('minggu ini')) {
        fallbackAnswer = `**Ringkasan Rapat Minggu Ini (Fathom AI):**\n\n` +
          `• **Review Kurikulum & Demo AI Maxy Academy (Jun 19):** Nabila & Wahyudi menyetujui fokus pengembangan kurikulum AI yang ringan tanpa over-engineering, serta menambahkan simulator interaktif.\n` +
          `• **Evaluasi Dashboard Penjualan Pak Budi (Jun 9):** Menetapkan target akuisisi peserta baru naik 20% untuk bootcamp AI Engineer.\n` +
          `• **Workshop Gemini 3 Engine (Jun 9):** Pelatihan integrasi API server-side aman untuk menyembunyikan API key.\n` +
          `• **Perencanaan Strategis Q3 (Jun 3):** Penetapan milestone sertifikasi kompetensi otomatis.\n\n` +
          `*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      } else if (q.includes('urgent') || q.includes('mendesak') || q.includes('penting')) {
        fallbackAnswer = `**Hal-Hal Mendesak yang Disebutkan Baru-Baru Ini:**\n\n` +
          `1. ⚠️ **Distribusi Survey:** Nabila perlu membuat & mendistribusikan Google Form survey dampak pelatihan segera setelah sesi.\n` +
          `2. ⚠️ **Update Dashboard:** Perbarui tampilan dasbor penjualan untuk Pak Budi mengenai daftar panggilan harian dan prospek berisiko.\n` +
          `3. ⚠️ **Notetaker Log:** Peringatan audio pada rapat silent session "Sync Tim Pengembang FlowBuddy".\n\n` +
          `*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      } else if (q.includes('promised') || q.includes('janji') || q.includes('tugas')) {
        fallbackAnswer = `**Komitmen & Janji Tugas Minggu Ini:**\n\n` +
          `• **Nabila Maxy:** Kirimkan draf brosur program AI ke Pak Budi & update dasbor penjualan.\n` +
          `• **Wahyudi Maxy:** Lakukan alignment program pelatihan dengan tim eksekutif (CEO Circle).\n` +
          `• **Trainer Maxy:** Update file \`.env.example\` di repository utama.\n\n` +
          `*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      } else {
        fallbackAnswer = `**Hasil Analisis Fathom AI untuk "${question}":**\n\n` +
          `Berdasarkan data rapat (${scope || 'My Calls'}), seluruh aktivitas tim Maxy Academy terpantau berjalan sesuai roadmap. Rapat utama melibatkan Nabila Maxy, Wahyudi Maxy, dan Pak Budi.\n\n` +
          `*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      }

      return res.json({ answer: fallbackAnswer });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nPertanyaan Pengguna: "${question}"`,
    });

    const responseText = response.text || "Tidak ada jawaban dari Fathom AI.";
    return res.json({ answer: responseText });

  } catch (err: any) {
    console.error("Server fathom-ask error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses pertanyaan Fathom AI." });
  }
});

// Fathom AI Meeting Detail Summarizer Endpoint
app.post("/api/fathom-summarize", async (req, res) => {
  try {
    const { title, durationMins, participants, transcript } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Judul rapat tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        objective: `Meninjau dan mengeksekusi agenda rapat "${title}" secara efektif bersama tim.`,
        keyPoints: [
          { topic: 'Ringkasan Utama', details: `Peserta rapat mendiskusikan langkah strategis terkait ${title}.` },
          { topic: 'Poin Alignment', details: 'Seluruh peserta menyepakati pembagian tugas dan penanggung jawab action items.' }
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Kamu adalah Fathom AI Notetaker. Hasilkan JSON object ringkasan rapat untuk judul: "${title}" (Durasi: ${durationMins || 30} menit, Peserta: ${(participants || []).map((p: any) => p.name || p).join(', ')}).
Format JSON yang dibutuhkan:
{
  "objective": "Tujuan utama rapat...",
  "keyPoints": [
    { "topic": "Topik 1", "details": "Penjelasan detail..." },
    { "topic": "Topik 2", "details": "Penjelasan detail..." }
  ]
}
Hanya kembalikan JSON valid tanpa markdown ekstra.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleaned = (response.text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.json({
      objective: parsed.objective || `Tujuan rapat "${title}"`,
      keyPoints: parsed.keyPoints || []
    });

  } catch (err: any) {
    console.error("Server fathom-summarize error:", err);
    res.json({
      objective: `Meninjau dan mengeksekusi agenda rapat secara efektif bersama tim.`,
      keyPoints: [
        { topic: 'Poin Diskusi', details: 'Diskusi berjalan lancar dan seluruh kesepakatan tercatat.' }
      ]
    });
  }
});

// Mistral Vibe Studio Agent Endpoint
app.post("/api/mistral-vibe-chat", async (req, res) => {
  try {
    const { prompt, mode, project, isConnected, speedMode, history } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const currentMode = mode || "Work";
    const projectCtx = project ? `Konteks Proyek Aktif: "${project}"` : "Konteks Proyek: Umum / Tidak Spesifik";
    const appCtx = isConnected ? "Aplikasi Terhubung: Google Workspace, GitHub, Slack (Akses Penuh Basis Data)" : "Aplikasi Terhubung: Tidak ada (Belum Terhubung)";

    let modeInstruction = "";
    if (currentMode === "Work") {
      modeInstruction = "MODE WORK (Long-Horizon Tasks): Fokus pada penyusunan alur kerja mandiri, otomatisasi tugas, analisis proyek, dan rekomendasi akselerasi. Sertakan poin tindak lanjut dan integrasi alat.";
    } else if (currentMode === "Code") {
      modeInstruction = "MODE CODE (Software Engineering & Architecture): Fokus pada pembuatan, refactoring, dan verifikasi kode (TypeScript/React/Python). Sertakan snippet kode clean dengan penjelasan arsitektur.";
    } else {
      modeInstruction = "MODE CHAT (Quick Reasoning & Discussion): Fokus pada diskusi cepat, penalaran konseptual, dan ide-ide strategis secara responsif.";
    }

    const systemPrompt = `Kamu adalah Mistral Vibe — AI Agent mandiri tingkat lanjut untuk tugas-tugas jangka panjang (long-horizon tasks).
${modeInstruction}
${projectCtx}
${appCtx}

PENTING UNTUK ATURAN FORMAT RAW BALASAN:
Jawablah dengan Bahasa Indonesia yang profesional dan lugas.

Susun balasan dengan struktur berikut:
⚡ Execution Steps:
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

📌 Hasil Eksekusi Mandiri:
- [Poin Utama 1]
- [Poin Utama 2 / Detail Output]
- [Langkah Tindak Lanjut / Rekomendasi]`;

    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is missing
      const steps = [
        `Memindai basis pengetahuan terhubung (${projectCtx})`,
        `Menganalisis kebutuhan tugas jangka panjang (${currentMode} Mode)`,
        `Menyusun draf eksekusi mandiri untuk Vibe Agent`
      ];
      const fallbackContent = `[Mistral Vibe Agent - Mode ${currentMode}]\n\nTelah memproses permintaan: "${prompt}"\n\n📌 Hasil Eksekusi Mandiri:\n1. Analisis Proyek: Berhasil memproses konteks input "${project || 'General'}".\n2. Optimasi Mode ${currentMode}: Dihasilkan berdasarkan alur kerja mandiri Vibe Agent.\n3. Tindak Lanjut: Langkah terotomasi siap dieksekusi secara berulang.`;
      const fallbackSuggested = `Lanjutkan analisis terinci untuk ${project || 'proyek ini'}`;
      return res.json({ steps, content: fallbackContent, suggestedTask: fallbackSuggested });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = speedMode === 'Reasoning' || speedMode === 'Pro Agent' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    let historyText = "";
    if (Array.isArray(history) && history.length > 0) {
      historyText = "\n\nRIWAYAT DISKUSI SEBELUMNYA:\n" + history.slice(-4).map((h: any) => `${h.role === 'user' ? 'Pengguna' : 'Mistral Vibe'}: ${h.content}`).join('\n');
    }

    const fullPrompt = `${systemPrompt}${historyText}\n\nPengguna: "${prompt}"\n\nMistral Vibe:`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
    });

    const rawText = response.text || "";

    // Extract steps if present, otherwise generate default steps
    let steps: string[] = [];
    let content = rawText;

    if (rawText.includes("⚡ Execution Steps:")) {
      const parts = rawText.split("📌 Hasil Eksekusi Mandiri:");
      const stepsPart = parts[0].replace("⚡ Execution Steps:", "").trim();
      steps = stepsPart.split("\n").map(s => s.replace(/^\d+\.\s*/, "").trim()).filter(s => s.length > 0);
      content = "📌 Hasil Eksekusi Mandiri:\n" + (parts[1] || parts[0]).trim();
    } else {
      steps = [
        `Memindai konteks ${project || 'workspace'} (${currentMode} Mode)`,
        `Mengeksekusi alur kerja penalaran long-horizon`,
        `Memvalidasi kelengkapan hasil eksekusi`
      ];
    }

    const suggestedTask = `Analisis lebih dalam konteks ${project || 'sistem'} via Vibe`;

    return res.json({ steps, content, suggestedTask });

  } catch (err: any) {
    console.error("Server mistral-vibe-chat error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan Mistral Vibe Agent." });
  }
});

// Gemini Gems Studio Chat Endpoint
app.post("/api/gemini-gems-chat", async (req, res) => {
  try {
    const { prompt, gemName, gemDescription, systemInstruction, history, mode } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const name = gemName || "Gemini Gem";
    const desc = gemDescription || "";
    const sysInstruction = systemInstruction || "Kamu adalah asisten AI yang membantu tugas pengguna dengan profesional.";

    const fullSystemPrompt = `SISTEM ROLE & INSTRUKSI GEM KUSTOM:
Nama Gem: "${name}"
Deskripsi Gem: "${desc}"
Petunjuk Khusus (System Instruction):
${sysInstruction}

PENTING:
- Bertindaklah Sepenuhnya sebagai "${name}" sesuai petunjuk kustom di atas.
- Jawaban harus konsisten dengan peran, gaya bahasa, dan batasan yang telah ditetapkan.
- Gunakan Bahasa Indonesia yang ramah, profesional, dan terstruktur.`;

    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not set
      const fallbackText = `[${name}] Halo! Menerima prompt: "${prompt}"\n\nBerdasarkan Petunjuk System Instruction Gem (${name}):\n\n1. Analisis Otomatis: Memproses data dan konteks input Anda.\n2. Evaluasi Peran (${name}): Memastikan seluruh tanggapan sesuai instruksi spesifik.\n3. Rekomendasi / Tindak Lanjut: Berikan detail tambahan jika ada poin yang ingin diperdalam.\n\n*(Simulasi respons Gem kustom)*`;
      return res.json({ text: fallbackText });
    }

    const ai = new GoogleGenAI({ apiKey });
    const selectedModel = mode === 'Pro Mendalam' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    // Format chat history context
    let formattedHistory = "";
    if (Array.isArray(history) && history.length > 0) {
      formattedHistory = "\n\nRIWAYAT PERCAKAPAN SEBELUMNYA:\n" + history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Pengguna' : name}: ${h.text}`).join('\n');
    }

    const fullPrompt = `${fullSystemPrompt}${formattedHistory}\n\nPengguna: "${prompt}"\n\n${name}:`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: fullPrompt,
    });

    const responseText = response.text || `[${name}] Tidak dapat menghasilkan tanggapan.`;
    return res.json({ text: responseText, gemName: name });

  } catch (err: any) {
    console.error("Server gemini-gems-chat error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses percakapan Gem AI." });
  }
});

// Claude Features Studio Simulator Endpoint
app.post("/api/claude-features-studio", async (req, res) => {
  try {
    const { stage, prompt, context } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (stage === 'nav') {
      // Stage 1: General Chat / Navigation
      const systemPrompt = `Kamu adalah Claude 3.7 Sonnet — asisten AI canggih dari Anthropic.
Berikan balasan yang terstruktur, alami, langsung pada intinya, dan sangat berguna.
Jawab dengan Bahasa Indonesia.`;

      if (!apiKey) {
        return res.json({
          text: `[Claude 3.7 Sonnet]\n\nTerima kasih! Saya telah memproses pesan Anda: "${prompt}".\n\n- **Analisis**: Permintaan telah diproses secara efektif.\n- **Konteks**: Modul navigasi Claude siap membantu pekerjaan Anda selanjutnya.`,
          titleSummary: prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const fullPrompt = `${systemPrompt}\n\nPengguna: "${prompt}"\n\nClaude:`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      const text = response.text || "Terima kasih, pesan Anda telah diproses.";
      
      // Auto-summary for chat history title
      const summaryPrompt = `Buatkan judul ringkas (2-4 kata) dalam Bahasa Indonesia untuk topik percakapan berikut: "${prompt}". Hanya kembalikan judulnya saja tanpa tanda petik.`;
      const summaryRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: summaryPrompt,
      });
      const titleSummary = (summaryRes.text || prompt).trim().replace(/^["']|["']$/g, '');

      return res.json({ text, titleSummary });
    }

    else if (stage === 'artifacts') {
      // Stage 2: Artifacts
      const systemPrompt = `Kamu adalah Claude Artifacts Generator.
Tugasmu adalah menghasilkan artefak kustom berdasarkan deskripsi pengguna.
Pengguna meminta: "${prompt}"

Sediakan keluaran terstruktur dengan format:
---SUMMARY---
[Ringkasan penjelasan artefak dalam Bahasa Indonesia]
---TITLE---
[Nama file/judul artefak, misal: maxy_app_component.tsx]
---CODE---
[Kode React/HTML/TypeScript atau dokumen terstruktur yang fungsional dan bersih]`;

      if (!apiKey) {
        const fallbackTitle = "interactive_react_artifact.tsx";
        const fallbackSummary = `Artefak baru telah dihasilkan berdasarkan deskripsi: "${prompt}". Artefak ini dapat dipratinjau dan dikustomisasi secara langsung.`;
        const fallbackCode = `// Generated Code Artifact\nexport function CustomArtifact() {\n  return (\n    <div className="p-6 bg-[#18181b] text-amber-400 rounded-2xl border border-amber-500/30">\n      <h3 className="font-bold text-lg">✨ Artefak: ${prompt}</h3>\n      <p className="text-slate-300 text-xs mt-2">Dibuat otomatis oleh Claude Artifacts Engine untuk Maxy Academy.</p>\n    </div>\n  );\n}`;
        return res.json({ title: fallbackTitle, summary: fallbackSummary, code: fallbackCode });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      const raw = response.text || "";
      let title = "custom_artifact.tsx";
      let summary = `Berhasil menghasilkan artefak untuk: "${prompt}"`;
      let code = `// ${prompt}\nconsole.log("Artifact created");`;

      if (raw.includes("---SUMMARY---")) {
        const parts = raw.split(/---TITLE---|---CODE---/);
        summary = parts[0].replace("---SUMMARY---", "").trim();
        if (parts[1]) title = parts[1].trim();
        if (parts[2]) code = parts[2].trim();
      } else {
        code = raw;
      }

      return res.json({ title, summary, code });
    }

    else if (stage === 'cowork') {
      // Stage 3: Cowork Autonomous Agent
      const folderCtx = context?.folderName ? `Folder Terhubung: "${context.folderName}"` : "Folder Terhubung: Tidak ada";
      const systemPrompt = `Kamu adalah Claude Cowork Agent — Agen AI Otonom untuk alur kerja jangka panjang.
${folderCtx}

Pengguna meminta eksekusi tugas otonom: "${prompt}"

Susun keluaran dengan format:
⚡ EXECUTION STEPS:
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]
4. [Langkah 4]

📌 HASIL EKSEKUSI COWORK:
[Laporan eksekutif ringkas, temuan utama, dan rekomendasi efisiensi]`;

      if (!apiKey) {
        const steps = [
          `Membaca dokumen & konteks ${context?.folderName || 'lingkaran kerja'}`,
          `Mengekstrak poin-poin utama dan tindak lanjut`,
          `Menganalisis peluang efisiensi untuk Maxy Academy`,
          `Menyusun ringkasan eksekutif akhir`
        ];
        const content = `📌 HASIL EKSEKUSI COWORK:\n\nTugas: "${prompt}"\n\n1. Ringkasan Eksekutif: Berhasil menganalisis data dalam konteks ${context?.folderName || 'kerja'}.\n2. Poin Tindak Lanjut: 3 tugas utama telah diidentifikasi dan dijadwalkan.\n3. Rekomendasi Efisiensi: Otomatisasi alur kerja rutin dapat menghemat hingga 40% waktu tim.`;
        return res.json({ steps, content });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      const raw = response.text || "";
      let steps: string[] = [];
      let content = raw;

      if (raw.includes("⚡ EXECUTION STEPS:")) {
        const parts = raw.split("📌 HASIL EKSEKUSI COWORK:");
        const stepsPart = parts[0].replace("⚡ EXECUTION STEPS:", "").trim();
        steps = stepsPart.split("\n").map(s => s.replace(/^\d+\.\s*/, "").trim()).filter(s => s.length > 0);
        content = "📌 HASIL EKSEKUSI COWORK:\n" + (parts[1] || parts[0]).trim();
      } else {
        steps = [
          `Memindai konteks tugas (${context?.folderName || 'Work Space'})`,
          `Mengeksekusi analisis data otonom`,
          `Menyusun laporan akhir`
        ];
      }

      return res.json({ steps, content });
    }

    else if (stage === 'office') {
      // Stage 4: Excel & PowerPoint
      const officeApp = context?.officeApp || 'excel';
      const tableContext = context?.tableData ? `Data Tabel Saat Ini:\n${JSON.stringify(context.tableData, null, 2)}` : '';

      const systemPrompt = `Kamu adalah Claude Add-in Assistant untuk Microsoft ${officeApp === 'excel' ? 'Excel' : 'PowerPoint'}.
${tableContext}

Instruksi pengguna: "${prompt}"

Berikan bantuan spesifik untuk ${officeApp === 'excel' ? 'Excel (formula Excel persis, analisis nilai/data, penjelasan ringkas)' : 'PowerPoint (struktur slide presentasi terstruktur 3-5 slide)'}.
Jawab dalam Bahasa Indonesia yang profesional dan jelas.`;

      if (!apiKey) {
        let fallbackText = '';
        if (officeApp === 'excel') {
          fallbackText = `[Claude for Excel]\n\nAnalisis untuk "${prompt}":\n\n• **Formula Direkomendasikan**:\n\`=AVERAGEIF(C2:C100, "Fullstack Web", D2:D100)\`\n\n• **Ringkasan Data**: Tabel berisi data nilai siswa Maxy Academy. Rata-rata nilai keseluruhan adalah 84.6.\n• **Tindak Lanjut**: Data siap diurutkan berdasarkan status kelulusan.`;
        } else {
          fallbackText = `[Claude for PowerPoint]\n\nStruktur Slide Dihasilkan untuk "${prompt}":\n\nSlide 1: Judul Utama & Sub-judul\nSlide 2: Latar Belakang & Tantangan Utama\nSlide 3: Solusi & Keunggulan Program Maxy Academy\nSlide 4: Metrik Keberhasilan & Timeline`;
        }
        return res.json({ text: fallbackText });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      return res.json({ text: response.text || "Bantuan Office berhasil diproses." });
    }

    return res.status(400).json({ error: "Stage tidak valid." });

  } catch (err: any) {
    console.error("Server claude-features-studio error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan Claude Features Studio." });
  }
});

// Kimi AI Studio Simulator Endpoint
app.post("/api/kimi-ai-studio", async (req, res) => {
  try {
    const { stage, prompt, mode, project, feature, workTab, workMode, command, code, type } = req.body;
    const reqPrompt = prompt || command || code || "";
    if (!reqPrompt || typeof reqPrompt !== "string" || !reqPrompt.trim()) {
      return res.status(400).json({ error: "Prompt/Command tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (stage === 'chat') {
      // Stage 1: Chat Utama
      const modeText = mode === 'Tinggi' ? 'Penalaran Mendalam (Thinking Level High)' : 'Instan (Quick Response)';
      const projectCtx = project && project !== 'Pilih proyek' ? `[Proyek: ${project}] ` : '';
      const featureCtx = feature ? `[Mode Fitur: ${feature}] ` : '';
      
      const systemPrompt = `Kamu adalah Kimi K2.5 — Asisten AI Canggih dari Moonshot AI.
${projectCtx}${featureCtx}[Level Penalaran: ${modeText}]
Jawab pertanyaan pengguna dengan jelas, cepat, akurat, dan dalam Bahasa Indonesia.`;

      if (!apiKey) {
        return res.json({
          text: `[Kimi K2.5 ${mode || 'Instan'}]\n\nTerima kasih atas pertanyaannya: "${reqPrompt}".\n\n- **Proyek**: ${project || 'Umum'}\n- **Fitur Aktif**: ${feature || 'Chat Standard'}\n- **Analisis Kimi**: Pertanyaan Anda telah berhasil dianalisis dengan keakuratan tinggi.`,
          titleSummary: reqPrompt.length > 25 ? reqPrompt.substring(0, 25) + '...' : reqPrompt
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const fullPrompt = `${systemPrompt}\n\nPengguna: "${reqPrompt}"\n\nKimi:`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      const text = response.text || "Terima kasih, pesan telah diproses.";

      // Summary for new chat title
      const summaryPrompt = `Buatkan judul ringkas (2-4 kata) dalam Bahasa Indonesia untuk topik berikut: "${reqPrompt}". Hanya kembalikan judulnya tanpa tanda petik.`;
      const summaryRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: summaryPrompt,
      });
      const titleSummary = (summaryRes.text || reqPrompt).trim().replace(/^["']|["']$/g, '');

      return res.json({ text, titleSummary });
    }

    else if (stage === 'work') {
      // Stage 2: Kimi Work
      const isWorkMode = workTab === 'Work';
      const systemPrompt = isWorkMode
        ? `Kamu adalah agen otonom Kimi Work dari Moonshot AI yang menyelesaikan tugas multi-langkah.
Mode: ${workMode || 'Agent'}
Proyek: ${project || 'Definisikan'}
Tugas Pengguna: "${reqPrompt}"

Format keluaran:
---STEPS---
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]
---RESULT---
[Laporan eksekusi agen Kimi Work dalam Bahasa Indonesia]`
        : `Kamu adalah Kimi Assistant dalam mode percakapan biasa Kimi Work. Jawab dengan ringkas dalam Bahasa Indonesia.`;

      if (!apiKey) {
        const steps = [
          `Menganalisis instruksi tugas "${reqPrompt.substring(0, 30)}..."`,
          `Mengeksekusi pencarian & pemrosesan via WebBridge`,
          `Menyusun dokumen & output akhir ke workspace`
        ];
        const content = `[Kimi Work Agent Execution]\n\nTugas: "${reqPrompt}"\n\n• **Status**: Selesai 100%\n• **Hasil**: Agen Kimi Work berhasil menyelesaikan analisis multi-langkah dan menyimpan data pendukung secara teratur.`;
        return res.json({ steps, content });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      const raw = response.text || "";
      let steps: string[] = [];
      let content = raw;

      if (raw.includes("---STEPS---")) {
        const parts = raw.split("---RESULT---");
        const stepsPart = parts[0].replace("---STEPS---", "").trim();
        steps = stepsPart.split("\n").map(s => s.replace(/^\d+\.\s*/, "").trim()).filter(s => s.length > 0);
        content = (parts[1] || parts[0]).trim();
      } else {
        steps = [
          `Menganalisis instruksi tugas: "${reqPrompt}"`,
          `Mengeksekusi langkah otomatisasi`,
          `Menyelesaikan laporan tugas Kimi Work`
        ];
      }

      return res.json({ steps, content });
    }

    else if (stage === 'code') {
      // Stage 3: Kimi Code
      const isCli = type === 'cli';
      const systemPrompt = isCli
        ? `Kamu adalah Kimi Code CLI (Model K2.7 Code) — asisten CLI terminal untuk software engineering.
Perintah pengguna: "${reqPrompt}"

Berikan balasan seolah-olah output terminal CLI sungguhan (bersih, informatif, monospaced style, dengan simbol prompt 'moonshot@KimiCode 🚀'). Jawab ringkas dalam Bahasa Indonesia/Inggris teknis.`
        : `Kamu adalah Kimi Code IDE Assistant.
Kode/Instruksi pengguna: "${reqPrompt}"

Berikan penjelasan ringkas, analisis sintaks, dan saran perbaikan kode dalam Bahasa Indonesia.`;

      if (!apiKey) {
        const fallbackOutput = isCli
          ? `moonshot@KimiCode 🚀 ${reqPrompt}\nExecuting command '${reqPrompt}'...\n✓ Operation completed successfully. No syntax or type errors found.`
          : `[Kimi Code IDE]\n\nAnalisis Kode:\n• Kode berjalan dengan baik.\n• Rekomendasi: Gunakan memoization jika komponen ini sering dirender ulang.`;
        return res.json({ output: fallbackOutput });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      return res.json({ output: response.text || "Output Kimi Code diproses." });
    }

    else if (stage === 'claw') {
      // Stage 4: Kimi Claw / OpenClaw
      const systemPrompt = `Kamu adalah OpenClaw — asisten AI otonom pribadi dengan kepribadian ramah, suportif, dan memori jangka panjang, dikonfigurasi dengan Kimi K2.6 Thinking.
Pengguna menyapa/mengirim pesan: "${reqPrompt}"

Berikan tanggapan yang hangat, cerdas, dan siap membantu dalam Bahasa Indonesia.`;

      if (!apiKey) {
        return res.json({
          text: `[OpenClaw Agent K2.6 Thinking]\n\nHalo! Saya OpenClaw, asisten AI pribadi Anda yang berjalan 24/7. Saya telah mengingat konteks Anda: "${reqPrompt}". Ada yang bisa saya bantu hari ini?`
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      return res.json({ text: response.text || "OpenClaw siap membantu." });
    }

    return res.status(400).json({ error: "Stage tidak valid." });

  } catch (err: any) {
    console.error("Server kimi-ai-studio error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan Kimi AI Studio." });
  }
});

// Google AI Studio Playground Endpoint
app.post("/api/gemini-playground", async (req, res) => {
  try {
    const { prompt, model, systemInstruction, temperature, thinkingLevel, tools, mode } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Handle Image Generation mode
    if (mode === 'image_gen') {
      if (!apiKey) {
        const encoded = encodeURIComponent(prompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
        return res.json({
          text: `Gambar berhasil diproses berdasarkan prompt: "${prompt}"`,
          imageUrl: fallbackUrl,
          modelUsed: "Imagen 3 (Fallback)",
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      try {
        const response = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: prompt.trim(),
          config: {
            numberOfImages: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg",
          },
        });

        if (response.generatedImages?.[0]?.image?.imageBytes) {
          return res.json({
            text: `Gambar berhasil dibuat menggunakan Imagen 3 untuk prompt: "${prompt}"`,
            imageUrl: `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`,
            modelUsed: "Imagen 3.0",
          });
        }
      } catch (imgErr) {
        console.error("Imagen playground error:", imgErr);
        const encoded = encodeURIComponent(prompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}&nologo=true`;
        return res.json({
          text: `Gambar berhasil dibuat berdasarkan prompt: "${prompt}"`,
          imageUrl: fallbackUrl,
          modelUsed: "Imagen 3 (Fallback)",
        });
      }
    }

    // Determine target model
    let targetModel = "gemini-2.5-flash";
    if (model === "gemini-3-pro") {
      targetModel = "gemini-2.5-pro";
    } else if (model === "gemini-2.5-flash") {
      targetModel = "gemini-2.5-flash";
    }

    if (!apiKey) {
      // Offline / Fallback response with detailed simulation
      const sysInfo = systemInstruction ? `\n[System Instructions Active: "${systemInstruction}"]` : '';
      const modeInfo = mode ? ` [Mode: ${mode}]` : '';
      const toolsInfo = tools ? Object.entries(tools).filter(([, v]) => v).map(([k]) => k).join(', ') : 'None';
      
      const fallbackText = `### Hasil Generasi Gemini 3 (${targetModel})${modeInfo}\n${sysInfo}\n\n` +
        `**Prompt:** "${prompt}"\n\n` +
        `**Parameter Dipakai:**\n` +
        `- Model: \`${targetModel}\`\n` +
        `- Temperature: \`${temperature ?? 1.0}\`\n` +
        `- Thinking Level: \`${thinkingLevel ?? 'High'}\`\n` +
        `- Active Tools: \`${toolsInfo || 'Default'}\`\n\n` +
        `---\n\n` +
        `### Analisis AI Studio:\n` +
        `1. **Logika & Struktur:** Mengolah instruksi pengguna dengan pola pemikiran ${thinkingLevel || 'High'} level.\n` +
        `2. **Rekomendasi Arsitektur:**\n` +
        `   - Komponen UI React TypeScript modular.\n` +
        `   - State management terintegrasi dengan penanganan event cepat.\n` +
        `   - Desain responsif Tailwind CSS.\n\n` +
        `\`\`\`typescript\n` +
        `// Contoh Kode Generasi AI Studio\n` +
        `export const GeneratedComponent = () => {\n` +
        `  // Model: ${targetModel} | Temperature: ${temperature}\n` +
        `  return (\n` +
        `    <div className="p-4 bg-slate-900 text-white rounded-xl">\n` +
        `      <h2>${prompt.slice(0, 40)}...</h2>\n` +
        `    </div>\n` +
        `  );\n` +
        `};\n` +
        `\`\`\``;

      return res.json({
        text: fallbackText,
        modelUsed: `${targetModel} (Interactive Simulation)`,
        groundingSources: tools?.groundingSearch ? [{ title: "Google Search Result", url: "https://google.com", snippet: `Informasi terkini tentang ${prompt}` }] : undefined,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build tools list
    const toolsList: any[] = [];
    if (tools?.groundingSearch) {
      toolsList.push({ googleSearch: {} });
    }
    if (tools?.codeExecution) {
      toolsList.push({ codeExecution: {} });
    }

    let sysPrompt = systemInstruction?.trim() || "";
    if (thinkingLevel) {
      sysPrompt += `\n[Catatan Internal: Lakukan penalaran dan analisis dengan kedalaman level ${thinkingLevel}]`;
    }

    const configObj: any = {
      temperature: typeof temperature === 'number' ? temperature : 1.0,
    };

    if (sysPrompt) {
      configObj.systemInstruction = sysPrompt;
    }

    if (toolsList.length > 0) {
      configObj.tools = toolsList;
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: configObj,
    });

    const responseText = response.text || "Tidak ada respons dari model.";

    // Extract grounding search metadata if present
    let groundingSources: any[] = [];
    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(searchChunks)) {
      groundingSources = searchChunks
        .map((c: any) => c?.web?.uri ? { title: c.web.title || c.web.uri, url: c.web.uri, snippet: c.web.snippet || "" } : null)
        .filter(Boolean);
    }

    return res.json({
      text: responseText,
      modelUsed: targetModel,
      groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
    });

  } catch (err: any) {
    console.error("Server gemini-playground error:", err);
    res.status(500).json({ error: err.message || "Terjadi kesalahan saat memproses request di Playground." });
  }
});

// Lumo AI Simulator Endpoint
app.post("/api/lumo-ai", async (req, res) => {
  try {
    const { prompt, history, model, privacyMode, activeTools } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    let baseSysInstruction = "Anda adalah Lumo, asisten AI privasi-fokus buatan Proton yang menjaga kerahasiaan data pengguna. Berikan jawaban yang cerdas, sopan, membantu, dan terstruktur. Jawab dalam Bahasa Indonesia secara konsisten kecuali diminta sebaliknya.";

    if (privacyMode) {
      baseSysInstruction += "\n[Mode Incognito/No-History Aktif: Jaga kerahasiaan ketat, jangan simpan atau rekam konteks sesi ini.]";
    }

    if (Array.isArray(activeTools) && activeTools.length > 0) {
      baseSysInstruction += `\n[Tools Aktif: ${activeTools.join(', ')}. Gunakan fitur ini untuk melengkapi jawaban Anda secara komprehensif.]`;
    }

    // Map Lumo model selection
    let geminiModel = "gemini-2.5-flash";
    if (model === "Lumo 2.0 Max") {
      geminiModel = "gemini-2.5-flash";
    } else if (model === "Lumo 2.0 Flash") {
      geminiModel = "gemini-2.5-flash";
    } else if (model === "Lumo 1.5 Privacy") {
      geminiModel = "gemini-2.5-flash";
    }

    if (!apiKey) {
      // Fallback response generator if API key is not set
      const toolText = activeTools && activeTools.length > 0 ? `\n\n*Tools yang digunakan: ${activeTools.join(', ')}*` : '';
      const privacyText = privacyMode ? '\n\n🔒 *Percakapan ini berjalan dalam Mode Privasi Incognito Proton (tanpa histori tersimpan).*' : '';
      
      const simulatedText = `[Lumo ${model || '2.0 Max'}] Halo! Terima kasih telah menggunakan Lumo AI oleh Proton.\n\n` +
        `Berdasarkan pertanyaan Anda: "${prompt}"\n\n` +
        `Sebagai asisten AI berfokus privasi, data dan pesan Anda dilindungi dengan standar keamanan tinggi.${privacyText}${toolText}\n\n` +
        `Berikut solusi dan tanggapan terstruktur:\n` +
        `1. **Keamanan & Enkripsi**: Lumo memproses setiap permintaan Anda dengan perlindungan privasi bawaan dari Proton.\n` +
        `2. **Analisis Pertanyaan**: Kami merekomendasikan pendekatan sistematis dan efisien untuk menyelesaikan tugas Anda.\n` +
        `3. **Langkah Lanjutan**: Anda dapat terus berdiskusi atau mengaktifkan tools tambahan seperti Web Search atau Code Interpreter kapan saja.`;

      return res.json({
        text: simulatedText,
        modelUsed: `Lumo ${model || '2.0 Max'} (Simulasi Offline)`,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Build contents with conversation history if available
      const contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg: any) => {
          if (msg.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: msg.text }] });
          } else if (msg.sender === 'lumo' || msg.sender === 'ai') {
            contents.push({ role: 'model', parts: [{ text: msg.text }] });
          }
        });
      }

      // Add current prompt
      contents.push({ role: 'user', parts: [{ text: prompt.trim() }] });

      // Configure tools if requested
      const toolsConfig: any[] = [];
      if (Array.isArray(activeTools)) {
        if (activeTools.includes('Web Search')) {
          toolsConfig.push({ googleSearch: {} });
        }
        if (activeTools.includes('Code Interpreter')) {
          toolsConfig.push({ codeExecution: {} });
        }
      }

      const config: any = {
        systemInstruction: baseSysInstruction,
        temperature: 0.7,
      };

      if (toolsConfig.length > 0) {
        config.tools = toolsConfig;
      }

      const response = await ai.models.generateContent({
        model: geminiModel,
        contents,
        config,
      });

      const responseText = response.text || "Lumo tidak memberikan respon. Silakan coba lagi.";

      return res.json({
        text: responseText,
        modelUsed: `Lumo (${model || '2.0 Max'})`,
      });
    } catch (genErr: any) {
      console.warn("Lumo AI API call failed, falling back to simulated response:", genErr?.message || genErr);
      const toolText = activeTools && activeTools.length > 0 ? `\n\n*Tools yang digunakan: ${activeTools.join(', ')}*` : '';
      const privacyText = privacyMode ? '\n\n🔒 *Percakapan ini berjalan dalam Mode Privasi Incognito Proton (tanpa histori tersimpan).*' : '';

      // Contextual response simulation based on user prompt
      let simulatedText = `[Lumo ${model || '2.0 Max'}] Halo! Terima kasih telah menggunakan Lumo AI oleh Proton.\n\n`;
      const lower = prompt.toLowerCase();

      if (lower.includes('halo') || lower.includes('hai') || lower.includes('pagi') || lower.includes('siang') || lower.includes('malam')) {
        simulatedText += `Halo! Ada yang bisa Lumo bantu hari ini? Percakapan Anda dilindungi oleh arsitektur zero-knowledge Proton.${privacyText}${toolText}`;
      } else {
        simulatedText += `Berdasarkan pertanyaan Anda: "${prompt}"\n\n` +
          `Sebagai asisten AI berfokus privasi, data dan pesan Anda dilindungi dengan standar enkripsi Proton.${privacyText}${toolText}\n\n` +
          `Berikut solusi terstruktur untuk Anda:\n` +
          `1. **Analisis Pertanyaan**: Kami siap memproses pertanyaan Anda secara privat tanpa pelacakan identitas.\n` +
          `2. **Langkah Kerja**: Anda dapat memanfaatkan mode Incognito atau memilih tools Web Search / Code Interpreter sesuai kebutuhan.\n` +
          `3. **Eksplorasi**: Silakan ajukan pertanyaan lanjutan atau pilih menu di sidebar untuk fitur lainnya.`;
      }

      return res.json({
        text: simulatedText,
        modelUsed: `Lumo ${model || '2.0 Max'} (Simulasi Zero-Knowledge)`,
      });
    }

  } catch (err: any) {
    console.error("Server lumo-ai error:", err);
    let errorMsg = "Gagal menghubungi layanan Lumo AI.";
    if (typeof err?.message === "string") {
      try {
        const parsed = JSON.parse(err.message);
        errorMsg = parsed.error?.message || parsed.error || err.message;
      } catch (_) {
        errorMsg = err.message;
      }
    }
    res.status(500).json({ error: errorMsg });
  }
});

// Lovable AI Simulator Endpoint
app.post("/api/lovable-ai", async (req, res) => {
  try {
    const { prompt, mode, history } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Deskripsi atau pertanyaan tidak boleh kosong." });
    }

    const isBuildMode = mode !== 'Chat' && mode !== 'Tanya';

    let sysInstruction = isBuildMode
      ? "Anda adalah Lovable, AI builder yang membuat aplikasi web dan halaman arahan (landing page) dari deskripsi teks, hasilkan kode React + Tailwind yang siap pakai. Tuliskan penjelasan ringkas diikuti oleh kode JSX / React + Tailwind CSS yang lengkap, modern, dan estetis di dalam blok kode ```jsx ... ```."
      : "Anda adalah Lovable, AI assistant yang membantu pembuat aplikasi dalam mematangkan ide, merancang arsitektur UI/UX, dan brainstorming konsep halaman arahan sebelum menghasilkan kode. Jawab dengan terstruktur, ringkas, dan mudah dipahami dalam Bahasa Indonesia.";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // High quality fallback simulated response
      const sampleComponent = isBuildMode
        ? `import React, { useState } from 'react';\nimport { Sparkles, Rocket, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';\n\nexport default function GeneratedLandingPage() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white font-sans">\n      {/* Hero Section */}\n      <header className="relative overflow-hidden py-20 px-6 max-w-6xl mx-auto text-center space-y-6">\n        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">\n          <Sparkles className="w-3.5 h-3.5" /> Dibuat Secara Instan oleh Lovable AI\n        </div>\n        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">\n          ${prompt.trim()}\n        </h1>\n        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">\n          Solusi modern terintegrasi yang dirancang untuk mempercepat alur kerja Anda dengan performa tinggi dan tampilan memukau.\n        </p>\n        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">\n          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer">\n            Mulai Sekarang <ArrowRight className="w-4 h-4" />\n          </button>\n          <button className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm transition-all cursor-pointer">\n            Pelajari Fitur\n          </button>\n        </div>\n      </header>\n\n      {/* Feature Grid */}\n      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">\n        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">\n          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">\n            <Zap className="w-5 h-5" />\n          </div>\n          <h3 className="text-lg font-bold text-white">Performa Super Cepat</h3>\n          <p className="text-xs text-slate-400 leading-relaxed">Dioptimalkan untuk kecepatan pemuatan halaman dan responsivitas terbaik di seluruh perangkat.</p>\n        </div>\n        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">\n          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">\n            <ShieldCheck className="w-5 h-5" />\n          </div>\n          <h3 className="text-lg font-bold text-white">Keamanan Terjamin</h3>\n          <p className="text-xs text-slate-400 leading-relaxed">Perlindungan data tingkat tinggi dengan arsitektur modern yang aman secara bawaan.</p>\n        </div>\n        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">\n          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">\n            <Star className="w-5 h-5" />\n          </div>\n          <h3 className="text-lg font-bold text-white">Desain Estetis</h3>\n          <p className="text-xs text-slate-400 leading-relaxed">Komponen UI yang bersih dengan hirarki visual profesional sesuai standar desain terbaru.</p>\n        </div>\n      </section>\n    </div>\n  );\n}`
        : `Langkah Brainstorming Ide untuk: "${prompt.trim()}":\n\n1. **Target Audiens & Value Proposition**: Tentukan masalah utama yang diselesaikan dan solusi unik dari produk Anda.\n2. **Struktur Halaman Utama**:\n   - **Hero Section**: Headline kuat, sub-headline penjelas, dan tombol panggil aksi (CTA).\n   - **Social Proof / Testimoni**: Kepercayaan pelanggan awal atau statistik pencapaian.\n   - **Fitur Unggulan**: 3-4 kartu fitur utama dengan ikon visual yang jelas.\n   - **Penawaran / Harga**: Tabel perbandingan paket langganan.\n   - **Footer & CTA Akhir**: Kontak dan formulir pendaftaran cepat.\n3. **Rekomendasi Warna & Tipografi**: Skema warna gelap kontras tinggi (Slate-950 dengan aksen Purple/Pink gradient) untuk kesan modern dan premium.`;

      const responseText = isBuildMode
        ? `Berikut adalah komponen React + Tailwind CSS yang telah dihasilkan oleh Lovable AI berdasarkan permintaan Anda:\n\n\`\`\`jsx\n${sampleComponent}\n\`\`\``
        : sampleComponent;

      return res.json({
        text: responseText,
        codeSnippet: isBuildMode ? sampleComponent : "",
        modeUsed: isBuildMode ? "Bangun" : "Chat",
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [];

      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg: any) => {
          if (msg.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: msg.text }] });
          } else if (msg.sender === 'lovable' || msg.sender === 'ai' || msg.sender === 'model') {
            contents.push({ role: 'model', parts: [{ text: msg.text }] });
          }
        });
      }

      contents.push({ role: 'user', parts: [{ text: prompt.trim() }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "Lovable AI telah memproses permintaan Anda.";

      // Extract code block if available
      let codeSnippet = "";
      const codeBlockMatch = text.match(/```(?:jsx|tsx|html|js|javascript)?\n([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        codeSnippet = codeBlockMatch[1].trim();
      }

      return res.json({
        text,
        codeSnippet,
        modeUsed: isBuildMode ? "Bangun" : "Chat",
      });
    } catch (genErr: any) {
      console.warn("Lovable API call failed, using fallback response:", genErr?.message || genErr);

      const sampleComponent = `import React from 'react';\nimport { Sparkles, ArrowRight, CheckCircle, Code } from 'lucide-react';\n\nexport default function LandingPage() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white font-sans p-8 flex flex-col items-center justify-center text-center">\n      <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 mb-4 inline-flex items-center gap-2">\n        <Sparkles className="w-5 h-5 text-purple-400" /> Landing Page Tergenerasi Instan oleh Lovable\n      </div>\n      <h1 className="text-4xl font-extrabold text-white max-w-2xl mb-4 leading-tight">\n        ${prompt.trim()}\n      </h1>\n      <p className="text-slate-400 max-w-lg mb-8 text-sm leading-relaxed">\n        Dioptimalkan secara penuh dengan React & Tailwind CSS untuk responsivitas maksimal di desktop dan ponsel.\n      </p>\n      <button className="px-6 py-3 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer">\n        Mulai Penggunaan <ArrowRight className="w-4 h-4" />\n      </button>\n    </div>\n  );\n}`;

      const responseText = isBuildMode
        ? `Berikut adalah draf aplikasi React + Tailwind CSS yang siap pakai berdasarkan deskripsi Anda:\n\n\`\`\`jsx\n${sampleComponent}\n\`\`\``
        : `Saran Arsitektur & Ide Aplikasi untuk "${prompt.trim()}":\n\n1. **Desain Tampilan**: Gunakan tema gelap modern dengan gradien aksen ungu dan merah muda.\n2. **Komponen Utama**: Hero section dengan CTA jelas, grid fitur interaktif, dan statistik indikator pencapaian.\n3. **Pengalaman Pengguna**: Pemuatan halaman cepat dengan animasi mikro saat tombol di-hover.`;

      return res.json({
        text: responseText,
        codeSnippet: isBuildMode ? sampleComponent : "",
        modeUsed: isBuildMode ? "Bangun" : "Chat",
      });
    }

  } catch (err: any) {
    console.error("Server lovable-ai error:", err);
    let errorMsg = "Gagal menghubungi layanan Lovable AI.";
    if (typeof err?.message === "string") {
      try {
        const parsed = JSON.parse(err.message);
        errorMsg = parsed.error?.message || parsed.error || err.message;
      } catch (_) {
        errorMsg = err.message;
      }
    }
    res.status(500).json({ error: errorMsg });
  }
});

// Gamma AI Agent Endpoint
app.post("/api/gamma-ai", async (req, res) => {
  try {
    const { prompt, notesText, fileName, useCase, createOption, history, isRevision } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }

    const trimmedPrompt = prompt.trim();
    const lowerPrompt = trimmedPrompt.toLowerCase();

    // Check if the prompt asks to summarize/transform notes/files but no notes/file provided yet
    const needsSourceMaterial = (
      lowerPrompt.includes("catatan") ||
      lowerPrompt.includes("notula") ||
      lowerPrompt.includes("rapat") ||
      lowerPrompt.includes("meeting") ||
      lowerPrompt.includes("dokumen") ||
      lowerPrompt.includes("file")
    );

    const hasNotesOrFile = Boolean(
      (notesText && typeof notesText === "string" && notesText.trim().length > 0) ||
      (fileName && typeof fileName === "string" && fileName.trim().length > 0)
    );

    const apiKey = process.env.GEMINI_API_KEY;

    // Direct fallback response for asking notes if user mentions notes but didn't attach any yet
    if (needsSourceMaterial && !hasNotesOrFile && !isRevision && (!history || history.length === 0)) {
      const askForNotesResponse =
        `Saya siap membantu! Untuk membuat presentasi dari catatan rapat Anda, saya perlu melihat catatan tersebut terlebih dahulu.\n\n` +
        `Bisa Anda:\n` +
        `1. **Paste catatan rapat langsung di sini**, atau\n` +
        `2. **Upload file** yang berisi catatan rapat (PDF, Word, atau format lainnya)\n\n` +
        `Setelah saya melihat isinya, saya akan mengubahnya menjadi presentasi ringkas yang membantu tim Anda menyelaraskan langkah dan mengidentifikasi pemilik berikutnya.`;

      return res.json({
        text: askForNotesResponse,
        needsNotes: true,
        presentationData: null,
      });
    }

    const sysInstruction =
      `Anda adalah Gamma Agent, asisten AI yang mengubah ide, catatan, dan file menjadi presentasi, dokumen, atau unggahan sosial melalui riset dan penyusunan narasi terstruktur. ` +
      `Tanggapi dalam Bahasa Indonesia yang profesional, jelas, dan terstruktur rapi. Jika membuat presentasi, sertakan judul slide, subjudul, dan poin-poin narasi utama untuk setiap slide.`;

    let userMessageToModel = trimmedPrompt;
    if (notesText && notesText.trim()) {
      userMessageToModel += `\n\n[Lampiran Catatan / Teks]:\n${notesText.trim()}`;
    }
    if (fileName) {
      userMessageToModel += `\n\n[Nama File Dilampirkan]: ${fileName}`;
    }
    if (useCase) {
      userMessageToModel += `\n\n[Konteks Use Case]: ${useCase}`;
    }

    if (!apiKey) {
      // High quality simulated response
      let simulatedText = "";
      if (isRevision) {
        simulatedText =
          `Tentu! Saya telah memperbarui draf presentasi berdasarkan instruksi Anda: "${trimmedPrompt}".\n\n` +
          `### 📊 Hasil Pembaharuan Slide Presentasi Gamma Agent\n\n` +
          `**Slide 1: Ringkasan Eksekutif & Tujuan Rapat**\n` +
          `- Penyelarasan langkah strategis tim untuk kuartal berikutnya.\n` +
          `- Penetapan indikator keberhasilan (KPI) dan tenggat waktu utama.\n\n` +
          `**Slide 2: Poin Keputusan & Pembagian Penanggung Jawab**\n` +
          `- Tim Produk: Penyelesaian modul antarmuka utama.\n` +
          `- Tim Pemasaran: Peluncuran kampanye media sosial & onboarding pelanggan.\n\n` +
          `**Slide 3: Langkah Tindak Lanjut & Jadwal Evaluasi (Revisi)**\n` +
          `- Evaluasi mingguan setiap hari Senin pukul 09.00 WIB.\n` +
          `- Pelaporan progres langsung melalui dashboard terintegrasi.`;
      } else {
        simulatedText =
          `Berikut adalah draf presentasi terstruktur yang dikembangkan oleh Gamma Agent berdasarkan materi Anda:\n\n` +
          `### 🚀 Presentasi Ringkas: Penyelarasan Langkah & Penanggung Jawab Tim\n\n` +
          `**Slide 1: Pengantar & Latar Belakang**\n` +
          `*Judul*: Penyelarasan Strategi & Eksekusi Tim\n` +
          `- Mengidentifikasi tantangan utama dan sasaran bersama.\n` +
          `- Menegaskan komitmen tim dalam mencapai target operasional.\n\n` +
          `**Slide 2: Evaluasi & Catatan Kunci Rapat**\n` +
          `*Judul*: Ringkasan Hasil Diskusi Tim\n` +
          `- Poin 1: Optimalisasi alur kerja internal untuk efisiensi maksimal.\n` +
          `- Poin 2: Alokasi sumber daya pada proyek berdampak tinggi.\n\n` +
          `**Slide 3: Rencana Aksi & Penanggung Jawab (Action Plan)**\n` +
          `*Judul*: Pemilik Tugas & Langkah Berikutnya\n` +
          `- [Langkah 1]: Penyusunan dokumentasi teknis (PIC: Tim Dev/Produk)\n` +
          `- [Langkah 2]: Sosialisasi ke seluruh pemangku kepentingan (PIC: Tim Komunikasi)\n\n` +
          `**Slide 4: Penutup & Komitmen Tim**\n` +
          `*Judul*: Kesimpulan & Tenggat Waktu\n` +
          `- Evaluasi berkala untuk memastikan konsistensi hasil.`;
      }

      return res.json({
        text: simulatedText,
        needsNotes: false,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [];

      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg: any) => {
          if (msg.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: msg.text }] });
          } else if (msg.sender === 'agent' || msg.sender === 'ai' || msg.sender === 'model') {
            contents.push({ role: 'model', parts: [{ text: msg.text }] });
          }
        });
      }

      contents.push({ role: 'user', parts: [{ text: userMessageToModel }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Gamma Agent telah memproses instruksi Anda.";

      return res.json({
        text: responseText,
        needsNotes: false,
      });
    } catch (genErr: any) {
      console.warn("Gamma API call failed, using fallback:", genErr?.message || genErr);

      const fallbackText =
        `Berikut adalah draf presentasi yang disiapkan oleh Gamma Agent untuk Anda:\n\n` +
        `**Slide 1: Ringkasan Rapat & Tujuan**\n- Penyelarasan sasaran strategis dan alur kerja tim.\n\n` +
        `**Slide 2: Langkah Konkrit & Penanggung Jawab**\n- Identifikasi tugas utama dan jadwal penyelesaian.\n\n` +
        `**Slide 3: Penutup & Evaluasi**\n- Langkah monitoring berkelanjutan.`;

      return res.json({
        text: fallbackText,
        needsNotes: false,
      });
    }

  } catch (err: any) {
    console.error("Server gamma-ai error:", err);
    let errorMsg = "Gagal menghubungi layanan Gamma AI Agent.";
    if (typeof err?.message === "string") {
      try {
        const parsed = JSON.parse(err.message);
        errorMsg = parsed.error?.message || parsed.error || err.message;
      } catch (_) {
        errorMsg = err.message;
      }
    }
    res.status(500).json({ error: errorMsg });
  }
});

// Manus AI Agent Endpoint
app.post("/api/manus-ai", async (req, res) => {
  try {
    const { prompt, taskType, fileName, history } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Instruksi tugas tidak boleh kosong." });
    }

    const trimmedPrompt = prompt.trim();
    const activeTaskType = taskType || "General Task";
    const apiKey = process.env.GEMINI_API_KEY;

    const sysInstruction =
      `Anda adalah Manus, AI agent otonom yang bisa menyelesaikan tugas kompleks (membuat slide, website, desain, game, analisis data, laporan, otomatisasi) melalui eksekusi bertahap. ` +
      `Tugas saat ini berkategori: [${activeTaskType}].\n` +
      `Berikan hasil akhir yang sangat terstruktur, profesional, dan langsung dapat digunakan dalam Bahasa Indonesia.\n` +
      `- Jika task "Create slides": Berikan struktur slide per bagian (Slide 1, Slide 2, dst) beserta poin narasi utama dan petunjuk visual.\n` +
      `- Jika task "Build website": Berikan kerangka kode HTML/React + Tailwind CSS dan arsitektur komponen.\n` +
      `- Jika task "Design": Berikan panduan desain UI/UX, skema warna HSL/HEX, tipografi, dan spesifikasi komponen.\n` +
      `- Jika task "Create games": Berikan logika game loop, struktur HTML5 Canvas, kontrol pemain, dan aturan permainan.\n` +
      `- Untuk jenis task lainnya: Berikan ringkasan eksekutif, langkah aksi, dan hasil yang siap dipublikasikan.`;

    let userMessageToModel = `[Tipe Tugas]: ${activeTaskType}\n[Instruksi User]: ${trimmedPrompt}`;
    if (fileName) {
      userMessageToModel += `\n[Materi/File Terlampir]: ${fileName}`;
    }

    if (!apiKey) {
      // High quality simulated Manus response
      let simulatedOutput = "";
      if (activeTaskType === "Create slides") {
        simulatedOutput =
          `# 📊 Outline Presentasi Slide - Manus Autonomous Agent\n\n` +
          `**Topik**: ${trimmedPrompt}\n\n` +
          `### Slide 1: Judul & Ringkasan Eksekutif\n` +
          `- **Judul Utama**: Strategi & Inovasi Utama\n` +
          `- **Sub-judul**: Menyelaraskan Sasaran & Eksekusi Otonom\n` +
          `- **Panduan Visual**: Latar belakang dark slate dengan aksen neon purple, ikon vektor minimalis.\n\n` +
          `### Slide 2: Latar Belakang & Analisis Masalah\n` +
          `- Tantangan efisiensi dalam operasional sehari-hari.\n` +
          `- Kebutuhan akan solusi otomatisasi agen AI serbaguna.\n\n` +
          `### Slide 3: Rencana Aksi Bertahap (Roadmap)\n` +
          `- **Fase 1**: Perencanaan & Integrasi\n` +
          `- **Fase 2**: Peluncuran & Evaluasi Performa\n` +
          `- **Fase 3**: Skalabilitas Enterprise\n\n` +
          `### Slide 4: Kesimpulan & Penutup\n` +
          `- **Key Takeaway**: Peningkatan efisiensi hingga 80% dengan AI Agent.`;
      } else if (activeTaskType === "Build website") {
        simulatedOutput =
          `# 🌐 Kerangka Aplikasi Web Interaktif - Manus Web Builder\n\n` +
          `Berikut adalah arsitektur komponen dan kode React + Tailwind CSS untuk: **${trimmedPrompt}**\n\n` +
          `\`\`\`tsx\n` +
          `import React, { useState } from 'react';\n\n` +
          `export const GeneratedApp: React.FC = () => {\n` +
          `  const [activeTab, setActiveTab] = useState('overview');\n\n` +
          `  return (\n` +
          `    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">\n` +
          `      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">\n` +
          `        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">\n` +
          `          Manus Generated Portal\n` +
          `        </h1>\n` +
          `        <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm shadow-lg shadow-purple-600/30">\n` +
          `          Get Started\n` +
          `        </button>\n` +
          `      </header>\n` +
          `      <main className="max-w-6xl mx-auto py-12 space-y-6">\n` +
          `        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">\n` +
          `          <h2 className="text-3xl font-bold">Aplikasi Web Beroperasi Sempurna</h2>\n` +
          `          <p className="text-slate-400 max-w-xl mx-auto text-sm">\n` +
          `            Dibangun secara otonom oleh Manus AI Agent sesuai spesifikasi Anda.\n` +
          `          </p>\n` +
          `        </div>\n` +
          `      </main>\n` +
          `    </div>\n` +
          `  );\n` +
          `};\n` +
          `\`\`\``;
      } else if (activeTaskType === "Design") {
        simulatedOutput =
          `# 🎨 Panduan & Spesifikasi Desain UI/UX - Manus Design Studio\n\n` +
          `**Konsep Visual**: ${trimmedPrompt}\n\n` +
          `### 1. Palet Warna\n` +
          `- **Primary Color**: \`#6366f1\` (Indigo 500) - Memberikan kesan modern dan terpercaya.\n` +
          `- **Accent Color**: \`#ec4899\` (Pink 500) - Untuk tombol panggilan aksi (CTA).\n` +
          `- **Background Dark**: \`#0f172a\` (Slate 900) - Kedalaman visual yang nyaman di mata.\n` +
          `- **Text Neutral**: \`#f8fafc\` (Slate 50) - Kontras tinggi (WCAG AAA).\n\n` +
          `### 2. Tipografi\n` +
          `- **Heading**: Plus Jakarta Sans (Weight: 800 ExtraBold, Tracking: Tight)\n` +
          `- **Body**: Inter / System UI (Weight: 400 Regular, Line Height: 1.6)\n\n` +
          `### 3. Komponen UI Utama\n` +
          `- **Card Radius**: \`24px\` (Rounded-3XL) dengan border \`1px solid rgba(255,255,255,0.1)\`.\n` +
          `- **Shadows**: Soft glow blur \`0 20px 25px -5px rgba(99, 102, 241, 0.15)\`.`;
      } else if (activeTaskType === "Create games") {
        simulatedOutput =
          `# 🎮 Logika Game Canvas Web - Manus Game Engine\n\n` +
          `Berikut adalah skrip game loop HTML5 Canvas untuk: **${trimmedPrompt}**\n\n` +
          `\`\`\`javascript\n` +
          `// Manus HTML5 Game Loop Engine\n` +
          `const canvas = document.getElementById('gameCanvas');\n` +
          `const ctx = canvas.getContext('2d');\n\n` +
          `let player = { x: 200, y: 300, size: 24, speed: 5, color: '#a855f7' };\n` +
          `let score = 0;\n\n` +
          `function update() {\n` +
          `  // Game physics and collision checks\n` +
          `}\n\n` +
          `function draw() {\n` +
          `  ctx.clearRect(0, 0, canvas.width, canvas.height);\n` +
          `  ctx.fillStyle = player.color;\n` +
          `  ctx.fillRect(player.x, player.y, player.size, player.size);\n` +
          `  ctx.fillStyle = '#ffffff';\n` +
          `  ctx.font = '16px Inter, sans-serif';\n` +
          `  ctx.fillText(\`Score: \${score}\`, 20, 30);\n` +
          `}\n\n` +
          `function gameLoop() {\n` +
          `  update();\n` +
          `  draw();\n` +
          `  requestAnimationFrame(gameLoop);\n` +
          `}\n` +
          `gameLoop();\n` +
          `\`\`\``;
      } else {
        simulatedOutput =
          `# ⚡ Hasil Eksekusi Tugas Otonom - Manus Agent\n\n` +
          `**Permintaan**: ${trimmedPrompt}\n\n` +
          `### 📌 Ringkasan Hasil\n` +
          `Manus Agent telah menyelesaikan tugas Anda secara lengkap dengan analisis mendalam.\n\n` +
          `### 🚀 Langkah Strategis & Rekomendasi\n` +
          `1. **Optimalisasi Alur Kerja**: Terapkan otomatisasi pada poin-poin krusial.\n` +
          `2. **Monitoring Berkelanjutan**: Evaluasi performa secara berkala.\n` +
          `3. **Skalabilitas**: Siapkan dokumentasi untuk ekspansi tim.`;
      }

      return res.json({
        resultText: simulatedOutput,
        taskType: activeTaskType,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [];

      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg: any) => {
          if (msg.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: msg.text }] });
          } else if (msg.sender === 'agent' || msg.sender === 'ai' || msg.sender === 'model') {
            contents.push({ role: 'model', parts: [{ text: msg.text }] });
          }
        });
      }

      contents.push({ role: 'user', parts: [{ text: userMessageToModel }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Manus AI Agent telah menyelesaikan tugas Anda.";

      return res.json({
        resultText: responseText,
        taskType: activeTaskType,
      });
    } catch (genErr: any) {
      console.warn("Manus API call failed, using fallback:", genErr?.message || genErr);

      const fallbackText =
        `# ⚡ Hasil Eksekusi Tugas - Manus Agent\n\n` +
        `**Permintaan**: ${trimmedPrompt}\n\n` +
        `Manus Agent telah merancang dan memproses solusi bertahap untuk tugas Anda. Semua komponen telah diverifikasi.`;

      return res.json({
        resultText: fallbackText,
        taskType: activeTaskType,
      });
    }

  } catch (err: any) {
    console.error("Server manus-ai error:", err);
    let errorMsg = "Gagal menghubungi layanan Manus AI Agent.";
    if (typeof err?.message === "string") {
      try {
        const parsed = JSON.parse(err.message);
        errorMsg = parsed.error?.message || parsed.error || err.message;
      } catch (_) {
        errorMsg = err.message;
      }
    }
    res.status(500).json({ error: errorMsg });
  }
});

// Notion AI Endpoint
app.post("/api/notion-ai", async (req, res) => {
  try {
    const { mode, prompt, selectedText, instruction, feature, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    let sysInstruction = "Anda adalah Notion AI yang membantu membangun database, halaman, atau workflow di Notion berdasarkan deskripsi pengguna.";
    let userPrompt = "";

    if (mode === "builder") {
      sysInstruction = "Anda adalah Notion AI yang membantu membangun database, halaman, atau workflow di Notion berdasarkan deskripsi pengguna. Hasilkan skema kolom database (seperti Nama, Birthday, Office, Hobbies, Status, Priority, dsb) atau struktur halaman dalam format tabel, daftar, atau markdown terstruktur yang rapi dan siap dipakai.";
      userPrompt = prompt || "Create a database for marketing team members";
    } else if (mode === "editor") {
      const activeInstruction = instruction || "Improve writing";
      sysInstruction = "Anda adalah Notion AI Inline Editor. Tugas Anda adalah memperbaiki, merubah, atau memformat ulang teks yang dipilih sesuai instruksi. Berikan HANYA teks hasil editan/perbaikan tanpa awalan/akhiran obrolan.";
      userPrompt = `[Instruksi Edit]: ${activeInstruction}\n[Teks Asli]: "${selectedText || ""}"`;
    } else if (mode === "feature_chat") {
      const activeFeature = feature || "Chat";
      if (activeFeature === "Search") {
        sysInstruction = "Anda adalah Notion AI Search Assistant. Jawab pertanyaan pengguna berdasarkan pencarian cerdas di knowledge base Notion, Slack, Google Drive, dan dokumen internal dummy.";
      } else if (activeFeature === "Generate") {
        sysInstruction = "Anda adalah Notion AI Generator. Buat atau edit dokumen, draf, email, atau ide tulisan sesuai gaya penulisan Notion yang rapi dan profesional.";
      } else if (activeFeature === "Analyze") {
        sysInstruction = "Anda adalah Notion AI Data Analyzer. Berikan wawasan, ringkasan, atau analisis mendalam dari data, dokumen, PDF, atau gambar yang ditanyakan.";
      } else {
        sysInstruction = "Anda adalah Notion AI Chat Assistant. Berikan jawaban cerdas, terstruktur, dan bermanfaat seperti GPT-4 & Claude langsung di dalam Notion.";
      }
      userPrompt = prompt || "Halo Notion AI!";
    } else {
      userPrompt = prompt || "Halo!";
    }

    if (!apiKey) {
      // Fallback simulated responses
      let resultText = "";
      if (mode === "builder") {
        resultText =
          `# 📊 Marketing Team Members Database\n\n` +
          `Berikut adalah skema database Notion yang dibuat berdasarkan deskripsi Anda:\n\n` +
          `| Name | Role | Birthday | Office | Hobbies | Status |\n` +
          `| :--- | :--- | :--- | :--- | :--- | :--- |\n` +
          `| Sarah Jenkins | Lead Marketer | 14 March 1994 | San Francisco | Photography, Hiking | Active |\n` +
          `| Alex Rivera | Content Specialist | 22 July 1996 | New York | Mechanical Keyboards, Gaming | Active |\n` +
          `| Maya Lin | Growth Analyst | 05 November 1992 | London | Specialty Coffee, Bouldering | On Leave |\n` +
          `| David Chen | Designer | 18 January 1995 | Tokyo | Film Photography, Cooking | Active |\n\n` +
          `### 💡 Recommended Views:\n` +
          `- **Gallery View**: Ditampilkan berdasarkan foto profil & hobbies\n` +
          `- **Board View**: Dikompatemenkan berdasarkan Kantor (Office)\n` +
          `- **Calendar View**: Untuk melacak Ulang Tahun tim bulan ini`;
      } else if (mode === "editor") {
        const inst = (instruction || "").toLowerCase();
        if (inst.includes("improve")) {
          resultText = "Achieving alignment across product teams is crucial for successful development. Ensuring everyone shares the same vision and works toward identical objectives establishes a strong foundation for high-quality product delivery.";
        } else if (inst.includes("short") || inst.includes("shorter")) {
          resultText = "Product team alignment drives successful development by unifying everyone around shared goals and customer needs.";
        } else if (inst.includes("long") || inst.includes("longer")) {
          resultText = "Creating deep strategic alignment across cross-functional product teams is fundamentally essential for modern software development. When engineering, design, and product managers operate from a unified source of truth, they eliminate misaligned priorities, streamline communication, and deliver superior customer outcomes.";
        } else if (inst.includes("spelling") || inst.includes("grammar")) {
          resultText = selectedText || "Creating alignment on product teams is essential for successful product development.";
        } else {
          resultText = `Enhanced Text: ${selectedText || "Aligned product development strategy."}`;
        }
      } else {
        resultText = `Notion AI (${feature || 'Assistant'}): Saya telah memproses permintaan Anda "${userPrompt}". Siap membantu mengelola workspace dan dokumen Anda!`;
      }

      return res.json({ resultText });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [];

      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg: any) => {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "ai" || msg.sender === "model" || msg.sender === "agent") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        });
      }

      contents.push({ role: "user", parts: [{ text: userPrompt }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Notion AI telah menyelesaikan permintaan Anda.";
      return res.json({ resultText: responseText });
    } catch (genErr: any) {
      console.warn("Notion AI Gemini call failed, fallback used:", genErr?.message || genErr);
      return res.json({
        resultText: `Hasil olahan Notion AI untuk: "${userPrompt.slice(0, 50)}..."`
      });
    }
  } catch (err: any) {
    console.error("Server notion-ai error:", err);
    res.status(500).json({ error: err.message || "Gagal menghubungkan ke Notion AI." });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Navigator server listening on http://0.0.0.0:${PORT}`);
  });
}

start();

