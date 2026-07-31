import fs from 'fs';
import path from 'path';

const TOTAL_MODULES = 29;
const QUESTIONS_PER_MODULE = 50;

function generateQuestionsForModule(moduleId: number) {
  const questions = [];
  for (let i = 1; i <= QUESTIONS_PER_MODULE; i++) {
    questions.push({
      id: `m${moduleId}-q${i.toString().padStart(3, '0')}`,
      question: `Pertanyaan contoh ${i} untuk Modul ${moduleId}? (Silakan diganti dengan soal asli nanti)`,
      options: [
        { id: 'a', text: `Pilihan A untuk soal ${i}` },
        { id: 'b', text: `Pilihan B untuk soal ${i} (Jawaban Benar)` },
        { id: 'c', text: `Pilihan C untuk soal ${i}` },
        { id: 'd', text: `Pilihan D untuk soal ${i}` }
      ],
      correctOptionId: 'b',
      explanation: `Penjelasan contoh mengapa jawaban B benar untuk soal ${i}.`
    });
  }
  return questions;
}

function main() {
  const modules = [];
  for (let m = 1; m <= TOTAL_MODULES; m++) {
    modules.push({
      moduleId: m,
      moduleName: `Modul ${m}`,
      questions: generateQuestionsForModule(m)
    });
  }

  const fileContent = `import { QuestionBankDatabase } from '../types';\n\nexport const QUESTION_BANK: QuestionBankDatabase = ${JSON.stringify({ modules }, null, 2)};\n`;

  const outputPath = path.join(process.cwd(), 'src', 'data', 'questionBank.ts');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`Generated ${TOTAL_MODULES} modules with ${QUESTIONS_PER_MODULE} questions each at ${outputPath}`);
}

main();
