const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data', 'question-bank.json'), 'utf8'));
const fuzzy = JSON.parse(fs.readFileSync(path.join(root, 'data', 'jiakao-fuzzy-crosscheck.json'), 'utf8'));
const decisionsPath = path.join(root, 'data', 'verification-decisions.json');
const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const questions = new Map(bank.questions.map((question) => [question.id, question]));
const candidates = new Map(fuzzy.candidates.map((candidate) => [candidate.localId, candidate]));

const reviewed = [
  {
    localId: 'police-public-4.1.1.6',
    expectedAnswer: 'A',
    publicQuestionId: '879000',
    note: '同方向3条以上车道，最左侧车道最低车速为110公里/小时；同向4车道且车速高于110公里/小时应在最左侧车道行驶。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第七十八条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
];

let promoted = 0;
for (const item of reviewed) {
  const question = questions.get(item.localId);
  const candidate = candidates.get(item.localId);
  if (!question || question.answer !== item.expectedAnswer) throw new Error(`Local answer changed: ${item.localId}`);
  if (!candidate || candidate.best.publicQuestionId !== item.publicQuestionId) {
    throw new Error(`Public cross-check changed: ${item.localId}`);
  }
  decisions.decisions[item.localId] = {
    expectedAnswer: item.expectedAnswer,
    verifiedAt: '2026-07-14',
    verificationClass: 'current-regulation-and-public-crosscheck',
    note: item.note,
    evidence: [
      { type: 'law', title: item.lawTitle, url: item.lawUrl },
      {
        type: 'cross-check',
        title: `驾考宝典2026小车科目一公开题 ${item.publicQuestionId}`,
        url: candidate.best.evidenceUrl,
      },
    ],
  };
  promoted += 1;
}

fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
console.log(`Promoted ${promoted} regulation-backed cross-checks.`);
