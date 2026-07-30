var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "offline-interactive" });
});
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, style, aspectRatio, excludedWords } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }
    const stylePrefix = style && style !== "auto" ? `, ${style} style` : "";
    const negativePrompt = excludedWords ? `, avoiding ${excludedWords}` : "";
    const fullPrompt = `${prompt.trim()}${stylePrefix}${negativePrompt}`;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const encoded = encodeURIComponent(fullPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1e5)}&nologo=true`;
      return res.json({
        imageUrl: fallbackUrl,
        prompt: fullPrompt,
        provider: "pollinations-fallback"
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
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
          aspectRatio: ar,
          outputMimeType: "image/jpeg"
        }
      });
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Image = response.generatedImages[0].image?.imageBytes;
        if (base64Image) {
          return res.json({
            imageUrl: `data:image/jpeg;base64,${base64Image}`,
            prompt: fullPrompt,
            provider: "imagen-3.0"
          });
        }
      }
      throw new Error("Tidak ada data gambar yang diterima dari API.");
    } catch (apiErr) {
      console.error("Gemini Imagen API Error:", apiErr);
      const errMsg = apiErr?.message || String(apiErr);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        return res.status(429).json({
          error: "Batas kuota API tercapai (Rate limit/Quota exceeded). Silakan coba lagi nanti atau tunggu beberapa saat."
        });
      }
      const encoded = encodeURIComponent(fullPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1e5)}&nologo=true`;
      return res.json({
        imageUrl: fallbackUrl,
        prompt: fullPrompt,
        provider: "pollinations-fallback",
        warning: "Menggunakan mesin cadangan karena Imagen API mengalami kendala."
      });
    }
  } catch (err) {
    console.error("Server generate-image error:", err);
    res.status(500).json({ error: err.message || "Terjadi kesalahan internal pada server saat membuat gambar." });
  }
});
function pcmToWavDataUrl(base64Pcm, sampleRate = 24e3, numChannels = 1) {
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
  wavHeader.writeUInt16LE(1, 20);
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
function generateSynthesizedSpeechWav(text, voiceName = "Aria") {
  const sampleRate = 22050;
  const durationInSeconds = Math.max(3, Math.min(30, Math.ceil(text.length * 0.08)));
  const totalSamples = Math.floor(sampleRate * durationInSeconds);
  const pcmBuffer = Buffer.alloc(totalSamples * 2);
  let baseFreq = 220;
  if (voiceName.toLowerCase().includes("adam") || voiceName.toLowerCase().includes("marcus")) {
    baseFreq = 130;
  } else if (voiceName.toLowerCase().includes("serena")) {
    baseFreq = 240;
  }
  for (let i = 0; i < totalSamples; i++) {
    const time = i / sampleRate;
    const syllableEnv = Math.abs(Math.sin(time * Math.PI * 4.5)) * Math.max(0, Math.sin(time * Math.PI * 0.8));
    const f1 = Math.sin(2 * Math.PI * baseFreq * time);
    const f2 = 0.5 * Math.sin(2 * Math.PI * (baseFreq * 1.5) * time);
    const f3 = 0.25 * Math.sin(2 * Math.PI * (baseFreq * 2.1) * time);
    const vibrato = 1 + 0.03 * Math.sin(2 * Math.PI * 5 * time);
    const sampleValue = Math.floor((f1 + f2 + f3) * vibrato * syllableEnv * 8e3);
    const clamped = Math.max(-32768, Math.min(32767, sampleValue));
    pcmBuffer.writeInt16LE(clamped, i * 2);
  }
  const audioUrl = pcmToWavDataUrl(pcmBuffer.toString("base64"), sampleRate, 1);
  return { audioUrl, duration: durationInSeconds };
}
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
        model: model || "Eleven Multilingual v2"
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const voiceMap = {
      "Aria - Maxy Educator": "Aoede",
      "Adam - Tech Narrator": "Puck",
      "Serena - Warm Guide": "Kore",
      "Marcus - Executive Pitch": "Fenrir"
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
                voiceName: targetVoice
              }
            }
          }
        }
      });
      const candidate = response.candidates?.[0];
      const audioPart = candidate?.content?.parts?.find((p) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/"));
      if (audioPart && audioPart.inlineData) {
        const { mimeType, data } = audioPart.inlineData;
        let finalAudioUrl = "";
        if (mimeType.includes("pcm")) {
          finalAudioUrl = pcmToWavDataUrl(data, 24e3, 1);
        } else {
          finalAudioUrl = `data:${mimeType};base64,${data}`;
        }
        const estDuration = Math.max(3, Math.ceil(text.length * 0.08));
        return res.json({
          audioUrl: finalAudioUrl,
          duration: estDuration,
          provider: "gemini-2.5-flash-tts",
          voice: voice || "Aria - Maxy Educator",
          model: model || "Eleven Multilingual v2"
        });
      }
      const fallback = generateSynthesizedSpeechWav(text, voice);
      return res.json({
        audioUrl: fallback.audioUrl,
        duration: fallback.duration,
        provider: "gemini-text-fallback",
        voice: voice || "Aria - Maxy Educator",
        model: model || "Eleven Multilingual v2"
      });
    } catch (apiErr) {
      console.error("Gemini TTS Error:", apiErr);
      const fallback = generateSynthesizedSpeechWav(text, voice);
      return res.json({
        audioUrl: fallback.audioUrl,
        duration: fallback.duration,
        provider: "synthesizer-fallback",
        voice: voice || "Aria - Maxy Educator",
        model: model || "Eleven Multilingual v2",
        warning: "Menggunakan pemrosesan audio lokal karena respons API terhambat."
      });
    }
  } catch (err) {
    console.error("Server generate-speech error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses pembuatan speech audio." });
  }
});
app.post("/api/generate-song", async (req, res) => {
  try {
    const { prompt, mode, isInstrumental, customLyrics, customStyle, customTitle } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const createFallbackVersions = () => {
      const baseTitle = customTitle?.trim() || prompt?.trim().slice(0, 30) || "Lagu Maxy AI";
      const styleTag = customStyle?.trim() || "Upbeat Indie Pop, 128 BPM, Synthwave";
      const lyrics1 = isInstrumental ? "(Instrumental Track - Tanpa Vokal)" : customLyrics?.trim() || `[Intro - Upbeat Synth]

[Verse 1]
${prompt || "Langkah awal belajar AI di Maxy Academy"}
Persiapan matang menuju karir cemerlang
Coding dan AI menyatu dalam harmoni!

[Chorus]
Kita wujudkan karya musik AI generasi baru!
Semangat tanpa batas bersama Maxy Academy!

[Outro - Fade Out]`;
      const lyrics2 = isInstrumental ? "(Instrumental Track - Tanpa Vokal)" : customLyrics?.trim() ? `${customLyrics}

[Alternative Acoustic Outro]` : `[Verse 1]
Suasana malam penuh inspirasi
${prompt || "Merancang lagu dengan AI Studio"}
Membawa ide menjadi nada berharga

[Chorus]
Sing along! Nada gembira ciptaan AI
Suno AI v4.5 melodi Maxy Academy!

[Outro]`;
      return [
        {
          title: `${baseTitle} (v1)`,
          style: styleTag,
          duration: "2:45",
          isInstrumental: Boolean(isInstrumental),
          lyrics: lyrics1,
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 55) + 40)
        },
        {
          title: `${baseTitle} (v2 Chill Remix)`,
          style: `${styleTag}, Chill Lofi Remix, 95 BPM`,
          duration: "3:12",
          isInstrumental: Boolean(isInstrumental),
          lyrics: lyrics2,
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 30)
        }
      ];
    };
    if (!apiKey) {
      return res.json({ versions: createFallbackVersions() });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    try {
      const systemInstruction = `Kamu adalah Suno AI v4.5 Songwriter & Producer. Hasilkan JSON array berisi tepat 2 objek versi lagu.
Setiap objek harus memiliki properti:
- "title": string (judul lagu yang kreatif)
- "style": string (genre, tempo bpm, instrumen)
- "duration": string (misal "2:38")
- "lyrics": string (lirik lagu lengkap dengan tag [Verse], [Chorus], [Outro])

Respons HARUS valid JSON array saja tanpa format markdown extra.`;
      const userPromptText = mode === "custom" ? `Buat 2 variasi lagu berdasarkan: Judul: "${customTitle}", Gaya: "${customStyle}", Lirik: "${customLyrics}", Instrumental: ${isInstrumental}` : `Buat 2 variasi lagu berdasarkan prompt: "${prompt}", Instrumental: ${isInstrumental}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}

${userPromptText}`
      });
      const responseText = response.text || "";
      const cleanedJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      let parsed = JSON.parse(cleanedJson);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        const versions = parsed.slice(0, 2).map((item, idx) => ({
          title: item.title || `${customTitle || "Lagu Maxy AI"} v${idx + 1}`,
          style: item.style || customStyle || "Indie Pop, 128 BPM",
          duration: item.duration || (idx === 0 ? "2:40" : "3:05"),
          isInstrumental: Boolean(isInstrumental),
          lyrics: isInstrumental ? "(Instrumental Track - Tanpa Vokal)" : item.lyrics || customLyrics || "[Verse]\nLagu AI Maxy",
          waveform: Array.from({ length: 24 }, () => Math.floor(Math.random() * 60) + 35)
        }));
        return res.json({ versions });
      }
      return res.json({ versions: createFallbackVersions() });
    } catch (apiErr) {
      console.error("Gemini Song Generation error:", apiErr);
      return res.json({ versions: createFallbackVersions() });
    }
  } catch (err) {
    console.error("Server generate-song error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses generasi lagu." });
  }
});
app.post("/api/fathom-ask", async (req, res) => {
  try {
    const { question, meetingsContext, scope } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Pertanyaan tidak boleh kosong." });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    const meetingsListText = Array.isArray(meetingsContext) ? meetingsContext.map((m) => `- Judul: "${m.title}", Tanggal: ${m.date || m.fullDate}, Durasi: ${m.durationMins} menit, Peserta: ${(m.participants || []).map((p) => p.name).join(", ")}, Tujuan: "${m.summary?.objective || ""}"`).join("\n") : "Review Kurikulum & Demo AI Maxy Academy, Evaluasi Dashboard Penjualan Pak Budi, Workshop Gemini 3 Engine, Perencanaan Strategis Kuartal 3";
    const systemPrompt = `Kamu adalah "Fathom AI Assistant" (Cross-Meeting Assistant). 
Kamu bertugas menjawab pertanyaan pengguna seolah-olah kamu memiliki akses penuh ke seluruh transkrip dan rekaman rapat.
Lingkup pencarian rapat saat ini: ${scope || "My Calls"}.

Berikut adalah daftar rapat yang tersedia dalam sistem:
${meetingsListText}

Instruksi Jawaban:
1. Jawablah pertanyaan dengan profesional, terstruktur, ringkas, dan sangat informatif.
2. Aculah judul rapat, tanggal, dan peserta spesifik yang relevan dari daftar di atas.
3. Sediakan poin-poin bertanda centang atau nomor jika memberikan daftar tugas/ringkasan.
4. Di akhir jawaban, sertakan pesan kecil dalam tanda kurung: "(Simulasi analisis bertenaga Fathom Gemini AI Engine)".`;
    if (!apiKey) {
      let fallbackAnswer = "";
      const q = question.toLowerCase();
      if (q.includes("summarize") || q.includes("ringkas") || q.includes("minggu ini")) {
        fallbackAnswer = `**Ringkasan Rapat Minggu Ini (Fathom AI):**

\u2022 **Review Kurikulum & Demo AI Maxy Academy (Jun 19):** Nabila & Wahyudi menyetujui fokus pengembangan kurikulum AI yang ringan tanpa over-engineering, serta menambahkan simulator interaktif.
\u2022 **Evaluasi Dashboard Penjualan Pak Budi (Jun 9):** Menetapkan target akuisisi peserta baru naik 20% untuk bootcamp AI Engineer.
\u2022 **Workshop Gemini 3 Engine (Jun 9):** Pelatihan integrasi API server-side aman untuk menyembunyikan API key.
\u2022 **Perencanaan Strategis Q3 (Jun 3):** Penetapan milestone sertifikasi kompetensi otomatis.

*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      } else if (q.includes("urgent") || q.includes("mendesak") || q.includes("penting")) {
        fallbackAnswer = `**Hal-Hal Mendesak yang Disebutkan Baru-Baru Ini:**

1. \u26A0\uFE0F **Distribusi Survey:** Nabila perlu membuat & mendistribusikan Google Form survey dampak pelatihan segera setelah sesi.
2. \u26A0\uFE0F **Update Dashboard:** Perbarui tampilan dasbor penjualan untuk Pak Budi mengenai daftar panggilan harian dan prospek berisiko.
3. \u26A0\uFE0F **Notetaker Log:** Peringatan audio pada rapat silent session "Sync Tim Pengembang FlowBuddy".

*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      } else if (q.includes("promised") || q.includes("janji") || q.includes("tugas")) {
        fallbackAnswer = `**Komitmen & Janji Tugas Minggu Ini:**

\u2022 **Nabila Maxy:** Kirimkan draf brosur program AI ke Pak Budi & update dasbor penjualan.
\u2022 **Wahyudi Maxy:** Lakukan alignment program pelatihan dengan tim eksekutif (CEO Circle).
\u2022 **Trainer Maxy:** Update file \`.env.example\` di repository utama.

*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      } else {
        fallbackAnswer = `**Hasil Analisis Fathom AI untuk "${question}":**

Berdasarkan data rapat (${scope || "My Calls"}), seluruh aktivitas tim Maxy Academy terpantau berjalan sesuai roadmap. Rapat utama melibatkan Nabila Maxy, Wahyudi Maxy, dan Pak Budi.

*(Simulasi analisis bertenaga Fathom Gemini AI Engine)*`;
      }
      return res.json({ answer: fallbackAnswer });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}

Pertanyaan Pengguna: "${question}"`
    });
    const responseText = response.text || "Tidak ada jawaban dari Fathom AI.";
    return res.json({ answer: responseText });
  } catch (err) {
    console.error("Server fathom-ask error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses pertanyaan Fathom AI." });
  }
});
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
          { topic: "Ringkasan Utama", details: `Peserta rapat mendiskusikan langkah strategis terkait ${title}.` },
          { topic: "Poin Alignment", details: "Seluruh peserta menyepakati pembagian tugas dan penanggung jawab action items." }
        ]
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const prompt = `Kamu adalah Fathom AI Notetaker. Hasilkan JSON object ringkasan rapat untuk judul: "${title}" (Durasi: ${durationMins || 30} menit, Peserta: ${(participants || []).map((p) => p.name || p).join(", ")}).
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
      contents: prompt
    });
    const cleaned = (response.text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return res.json({
      objective: parsed.objective || `Tujuan rapat "${title}"`,
      keyPoints: parsed.keyPoints || []
    });
  } catch (err) {
    console.error("Server fathom-summarize error:", err);
    res.json({
      objective: `Meninjau dan mengeksekusi agenda rapat secara efektif bersama tim.`,
      keyPoints: [
        { topic: "Poin Diskusi", details: "Diskusi berjalan lancar dan seluruh kesepakatan tercatat." }
      ]
    });
  }
});
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
    const systemPrompt = `Kamu adalah Mistral Vibe \u2014 AI Agent mandiri tingkat lanjut untuk tugas-tugas jangka panjang (long-horizon tasks).
${modeInstruction}
${projectCtx}
${appCtx}

PENTING UNTUK ATURAN FORMAT RAW BALASAN:
Jawablah dengan Bahasa Indonesia yang profesional dan lugas.

Susun balasan dengan struktur berikut:
\u26A1 Execution Steps:
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

\u{1F4CC} Hasil Eksekusi Mandiri:
- [Poin Utama 1]
- [Poin Utama 2 / Detail Output]
- [Langkah Tindak Lanjut / Rekomendasi]`;
    if (!apiKey) {
      const steps2 = [
        `Memindai basis pengetahuan terhubung (${projectCtx})`,
        `Menganalisis kebutuhan tugas jangka panjang (${currentMode} Mode)`,
        `Menyusun draf eksekusi mandiri untuk Vibe Agent`
      ];
      const fallbackContent = `[Mistral Vibe Agent - Mode ${currentMode}]

Telah memproses permintaan: "${prompt}"

\u{1F4CC} Hasil Eksekusi Mandiri:
1. Analisis Proyek: Berhasil memproses konteks input "${project || "General"}".
2. Optimasi Mode ${currentMode}: Dihasilkan berdasarkan alur kerja mandiri Vibe Agent.
3. Tindak Lanjut: Langkah terotomasi siap dieksekusi secara berulang.`;
      const fallbackSuggested = `Lanjutkan analisis terinci untuk ${project || "proyek ini"}`;
      return res.json({ steps: steps2, content: fallbackContent, suggestedTask: fallbackSuggested });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const modelName = speedMode === "Reasoning" || speedMode === "Pro Agent" ? "gemini-2.5-pro" : "gemini-2.5-flash";
    let historyText = "";
    if (Array.isArray(history) && history.length > 0) {
      historyText = "\n\nRIWAYAT DISKUSI SEBELUMNYA:\n" + history.slice(-4).map((h) => `${h.role === "user" ? "Pengguna" : "Mistral Vibe"}: ${h.content}`).join("\n");
    }
    const fullPrompt = `${systemPrompt}${historyText}

Pengguna: "${prompt}"

Mistral Vibe:`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt
    });
    const rawText = response.text || "";
    let steps = [];
    let content = rawText;
    if (rawText.includes("\u26A1 Execution Steps:")) {
      const parts = rawText.split("\u{1F4CC} Hasil Eksekusi Mandiri:");
      const stepsPart = parts[0].replace("\u26A1 Execution Steps:", "").trim();
      steps = stepsPart.split("\n").map((s) => s.replace(/^\d+\.\s*/, "").trim()).filter((s) => s.length > 0);
      content = "\u{1F4CC} Hasil Eksekusi Mandiri:\n" + (parts[1] || parts[0]).trim();
    } else {
      steps = [
        `Memindai konteks ${project || "workspace"} (${currentMode} Mode)`,
        `Mengeksekusi alur kerja penalaran long-horizon`,
        `Memvalidasi kelengkapan hasil eksekusi`
      ];
    }
    const suggestedTask = `Analisis lebih dalam konteks ${project || "sistem"} via Vibe`;
    return res.json({ steps, content, suggestedTask });
  } catch (err) {
    console.error("Server mistral-vibe-chat error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan Mistral Vibe Agent." });
  }
});
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
      const fallbackText = `[${name}] Halo! Menerima prompt: "${prompt}"

Berdasarkan Petunjuk System Instruction Gem (${name}):

1. Analisis Otomatis: Memproses data dan konteks input Anda.
2. Evaluasi Peran (${name}): Memastikan seluruh tanggapan sesuai instruksi spesifik.
3. Rekomendasi / Tindak Lanjut: Berikan detail tambahan jika ada poin yang ingin diperdalam.

*(Simulasi respons Gem kustom)*`;
      return res.json({ text: fallbackText });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const selectedModel = mode === "Pro Mendalam" ? "gemini-2.5-pro" : "gemini-2.5-flash";
    let formattedHistory = "";
    if (Array.isArray(history) && history.length > 0) {
      formattedHistory = "\n\nRIWAYAT PERCAKAPAN SEBELUMNYA:\n" + history.slice(-6).map((h) => `${h.sender === "user" ? "Pengguna" : name}: ${h.text}`).join("\n");
    }
    const fullPrompt = `${fullSystemPrompt}${formattedHistory}

Pengguna: "${prompt}"

${name}:`;
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: fullPrompt
    });
    const responseText = response.text || `[${name}] Tidak dapat menghasilkan tanggapan.`;
    return res.json({ text: responseText, gemName: name });
  } catch (err) {
    console.error("Server gemini-gems-chat error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses percakapan Gem AI." });
  }
});
app.post("/api/claude-features-studio", async (req, res) => {
  try {
    const { stage, prompt, context } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (stage === "nav") {
      const systemPrompt = `Kamu adalah Claude 3.7 Sonnet \u2014 asisten AI canggih dari Anthropic.
Berikan balasan yang terstruktur, alami, langsung pada intinya, dan sangat berguna.
Jawab dengan Bahasa Indonesia.`;
      if (!apiKey) {
        return res.json({
          text: `[Claude 3.7 Sonnet]

Terima kasih! Saya telah memproses pesan Anda: "${prompt}".

- **Analisis**: Permintaan telah diproses secara efektif.
- **Konteks**: Modul navigasi Claude siap membantu pekerjaan Anda selanjutnya.`,
          titleSummary: prompt.length > 25 ? prompt.substring(0, 25) + "..." : prompt
        });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const fullPrompt = `${systemPrompt}

Pengguna: "${prompt}"

Claude:`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt
      });
      const text = response.text || "Terima kasih, pesan Anda telah diproses.";
      const summaryPrompt = `Buatkan judul ringkas (2-4 kata) dalam Bahasa Indonesia untuk topik percakapan berikut: "${prompt}". Hanya kembalikan judulnya saja tanpa tanda petik.`;
      const summaryRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: summaryPrompt
      });
      const titleSummary = (summaryRes.text || prompt).trim().replace(/^["']|["']$/g, "");
      return res.json({ text, titleSummary });
    } else if (stage === "artifacts") {
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
        const fallbackCode = `// Generated Code Artifact
export function CustomArtifact() {
  return (
    <div className="p-6 bg-[#18181b] text-amber-400 rounded-2xl border border-amber-500/30">
      <h3 className="font-bold text-lg">\u2728 Artefak: ${prompt}</h3>
      <p className="text-slate-300 text-xs mt-2">Dibuat otomatis oleh Claude Artifacts Engine untuk Maxy Academy.</p>
    </div>
  );
}`;
        return res.json({ title: fallbackTitle, summary: fallbackSummary, code: fallbackCode });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt
      });
      const raw = response.text || "";
      let title = "custom_artifact.tsx";
      let summary = `Berhasil menghasilkan artefak untuk: "${prompt}"`;
      let code = `// ${prompt}
console.log("Artifact created");`;
      if (raw.includes("---SUMMARY---")) {
        const parts = raw.split(/---TITLE---|---CODE---/);
        summary = parts[0].replace("---SUMMARY---", "").trim();
        if (parts[1]) title = parts[1].trim();
        if (parts[2]) code = parts[2].trim();
      } else {
        code = raw;
      }
      return res.json({ title, summary, code });
    } else if (stage === "cowork") {
      const folderCtx = context?.folderName ? `Folder Terhubung: "${context.folderName}"` : "Folder Terhubung: Tidak ada";
      const systemPrompt = `Kamu adalah Claude Cowork Agent \u2014 Agen AI Otonom untuk alur kerja jangka panjang.
${folderCtx}

Pengguna meminta eksekusi tugas otonom: "${prompt}"

Susun keluaran dengan format:
\u26A1 EXECUTION STEPS:
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]
4. [Langkah 4]

\u{1F4CC} HASIL EKSEKUSI COWORK:
[Laporan eksekutif ringkas, temuan utama, dan rekomendasi efisiensi]`;
      if (!apiKey) {
        const steps2 = [
          `Membaca dokumen & konteks ${context?.folderName || "lingkaran kerja"}`,
          `Mengekstrak poin-poin utama dan tindak lanjut`,
          `Menganalisis peluang efisiensi untuk Maxy Academy`,
          `Menyusun ringkasan eksekutif akhir`
        ];
        const content2 = `\u{1F4CC} HASIL EKSEKUSI COWORK:

Tugas: "${prompt}"

1. Ringkasan Eksekutif: Berhasil menganalisis data dalam konteks ${context?.folderName || "kerja"}.
2. Poin Tindak Lanjut: 3 tugas utama telah diidentifikasi dan dijadwalkan.
3. Rekomendasi Efisiensi: Otomatisasi alur kerja rutin dapat menghemat hingga 40% waktu tim.`;
        return res.json({ steps: steps2, content: content2 });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt
      });
      const raw = response.text || "";
      let steps = [];
      let content = raw;
      if (raw.includes("\u26A1 EXECUTION STEPS:")) {
        const parts = raw.split("\u{1F4CC} HASIL EKSEKUSI COWORK:");
        const stepsPart = parts[0].replace("\u26A1 EXECUTION STEPS:", "").trim();
        steps = stepsPart.split("\n").map((s) => s.replace(/^\d+\.\s*/, "").trim()).filter((s) => s.length > 0);
        content = "\u{1F4CC} HASIL EKSEKUSI COWORK:\n" + (parts[1] || parts[0]).trim();
      } else {
        steps = [
          `Memindai konteks tugas (${context?.folderName || "Work Space"})`,
          `Mengeksekusi analisis data otonom`,
          `Menyusun laporan akhir`
        ];
      }
      return res.json({ steps, content });
    } else if (stage === "office") {
      const officeApp = context?.officeApp || "excel";
      const tableContext = context?.tableData ? `Data Tabel Saat Ini:
${JSON.stringify(context.tableData, null, 2)}` : "";
      const systemPrompt = `Kamu adalah Claude Add-in Assistant untuk Microsoft ${officeApp === "excel" ? "Excel" : "PowerPoint"}.
${tableContext}

Instruksi pengguna: "${prompt}"

Berikan bantuan spesifik untuk ${officeApp === "excel" ? "Excel (formula Excel persis, analisis nilai/data, penjelasan ringkas)" : "PowerPoint (struktur slide presentasi terstruktur 3-5 slide)"}.
Jawab dalam Bahasa Indonesia yang profesional dan jelas.`;
      if (!apiKey) {
        let fallbackText = "";
        if (officeApp === "excel") {
          fallbackText = `[Claude for Excel]

Analisis untuk "${prompt}":

\u2022 **Formula Direkomendasikan**:
\`=AVERAGEIF(C2:C100, "Fullstack Web", D2:D100)\`

\u2022 **Ringkasan Data**: Tabel berisi data nilai siswa Maxy Academy. Rata-rata nilai keseluruhan adalah 84.6.
\u2022 **Tindak Lanjut**: Data siap diurutkan berdasarkan status kelulusan.`;
        } else {
          fallbackText = `[Claude for PowerPoint]

Struktur Slide Dihasilkan untuk "${prompt}":

Slide 1: Judul Utama & Sub-judul
Slide 2: Latar Belakang & Tantangan Utama
Slide 3: Solusi & Keunggulan Program Maxy Academy
Slide 4: Metrik Keberhasilan & Timeline`;
        }
        return res.json({ text: fallbackText });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt
      });
      return res.json({ text: response.text || "Bantuan Office berhasil diproses." });
    }
    return res.status(400).json({ error: "Stage tidak valid." });
  } catch (err) {
    console.error("Server claude-features-studio error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan Claude Features Studio." });
  }
});
app.post("/api/kimi-ai-studio", async (req, res) => {
  try {
    const { stage, prompt, mode, project, feature, workTab, workMode, command, code, type } = req.body;
    const reqPrompt = prompt || command || code || "";
    if (!reqPrompt || typeof reqPrompt !== "string" || !reqPrompt.trim()) {
      return res.status(400).json({ error: "Prompt/Command tidak boleh kosong." });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (stage === "chat") {
      const modeText = mode === "Tinggi" ? "Penalaran Mendalam (Thinking Level High)" : "Instan (Quick Response)";
      const projectCtx = project && project !== "Pilih proyek" ? `[Proyek: ${project}] ` : "";
      const featureCtx = feature ? `[Mode Fitur: ${feature}] ` : "";
      const systemPrompt = `Kamu adalah Kimi K2.5 \u2014 Asisten AI Canggih dari Moonshot AI.
${projectCtx}${featureCtx}[Level Penalaran: ${modeText}]
Jawab pertanyaan pengguna dengan jelas, cepat, akurat, dan dalam Bahasa Indonesia.`;
      if (!apiKey) {
        return res.json({
          text: `[Kimi K2.5 ${mode || "Instan"}]

Terima kasih atas pertanyaannya: "${reqPrompt}".

- **Proyek**: ${project || "Umum"}
- **Fitur Aktif**: ${feature || "Chat Standard"}
- **Analisis Kimi**: Pertanyaan Anda telah berhasil dianalisis dengan keakuratan tinggi.`,
          titleSummary: reqPrompt.length > 25 ? reqPrompt.substring(0, 25) + "..." : reqPrompt
        });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const fullPrompt = `${systemPrompt}

Pengguna: "${reqPrompt}"

Kimi:`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt
      });
      const text = response.text || "Terima kasih, pesan telah diproses.";
      const summaryPrompt = `Buatkan judul ringkas (2-4 kata) dalam Bahasa Indonesia untuk topik berikut: "${reqPrompt}". Hanya kembalikan judulnya tanpa tanda petik.`;
      const summaryRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: summaryPrompt
      });
      const titleSummary = (summaryRes.text || reqPrompt).trim().replace(/^["']|["']$/g, "");
      return res.json({ text, titleSummary });
    } else if (stage === "work") {
      const isWorkMode = workTab === "Work";
      const systemPrompt = isWorkMode ? `Kamu adalah agen otonom Kimi Work dari Moonshot AI yang menyelesaikan tugas multi-langkah.
Mode: ${workMode || "Agent"}
Proyek: ${project || "Definisikan"}
Tugas Pengguna: "${reqPrompt}"

Format keluaran:
---STEPS---
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]
---RESULT---
[Laporan eksekusi agen Kimi Work dalam Bahasa Indonesia]` : `Kamu adalah Kimi Assistant dalam mode percakapan biasa Kimi Work. Jawab dengan ringkas dalam Bahasa Indonesia.`;
      if (!apiKey) {
        const steps2 = [
          `Menganalisis instruksi tugas "${reqPrompt.substring(0, 30)}..."`,
          `Mengeksekusi pencarian & pemrosesan via WebBridge`,
          `Menyusun dokumen & output akhir ke workspace`
        ];
        const content2 = `[Kimi Work Agent Execution]

Tugas: "${reqPrompt}"

\u2022 **Status**: Selesai 100%
\u2022 **Hasil**: Agen Kimi Work berhasil menyelesaikan analisis multi-langkah dan menyimpan data pendukung secara teratur.`;
        return res.json({ steps: steps2, content: content2 });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt
      });
      const raw = response.text || "";
      let steps = [];
      let content = raw;
      if (raw.includes("---STEPS---")) {
        const parts = raw.split("---RESULT---");
        const stepsPart = parts[0].replace("---STEPS---", "").trim();
        steps = stepsPart.split("\n").map((s) => s.replace(/^\d+\.\s*/, "").trim()).filter((s) => s.length > 0);
        content = (parts[1] || parts[0]).trim();
      } else {
        steps = [
          `Menganalisis instruksi tugas: "${reqPrompt}"`,
          `Mengeksekusi langkah otomatisasi`,
          `Menyelesaikan laporan tugas Kimi Work`
        ];
      }
      return res.json({ steps, content });
    } else if (stage === "code") {
      const isCli = type === "cli";
      const systemPrompt = isCli ? `Kamu adalah Kimi Code CLI (Model K2.7 Code) \u2014 asisten CLI terminal untuk software engineering.
Perintah pengguna: "${reqPrompt}"

Berikan balasan seolah-olah output terminal CLI sungguhan (bersih, informatif, monospaced style, dengan simbol prompt 'moonshot@KimiCode \u{1F680}'). Jawab ringkas dalam Bahasa Indonesia/Inggris teknis.` : `Kamu adalah Kimi Code IDE Assistant.
Kode/Instruksi pengguna: "${reqPrompt}"

Berikan penjelasan ringkas, analisis sintaks, dan saran perbaikan kode dalam Bahasa Indonesia.`;
      if (!apiKey) {
        const fallbackOutput = isCli ? `moonshot@KimiCode \u{1F680} ${reqPrompt}
Executing command '${reqPrompt}'...
\u2713 Operation completed successfully. No syntax or type errors found.` : `[Kimi Code IDE]

Analisis Kode:
\u2022 Kode berjalan dengan baik.
\u2022 Rekomendasi: Gunakan memoization jika komponen ini sering dirender ulang.`;
        return res.json({ output: fallbackOutput });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt
      });
      return res.json({ output: response.text || "Output Kimi Code diproses." });
    } else if (stage === "claw") {
      const systemPrompt = `Kamu adalah OpenClaw \u2014 asisten AI otonom pribadi dengan kepribadian ramah, suportif, dan memori jangka panjang, dikonfigurasi dengan Kimi K2.6 Thinking.
Pengguna menyapa/mengirim pesan: "${reqPrompt}"

Berikan tanggapan yang hangat, cerdas, dan siap membantu dalam Bahasa Indonesia.`;
      if (!apiKey) {
        return res.json({
          text: `[OpenClaw Agent K2.6 Thinking]

Halo! Saya OpenClaw, asisten AI pribadi Anda yang berjalan 24/7. Saya telah mengingat konteks Anda: "${reqPrompt}". Ada yang bisa saya bantu hari ini?`
        });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt
      });
      return res.json({ text: response.text || "OpenClaw siap membantu." });
    }
    return res.status(400).json({ error: "Stage tidak valid." });
  } catch (err) {
    console.error("Server kimi-ai-studio error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan Kimi AI Studio." });
  }
});
app.post("/api/gemini-playground", async (req, res) => {
  try {
    const { prompt, model, systemInstruction, temperature, thinkingLevel, tools, mode } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (mode === "image_gen") {
      if (!apiKey) {
        const encoded = encodeURIComponent(prompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1e5)}&nologo=true`;
        return res.json({
          text: `Gambar berhasil diproses berdasarkan prompt: "${prompt}"`,
          imageUrl: fallbackUrl,
          modelUsed: "Imagen 3 (Fallback)"
        });
      }
      const ai2 = new import_genai.GoogleGenAI({ apiKey });
      try {
        const response2 = await ai2.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: prompt.trim(),
          config: {
            numberOfImages: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg"
          }
        });
        if (response2.generatedImages?.[0]?.image?.imageBytes) {
          return res.json({
            text: `Gambar berhasil dibuat menggunakan Imagen 3 untuk prompt: "${prompt}"`,
            imageUrl: `data:image/jpeg;base64,${response2.generatedImages[0].image.imageBytes}`,
            modelUsed: "Imagen 3.0"
          });
        }
      } catch (imgErr) {
        console.error("Imagen playground error:", imgErr);
        const encoded = encodeURIComponent(prompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1e5)}&nologo=true`;
        return res.json({
          text: `Gambar berhasil dibuat berdasarkan prompt: "${prompt}"`,
          imageUrl: fallbackUrl,
          modelUsed: "Imagen 3 (Fallback)"
        });
      }
    }
    let targetModel = "gemini-2.5-flash";
    if (model === "gemini-3-pro") {
      targetModel = "gemini-2.5-pro";
    } else if (model === "gemini-2.5-flash") {
      targetModel = "gemini-2.5-flash";
    }
    if (!apiKey) {
      const sysInfo = systemInstruction ? `
[System Instructions Active: "${systemInstruction}"]` : "";
      const modeInfo = mode ? ` [Mode: ${mode}]` : "";
      const toolsInfo = tools ? Object.entries(tools).filter(([, v]) => v).map(([k]) => k).join(", ") : "None";
      const fallbackText = `### Hasil Generasi Gemini 3 (${targetModel})${modeInfo}
${sysInfo}

**Prompt:** "${prompt}"

**Parameter Dipakai:**
- Model: \`${targetModel}\`
- Temperature: \`${temperature ?? 1}\`
- Thinking Level: \`${thinkingLevel ?? "High"}\`
- Active Tools: \`${toolsInfo || "Default"}\`

---

### Analisis AI Studio:
1. **Logika & Struktur:** Mengolah instruksi pengguna dengan pola pemikiran ${thinkingLevel || "High"} level.
2. **Rekomendasi Arsitektur:**
   - Komponen UI React TypeScript modular.
   - State management terintegrasi dengan penanganan event cepat.
   - Desain responsif Tailwind CSS.

\`\`\`typescript
// Contoh Kode Generasi AI Studio
export const GeneratedComponent = () => {
  // Model: ${targetModel} | Temperature: ${temperature}
  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl">
      <h2>${prompt.slice(0, 40)}...</h2>
    </div>
  );
};
\`\`\``;
      return res.json({
        text: fallbackText,
        modelUsed: `${targetModel} (Interactive Simulation)`,
        groundingSources: tools?.groundingSearch ? [{ title: "Google Search Result", url: "https://google.com", snippet: `Informasi terkini tentang ${prompt}` }] : void 0
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const toolsList = [];
    if (tools?.groundingSearch) {
      toolsList.push({ googleSearch: {} });
    }
    if (tools?.codeExecution) {
      toolsList.push({ codeExecution: {} });
    }
    let sysPrompt = systemInstruction?.trim() || "";
    if (thinkingLevel) {
      sysPrompt += `
[Catatan Internal: Lakukan penalaran dan analisis dengan kedalaman level ${thinkingLevel}]`;
    }
    const configObj = {
      temperature: typeof temperature === "number" ? temperature : 1
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
      config: configObj
    });
    const responseText = response.text || "Tidak ada respons dari model.";
    let groundingSources = [];
    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(searchChunks)) {
      groundingSources = searchChunks.map((c) => c?.web?.uri ? { title: c.web.title || c.web.uri, url: c.web.uri, snippet: c.web.snippet || "" } : null).filter(Boolean);
    }
    return res.json({
      text: responseText,
      modelUsed: targetModel,
      groundingSources: groundingSources.length > 0 ? groundingSources : void 0
    });
  } catch (err) {
    console.error("Server gemini-playground error:", err);
    res.status(500).json({ error: err.message || "Terjadi kesalahan saat memproses request di Playground." });
  }
});
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
      baseSysInstruction += `
[Tools Aktif: ${activeTools.join(", ")}. Gunakan fitur ini untuk melengkapi jawaban Anda secara komprehensif.]`;
    }
    let geminiModel = "gemini-2.5-flash";
    if (model === "Lumo 2.0 Max") {
      geminiModel = "gemini-2.5-flash";
    } else if (model === "Lumo 2.0 Flash") {
      geminiModel = "gemini-2.5-flash";
    } else if (model === "Lumo 1.5 Privacy") {
      geminiModel = "gemini-2.5-flash";
    }
    if (!apiKey) {
      const toolText = activeTools && activeTools.length > 0 ? `

*Tools yang digunakan: ${activeTools.join(", ")}*` : "";
      const privacyText = privacyMode ? "\n\n\u{1F512} *Percakapan ini berjalan dalam Mode Privasi Incognito Proton (tanpa histori tersimpan).*" : "";
      const simulatedText = `[Lumo ${model || "2.0 Max"}] Halo! Terima kasih telah menggunakan Lumo AI oleh Proton.

Berdasarkan pertanyaan Anda: "${prompt}"

Sebagai asisten AI berfokus privasi, data dan pesan Anda dilindungi dengan standar keamanan tinggi.${privacyText}${toolText}

Berikut solusi dan tanggapan terstruktur:
1. **Keamanan & Enkripsi**: Lumo memproses setiap permintaan Anda dengan perlindungan privasi bawaan dari Proton.
2. **Analisis Pertanyaan**: Kami merekomendasikan pendekatan sistematis dan efisien untuk menyelesaikan tugas Anda.
3. **Langkah Lanjutan**: Anda dapat terus berdiskusi atau mengaktifkan tools tambahan seperti Web Search atau Code Interpreter kapan saja.`;
      return res.json({
        text: simulatedText,
        modelUsed: `Lumo ${model || "2.0 Max"} (Simulasi Offline)`
      });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg) => {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "lumo" || msg.sender === "ai") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        });
      }
      contents.push({ role: "user", parts: [{ text: prompt.trim() }] });
      const toolsConfig = [];
      if (Array.isArray(activeTools)) {
        if (activeTools.includes("Web Search")) {
          toolsConfig.push({ googleSearch: {} });
        }
        if (activeTools.includes("Code Interpreter")) {
          toolsConfig.push({ codeExecution: {} });
        }
      }
      const config = {
        systemInstruction: baseSysInstruction,
        temperature: 0.7
      };
      if (toolsConfig.length > 0) {
        config.tools = toolsConfig;
      }
      const response = await ai.models.generateContent({
        model: geminiModel,
        contents,
        config
      });
      const responseText = response.text || "Lumo tidak memberikan respon. Silakan coba lagi.";
      return res.json({
        text: responseText,
        modelUsed: `Lumo (${model || "2.0 Max"})`
      });
    } catch (genErr) {
      console.warn("Lumo AI API call failed, falling back to simulated response:", genErr?.message || genErr);
      const toolText = activeTools && activeTools.length > 0 ? `

*Tools yang digunakan: ${activeTools.join(", ")}*` : "";
      const privacyText = privacyMode ? "\n\n\u{1F512} *Percakapan ini berjalan dalam Mode Privasi Incognito Proton (tanpa histori tersimpan).*" : "";
      let simulatedText = `[Lumo ${model || "2.0 Max"}] Halo! Terima kasih telah menggunakan Lumo AI oleh Proton.

`;
      const lower = prompt.toLowerCase();
      if (lower.includes("halo") || lower.includes("hai") || lower.includes("pagi") || lower.includes("siang") || lower.includes("malam")) {
        simulatedText += `Halo! Ada yang bisa Lumo bantu hari ini? Percakapan Anda dilindungi oleh arsitektur zero-knowledge Proton.${privacyText}${toolText}`;
      } else {
        simulatedText += `Berdasarkan pertanyaan Anda: "${prompt}"

Sebagai asisten AI berfokus privasi, data dan pesan Anda dilindungi dengan standar enkripsi Proton.${privacyText}${toolText}

Berikut solusi terstruktur untuk Anda:
1. **Analisis Pertanyaan**: Kami siap memproses pertanyaan Anda secara privat tanpa pelacakan identitas.
2. **Langkah Kerja**: Anda dapat memanfaatkan mode Incognito atau memilih tools Web Search / Code Interpreter sesuai kebutuhan.
3. **Eksplorasi**: Silakan ajukan pertanyaan lanjutan atau pilih menu di sidebar untuk fitur lainnya.`;
      }
      return res.json({
        text: simulatedText,
        modelUsed: `Lumo ${model || "2.0 Max"} (Simulasi Zero-Knowledge)`
      });
    }
  } catch (err) {
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
app.post("/api/lovable-ai", async (req, res) => {
  try {
    const { prompt, mode, history } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Deskripsi atau pertanyaan tidak boleh kosong." });
    }
    const isBuildMode = mode !== "Chat" && mode !== "Tanya";
    let sysInstruction = isBuildMode ? "Anda adalah Lovable, AI builder yang membuat aplikasi web dan halaman arahan (landing page) dari deskripsi teks, hasilkan kode React + Tailwind yang siap pakai. Tuliskan penjelasan ringkas diikuti oleh kode JSX / React + Tailwind CSS yang lengkap, modern, dan estetis di dalam blok kode ```jsx ... ```." : "Anda adalah Lovable, AI assistant yang membantu pembuat aplikasi dalam mematangkan ide, merancang arsitektur UI/UX, dan brainstorming konsep halaman arahan sebelum menghasilkan kode. Jawab dengan terstruktur, ringkas, dan mudah dipahami dalam Bahasa Indonesia.";
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const sampleComponent = isBuildMode ? `import React, { useState } from 'react';
import { Sparkles, Rocket, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

export default function GeneratedLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-20 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Dibuat Secara Instan oleh Lovable AI
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
          ${prompt.trim()}
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Solusi modern terintegrasi yang dirancang untuk mempercepat alur kerja Anda dengan performa tinggi dan tampilan memukau.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer">
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm transition-all cursor-pointer">
            Pelajari Fitur
          </button>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Performa Super Cepat</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Dioptimalkan untuk kecepatan pemuatan halaman dan responsivitas terbaik di seluruh perangkat.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Keamanan Terjamin</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Perlindungan data tingkat tinggi dengan arsitektur modern yang aman secara bawaan.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Desain Estetis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Komponen UI yang bersih dengan hirarki visual profesional sesuai standar desain terbaru.</p>
        </div>
      </section>
    </div>
  );
}` : `Langkah Brainstorming Ide untuk: "${prompt.trim()}":

1. **Target Audiens & Value Proposition**: Tentukan masalah utama yang diselesaikan dan solusi unik dari produk Anda.
2. **Struktur Halaman Utama**:
   - **Hero Section**: Headline kuat, sub-headline penjelas, dan tombol panggil aksi (CTA).
   - **Social Proof / Testimoni**: Kepercayaan pelanggan awal atau statistik pencapaian.
   - **Fitur Unggulan**: 3-4 kartu fitur utama dengan ikon visual yang jelas.
   - **Penawaran / Harga**: Tabel perbandingan paket langganan.
   - **Footer & CTA Akhir**: Kontak dan formulir pendaftaran cepat.
3. **Rekomendasi Warna & Tipografi**: Skema warna gelap kontras tinggi (Slate-950 dengan aksen Purple/Pink gradient) untuk kesan modern dan premium.`;
      const responseText = isBuildMode ? `Berikut adalah komponen React + Tailwind CSS yang telah dihasilkan oleh Lovable AI berdasarkan permintaan Anda:

\`\`\`jsx
${sampleComponent}
\`\`\`` : sampleComponent;
      return res.json({
        text: responseText,
        codeSnippet: isBuildMode ? sampleComponent : "",
        modeUsed: isBuildMode ? "Bangun" : "Chat"
      });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg) => {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "lovable" || msg.sender === "ai" || msg.sender === "model") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        });
      }
      contents.push({ role: "user", parts: [{ text: prompt.trim() }] });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7
        }
      });
      const text = response.text || "Lovable AI telah memproses permintaan Anda.";
      let codeSnippet = "";
      const codeBlockMatch = text.match(/```(?:jsx|tsx|html|js|javascript)?\n([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        codeSnippet = codeBlockMatch[1].trim();
      }
      return res.json({
        text,
        codeSnippet,
        modeUsed: isBuildMode ? "Bangun" : "Chat"
      });
    } catch (genErr) {
      console.warn("Lovable API call failed, using fallback response:", genErr?.message || genErr);
      const sampleComponent = `import React from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-8 flex flex-col items-center justify-center text-center">
      <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 mb-4 inline-flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-400" /> Landing Page Tergenerasi Instan oleh Lovable
      </div>
      <h1 className="text-4xl font-extrabold text-white max-w-2xl mb-4 leading-tight">
        ${prompt.trim()}
      </h1>
      <p className="text-slate-400 max-w-lg mb-8 text-sm leading-relaxed">
        Dioptimalkan secara penuh dengan React & Tailwind CSS untuk responsivitas maksimal di desktop dan ponsel.
      </p>
      <button className="px-6 py-3 rounded-xl bg-[#6149f6] hover:bg-[#523be3] text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer">
        Mulai Penggunaan <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}`;
      const responseText = isBuildMode ? `Berikut adalah draf aplikasi React + Tailwind CSS yang siap pakai berdasarkan deskripsi Anda:

\`\`\`jsx
${sampleComponent}
\`\`\`` : `Saran Arsitektur & Ide Aplikasi untuk "${prompt.trim()}":

1. **Desain Tampilan**: Gunakan tema gelap modern dengan gradien aksen ungu dan merah muda.
2. **Komponen Utama**: Hero section dengan CTA jelas, grid fitur interaktif, dan statistik indikator pencapaian.
3. **Pengalaman Pengguna**: Pemuatan halaman cepat dengan animasi mikro saat tombol di-hover.`;
      return res.json({
        text: responseText,
        codeSnippet: isBuildMode ? sampleComponent : "",
        modeUsed: isBuildMode ? "Bangun" : "Chat"
      });
    }
  } catch (err) {
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
app.post("/api/gamma-ai", async (req, res) => {
  try {
    const { prompt, notesText, fileName, useCase, createOption, history, isRevision } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt tidak boleh kosong." });
    }
    const trimmedPrompt = prompt.trim();
    const lowerPrompt = trimmedPrompt.toLowerCase();
    const needsSourceMaterial = lowerPrompt.includes("catatan") || lowerPrompt.includes("notula") || lowerPrompt.includes("rapat") || lowerPrompt.includes("meeting") || lowerPrompt.includes("dokumen") || lowerPrompt.includes("file");
    const hasNotesOrFile = Boolean(
      notesText && typeof notesText === "string" && notesText.trim().length > 0 || fileName && typeof fileName === "string" && fileName.trim().length > 0
    );
    const apiKey = process.env.GEMINI_API_KEY;
    if (needsSourceMaterial && !hasNotesOrFile && !isRevision && (!history || history.length === 0)) {
      const askForNotesResponse = `Saya siap membantu! Untuk membuat presentasi dari catatan rapat Anda, saya perlu melihat catatan tersebut terlebih dahulu.

Bisa Anda:
1. **Paste catatan rapat langsung di sini**, atau
2. **Upload file** yang berisi catatan rapat (PDF, Word, atau format lainnya)

Setelah saya melihat isinya, saya akan mengubahnya menjadi presentasi ringkas yang membantu tim Anda menyelaraskan langkah dan mengidentifikasi pemilik berikutnya.`;
      return res.json({
        text: askForNotesResponse,
        needsNotes: true,
        presentationData: null
      });
    }
    const sysInstruction = `Anda adalah Gamma Agent, asisten AI yang mengubah ide, catatan, dan file menjadi presentasi, dokumen, atau unggahan sosial melalui riset dan penyusunan narasi terstruktur. Tanggapi dalam Bahasa Indonesia yang profesional, jelas, dan terstruktur rapi. Jika membuat presentasi, sertakan judul slide, subjudul, dan poin-poin narasi utama untuk setiap slide.`;
    let userMessageToModel = trimmedPrompt;
    if (notesText && notesText.trim()) {
      userMessageToModel += `

[Lampiran Catatan / Teks]:
${notesText.trim()}`;
    }
    if (fileName) {
      userMessageToModel += `

[Nama File Dilampirkan]: ${fileName}`;
    }
    if (useCase) {
      userMessageToModel += `

[Konteks Use Case]: ${useCase}`;
    }
    if (!apiKey) {
      let simulatedText = "";
      if (isRevision) {
        simulatedText = `Tentu! Saya telah memperbarui draf presentasi berdasarkan instruksi Anda: "${trimmedPrompt}".

### \u{1F4CA} Hasil Pembaharuan Slide Presentasi Gamma Agent

**Slide 1: Ringkasan Eksekutif & Tujuan Rapat**
- Penyelarasan langkah strategis tim untuk kuartal berikutnya.
- Penetapan indikator keberhasilan (KPI) dan tenggat waktu utama.

**Slide 2: Poin Keputusan & Pembagian Penanggung Jawab**
- Tim Produk: Penyelesaian modul antarmuka utama.
- Tim Pemasaran: Peluncuran kampanye media sosial & onboarding pelanggan.

**Slide 3: Langkah Tindak Lanjut & Jadwal Evaluasi (Revisi)**
- Evaluasi mingguan setiap hari Senin pukul 09.00 WIB.
- Pelaporan progres langsung melalui dashboard terintegrasi.`;
      } else {
        simulatedText = `Berikut adalah draf presentasi terstruktur yang dikembangkan oleh Gamma Agent berdasarkan materi Anda:

### \u{1F680} Presentasi Ringkas: Penyelarasan Langkah & Penanggung Jawab Tim

**Slide 1: Pengantar & Latar Belakang**
*Judul*: Penyelarasan Strategi & Eksekusi Tim
- Mengidentifikasi tantangan utama dan sasaran bersama.
- Menegaskan komitmen tim dalam mencapai target operasional.

**Slide 2: Evaluasi & Catatan Kunci Rapat**
*Judul*: Ringkasan Hasil Diskusi Tim
- Poin 1: Optimalisasi alur kerja internal untuk efisiensi maksimal.
- Poin 2: Alokasi sumber daya pada proyek berdampak tinggi.

**Slide 3: Rencana Aksi & Penanggung Jawab (Action Plan)**
*Judul*: Pemilik Tugas & Langkah Berikutnya
- [Langkah 1]: Penyusunan dokumentasi teknis (PIC: Tim Dev/Produk)
- [Langkah 2]: Sosialisasi ke seluruh pemangku kepentingan (PIC: Tim Komunikasi)

**Slide 4: Penutup & Komitmen Tim**
*Judul*: Kesimpulan & Tenggat Waktu
- Evaluasi berkala untuk memastikan konsistensi hasil.`;
      }
      return res.json({
        text: simulatedText,
        needsNotes: false
      });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg) => {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "agent" || msg.sender === "ai" || msg.sender === "model") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        });
      }
      contents.push({ role: "user", parts: [{ text: userMessageToModel }] });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7
        }
      });
      const responseText = response.text || "Gamma Agent telah memproses instruksi Anda.";
      return res.json({
        text: responseText,
        needsNotes: false
      });
    } catch (genErr) {
      console.warn("Gamma API call failed, using fallback:", genErr?.message || genErr);
      const fallbackText = `Berikut adalah draf presentasi yang disiapkan oleh Gamma Agent untuk Anda:

**Slide 1: Ringkasan Rapat & Tujuan**
- Penyelarasan sasaran strategis dan alur kerja tim.

**Slide 2: Langkah Konkrit & Penanggung Jawab**
- Identifikasi tugas utama dan jadwal penyelesaian.

**Slide 3: Penutup & Evaluasi**
- Langkah monitoring berkelanjutan.`;
      return res.json({
        text: fallbackText,
        needsNotes: false
      });
    }
  } catch (err) {
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
app.post("/api/manus-ai", async (req, res) => {
  try {
    const { prompt, taskType, fileName, history } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Instruksi tugas tidak boleh kosong." });
    }
    const trimmedPrompt = prompt.trim();
    const activeTaskType = taskType || "General Task";
    const apiKey = process.env.GEMINI_API_KEY;
    const sysInstruction = `Anda adalah Manus, AI agent otonom yang bisa menyelesaikan tugas kompleks (membuat slide, website, desain, game, analisis data, laporan, otomatisasi) melalui eksekusi bertahap. Tugas saat ini berkategori: [${activeTaskType}].
Berikan hasil akhir yang sangat terstruktur, profesional, dan langsung dapat digunakan dalam Bahasa Indonesia.
- Jika task "Create slides": Berikan struktur slide per bagian (Slide 1, Slide 2, dst) beserta poin narasi utama dan petunjuk visual.
- Jika task "Build website": Berikan kerangka kode HTML/React + Tailwind CSS dan arsitektur komponen.
- Jika task "Design": Berikan panduan desain UI/UX, skema warna HSL/HEX, tipografi, dan spesifikasi komponen.
- Jika task "Create games": Berikan logika game loop, struktur HTML5 Canvas, kontrol pemain, dan aturan permainan.
- Untuk jenis task lainnya: Berikan ringkasan eksekutif, langkah aksi, dan hasil yang siap dipublikasikan.`;
    let userMessageToModel = `[Tipe Tugas]: ${activeTaskType}
[Instruksi User]: ${trimmedPrompt}`;
    if (fileName) {
      userMessageToModel += `
[Materi/File Terlampir]: ${fileName}`;
    }
    if (!apiKey) {
      let simulatedOutput = "";
      if (activeTaskType === "Create slides") {
        simulatedOutput = `# \u{1F4CA} Outline Presentasi Slide - Manus Autonomous Agent

**Topik**: ${trimmedPrompt}

### Slide 1: Judul & Ringkasan Eksekutif
- **Judul Utama**: Strategi & Inovasi Utama
- **Sub-judul**: Menyelaraskan Sasaran & Eksekusi Otonom
- **Panduan Visual**: Latar belakang dark slate dengan aksen neon purple, ikon vektor minimalis.

### Slide 2: Latar Belakang & Analisis Masalah
- Tantangan efisiensi dalam operasional sehari-hari.
- Kebutuhan akan solusi otomatisasi agen AI serbaguna.

### Slide 3: Rencana Aksi Bertahap (Roadmap)
- **Fase 1**: Perencanaan & Integrasi
- **Fase 2**: Peluncuran & Evaluasi Performa
- **Fase 3**: Skalabilitas Enterprise

### Slide 4: Kesimpulan & Penutup
- **Key Takeaway**: Peningkatan efisiensi hingga 80% dengan AI Agent.`;
      } else if (activeTaskType === "Build website") {
        simulatedOutput = `# \u{1F310} Kerangka Aplikasi Web Interaktif - Manus Web Builder

Berikut adalah arsitektur komponen dan kode React + Tailwind CSS untuk: **${trimmedPrompt}**

\`\`\`tsx
import React, { useState } from 'react';

export const GeneratedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Manus Generated Portal
        </h1>
        <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm shadow-lg shadow-purple-600/30">
          Get Started
        </button>
      </header>
      <main className="max-w-6xl mx-auto py-12 space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h2 className="text-3xl font-bold">Aplikasi Web Beroperasi Sempurna</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Dibangun secara otonom oleh Manus AI Agent sesuai spesifikasi Anda.
          </p>
        </div>
      </main>
    </div>
  );
};
\`\`\``;
      } else if (activeTaskType === "Design") {
        simulatedOutput = `# \u{1F3A8} Panduan & Spesifikasi Desain UI/UX - Manus Design Studio

**Konsep Visual**: ${trimmedPrompt}

### 1. Palet Warna
- **Primary Color**: \`#6366f1\` (Indigo 500) - Memberikan kesan modern dan terpercaya.
- **Accent Color**: \`#ec4899\` (Pink 500) - Untuk tombol panggilan aksi (CTA).
- **Background Dark**: \`#0f172a\` (Slate 900) - Kedalaman visual yang nyaman di mata.
- **Text Neutral**: \`#f8fafc\` (Slate 50) - Kontras tinggi (WCAG AAA).

### 2. Tipografi
- **Heading**: Plus Jakarta Sans (Weight: 800 ExtraBold, Tracking: Tight)
- **Body**: Inter / System UI (Weight: 400 Regular, Line Height: 1.6)

### 3. Komponen UI Utama
- **Card Radius**: \`24px\` (Rounded-3XL) dengan border \`1px solid rgba(255,255,255,0.1)\`.
- **Shadows**: Soft glow blur \`0 20px 25px -5px rgba(99, 102, 241, 0.15)\`.`;
      } else if (activeTaskType === "Create games") {
        simulatedOutput = `# \u{1F3AE} Logika Game Canvas Web - Manus Game Engine

Berikut adalah skrip game loop HTML5 Canvas untuk: **${trimmedPrompt}**

\`\`\`javascript
// Manus HTML5 Game Loop Engine
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 200, y: 300, size: 24, speed: 5, color: '#a855f7' };
let score = 0;

function update() {
  // Game physics and collision checks
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText(\`Score: \${score}\`, 20, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
\`\`\``;
      } else {
        simulatedOutput = `# \u26A1 Hasil Eksekusi Tugas Otonom - Manus Agent

**Permintaan**: ${trimmedPrompt}

### \u{1F4CC} Ringkasan Hasil
Manus Agent telah menyelesaikan tugas Anda secara lengkap dengan analisis mendalam.

### \u{1F680} Langkah Strategis & Rekomendasi
1. **Optimalisasi Alur Kerja**: Terapkan otomatisasi pada poin-poin krusial.
2. **Monitoring Berkelanjutan**: Evaluasi performa secara berkala.
3. **Skalabilitas**: Siapkan dokumentasi untuk ekspansi tim.`;
      }
      return res.json({
        resultText: simulatedOutput,
        taskType: activeTaskType
      });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg) => {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "agent" || msg.sender === "ai" || msg.sender === "model") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        });
      }
      contents.push({ role: "user", parts: [{ text: userMessageToModel }] });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7
        }
      });
      const responseText = response.text || "Manus AI Agent telah menyelesaikan tugas Anda.";
      return res.json({
        resultText: responseText,
        taskType: activeTaskType
      });
    } catch (genErr) {
      console.warn("Manus API call failed, using fallback:", genErr?.message || genErr);
      const fallbackText = `# \u26A1 Hasil Eksekusi Tugas - Manus Agent

**Permintaan**: ${trimmedPrompt}

Manus Agent telah merancang dan memproses solusi bertahap untuk tugas Anda. Semua komponen telah diverifikasi.`;
      return res.json({
        resultText: fallbackText,
        taskType: activeTaskType
      });
    }
  } catch (err) {
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
      userPrompt = `[Instruksi Edit]: ${activeInstruction}
[Teks Asli]: "${selectedText || ""}"`;
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
      let resultText = "";
      if (mode === "builder") {
        resultText = `# \u{1F4CA} Marketing Team Members Database

Berikut adalah skema database Notion yang dibuat berdasarkan deskripsi Anda:

| Name | Role | Birthday | Office | Hobbies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Sarah Jenkins | Lead Marketer | 14 March 1994 | San Francisco | Photography, Hiking | Active |
| Alex Rivera | Content Specialist | 22 July 1996 | New York | Mechanical Keyboards, Gaming | Active |
| Maya Lin | Growth Analyst | 05 November 1992 | London | Specialty Coffee, Bouldering | On Leave |
| David Chen | Designer | 18 January 1995 | Tokyo | Film Photography, Cooking | Active |

### \u{1F4A1} Recommended Views:
- **Gallery View**: Ditampilkan berdasarkan foto profil & hobbies
- **Board View**: Dikompatemenkan berdasarkan Kantor (Office)
- **Calendar View**: Untuk melacak Ulang Tahun tim bulan ini`;
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
        resultText = `Notion AI (${feature || "Assistant"}): Saya telah memproses permintaan Anda "${userPrompt}". Siap membantu mengelola workspace dan dokumen Anda!`;
      }
      return res.json({ resultText });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((msg) => {
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
          temperature: 0.7
        }
      });
      const responseText = response.text || "Notion AI telah menyelesaikan permintaan Anda.";
      return res.json({ resultText: responseText });
    } catch (genErr) {
      console.warn("Notion AI Gemini call failed, fallback used:", genErr?.message || genErr);
      return res.json({
        resultText: `Hasil olahan Notion AI untuk: "${userPrompt.slice(0, 50)}..."`
      });
    }
  } catch (err) {
    console.error("Server notion-ai error:", err);
    res.status(500).json({ error: err.message || "Gagal menghubungkan ke Notion AI." });
  }
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Navigator server listening on http://0.0.0.0:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
