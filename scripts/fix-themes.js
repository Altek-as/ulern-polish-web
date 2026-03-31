/**
 * fix-themes.js — Fix visualTheme for lessons 3-17 that got corrupted to 'polish_classroom'
 * Run: node scripts/fix-themes.js
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

// For each lesson, find its visualTheme line by looking for the "    id: N," line
// then finding the visualTheme line within the next ~20 lines
for (const [lessonId, correctTheme] of Object.entries(themeMap)) {
  const idPattern = new RegExp(`\\n    id: ${lessonId},`);
  const idMatch = idPattern.exec(content);
  if (!idMatch) { console.warn(`Lesson ${lessonId}: id not found`); continue; }

  const idOffset = idMatch.index;
  // Look for visualTheme within the next 800 chars after id (covers the lesson header)
  const afterId = content.substring(idOffset, idOffset + 800);
  const themeMatch = /    visualTheme: '([^']+)'/.exec(afterId);

  if (themeMatch) {
    const currentTheme = themeMatch[1];
    if (currentTheme === correctTheme) {
      console.log(`[OK]   Lesson ${lessonId}: already '${correctTheme}'`);
    } else {
      // Replace just this theme reference
      const themePattern = new RegExp(`(\\n    id: ${lessonId},[\\s\\S]{1,800}?)    visualTheme: '${currentTheme}'`);
      content = content.replace(themePattern, `$1    visualTheme: '${correctTheme}'`);
      console.log(`[FIX]  Lesson ${lessonId}: '${currentTheme}' → '${correctTheme}'`);
    }
  } else {
    // Insert visualTheme before sections:
    const insertPattern = new RegExp(`(\\n    id: ${lessonId},[\\s\\S]{1,800}?)    sections: \\[`);
    const insert = `$1    visualTheme: '${correctTheme}',\n    sections: [`;
    content = content.replace(insertPattern, insert);
    console.log(`[ADD]  Lesson ${lessonId}: added '${correctTheme}'`);
  }
}

// Verify all 17 lessons
let correct = 0;
for (const [lessonId, theme] of Object.entries(themeMap)) {
  const re = new RegExp(`\\n    id: ${lessonId},[\\s\\S]{1,800}?    visualTheme: '([^']+)'`);
  const m = content.match(re);
  if (m) {
    if (m[1] === theme) correct++;
    else console.warn(`[FAIL] Lesson ${lessonId}: got '${m[1]}', want '${theme}'`);
  } else {
    console.warn(`[FAIL] Lesson ${lessonId}: no visualTheme found`);
  }
}

console.log(`\nVerification: ${correct}/17 correct`);
fs.writeFileSync(filePath, content);
console.log('[done] lessons.ts saved');
