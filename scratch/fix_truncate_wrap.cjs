const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Replica.tsx'));
let totalReplaced = 0;
for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // Replace 'truncate' with 'break-words whitespace-normal' in <h4>, <p>, <span>, <h5> elements
  content = content.replace(/(<(?:h4|h5|p|span)[^>]*className="[^"]*?)\btruncate\b([^"]*")/g, '$1break-words whitespace-normal leading-snug$2');
  
  // Ensure flex containers holding items have flex-wrap if they are rows
  content = content.replace(/className="([^"]*flex items-center gap-[1-4][^"]*)"/g, (match, p1) => {
     if (!p1.includes('flex-wrap') && !p1.includes('flex-col')) {
         return 'className="' + p1 + ' flex-wrap max-w-full"';
     }
     return match;
  });

  // Ensure flex-1 containers have min-w-0
  content = content.replace(/className="([^"]*flex-1[^"]*)"/g, (match, p1) => {
     if (!p1.includes('min-w-0') && !p1.includes('flex-col')) {
         return 'className="' + p1 + ' min-w-0"';
     }
     return match;
  });

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    totalReplaced++;
    console.log('Fixed:', file);
  }
}
console.log('Total fixed:', totalReplaced);
