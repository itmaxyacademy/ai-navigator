export interface DailyQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface DailyChallengeSet {
  id: string;
  dateKey?: string;
  title: string;
  questions: DailyQuestion[];
}

export const DAILY_CHALLENGES_POOL: DailyChallengeSet[] = [
  {
    id: 'dc-set-1',
    title: 'Tantangan Dasar LLM & Tokenisasi',
    questions: [
      {
        id: 'q1-1',
        question: 'Mengapa LLM tidak langsung memproses huruf/kata utuh, melainkan menggunakan token?',
        options: [
          'Agar ukuran file model menjadi lebih besar',
          'Untuk mengonversi teks menjadi representasi angka numerik yang efisien untuk kalkulasi matematika',
          'Karena token hanya bekerja dalam bahasa Inggris',
          'Supaya komputer tidak membutuhkan kartu grafis (GPU)'
        ],
        correctIndex: 1,
        explanation: 'Tokenisasi memecah teks menjadi potongan (seperti kata/suku kata) dan mengonversinya menjadi ID angka numerik agar dapat diproses oleh matriks matematika neural network.',
        topic: 'Tokenisasi'
      },
      {
        id: 'q2-1',
        question: 'Nilai Temperature manakah yang paling cocok untuk mengekstrak data JSON yang konsisten & deterministik?',
        options: ['1.0', '0.8', '0.0', '1.5'],
        correctIndex: 2,
        explanation: 'Temperature 0.0 membuat jawaban model sepenuhnya deterministik dan berfokus pada token dengan probabilitas tertinggi, ideal untuk format data terstruktur seperti JSON.',
        topic: 'Parameter LLM'
      },
      {
        id: 'q3-1',
        question: 'Apa fungsi utama dari System Prompt dalam aplikasi AI Chatbot?',
        options: [
          'Mengubah warna tema antarmuka pengguna',
          'Menetapkan pedoman perilaku dasar, persona, dan batasan instruksi yang melandasi seluruh percakapan',
          'Mencetak kuitansi pembayaran langganan',
          'Menghapus riwayat percakapan lama secara otomatis'
        ],
        correctIndex: 1,
        explanation: 'System Prompt berfungsi sebagai kuesioner acuan dan batasan aturan dasar (guardrails) yang mengatur persona dan gaya respons AI sebelum obrolan pengguna dimulai.',
        topic: 'Prompting'
      }
    ]
  },
  {
    id: 'dc-set-2',
    title: 'Tantangan RAG & Memori AI',
    questions: [
      {
        id: 'q1-2',
        question: 'Apa kepanjangan dan konsep utama dari teknik RAG?',
        options: [
          'Random Automated Generation — membuat kata secara acak',
          'Retrieval-Augmented Generation — mengambil dokumen eksternal relevan lalu memasukkannya sebagai konteks prompt',
          'Realtime AI Graph — menghubungkan jaringan komputer',
          'Rapid Algorithm Gate — mempercepat kecepatan internet'
        ],
        correctIndex: 1,
        explanation: 'RAG (Retrieval-Augmented Generation) mencari dokumen acuan terbaru dari database, lalu menyuntikkannya ke konteks prompt LLM untuk mencegah halusinasi.',
        topic: 'RAG & Memory'
      },
      {
        id: 'q2-2',
        question: 'Apa yang dimaksud dengan "Hallucination" (Halusinasi) pada LLM?',
        options: [
          'Model mematikan server secara tiba-tiba',
          'Model memberikan jawaban yang salah/fiktif namun disajikan dengan sangat meyakinkan',
          'Model meminta pengguna memasukkan kata sandi',
          'Model menghasilkan gambar bergerak alih-alih teks'
        ],
        correctIndex: 1,
        explanation: 'Halusinasi terjadi saat LLM memprediksi urutan kata yang secara tata bahasa terstruktur rapi tetapi faktanya tidak benar atau mengarang fiksi.',
        topic: 'Arsitektur LLM'
      },
      {
        id: 'q3-2',
        question: 'Manakah dari berikut ini yang merepresentasikan makna teks sebagai titik koordinat angka dalam ruang multi-dimensi?',
        options: ['Text Embedding', 'CSS Grid', 'RAM Server', 'HTML Tag'],
        correctIndex: 0,
        explanation: 'Embedding mengubah kata/kalimat menjadi vektor angka multi-dimensi, di mana teks bermakna mirip akan berada berdampingan di ruang koordinat.',
        topic: 'Vector DB'
      }
    ]
  },
  {
    id: 'dc-set-3',
    title: 'Tantangan Penalaran Chain-of-Thought & Keamanan',
    questions: [
      {
        id: 'q1-3',
        question: 'Bagaimana teknik Chain-of-Thought (CoT) meningkatkan akurasi logika LLM?',
        options: [
          'Dengan memotong panjang jawaban secara paksa',
          'Dengan meminta model menguraikan langkah-langkah penalaran bertahap sebelum memberikan jawaban akhir',
          'Dengan menyembunyikan pertanyaan pengguna',
          'Dengan mengganti model ke versi yang lebih murah'
        ],
        correctIndex: 1,
        explanation: 'Meminta LLM berpikir "langkah demi langkah" memungkinkannya mengalokasikan token komputasi untuk merumuskan logika matematika sebelum menyimpulkan jawaban akhir.',
        topic: 'Chain-of-Thought'
      },
      {
        id: 'q2-3',
        question: 'Istilah untuk ancaman keamanan di mana pengguna mencoba memanipulasi LLM agar mengabaikan instruksi utamanya disebut:',
        options: ['Phishing Email', 'Prompt Injection', 'SQL Injection', 'DDoS Attack'],
        correctIndex: 1,
        explanation: 'Prompt Injection terjadi saat input jahat memerintahkan AI mengabaikan System Prompt dan membocorkan data atau melakukan tindakan terlarang.',
        topic: 'Keamanan AI'
      },
      {
        id: 'q3-3',
        question: 'Apa keunggulan utama dari Context Window yang lebih besar (misal 1-2 juta token)?',
        options: [
          'Mampu memproses dan menganalisis seluruh buku, ratusan halaman PDF, atau jam video sekaligus dalam satu sesi',
          'Mencegah pengguna menggunakan koneksi internet',
          'Membuat baterai laptop bertahan dua kali lebih lama',
          'Menghilangkan kebutuhan akan kartu grafis GPU'
        ],
        correctIndex: 0,
        explanation: 'Context Window besar memungkinkan pengiriman dokumen panjang (seperti seluruh basis kode proyek atau ribuan halaman PDF) secara utuh dalam satu prompt.',
        topic: 'Context Window'
      }
    ]
  },
  {
    id: 'dc-set-4',
    title: 'Tantangan Multimodal & Tools AI',
    questions: [
      {
        id: 'q1-4',
        question: 'Apa arti kemampuan "Multimodal" pada model LLM modern seperti Gemini 1.5 Pro?',
        options: [
          'Model hanya dapat dijalankan di banyak laptop bersamaan',
          'Model dapat memahami dan memproses berbagai moda input seperti Teks, Gambar, Audio, dan Video secara bersamaan',
          'Model hanya menerima bahasa pemrograman Python',
          'Model memiliki lebih dari sepuluh tombol pilihan warna'
        ],
        correctIndex: 1,
        explanation: 'Multimodal berarti model dilatih sejak awal untuk memproses dan menghubungkan pemahaman dari teks, visual gambar, rekaman suara, hingga video.',
        topic: 'Multimodal AI'
      },
      {
        id: 'q2-4',
        question: 'Dalam framework RCTF untuk prompting, huruf "R" dan "C" masing-masing mewakili:',
        options: [
          'Result & Character',
          'Role (Peran) & Context (Konteks)',
          'Revision & Code',
          'Read & Clear'
        ],
        correctIndex: 1,
        explanation: 'Kerangka RCTF adalah singkatan dari Role (Peran), Context (Konteks), Task (Tugas), dan Format (Format Luaran).',
        topic: 'Framework RCTF'
      },
      {
        id: 'q3-4',
        question: 'Apa kegunaan utama dari fitur "Few-Shot Prompting"?',
        options: [
          'Memberikan beberapa contoh pasangan input-output di dalam prompt sebelum meminta AI mengerjakan tugas serupa',
          'Mengambil foto pengguna menggunakan webcam',
          'Mengulang prompt yang sama sebanyak 100 kali',
          'Membeli koin di dalam game'
        ],
        correctIndex: 0,
        explanation: 'Few-shot prompting menyertakan 2-3 contoh konkret hasil karya yang diinginkan agar AI meniru gaya, nada, atau format respons dengan presisi tinggi.',
        topic: 'Few-Shot Prompt'
      }
    ]
  }
];

// Deterministic function to pick today's challenge set based on day string
export function getTodayChallengeSet(dateStr: string): DailyChallengeSet {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_CHALLENGES_POOL.length;
  const setObj = DAILY_CHALLENGES_POOL[index];
  return {
    ...setObj,
    dateKey: dateStr,
  };
}
