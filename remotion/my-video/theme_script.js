const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'ssree', 'remotion', 'my-video', 'src');
const destDir = path.join(srcDir, 'HowAmericaBecameASuperpower');
const destCompDir = path.join(destDir, 'components');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
if (!fs.existsSync(destCompDir)) fs.mkdirSync(destCompDir, { recursive: true });

const filesToTheme = [
  'infografics/VerticalTimelineInfographic.tsx',
  'infografics/BlockChart.tsx',
  'infografics/AreaChart.tsx',
  'infografics/RadialProgressChart.tsx',
  'infografics/PyramidInfographic.tsx',
  'callouts/Callout1.tsx',
  'callouts/Callout2.tsx',
  'callouts/Callout3.tsx',
  'Lowerthird/LowerThird1.tsx',
  'Lowerthird/LowerThird2.tsx',
  'Lowerthird/LowerThird3.tsx',
  'Lowerthird/LowerThird4.tsx',
  'TextStyle6.tsx'
];

filesToTheme.forEach(relPath => {
  const sourceFile = path.join(srcDir, relPath);
  if (fs.existsSync(sourceFile)) {
    let content = fs.readFileSync(sourceFile, 'utf8');
    
    // Convert most colors to Red / Blue / White
    content = content.replace(/#(?:[0-9a-fA-F]{3}){1,2}\b/g, (match) => {
      const m = match.toLowerCase();
      if (m === '#fff' || m === '#ffffff') return m;
      if (m === '#000' || m === '#000000' || m === '#111' || m === '#222' || m === '#333') return '#0033A0'; // replace darks with blue
      return '#CC0000'; // Everything else to Red
    });

    content = content.replace(/rgba\([^)]+\)/g, (match) => {
      if (match.includes('255, 255, 255')) return match;
      if (match.includes('0, 0, 0')) return 'rgba(0, 51, 160, 0.5)';
      return 'rgba(204, 0, 0, 0.8)';
    });
    
    // A quick hack for specific text that might be hardcoded in these files
    content = content.replace(/badgeText = '[^']+'/g, `badgeText = 'USA POWER'`);
    content = content.replace(/headlineText = '[^']+'/g, `headlineText = 'AMERICA'`);

    const fileName = path.basename(sourceFile);
    fs.writeFileSync(path.join(destCompDir, fileName), content);
    console.log('Processed: ' + fileName);
  } else {
    console.log('Missing: ' + sourceFile);
  }
});
