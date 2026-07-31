const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Fix patterns
  content = content.replace(/dark:bg-white\/90\s+dark:bg-slate-900\/90/g, 'dark:bg-[#0d1322]');
  content = content.replace(/dark:bg-white\s+dark:bg-slate-900/g, 'dark:bg-[#0d1322]');
  content = content.replace(/dark:bg-white\s+dark:bg-white\/90\s+dark:bg-slate-900\/90/g, 'dark:bg-[#0d1322]');
  content = content.replace(/dark:border-slate-200\s+dark:border-slate-800/g, 'dark:border-slate-800');
  content = content.replace(/dark:text-slate-900\s+dark:text-white/g, 'dark:text-white');
  content = content.replace(/dark:text-slate-600\s+dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-500\s+dark:text-slate-400/g, 'dark:text-slate-400');
  content = content.replace(/dark:bg-slate-100\s+dark:bg-slate-950/g, 'dark:bg-slate-950');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished fixing dark mode in ${totalReplacements} components!`);
