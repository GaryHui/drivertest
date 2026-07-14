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
  {
    localId: 'police-public-1.1.1.44',
    verificationClass: 'superseded-penalty-exclusion',
    note: '旧规隔离：题库答案“暂扣1个月以上3个月、罚200元以上500元”已失效；现行为暂扣6个月，并处1000元以上2000元罚款。',
    evidence: [
      {
        type: 'law',
        title: '《中华人民共和国道路交通安全法》第九十一条',
        url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
      },
      {
        type: 'cross-check',
        title: '驾考宝典当前公开题：饮酒驾驶机动车一次记12分（解析载明现行处罚）',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-834100.html',
      },
    ],
  },
  {
    localId: 'police-public-1.1.1.45',
    verificationClass: 'superseded-penalty-exclusion',
    note: '旧规隔离：题库答案“15日以下拘留、暂扣3至6个月、罚500至2000元”已失效；现行醉酒驾驶为吊销驾驶证、依法追究刑事责任，5年内不得重新取得。',
    evidence: [
      {
        type: 'law',
        title: '《中华人民共和国道路交通安全法》第九十一条',
        url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
      },
      {
        type: 'cross-check',
        title: '驾考宝典当前公开C1题：醉酒驾驶刑事处罚及吊证规则',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-828500.html',
      },
    ],
  },
  {
    localId: 'police-public-1.1.1.52',
    verificationClass: 'superseded-penalty-exclusion',
    note: '旧规隔离：虽然空格处“扣留该机动车”仍正确，但题干所写200元以上2000元以下罚款已失效；现行处罚包含15日以下拘留并处2000元以上5000元以下罚款。',
    evidence: [
      {
        type: 'law',
        title: '《中华人民共和国道路交通安全法》第九十六条',
        url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
      },
      {
        type: 'cross-check',
        title: '驾考宝典当前公开C1题：伪造、变造机动车证件的现行处罚',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-801700.html',
      },
    ],
  },
  {
    localId: 'police-public-1.1.1.53',
    verificationClass: 'superseded-penalty-exclusion',
    note: '旧规隔离：虽然空格处“扣留该机动车”仍正确，但题干所写200元以上2000元以下罚款已失效；现行罚款为2000元以上5000元以下。',
    evidence: [
      {
        type: 'law',
        title: '《中华人民共和国道路交通安全法》第九十六条',
        url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
      },
      {
        type: 'cross-check',
        title: '驾考宝典当前公开C1题：使用其他车辆牌证的现行处罚',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-829500.html',
      },
    ],
  },
];

for (const question of bank.questions) {
  if (question.category !== 'car-general' || question.vehicle !== 'C1' || !question.needsImage) continue;
  exclusions.push({
    localId: question.id,
    verificationClass: 'missing-original-image-exclusion',
    note: '隔离：原始附件未保留本题所需图片，无法确认图示内容与答案；找回原图并重新核验前不得进入练习。',
    evidence: [
      {
        type: 'source',
        title: `${question.source.name}（原始导入记录标记为缺图）`,
        url: question.source.url,
      },
    ],
  });
}

for (const question of bank.questions) {
  if (question.category === 'car-general' && question.vehicle === 'C1') continue;
  exclusions.push({
    localId: question.id,
    verificationClass: 'non-c1-scope-exclusion',
    note: `隔离：本题分类为${question.category}、准驾车型为${question.vehicle}，不属于C1小型汽车科目一通用练习范围。`,
    evidence: [
      {
        type: 'source',
        title: `${question.source.name}（原始章节/车型分类）`,
        url: question.source.url,
      },
    ],
  });
}

for (const question of bank.questions) {
  if (question.review.status !== 'excluded' || decisions.decisions[question.id]) continue;
  const ageRule = /年龄|60\s*(周岁|岁)|63\s*(周岁|岁)/.test(`${question.stem} ${question.options.join(' ')}`);
  exclusions.push({
    localId: question.id,
    verificationClass: ageRule ? 'superseded-age-rule-exclusion' : 'legacy-rule-exclusion',
    note: `隔离：${question.review.reason}；完成现行条文与当前公开题页逐题复核前不得进入练习。`,
    evidence: [
      {
        type: 'source',
        title: `${question.source.name}（旧版附件来源）`,
        url: question.source.url,
      },
      {
        type: 'current-regulation',
        title: ageRule
          ? '《机动车驾驶证申领和使用规定》（公安部令第172号）'
          : '《道路交通安全违法行为记分管理办法》（公安部令第163号）',
        url: ageRule
          ? 'https://www.gov.cn/gongbao/2025/issue_11866/202502/content_7004031.html'
          : 'https://www.gov.cn/gongbao/content/2022/content_5679697.htm',
      },
    ],
  });
}

for (const item of exclusions) {
  if (!questions.has(item.localId)) throw new Error(`Missing exclusion candidate ${item.localId}`);
  decisions.decisions[item.localId] = {
    status: 'excluded',
    verifiedAt: '2026-07-14',
    verificationClass: item.verificationClass || 'reviewed-scope-exclusion',
    note: item.note,
    evidence: item.evidence,
  };
}

fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
console.log(`Recorded ${exclusions.length} reviewed exclusions.`);
