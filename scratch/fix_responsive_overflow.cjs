const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 1. Fix "flex items-center gap-2" button rows without flex-wrap inside cards
  content = content.replace(/className="flex items-center gap-2 pt-1"/g, 'className="flex flex-wrap items-center gap-2 pt-1 max-w-full"');
  content = content.replace(/className="flex items-center gap-2 mt-3"/g, 'className="flex flex-wrap items-center gap-2 mt-3 max-w-full"');
  content = content.replace(/className="flex items-center gap-2 sm:gap-3"/g, 'className="flex flex-wrap items-center gap-2 sm:gap-3 max-w-full"');

  // 2. Fix NotionAiReplica specific line 594
  content = content.replace(/\{\/\* Accept \/ Reject \/ Try again buttons \*\/\}\s*<div className="flex items-center gap-2 pt-1">/g, '{/* Accept / Reject / Try again buttons */}\n                  <div className="flex flex-wrap items-center gap-2 pt-1 max-w-full">');

  // 3. Ensure replica outer container cards have max-w-full overflow-hidden / overflow-x-auto where appropriate
  content = content.replace(/className="mt-4 p-4 rounded-2xl bg-purple-50/g, 'className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 max-w-full overflow-hidden');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Updated responsive layout in: ${file}`);
  }
});

console.log(`Responsive overflow audit finished! Updated ${totalReplacements} files.`);
