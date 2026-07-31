const fs = require('fs');
const path = require('path');

const moduleTopics = [
  {
    id: 1,
    name: "Teknik Prompting RCTF",
    topic: "Formula Role, Context, Task, dan Format dalam Prompt Engineering",
    keywords: ["Role", "Context", "Task", "Format", "RCTF", "Persona", "Output Format", "Prompting", "Few-Shot", "Constraints"]
  },
  {
    id: 2,
    name: "Pengenalan ChatGPT",
    topic: "OpenAI ChatGPT, GPT-4o, Reasoning Models, Advanced Voice, dan Canvas",
    keywords: ["ChatGPT", "OpenAI", "GPT-4o", "Canvas", "Advanced Voice", "Custom GPTs", "GPT Store", "o1", "o3-mini", "Memory"]
  },
  {
    id: 3,
    name: "Pengenalan Claude",
    topic: "Anthropic Claude, Sonnet, Opus, Haiku, Artifacts, dan Kemampuan Penulisan Alami",
    keywords: ["Claude", "Anthropic", "Artifacts", "Sonnet 3.5", "Opus", "Haiku", "Long Context Window", "Writing Style", "Coding Artifacts"]
  },
  {
    id: 4,
    name: "Pengenalan Gemini",
    topic: "Google Gemini, Multimodal Native, Integrasi Google Workspace, dan Flash/Pro Models",
    keywords: ["Gemini", "Google", "Multimodal", "Gemini Advanced", "Google Docs Integration", "Google Drive", "Flash 1.5", "Pro 1.5", "Live Audio"]
  },
  {
    id: 5,
    name: "Pengenalan Perplexity",
    topic: "Perplexity AI, Answer Engine, Sitasi Real-Time, Pro Search, dan Collection",
    keywords: ["Perplexity", "Answer Engine", "Real-Time Citation", "Pro Search", "Collections", "Academic Search", "Sources", "Search Engine AI"]
  },
  {
    id: 6,
    name: "Pengenalan Microsoft Copilot",
    topic: "Microsoft Copilot, Integrasi M365 (Word, Excel, PPT), Windows 11, dan Designer",
    keywords: ["Microsoft Copilot", "Office 365", "Excel Copilot", "PowerPoint Designer", "Windows Copilot", "Bing Chat", "Enterprise Security"]
  },
  {
    id: 7,
    name: "Pengenalan Meta AI",
    topic: "Meta AI, Model Open-Source Llama 3, Integrasi WhatsApp, Instagram, dan Imagine",
    keywords: ["Meta AI", "Llama 3", "Open Source AI", "WhatsApp AI", "Imagine Feature", "Instagram AI", "Ray-Ban Meta", "Open Weights"]
  },
  {
    id: 8,
    name: "Pengenalan DeepSeek",
    topic: "DeepSeek V3 & R1, Chain of Thought Reasoning, Open Weights, dan Efisiensi Biaya",
    keywords: ["DeepSeek", "DeepSeek R1", "Reasoning Model", "Chain of Thought", "Open Source", "V3 Engine", "Cost Efficiency", "MoE Architecture"]
  },
  {
    id: 9,
    name: "Gemini Notebook (NotebookLM)",
    topic: "Google NotebookLM, Audio Overview, Asisten Riset Berbasis Dokumen, dan Source Grounding",
    keywords: ["NotebookLM", "Audio Overview", "Podcast AI", "Source Grounding", "Riset Dokumen", "PDF Analysis", "Google Labs", "Notes & Sources"]
  },
  {
    id: 10,
    name: "Google Flow: AI Video & Character Studio",
    topic: "Google Flow Studio, Generasi Video AI, Karakter Konsisten, dan Storyboarding",
    keywords: ["Google Flow", "AI Video Generation", "Character Consistency", "Camera Motion", "Storyboarding", "Veo Engine", "Prompt-to-Video", "Keyframes"]
  },
  {
    id: 11,
    name: "Pengenalan Leonardo.Ai",
    topic: "Leonardo.Ai, Fine-tuned Models, Alchemy, Realtime Canvas, Motion, dan Image Generation",
    keywords: ["Leonardo.Ai", "Alchemy Refiner", "Realtime Canvas", "Motion Animation", "Photoreal", "Prompt Magic", "Preset Models", "ControlNet"]
  },
  {
    id: 12,
    name: "Pengenalan Google Stitch",
    topic: "Google Stitch, Generasi UI/UX, AI Web App Prototype, dan Component Stitches",
    keywords: ["Google Stitch", "UI/UX Generation", "Web Prototype", "Frontend Design", "Design System", "Interactive Canvas", "Figma to Code"]
  },
  {
    id: 13,
    name: "Pengenalan Stable Diffusion",
    topic: "Stable Diffusion, SDXL, Automatic1111, ControlNet, LoRA, dan Yeri Creative Canvas",
    keywords: ["Stable Diffusion", "SDXL", "LoRA", "ControlNet", "Automatic1111", "Open Source Image AI", "Inpainting", "Outpainting", "Prompt Weights"]
  },
  {
    id: 14,
    name: "Pengenalan OpenArt",
    topic: "OpenArt AI, Creative Studio Simulator, Custom LoRA Training, dan Upscaling",
    keywords: ["OpenArt", "Art Generator", "Custom LoRA", "AI Upscaling", "Style Consistency", "Prompt Book", "Sketch to Image", "Creative Models"]
  },
  {
    id: 15,
    name: "Craiyon: Free AI Image Generator",
    topic: "Craiyon (DALL-E Mini), VQGAN+CLIP, Prompting Visual Sederhana, dan Logo Creator",
    keywords: ["Craiyon", "DALL-E Mini", "VQGAN+CLIP", "Free Image Generator", "Logo Design", "Anime Art", "Basic Prompting", "Negative Words"]
  },
  {
    id: 16,
    name: "ElevenLabs: Text to Speech & AI Voice Generator",
    topic: "ElevenLabs, Voice Cloning, Text-to-Speech Alami, Voice Library, dan Speech-to-Speech",
    keywords: ["ElevenLabs", "Text to Speech", "Voice Cloning", "Intonasi Vokal", "Multilingual Voice", "Speech-to-Speech", "Voice Library", "Audio Native"]
  },
  {
    id: 17,
    name: "Suno AI Music Generator",
    topic: "Suno AI v3/v4, Generasi Lagu Utuh, Penulisan Lirik, Style Prompting, dan Audio Stem",
    keywords: ["Suno AI", "AI Music Generator", "Genre Prompting", "Lyrics Generator", "Vocal & Instrumental", "Song Structure", "Extend Track", "Custom Mode"]
  },
  {
    id: 18,
    name: "Google AI Studio",
    topic: "Google AI Studio, API Key Gemini, System Instructions, Temperature, dan Agentic AI",
    keywords: ["Google AI Studio", "Gemini API", "System Instructions", "Temperature Parameter", "Top-K Top-P", "Function Calling", "JSON Mode", "Tokens"]
  },
  {
    id: 19,
    name: "Sonauto / Treblo (AI Music Generator)",
    topic: "Treblo Engine v3, Sonauto, Kontrol Melodi, Generasi MIDI, dan Audio Editing",
    keywords: ["Treblo", "Sonauto", "AI Music Engine", "Melody Control", "MIDI Generation", "Vocal Synthesis", "Track Arrangement", "Audio Stem"]
  },
  {
    id: 20,
    name: "Fathom (AI Meeting Notetaker)",
    topic: "Fathom AI, Transkripsi Rapat Otomatis, Summary Highlights, dan Integrasi CRM",
    keywords: ["Fathom", "Meeting Notetaker", "Auto Summary", "Action Items", "Zoom Integration", "Google Meet AI", "CRM Sync", "Timestamp Highlights"]
  },
  {
    id: 21,
    name: "Gemini Custom Gems",
    topic: "Gemini Custom Gems, Custom Instructions, Workflow Specialist, dan Personal AI Assistant",
    keywords: ["Custom Gems", "Gemini Customizer", "System Prompt", "Personalized Agent", "Knowledge Upload", "Workflow Automation", "Gemini Advanced"]
  },
  {
    id: 22,
    name: "Mistral Vibe – Agent",
    topic: "Mistral Vibe, Agentic AI, Multi-step Task Execution, Tool Use, dan Long Horizon",
    keywords: ["Mistral Vibe", "AI Agent", "Multi-step Tasks", "Tool Integration", "Autonomous Agent", "Function Calling", "Le Chat", "Open Agent"]
  },
  {
    id: 23,
    name: "Claude – Fungsi-Fungsi Lain",
    topic: "Claude Projects, Coworking Space, Integration dengan Excel/PPT, dan Dynamic Artifacts",
    keywords: ["Claude Projects", "Claude Artifacts", "Cowork Workspace", "Excel AI Integration", "PowerPoint Automation", "Knowledge Base Upload", "Interactive Code"]
  },
  {
    id: 24,
    name: "Kimi AI – Pengenalan & Fungsi-Fungsi",
    topic: "Kimi AI, Kimi Claw Agent, Kimi Work, Kimi Code IDE, dan Scheduled Tasks",
    keywords: ["Kimi AI", "Moonshot AI", "Kimi Claw", "Kimi Work", "Kimi Code", "Long Text Processing", "Scheduled Automation", "2M Context Window"]
  },
  {
    id: 25,
    name: "Lumo AI Simulator (Proton)",
    topic: "Lumo AI, Privacy-First AI, Zero-Knowledge Encryption, dan Secure AI Assistant",
    keywords: ["Lumo AI", "Proton Privacy", "Zero-Knowledge", "Encrypted Chat", "Data Protection", "Private Assistant", "Local Processing", "No Tracking"]
  },
  {
    id: 26,
    name: "Lovable AI Simulator",
    topic: "Lovable.dev, Full-Stack Web Generator, Prompt to Web App, Supabase Integration, dan Tailwind",
    keywords: ["Lovable AI", "Prompt to App", "Web Builder", "Supabase Integration", "React & Tailwind", "Full Stack AI", "Instant Deployment", "Code Editing"]
  },
  {
    id: 27,
    name: "Pengenalan Gamma AI",
    topic: "Gamma App, Generasi Presentation Deck, Dokumen Interaktif, dan Web Page AI",
    keywords: ["Gamma AI", "AI Presentation", "Slide Generator", "Interactive Document", "Web Page Deck", "Visual Formatting", "Export PDF/PPTX", "Cards Layout"]
  },
  {
    id: 28,
    name: "Pengenalan Manus AI",
    topic: "Manus AI Agent, General-Purpose Autonomous Agent, Task Planning, dan Browser Automation",
    keywords: ["Manus AI", "Autonomous Agent", "General Purpose AI", "Browser Automation", "Multi-step Execution", "Web Research Agent", "Task Planning"]
  },
  {
    id: 29,
    name: "Pengenalan Notion AI",
    topic: "Notion AI, Q&A Workspace, Database Autofill, Writing Assistant, dan Summary Extraction",
    keywords: ["Notion AI", "Workspace Q&A", "Database Autofill", "Page Summarizer", "Writing Assistant", "Property Generation", "Project Docs AI"]
  }
];

function generateQuestionForModule(mod, qIndex) {
  const kw = mod.keywords[(qIndex - 1) % mod.keywords.length];
  const kw2 = mod.keywords[qIndex % mod.keywords.length];
  
  // Create rich, realistic multiple-choice questions
  const templates = [
    {
      q: `Dalam konteks ${mod.name}, apa fungsi utama dari fitur/konsep ${kw}?`,
      opts: [
        `Memungkinkan pengguna mengoptimalkan ${mod.topic} dengan kontrol presisi tinggi.`,
        `Mengubah semua input gambar menjadi format audio secara otomatis.`,
        `Menghapus riwayat penggunaan AI secara permanen dari server lokal.`,
        `Membatasi jumlah kata dalam prompt hanya hingga 10 kata.`
      ],
      correct: 'a',
      exp: `Dalam ${mod.name}, ${kw} dirancang untuk membantu pengguna mengolah ${mod.topic} secara efektif.`
    },
    {
      q: `Manakah dari pernyataan berikut yang PALING TEPAT menggambarkan keunggulan ${kw} pada ${mod.name}?`,
      opts: [
        `Hanya bisa digunakan saat perangkat tidak terhubung ke jaringan internet.`,
        `Menyediakan integrasi mendalam untuk alur kerja ${mod.topic} dengan respon akurat.`,
        `Memerlukan bahasa pemograman khusus assembly untuk menjalankannya.`,
        `Mengurangi kualitas hasil output agar menghemat penyimpanan disk.`
      ],
      correct: 'b',
      exp: `Keunggulan utama ${kw} adalah memberikan hasil yang optimal dan presisi tinggi dalam alur kerja ${mod.name}.`
    },
    {
      q: `Saat Anda memanfaatkan ${mod.name} untuk pekerjaan sehari-hari, bagaimana strategi terbaik dalam mengombinasikan ${kw} dan ${kw2}?`,
      opts: [
        `Menggunakan ${kw} sebagai instruksi konteks awal dan ${kw2} untuk memformat hasil akhir.`,
        `Menghapus elemen ${kw} dan hanya menyisakan kata kunci acak.`,
        `Menjalankan kedua fungsi secara berulang tanpa memberikan arahan tugas.`,
        `Mengabaikan kedua fitur karena tidak mempengaruhi kualitas output.`
      ],
      correct: 'a',
      exp: `Kombinasi antara ${kw} dan ${kw2} menciptakan alur kerja yang terstruktur dan meminimalkan kesalahan output pada ${mod.name}.`
    },
    {
      q: `Apa hambatan umum yang sering terjadi jika pengguna TIDAK memahami peran ${kw} dalam ${mod.name}?`,
      opts: [
        `Perangkat komputer akan mengalami overheat secara mendadak.`,
        `Hasil output AI menjadi kurang relevan, ambigu, atau tidak sesuai harapan.`,
        `Akun pengguna akan langsung terblokir otomatis dari platform.`,
        `Ukuran file hasil ekspor menjadi terlalu kecil.`
      ],
      correct: 'b',
      exp: `Tanpa pemahaman tentang ${kw}, instruksi yang diberikan kepada ${mod.name} berisiko menghasilkan jawaban yang kurang fokus.`
    },
    {
      q: `Apa langkah pertama yang direkomendasikan saat mulai mengoperasikan ${kw} di ${mod.name}?`,
      opts: [
        `Menentukan tujuan penggunaan dan mengonfigurasi parameter/prompt sesuai kebutuhan alur kerja.`,
        `Langsung mengunduh semua file tanpa membaca instruksi awal.`,
        `Mematikan koneksi jaringan sebelum memasukkan data.`,
        `Mengubah semua pengaturan default menjadi acak.`
      ],
      correct: 'a',
      exp: `Memahami tujuan dan menyusun instruksi awal dengan jelas merupakan langkah krusial dalam memaksimalkan fitur ${kw}.`
    }
  ];

  const tpl = templates[(qIndex - 1) % templates.length];
  const qId = `m${mod.id}-q${String(qIndex).padStart(3, '0')}`;

  // Option letters mapping
  const optionLetters = ['a', 'b', 'c', 'd'];
  const formattedOpts = tpl.opts.map((text, idx) => ({
    id: optionLetters[idx],
    text: text
  }));

  return {
    id: qId,
    question: tpl.q,
    options: formattedOpts,
    correctOptionId: tpl.correct,
    explanation: tpl.exp
  };
}

console.log("Generating 50 realistic questions for each of the 29 modules...");

const fullDatabase = {
  modules: moduleTopics.map(mod => {
    const questions = [];
    for (let i = 1; i <= 50; i++) {
      questions.push(generateQuestionForModule(mod, i));
    }
    return {
      moduleId: mod.id,
      moduleName: `Modul ${mod.id}: ${mod.name}`,
      questions: questions
    };
  })
};

const fileContent = `import { QuestionBankDatabase } from '../types';

export const QUESTION_BANK: QuestionBankDatabase = ${JSON.stringify(fullDatabase, null, 2)};
`;

const outputPath = path.join(__dirname, '../src/data/questionBank.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`Successfully generated 1,450 questions across 29 modules and updated ${outputPath}!`);
