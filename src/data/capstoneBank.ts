export interface CapstoneTopic {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  objectives: string[];
  recommendedTools: string[];
  deliverables: string[];
}

export const CAPSTONE_BANK: CapstoneTopic[] = [
  {
    id: 'rag-customer-support',
    title: 'Otomasi AI Customer Support & Knowledge Base RAG',
    category: 'E-Commerce & SaaS Support',
    difficulty: 'Intermediate',
    description: 'Membangun asisten AI berbasis Retrieval-Augmented Generation (RAG) yang mampu menjawab pertanyaan pelanggan secara akurat berdasarkan SOP perusahaan, FAQ, dan katalog produk tanpa halusinasi.',
    objectives: [
      'Membuat pipeline pemrosesan dokumen knowledge base (PDF/Markdown)',
      'Mengonfigurasi vector embeddings dan retrieval database',
      'Mengintegrasikan prompt grounding RCTF untuk memastikan respons faktual',
    ],
    recommendedTools: ['Gemini 1.5 Pro / GPT-4o', 'LangChain / LlamaIndex', 'ChromaDB / Pinecone', 'Streamlit / Next.js'],
    deliverables: ['Repositori GitHub / Demo App', 'Dokumen Knowledge Base & Prompt SOP', 'Laporan Evaluasi Akurasi Respon (PDF)'],
  },
  {
    id: 'marketing-content-engine',
    title: 'AI Marketing Omnichannel & Content Personalization Engine',
    category: 'Digital Marketing & Growth',
    difficulty: 'Beginner',
    description: 'Sistem pembuatan materi promosi omnichannel otomatis (copywriting Instagram, script video TikTok/Reels, subject & body email blast) dengan framework prompt RCTF dan gaya bahasa brand yang konsisten.',
    objectives: [
      'Merancang sistem prompt modular untuk multi-channel copy generation',
      'Mengotomasi pembuatan variasi A/B testing konten iklan',
      'Mengintegrasikan workflow otomatisasi n8n atau Make.com',
    ],
    recommendedTools: ['Claude 3.5 Sonnet', 'ChatGPT 4o', 'Canva AI / Midjourney', 'Make.com / Google Sheets'],
    deliverables: ['Template Prompt Framework RCTF', 'Contoh 10 Hasil Variasi Konten Kampanye', 'Dokumen Strategi Workflow Marketing'],
  },
  {
    id: 'financial-report-analyzer',
    title: 'Automated Financial Report Analyzer & Executive Summary AI',
    category: 'Finance & Corporate Strategy',
    difficulty: 'Advanced',
    description: 'Agen AI untuk menganalisis laporan keuangan triwulanan (PDF/Excel), mendeteksi anomali biaya operasional, membandingkan pertumbuhan YoY, dan menyusun ringkasan eksekutif siap presentasi.',
    objectives: [
      'Ekstraksi tabel dan metrik rasio keuangan dari file laporan tahunan',
      'Komparasi tren pendapatan dan identifikasi potensi risiko likuiditas',
      'Penyusunan Executive Summary terstruktur secara otomatis',
    ],
    recommendedTools: ['Gemini 1.5 Pro (Long Context)', 'Python (Pandas, OpenPyXL)', 'Google AI Studio', 'Markdown Exporter'],
    deliverables: ['Source Code Script Analisis Data', 'Executive Summary Report (PDF)', 'Contoh Input Data & Analisis Rasio'],
  },
  {
    id: 'hr-resume-screening',
    title: 'AI Resume Screening & Anti-Bias Candidate Shortlisting',
    category: 'Human Resources & Talent',
    difficulty: 'Intermediate',
    description: 'Sistem pemeringkatan CV kandidat pelamar kerja berdasarkan Job Description dan kualifikasi teknis dengan penilaian berbasis kriteria objektif, anti-bias, dan output rubrik penilaian terstandarisasi.',
    objectives: [
      'Ekstraksi data keahlian, pengalaman, dan pendidikan dari format resume PDF',
      'Scoring kesesuaian profil kandidat menggunakan rubrik terstandar',
      'Menghasilkan rekomendasi pertanyaan wawancara khusus untuk setiap kandidat',
    ],
    recommendedTools: ['OpenAI API / Gemini API', 'PDFPlumber / PyPDF', 'Structured JSON Output', 'Airtable / Google Sheets'],
    deliverables: ['Kode Ekstraksi & Scoring Kandidat', 'Rubrik Evaluasi AI HR', 'Laporan Perbandingan 5 Sampel CV'],
  },
  {
    id: 'legal-contract-review',
    title: 'AI Legal Contract Review & Risk Assessment Agent',
    category: 'Legal & Risk Compliance',
    difficulty: 'Advanced',
    description: 'Asisten analisis perjanjian kerjasama (MOU/NDA/Vendor Contract) untuk mendeteksi klausul berisiko, ketidaksesuaian regulasi hukum Indonesia, serta rekomendasi redaksi klausul alternatif.',
    objectives: [
      'Pemindaian otomatis klausul klausul ganti rugi, kerahasiaan, dan terminasi',
      'Penentuan tingkat risiko klausul (Low, Medium, High Risk Matrix)',
      'Penyusunan draft redlining dan saran perbaikan redaksi klausul',
    ],
    recommendedTools: ['Claude 3.5 Sonnet', 'Gemini Document AI', 'Docx / PDF Parser', 'Legal Prompt Rubric'],
    deliverables: ['Laporan Audit Kontrak Beranotasi', 'Risk Matrix Assessment Template', 'Panduan Prompt Legal Review'],
  },
  {
    id: 'ai-code-reviewer',
    title: 'AI-Powered Code Reviewer & Security Vulnerability Scanner',
    category: 'Software Engineering & DevOps',
    difficulty: 'Intermediate',
    description: 'Tool otomasi review Pull Request di GitHub/GitLab untuk menemukan potensi celah keamanan (OWASP Top 10), efisiensi algoritma (Big-O), dan kepatuhan clean code secara otomatis.',
    objectives: [
      'Integrasi bot review pada CI/CD pipeline via GitHub Actions / Webhooks',
      'Pemeriksaan keamanan kode terhadap SQL Injection, XSS, dan Secret Leaks',
      'Memberikan saran refactoring kode yang efisien beserta unit test',
    ],
    recommendedTools: ['GitHub Actions API', 'DeepSeek Coder / Claude 3.5 Sonnet', 'Node.js / Python', 'SonarQube / ESLint'],
    deliverables: ['GitHub Action Workflow Script', 'Contoh PR Review & Vulnerability Report', 'Panduan Setup & Dokumentasi'],
  },
  {
    id: 'smart-medical-summarizer',
    title: 'Smart Clinical Notes & SOAP Medical Record Summarizer',
    category: 'Healthcare & Medical AI',
    difficulty: 'Intermediate',
    description: 'Ekstraksi catatan konsultasi dokter dan riwayat keluhan pasien ke dalam format ringkas standar medis SOAP (Subjective, Objective, Assessment, Plan) dengan tetap menjaga privasi data.',
    objectives: [
      'Restrukturisasi narasi keluhan pasien menjadi format SOAP medis teratur',
      'Pemeriksaan interaksi obat dasar berdasarkan resep dan riwayat alergi',
      'Penyamaran identitas pribadi (de-identification) sebelum pemrosesan AI',
    ],
    recommendedTools: ['Gemini Flash 1.5', 'Medical Terminology Prompts', 'FHIR Data Mapping', 'Vue / React UI'],
    deliverables: ['Sistem Konversi Rekam Medis ke SOAP', 'Rubrik Evaluasi Medis', 'Laporan Keamanan Privasi Data'],
  },
  {
    id: 'adaptive-learning-tutor',
    title: 'Adaptive AI Socratic Tutor & Dynamic Quiz Generator',
    category: 'Education & EdTech',
    difficulty: 'Beginner',
    description: 'Tutor AI interaktif dengan metode Socratic yang tidak langsung memberikan jawaban, melainkan memandu logika siswa melalui pertanyaan kritis serta menghasilkan kuis adaptif bertingkat.',
    objectives: [
      'Penerapan teknik prompt Socratic Dialogue untuk pembelajaran aktif',
      'Pembuatan generator soal pilihan ganda dinamis berdasarkan topik materi',
      'Sistem tracking pemahaman materi dan rekomendasi perbaikan belajar',
    ],
    recommendedTools: ['OpenAI GPT-4o Mini', 'React / Tailwind CSS', 'Local Storage State', 'Latex Rendering'],
    deliverables: ['Aplikasi Web Interaktif Tutor AI', 'Koleksi Socratic System Prompts', 'Dokumen Uji Coba Pengguna'],
  },
];
