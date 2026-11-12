const fs = require('fs');
const path = require('path');

const destCompDir = path.join('C:', 'Users', 'ssree', 'remotion', 'my-video', 'src', 'HowAmericaBecameASuperpower', 'components');

const filesAndReplacements = [
  {
    name: 'TextStyle6.tsx',
    replacements: [
      {
        find: /const sentence = "motion graphics";/,
        replace: 'const sentence = "AMERICA SUPERPOWER";'
      }
    ]
  },
  {
    name: 'VerticalTimelineInfographic.tsx',
    replacements: [
      {
        find: /const TIMELINE_DATA[^\]]+\];/s,
        replace: `const TIMELINE_DATA: TimelineItem[] = [
  {
    id: 'step1',
    emoji: '🇺🇸',
    badgeLabel: 'THE FOUNDATION',
    title: 'INDEPENDENCE',
    textBefore: 'In 1776, the US declared independence, starting a ',
    highlightText: 'new democratic experiment',
    textAfter: ' in the new world.',
    color: '#CC0000',
  },
  {
    id: 'step2',
    emoji: '⚔️',
    badgeLabel: 'GLOBAL CONFLICT',
    title: 'POST-WWII',
    textBefore: 'Emerging victorious, America became an ',
    highlightText: 'economic and military giant',
    textAfter: ' shaping the modern world order.',
    color: '#0033A0',
  },
  {
    id: 'step3',
    emoji: '🚀',
    badgeLabel: 'SPACE & TECH',
    title: 'APOLLO 11',
    textBefore: 'Winning the space race secured US dominance in ',
    highlightText: 'technological innovation',
    textAfter: ' for decades.',
    color: '#CC0000',
  },
  {
    id: 'step4',
    emoji: '🌎',
    badgeLabel: 'UNIPOLAR WORLD',
    title: 'END OF COLD WAR',
    textBefore: 'The 1991 collapse of the USSR left the US as the ',
    highlightText: 'sole global superpower',
    textAfter: '.',
    color: '#0033A0',
  }
];`
      }
    ]
  },
  {
    name: 'BlockChart.tsx',
    replacements: [
      { find: /Category A/, replace: 'Defense Spending' },
      { find: /Category B/, replace: 'Aircraft Carriers' },
      { find: /Category C/, replace: 'Military Bases' },
      { find: /Category D/, replace: 'Fighter Jets' },
      { find: /Category E/, replace: 'Nuclear Arsenal' },
      { find: /Category F/, replace: 'Satellite Networks' },
      { find: /Category G/, replace: 'Cyber Command' },
      { find: /Category H/, replace: 'Active Personnel' }
    ]
  },
  {
    name: 'AreaChart.tsx',
    replacements: [
      { find: /'Jan'/, replace: "'1850'" },
      { find: /'Feb'/, replace: "'1900'" },
      { find: /'Mar'/, replace: "'1920'" },
      { find: /'Apr'/, replace: "'1940'" },
      { find: /'May'/, replace: "'1950'" },
      { find: /'Jun'/, replace: "'1970'" },
      { find: /'Jul'/, replace: "'1980'" },
      { find: /'Aug'/, replace: "'1990'" },
      { find: /'Sep'/, replace: "'2000'" },
      { find: /'Oct'/, replace: "'2010'" },
      { find: /'Nov'/, replace: "'2020'" },
      { find: /'Dec'/, replace: "'2025'" }
    ]
  },
  {
    name: 'RadialProgressChart.tsx',
    replacements: [
      { find: /Teal Category/, replace: 'Global GDP Share' },
      { find: /Pink Category/, replace: 'Top Tech Firms' },
      { find: /Orange Category/, replace: 'Cultural Export' },
      { find: /Purple Category/, replace: 'Reserve Currency' }
    ]
  },
  {
    name: 'PyramidInfographic.tsx',
    replacements: [
      {
        find: /const LAYERS[^\]]+\];/s,
        replace: `const LAYERS: LayerData[] = [
  { percent: '10%', label: 'Global Cultural Dominance', subtext: 'Music, Movies, Media', color: '#CC0000', clipPath: 'polygon(50% 0%, 37.5% 100%, 62.5% 100%)' },
  { percent: '50%', label: 'Technological Leadership', subtext: 'Silicon Valley, AI, Space', color: '#0033A0', clipPath: 'polygon(37.5% 0%, 25% 100%, 75% 100%, 62.5% 0%)' },
  { percent: '30%', label: 'Economic Supremacy', subtext: 'USD Reserve, Global Markets', color: '#CC0000', clipPath: 'polygon(25% 0%, 12.5% 100%, 87.5% 100%, 75% 0%)' },
  { percent: '10%', label: 'Military Hegemony', subtext: 'Global Bases, Alliances', color: '#0033A0', clipPath: 'polygon(12.5% 0%, 0% 100%, 100% 100%, 87.5% 0%)' }
];`
      }
    ]
  }
];

// General Replacements for LowerThirds and Callouts
const genericFiles = [
  'LowerThird1.tsx', 'LowerThird2.tsx', 'LowerThird3.tsx', 'LowerThird4.tsx',
  'Callout1.tsx', 'Callout2.tsx', 'Callout3.tsx'
];

genericFiles.forEach(name => {
  filesAndReplacements.push({
    name: name,
    replacements: [
      { find: /'TEXT SPACE GOES HERE'/g, replace: "'HISTORICAL MILESTONES'" },
      { find: /'Lorem Ipsum Dolor Sit Amet'/g, replace: "'The Foundation of Global Influence'" },
      { find: /'USA POWER'/g, replace: "'GLOBAL REACH'" },
      { find: /'AMERICA'/g, replace: "'SUPERPOWER'" }
    ]
  });
});

filesAndReplacements.forEach(fileData => {
  const filePath = path.join(destCompDir, fileData.name);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    fileData.replacements.forEach(rep => {
      content = content.replace(rep.find, rep.replace);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + fileData.name);
  }
});
