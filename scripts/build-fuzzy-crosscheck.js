const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data', 'question-bank.json'), 'utf8'));
const exact = JSON.parse(fs.readFileSync(path.join(root, 'data', 'jiakao-crosscheck.json'), 'utf8'));
const cache = JSON.parse(fs.readFileSync(path.join(root, 'audit', 'jiakao-detail-crosscheck-cache.json'), 'utf8'));
const output = path.join(root, 'data', 'jiakao-fuzzy-crosscheck.json');

function normalize(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\s　，。！？；：、“”‘’（）()【】《》〈〉…—·,.!?;:'"`~\-_]/g, '')
    .toLowerCase();
}

function bigrams(value) {
  const counts = new Map();
  for (let index = 0; index < value.length - 1; index += 1) {
    const gram = value.slice(index, index + 2);
    counts.set(gram, (counts.get(gram) || 0) + 1);
  }
  return counts;
}

function dice(left, right) {
  if (left === right) return 1;
  if (left.length < 2 || right.length < 2) return 0;
  const a = bigrams(left);
  const b = bigrams(right);
  let overlap = 0;
  for (const [gram, count] of a) overlap += Math.min(count, b.get(gram) || 0);
  return (2 * overlap) / (left.length - 1 + right.length - 1);
}

const publicQuestions = Object.values(cache).filter((item) => !item.error && item.fingerprint);
const exactStatus = new Map(exact.results.map((item) => [item.localId, item.status]));
const localQuestions = bank.questions.filter((question) =>
  question.category === 'car-general' &&
  !question.needsImage &&
  exactStatus.get(question.id) === 'not-matched-yet'
);

const candidates = localQuestions.map((question) => {
  const localFingerprint = normalize(question.stem);
  let best;
  let second;
  for (const publicQuestion of publicQuestions) {
    const score = dice(localFingerprint, publicQuestion.fingerprint);
    const item = {
      publicQuestionId: publicQuestion.questionId,
      publicAnswer: publicQuestion.answer,
      publicAnswerTextFingerprint: publicQuestion.correctOptionFingerprint,
      evidenceUrl: publicQuestion.url,
      score: Number(score.toFixed(4)),
    };
    if (!best || item.score > best.score) {
      second = best;
      best = item;
    } else if (!second || item.score > second.score) second = item;
  }
  return {
    localId: question.id,
    answer: question.answer,
    best,
    second,
    margin: Number(((best?.score || 0) - (second?.score || 0)).toFixed(4)),
    answerTextFingerprint: normalize(question.options['ABCDEFGH'.indexOf(question.answer)] || ''),
    answerAgrees: Boolean(
      best &&
      normalize(question.options['ABCDEFGH'.indexOf(question.answer)] || '') === best.publicAnswerTextFingerprint
    ),
  };
});

const bands = { high: 0, review: 0, weak: 0 };
for (const item of candidates) {
  if (item.best.score >= 0.9 && item.margin >= 0.05) bands.high += 1;
  else if (item.best.score >= 0.72 && item.margin >= 0.03) bands.review += 1;
  else bands.weak += 1;
}

const payload = {
  generatedAt: new Date().toISOString(),
  algorithm: 'normalized Chinese character bigram Dice; candidate generation only',
  rule: 'Fuzzy matches never change verification status automatically.',
  publicQuestionCount: publicQuestions.length,
  localQuestionCount: localQuestions.length,
  bands,
  candidates,
};
fs.writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(bands));
