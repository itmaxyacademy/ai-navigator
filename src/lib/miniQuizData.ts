import { CourseModule } from '../types';
import { MiniQuizQuestion } from '../components/MiniQuizCheckpoint';

/**
 * Returns a tailored MiniQuizQuestion for a specific module and section.
 */
export function getSectionCheckpointQuestion(
  module: CourseModule,
  section: 'overview' | 'replica' | 'prompting'
): MiniQuizQuestion {
  const modId = module.id;
  const modTitle = module.title;

  // Custom tailored questions for modules where specific checks enhance learning
  if (modId === 1) {
    if (section === 'overview') {
      return {
        id: `m${modId}-overview-cp`,
        title: 'Cek Pemahaman: Komponen RCTF',
        question: 'Dalam rumus RCTF, huruf "C" merujuk pada elemen penting apa?',
        options: [
          'Code (Kode Pemrograman)',
          'Context (Konteks Latar Belakang)',
          'Creator (Pembuat AI)',
          'Complexity (Tingkat Kesulitan)',
        ],
        correctAnswer: 1,
        explanation:
          'Benar! "C" singkatan dari Context (Konteks), yaitu latar belakang situasi dan batasan yang diberikan agar jawaban AI relevan.',
      };
    }
    if (section === 'replica') {
      return {
        id: `m${modId}-replica-cp`,
        title: 'Cek Pemahaman: Builder Interaktif',
        question: 'Mengapa menetapkan Role (Peran) pada prompt memberikan hasil yang lebih baik?',
        options: [
          'Sebab AI akan merespons menggunakan sudut pandang dan kepakaran spesifik sesuai kriteria.',
          'Sebab AI akan otomatis mengubah bahasa menjadi bahasa Inggris.',
          'Sebab AI tidak akan memproses instruksi tanpa peran.',
          'Sebab Role membuat ukuran teks jawaban menjadi lebih besar.',
        ],
        correctAnswer: 0,
        explanation:
          'Tepat! Role mengarahkan AI untuk mengambil sudut pandang, gaya bahasa, dan kedalaman analisis dari seorang profesional.',
      };
    }
    if (section === 'prompting') {
      return {
        id: `m${modId}-prompting-cp`,
        title: 'Cek Pemahaman: Format Output',
        question: 'Mana contoh penentuan elemen "Format" (F) yang benar dalam prompt?',
        options: [
          '"Tolong jawab dengan cepat ya"',
          '"Jawablah dalam bentuk Tabel 3 Kolom: No, Konsep, Contoh"',
          '"Saya sedang berada di kantor"',
          '"Anda adalah konsultan keuangan senior"',
        ],
        correctAnswer: 1,
        explanation:
          'Sangat baik! Elemen Format menentukan bentuk visual dari jawaban, seperti Tabel, Poin-poin, JSON, atau Paragraf.',
      };
    }
  }

  // Generative fallback based on module content for all other modules
  if (section === 'overview') {
    const dev = module.content.overview.developer;
    const tag = module.content.overview.tagline;
    return {
      id: `m${modId}-overview-cp`,
      title: `Checkpoint Pengenalan: ${modTitle}`,
      question: `Berdasarkan rangkuman ${modTitle}, apa fokus atau keunggulan utama dari teknologi ini?`,
      options: [
        `${tag.substring(0, 70)}...`,
        'Hanya digunakan untuk mengetik dokumen tanpa koneksi internet.',
        'Tidak memiliki keunggulan dibanding mesin pencari tradisional.',
        'Menggantikan seluruh pekerjaan manusia secara otomatis.',
      ],
      correctAnswer: 0,
      explanation: `Tepat sekali! ${modTitle} dirancang khusus untuk ${tag.toLowerCase()}.`,
    };
  }

  if (section === 'replica') {
    return {
      id: `m${modId}-replica-cp`,
      title: `Checkpoint Praktik Interaktif: ${modTitle}`,
      question: `Saat berinteraksi dengan simulasi ${modTitle}, apa yang perlu diperhatikan saat mengeksplorasi fitur-fiturnya?`,
      options: [
        'Memahami hotspot interaktif dan bagaimana kontrol khusus mengubah output AI.',
        'Menutup aplikasi secepat mungkin tanpa mencoba contoh prompt.',
        'Mengetik teks acak tanpa membaca jawaban simulasi.',
        'Mengabaikan tombol salin dan contoh respons.',
      ],
      correctAnswer: 0,
      explanation:
        'Benar! Mempelajari antarmuka dan hotspot membantu Anda menguasai kontrol nyata pada platform AI.',
    };
  }

  // Section: prompting
  return {
    id: `m${modId}-prompting-cp`,
    title: `Checkpoint Panduan Prompting: ${modTitle}`,
    question: `Apa prinsip utama dalam mengoptimalkan prompt untuk ${modTitle}?`,
    options: [
      'Gunakan petunjuk yang spesifik, beri konteks yang jelas, dan manfaatkan fitur uniknya.',
      'Gunakan prompt satu kata tanpa penjelasan tambahan.',
      'Sering menyalin prompt dari sumber acak tanpa mengedit konteks.',
      'Selalu gunakan bahasa gaul tanpa arahan format.',
    ],
    correctAnswer: 0,
    explanation:
      'Tepat! Memberikan petunjuk yang spesifik dan memanfaatkan fitur khusus adalah kunci utama efektivitas prompting.',
  };
}
