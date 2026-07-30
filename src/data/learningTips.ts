export interface LearningTip {
  id: string;
  category: 'Prompting' | 'LLM Architecture' | 'RAG & Memory' | 'Safety & Ethics' | 'Productivity';
  title: string;
  summary: string;
  explanation: string;
  promptExample?: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  tags: string[];
}

export const LEARNING_TIPS: LearningTip[] = [
  {
    id: 'tip-1',
    category: 'Prompting',
    title: 'Teknik Few-Shot Prompting',
    summary: 'Berikan 2–3 contoh input-output konkret dalam instruksi agar LLM memahami format hasil yang diharapkan.',
    explanation: 'LLM bekerja sangat baik dengan pencocokan pola. Daripada hanya menjelaskan aturan dalam teks, sertakan pasangan contoh [Input] -> [Output] di dalam prompt Anda.',
    promptExample: `Saya ingin Anda mengubah nama kota menjadi kode bandara IATA.
Contoh:
Jakarta -> CGK
Surabaya -> SUB
Denpasar -> DPS

Kota: Yogyakarta ->`,
    level: 'Pemula',
    tags: ['Few-Shot', 'Pattern Matching', 'Formatting'],
  },
  {
    id: 'tip-2',
    category: 'Prompting',
    title: 'Chain-of-Thought (CoT): "Pikirkan Langkah demi Langkah"',
    summary: 'Minta model menjelaskan proses penalaran logisnya secara sistematis sebelum memberikan jawaban akhir.',
    explanation: 'Menambahkan frasa "Mari kita pikirkan langkah demi langkah" memaksa model memecah masalah kompleks menjadi urutan logika kecil, mengurangi kesalahan hitung dan penalaran.',
    promptExample: `Sebuah toko buku menjual 15 buku di pagi hari dan setengah dari sisa bukunya di sore hari. Jika awalnya ada 50 buku, berapa sisa buku toko tersebut?

Mari kita hitung secara bertahap langkah demi langkah sebelum memberikan jawaban akhir.`,
    level: 'Pemula',
    tags: ['Chain of Thought', 'Reasoning', 'Math'],
  },
  {
    id: 'tip-3',
    category: 'Prompting',
    title: 'Role-Playing System Prompt',
    summary: 'Tetapkan persona spesifik pada AI untuk menyesuaikan nada, kosa kata, dan kedalaman jawaban.',
    explanation: 'Memberikan peran seperti "Anda adalah Senior Backend Developer dengan pengalaman 10 tahun" mengarahkan model untuk mengambil representasi pengetahuan yang lebih relevan dan teknis.',
    promptExample: `Anda adalah Senior Security Auditor AI. Periksa kode Python berikut dan sebutkan 3 celah keamanan utama beserta solusinya:

def login(user, pwd):
    query = f"SELECT * FROM users WHERE username='{user}' AND password='{pwd}'"
    return db.execute(query)`,
    level: 'Pemula',
    tags: ['System Prompt', 'Persona', 'Role-Playing'],
  },
  {
    id: 'tip-4',
    category: 'LLM Architecture',
    title: 'Memahami Temperature & Top-P',
    summary: 'Temperature mengatur kreativitas model: nilai rendah (0.0 - 0.2) untuk fakta, nilai tinggi (0.7 - 1.0) untuk karya kreatif.',
    explanation: 'Temperature menentukan seberapa berani model memilih token berikutnya yang kurang probabel. Gunakan Temperature 0.0 untuk analisis data/sintaksis kode, dan 0.8+ untuk ide curah pendapat (brainstorming).',
    level: 'Menengah',
    tags: ['Temperature', 'Sampling', 'Hyperparameters'],
  },
  {
    id: 'tip-5',
    category: 'Prompting',
    title: 'Penanda Struktur Delimiter (###, ---, ```)',
    summary: 'Gunakan delimiter pemisah yang jelas untuk memisahkan instruksi, konteks dokumen, dan input pengguna.',
    explanation: 'Tanpa pemisah yang jelas, LLM bisa bingung membedakan instruksi sistem dan isi dokumen teks yang dianalisis. Gunakan simbol pagar triple (###) atau backticks (```).',
    promptExample: `Ringkas artikel di dalam tanda pagar tiga berikut dalam 3 poin utama:

###
Artificial Intelligence mengalami perkembangan pesat sejak arsitektur Transformer diperkenalkan pada tahun 2017...
###`,
    level: 'Pemula',
    tags: ['Delimiters', 'Structuring', 'Formatting'],
  },
  {
    id: 'tip-6',
    category: 'RAG & Memory',
    title: 'Mencegah Halusinasi dengan Grounding Context',
    summary: 'Batas instruksi LLM agar HANYA menjawab berdasarkan konteks dokumen yang Anda berikan.',
    explanation: 'Model generative cenderung "mengarang" saat tidak yakin. Berikan batasan tegas seperti: "Jika jawaban tidak ada di dalam teks konteks, jawablah \'Informasi tidak ditemukan dalam dokumen\'."',
    promptExample: `Berdasarkan dokumen internal berikut HANYA, jawab pertanyaan di bawah. Jika tidak disebutkan di teks, katakan "Tidak ada dalam dokumen".

[Konteks]:
Jam operasional kantor adalah Senin-Jumat pukul 08:00 - 17:00 WIB.

[Pertanyaan]:
Apakah kantor buka pada hari Sabtu?`,
    level: 'Menengah',
    tags: ['Grounding', 'RAG', 'Hallucination Mitigation'],
  },
  {
    id: 'tip-7',
    category: 'LLM Architecture',
    title: 'Prinsip Context Window & Loss in the Middle',
    summary: 'Informasi paling penting sebaiknya diletakkan di SANGAT AWAL atau SANGAT AKHIR dari prompt.',
    explanation: 'Penelitian menunjukkan bahwa LLM paling memperhatikan bagian awal (primacy effect) dan bagian akhir (recency effect) dari prompt panjang, sedangkan informasi di tengah rentan diabaikan (lost in the middle).',
    level: 'Lanjutan',
    tags: ['Context Window', 'Attention Mechanism', 'Optimization'],
  },
  {
    id: 'tip-8',
    category: 'Productivity',
    title: 'Teknik Meta-Prompting (Minta AI Membuat Prompt)',
    summary: 'Gunakan LLM untuk membantu Anda menyempurnakan dan merancang prompt terbaik.',
    explanation: 'Daripada menebak-nebak susunan prompt yang tepat, minta model merevisi draft awal Anda dengan kriteria yang lebih terstruktur.',
    promptExample: `Saya ingin membuat bot layanan pelanggan untuk toko baju online. 
Tolong buatkan instruksi System Prompt yang lengkap, profesional, dan mencakup aturan pengembalian barang.`,
    level: 'Pemula',
    tags: ['Meta-Prompting', 'Productivity', 'Workflow'],
  },
  {
    id: 'tip-9',
    category: 'Safety & Ethics',
    title: 'Penanganan Prompt Injection (Jailbreak Defense)',
    summary: 'Lindungi aplikasi AI Anda dari manipulasi pengguna jahat yang mencoba mengabaikan instruksi sistem.',
    explanation: 'Validasi input pengguna sebelum dikirim ke LLM dan tambahkan instruksi pertahanan di bagian akhir prompt untuk menegaskan batas kewenangan model.',
    level: 'Lanjutan',
    tags: ['Security', 'Prompt Injection', 'Safety'],
  },
  {
    id: 'tip-10',
    category: 'Prompting',
    title: 'Format Output JSON Terstruktur',
    summary: 'Minta model merespons langsung dalam format JSON valid untuk kemudahan integrasi kode.',
    explanation: 'Sertakan contoh skema JSON dan berikan frasa tegas: "Kembalikan HANYA JSON tanpa teks pengantar atau pemformatan markdown tambahan."',
    promptExample: `Ekstrak entitas dari kalimat berikut ke dalam format JSON:
"Budi membeli 2 laptop Asus seharga Rp 15.000.000 pada tanggal 12 Juli 2026."

Format JSON target:
{
  "pembeli": string,
  "jumlah": number,
  "produk": string,
  "totalHarga": string,
  "tanggal": string
}`,
    level: 'Menengah',
    tags: ['JSON', 'Structured Output', 'API Integration'],
  }
];
