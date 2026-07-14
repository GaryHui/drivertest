const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bankPath = path.join(root, 'data', 'question-bank.json');
const crosscheckPath = path.join(root, 'data', 'jiakao-crosscheck.json');
const decisionsPath = path.join(root, 'data', 'verification-decisions.json');

const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const crosscheck = JSON.parse(fs.readFileSync(crosscheckPath, 'utf8'));
const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const byId = new Map(bank.questions.map((question) => [question.id, question]));

const highRisk = /记\s*分|扣\s*分|罚\s*款|拘\s*留|吊\s*销|撤\s*销|注\s*销|暂\s*扣|申\s*领|换\s*证|审\s*验|实\s*习\s*期|满\s*分|周\s*岁|有期徒刑|拘役|\d+\s*(?:日|天|年|月|小时|分钟|米|公里|分)/;
const stableSection = /^police-public-[345]\./;
let promoted = 0;

for (const [id, decision] of Object.entries(decisions.decisions)) {
  if (decision.verificationClass === 'stable-safety-exact-crosscheck') delete decisions.decisions[id];
}

for (const result of process.env.REVOKE_GENERATED_CROSSCHECKS === '1' ? [] : crosscheck.results) {
  if (result.status !== 'answer-agrees' || !stableSection.test(result.localId)) continue;
  const question = byId.get(result.localId);
  if (!question || question.needsImage || highRisk.test(question.stem)) continue;
  // 旧版同步曾让专用车型与C1通用题共用编号，非C1隔离结论可能覆盖C1精确匹配。
  // 仅在这种已知碰撞结论下允许稳定同题复核恢复C1题；其他人工结论仍优先。
  if (decisions.decisions[result.localId]
      && decisions.decisions[result.localId].verificationClass !== 'non-c1-scope-exclusion') continue;

  decisions.decisions[result.localId] = {
    expectedAnswer: question.answer,
    verifiedAt: '2026-07-14',
    verificationClass: 'stable-safety-exact-crosscheck',
    note: '公安公开汽车类题库与驾考宝典2026公开C1题页题干完全一致、答案一致；不含记分、处罚、证件、期限或数字规则。',
    evidence: [
      {
        type: 'official-question-bank',
        title: '承德市公安局2025-08-20公开汽车类题库',
        url: 'https://ga.chengde.gov.cn/art/2025/8/20/art_2935_1079682.html',
      },
      {
        type: 'cross-check',
        title: `驾考宝典2026小车科目一公开题 ${result.publicQuestionId}`,
        url: result.evidenceUrl,
      },
    ],
  };
  promoted += 1;
}

fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
console.log(`Promoted ${promoted} stable exact cross-checks.`);
