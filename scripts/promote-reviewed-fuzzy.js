const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data', 'question-bank.json'), 'utf8'));
const fuzzy = JSON.parse(fs.readFileSync(path.join(root, 'data', 'jiakao-fuzzy-crosscheck.json'), 'utf8'));
const decisionsPath = path.join(root, 'data', 'verification-decisions.json');
const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const questions = new Map(bank.questions.map((question) => [question.id, question]));
const candidates = new Map(fuzzy.candidates.map((candidate) => [candidate.localId, candidate]));

// Explicitly reviewed one by one on 2026-07-14. Numeric/legal high-risk questions are intentionally absent.
const approved = new Set([
  'police-public-3.2.1.11', 'police-public-3.3.1.3', 'police-public-3.3.1.16',
  'police-public-3.3.1.20', 'police-public-3.3.1.28', 'police-public-3.3.1.29',
  'police-public-3.4.1.1', 'police-public-3.4.1.3', 'police-public-3.4.1.9',
  'police-public-3.4.1.12', 'police-public-3.4.1.25', 'police-public-3.4.1.26',
  'police-public-3.4.1.27', 'police-public-3.4.1.31', 'police-public-3.4.1.49',
  'police-public-3.4.1.50', 'police-public-3.4.1.58', 'police-public-3.4.1.59',
  'police-public-3.4.1.61', 'police-public-3.4.1.63', 'police-public-3.4.2.4',
  'police-public-3.4.2.7', 'police-public-3.4.2.39', 'police-public-4.1.1.12',
  'police-public-4.1.2.12', 'police-public-4.4.2.7',
  'police-public-3.3.1.7', 'police-public-3.3.1.8', 'police-public-3.4.1.53',
  'police-public-3.4.1.56', 'police-public-3.4.2.2', 'police-public-4.2.2.5',
  'police-public-5.1.1.6', 'police-public-3.4.1.15', 'police-public-4.1.1.1',
  'police-public-3.2.2.7', 'police-public-3.4.1.19', 'police-public-3.4.1.21',
  'police-public-3.2.1.8',
  'police-public-3.4.1.11', 'police-public-3.4.1.8', 'police-public-3.4.1.52',
  'police-public-5.3.2.3', 'police-public-3.4.1.41', 'police-public-4.2.1.3',
  'police-public-3.3.1.23',
]);

let promoted = 0;
for (const localId of approved) {
  const question = questions.get(localId);
  const candidate = candidates.get(localId);
  if (!question || !candidate) throw new Error(`Missing reviewed candidate ${localId}`);
  if (candidate.best.score < 0.8 || candidate.margin < 0.05 || !candidate.answerAgrees) {
    throw new Error(`Reviewed candidate no longer passes text checks: ${localId}`);
  }
  decisions.decisions[localId] = {
    expectedAnswer: question.answer,
    verifiedAt: '2026-07-14',
    verificationClass: 'stable-safety-reviewed-fuzzy',
    note: `人工复核：题干仅有轻微措辞差异（Dice ${candidate.best.score}），正确选项文字一致；不涉及数字或处罚规则。`,
    evidence: [
      {
        type: 'official-question-bank',
        title: '承德市公安局2025-08-20公开汽车类题库',
        url: 'https://ga.chengde.gov.cn/art/2025/8/20/art_2935_1079682.html',
      },
      {
        type: 'cross-check',
        title: `驾考宝典2026小车科目一公开题 ${candidate.best.publicQuestionId}`,
        url: candidate.best.evidenceUrl,
      },
    ],
  };
  promoted += 1;
}

fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
console.log(`Promoted ${promoted} manually reviewed fuzzy matches.`);
