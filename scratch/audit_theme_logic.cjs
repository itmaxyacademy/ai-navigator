const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allFiles = getAllFiles(srcDir);
let fixedCount = 0;

allFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 1. Fix colored buttons: if an element has bg-indigo-600 / bg-indigo-500 / bg-purple-600 / bg-emerald-600 / bg-rose-600 and also text-slate-900 dark:text-white, make it text-white
  content = content.replace(/(bg-(?:indigo|purple|emerald|rose|blue)-(?:500|600|700)[^"]*?)text-slate-900 dark:text-white/g, '$1text-white');
  content = content.replace(/(bg-(?:indigo|purple|emerald|rose|blue)-(?:500|600|700)[^"]*?)text-slate-800 dark:text-white/g, '$1text-white');
  content = content.replace(/(bg-(?:indigo|purple|emerald|rose|blue)-(?:500|600|700)[^"]*?)text-slate-700 dark:text-white/g, '$1text-white');

  // 2. Fix inverted text on white inputs: "bg-white ... text-slate-900 dark:text-white" on inputs
  content = content.replace(/bg-white dark:bg-slate-900 text-slate-900 dark:text-white/g, 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white');

  // 3. Fix dark overlay text: "bg-slate-900 ... text-slate-900"
  content = content.replace(/bg-slate-950 text-slate-900 dark:text-white/g, 'bg-slate-950 text-white');
  content = content.replace(/bg-slate-900 text-slate-900 dark:text-white/g, 'bg-slate-900 text-white');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
    console.log(`Audited & fixed: ${path.basename(filePath)}`);
  }
});

console.log(`Theme logic audit complete! Updated ${fixedCount} files.`);
