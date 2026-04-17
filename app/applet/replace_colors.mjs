import fs from 'fs';

const replaceColors = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/#081018/g, 'var(--gris-surface)');
  content = content.replace(/#00FF9C/g, 'var(--gris-emerald)');
  content = content.replace(/#00E5FF/g, 'var(--gris-sky)');
  content = content.replace(/#FF3B3B/g, 'var(--gris-red)');
  content = content.replace(/#FFB800/g, 'var(--gris-amber)');
  content = content.replace(/#E8F0FF/g, 'var(--gris-text-primary)');
  content = content.replace(/#FF0000/g, 'var(--gris-red)');
  content = content.replace(/#02040A/g, 'var(--gris-void)');
  content = content.replace(/#FF2D78/g, 'var(--gris-pink)');
  fs.writeFileSync(filePath, content);
};

replaceColors('components/Header.tsx');
replaceColors('components/Sidebar.tsx');
replaceColors('components/AIAnalyst.tsx');
replaceColors('components/WarRoom.tsx');
replaceColors('components/StatsDashboard.tsx');
