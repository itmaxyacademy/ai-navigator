const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Fix button text on colored backgrounds: "bg-indigo-600 text-slate-900 dark:text-white" -> "bg-indigo-600 text-white"
  content = content.replace(/bg-indigo-600 text-slate-900 dark:text-white/g, 'bg-indigo-600 text-white');
  content = content.replace(/bg-rose-600 text-slate-900 dark:text-white/g, 'bg-rose-600 text-white');
  content = content.replace(/bg-purple-600 text-slate-900 dark:text-white/g, 'bg-purple-600 text-white');
  content = content.replace(/bg-emerald-600 text-slate-900 dark:text-white/g, 'bg-emerald-600 text-white');
  content = content.replace(/bg-amber-500 text-slate-900 dark:text-white/g, 'bg-amber-500 text-slate-950');

  // Fix hardcoded dark elements in Light mode: "bg-slate-950" without dark: -> "bg-white dark:bg-slate-950" (except where intended)
  // Let's ensure proper dark/light styling on card wrappers
  content = content.replace(/bg-slate-900 border border-slate-800 text-white/g, 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished fixing light mode text in ${totalReplacements} components!`);
