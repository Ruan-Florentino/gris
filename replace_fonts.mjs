import fs from 'fs';

const replaceFonts = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/text-\[4px\]/g, 'text-[10px]');
  content = content.replace(/text-\[3px\]/g, 'text-[9px]');
  fs.writeFileSync(filePath, content);
};

replaceFonts('components/Sidebar.tsx');
