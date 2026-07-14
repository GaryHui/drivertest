const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data', 'question-bank.json'), 'utf8'));
const decisionsPath = path.join(root, 'data', 'verification-decisions.json');
const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const questions = new Map(bank.questions.map((question) => [question.id, question]));

const exclusions = [
  {
    localId: 'police-public-1.1.2.31',
    note: '隔离：题干涉及前置式翻斗车专用锁止机构，无法可靠归入C1小型汽车通用考试范围；当前公开题页模糊匹配不足以证明同题。',
    evidence: [
      {
        type: 'source',
        title: '承德市公安局公开汽车类题库原始附件',
        url: 'https://ga.chengde.gov.cn/art/2025/8/20/art_2935_1079682.html',
      },
      {
        type: 'cross-check-rejected',
        title: '驾考宝典公开题页模糊候选 814600（相似度不足，不能作为同题证据）',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-814600.html',
      },
    ],
  },
];

for (const item of exclusions) {
  if (!questions.has(item.localId)) throw new Error(`Missing exclusion candidate ${item.localId}`);
  decisions.decisions[item.localId] = {
    status: 'excluded',
    verifiedAt: '2026-07-14',
    verificationClass: 'reviewed-scope-exclusion',
    note: item.note,
    evidence: item.evidence,
  };
}

fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
console.log(`Recorded ${exclusions.length} reviewed exclusions.`);
