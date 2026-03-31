/**
 * patch-lessons.js — Fix visualTheme for all lessons in lessons.ts
 * Replaces the complete header block (completed+started+sections) with the correct theme
 * Run: node scripts/patch-lessons.js
 */
const fs = require('fs');
const path = require('path');

const themeMap = {
  1: 'polish_classroom',
  2: 'street_cafe',
  3: 'market_square',
  4: 'home_study',
  5: 'traditional_restaurant',
  6: 'city_street_intersection',
  7: 'clock_tower_square',
  8: 'home_living_room',
  9: 'art_studio',
  10: 'boutique_shop',
  11: 'train_station_platform',
  12: 'city_park_weather',
  13: 'modern_clinic',
  14: 'university_lecture_hall',
  15: 'modern_home_office',
  16: 'smartphone_call',
  17: 'modern_office_building'
};

const filePath = path.join(__dirname, '..', 'lib', 'data', 'lessons.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern matching: "    completed: <bool>,\n    started: <bool>,\n    sections: ["
const headerRegex = /    completed: (true|false),\n    started: (true|false),\n    sections: \[/g;
const matches = [];
let m;
while ((m = headerRegex.exec(content)) !== null) {
  matches.push({ offset: m.index, text: m[0], completed: m[1], started: m[2] });
}

console.log(`Found ${matches.length} lesson headers`);

// Process matches from bottom to top (so offsets stay valid)
for (let i = matches.length - 1; i >= 0; i--) {
  const mm = matches[i];
  const lessonNum = i + 1;
  const theme = themeMap[lessonNum];
  if (!theme) { console.warn(`No theme for lesson ${lessonNum}`); continue; }

  const oldBlock = `    completed: ${mm.completed},\n    started: ${mm.started},\n    sections: [`;
  const newBlock = `    completed: ${mm.completed},\n    started: ${mm.started},\n    visualTheme: '${theme}',\n    sections: [`;

  // Only replace at this specific offset
  if (content.substring(mm.offset, mm.offset + oldBlock.length) === oldBlock) {
    content = content.substring(0, mm.offset) + newBlock + content.substring(mm.offset + oldBlock.length);
    console.log(`[OK]   Lesson ${lessonNum} → ${theme}`);
  } else {
    // The content at this offset has changed (possibly already has visualTheme)
    const atOffset = content.substring(mm.offset, mm.offset + 80);
    console.warn(`[WARN] Lesson ${lessonNum} block mismatch at offset ${mm.offset}, found: ${JSON.stringify(atOffset)}`);
    // Try to fix by replacing the entire visualTheme+sections block
    const fullPattern = /    visualTheme: '[^']*',\n    sections: \[/;
    const fixed = content.replace(fullPattern, `    visualTheme: '${theme}',\n    sections: [`);
    if (fixed !== content) {
      content = fixed;
      console.log(`[FIX]  Lesson ${lessonNum} → ${theme}`);
    }
  }
}

// Verify
let correct = 0, wrong = 0;
for (const [id, theme] of Object.entries(themeMap)) {
  const re = new RegExp(`\\n    id: ${id},[\\s\\S]*?visualTheme: '([^']*)'`);
  const match = content.match(re);
  if (match) {
    if (match[1] === theme) correct++;
    else { wrong++; console.warn(`[WARN] Lesson ${id}: got '${match[1]}', expected '${theme}'`); }
  } else {
    wrong++;
    console.warn(`[WARN] Lesson ${id}: visualTheme not found`);
  }
}

console.log(`\nVerification: ${correct}/17 correct, ${wrong} wrong`);
fs.writeFileSync(filePath, content);
console.log('[done] lessons.ts saved');
