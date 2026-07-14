const fs = require('fs');
const path = require('path');

const input = process.argv[2] || path.join('audit', 'jiakao-exercise-main.js');
const output = process.argv[3] || path.join('data', 'jiakao-public-index.json');
const source = fs.readFileSync(input, 'utf8');

function extractObjectAfter(marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing marker: ${marker}`);

  const start = source.indexOf('{', markerIndex + marker.length);
  if (start < 0) throw new Error(`Missing object after marker: ${marker}`);

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Unterminated object after marker: ${marker}`);
}

const chapterSource = extractObjectAfter('car:{kemu1:');
const chapters = Function(`"use strict"; return (${chapterSource});`)();
const chapterEntries = Object.entries(chapters).map(([chapterId, ids]) => ({
  chapterId,
  questionIds: ids.map(String),
}));
const questionIds = [...new Set(chapterEntries.flatMap((item) => item.questionIds))];

const payload = {
  source: {
    provider: '驾考宝典',
    page: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    scope: 'car-kemu1',
    role: 'cross-check-only',
  },
  capturedAt: new Date().toISOString(),
  chapterCount: chapterEntries.length,
  questionCount: questionIds.length,
  chapters: chapterEntries,
  questionIds,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Extracted ${payload.questionCount} current public C1 IDs across ${payload.chapterCount} chapters.`);
