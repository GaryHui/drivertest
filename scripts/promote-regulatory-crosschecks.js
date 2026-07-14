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
  {
    localId: 'police-public-1.2.2.4',
    expectedAnswer: 'A',
    publicQuestionId: '833500',
    note: '实习期驾驶机动车，应当在车身后部粘贴或者悬挂统一式样的实习标志。',
    lawTitle: '《机动车驾驶证申领和使用规定》（公安部令第172号）第七十六条',
    lawUrl: 'https://www.gov.cn/gongbao/2025/issue_11866/202502/content_7004031.html',
    supportingEvidence: {
      title: '福州市公安局关于公安部令第172号实习期规定的解读',
      url: 'https://gaj.fuzhou.gov.cn/jwxx/ztlm/rjzc/jgdt/202509/t20250905_5074141.htm',
    },
  },
  {
    localId: 'police-public-1.7.2.15',
    expectedAnswer: 'A',
    publicQuestionId: '832300',
    note: '驾驶人在驾驶证核发地车辆管理所管辖区以外居住，可以向居住地车辆管理所申请换证。',
    lawTitle: '《机动车驾驶证申领和使用规定》第六十四条',
    lawUrl: 'https://www.gov.cn/gongbao/content/2022/content_5679696.htm',
  },
  {
    localId: 'police-public-4.1.2.7',
    expectedAnswer: 'A',
    publicQuestionId: '879700',
    note: '高速公路车速达到每小时100公里时，保持100米以上属于安全距离；法规同时规定，车速超过每小时100公里时应当保持100米以上距离。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第八十条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-1.1.2.33',
    expectedAnswer: 'A',
    publicQuestionId: '819700',
    note: '机动车在道路上临时停车，不得妨碍其他车辆和行人通行。',
    lawTitle: '《中华人民共和国道路交通安全法》第五十六条',
    lawUrl: 'http://www.npc.gov.cn/zgrdw/npc//zfjc/zfjcelys/2016-12/13/content_2003512.htm',
  },
  {
    localId: 'police-public-1.1.2.41',
    expectedAnswer: 'A',
    publicQuestionId: '1130900',
    note: '造成交通事故后逃逸的，吊销机动车驾驶证，且终生不得重新取得机动车驾驶证。',
    lawTitle: '《中华人民共和国道路交通安全法》第一百零一条',
    lawUrl: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
  },
  {
    localId: 'police-public-1.1.2.36',
    expectedAnswer: 'A',
    publicQuestionId: '823000',
    note: '机动车在高速公路发生故障或者交通事故且无法正常行驶，应由救援车、清障车拖曳、牵引。',
    lawTitle: '《中华人民共和国道路交通安全法》第六十八条',
    lawUrl: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
  },
  {
    localId: 'police-public-1.2.2.31',
    expectedAnswer: 'A',
    publicQuestionId: '824100',
    note: '不得在机动车驾驶室前后窗范围内悬挂、放置妨碍驾驶人视线的物品。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第六十二条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-1.6.2.1',
    expectedAnswer: 'B',
    publicQuestionId: '830700',
    note: '碰撞建筑物、公共设施或者其他设施造成损毁，应当报警等候处理，不得驶离。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第八十八条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-1.3.2.1',
    expectedAnswer: 'A',
    publicQuestionId: '827700',
    note: '违反交通运输管理法规发生重大事故，使公私财产遭受重大损失并构成交通肇事罪，处三年以下有期徒刑或者拘役。',
    lawTitle: '《中华人民共和国刑法》第一百三十三条',
    lawUrl: 'https://www.npc.gov.cn/WZWSREL3pncmR3L25wYy9mbHN5eXdkL2Zsd2QvMjAwMi0wNC8xOS9jb250ZW50XzI5MzMzNS5odG0%3D',
  },
  {
    localId: 'police-public-1.2.1.78',
    expectedAnswer: 'D',
    publicQuestionId: '878900',
    note: '机动车在高速公路行驶，非紧急情况不得在应急车道行驶或者停车。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第八十二条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-1.2.1.61',
    expectedAnswer: 'C',
    publicQuestionId: '823600',
    note: '连续驾驶机动车超过4小时，应停车休息且停车休息时间不少于20分钟。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第六十二条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-1.1.1.61',
    expectedAnswer: 'B',
    publicQuestionId: '1134600',
    note: '将机动车交由未取得机动车驾驶证的人驾驶，除罚款外可以并处吊销机动车驾驶证。',
    lawTitle: '《中华人民共和国道路交通安全法》第九十九条',
    lawUrl: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
  },
  {
    localId: 'police-public-1.2.2.40',
    expectedAnswer: 'A',
    publicQuestionId: '1130500',
    note: '高速公路能见度小于50米时，车速不得超过每小时20公里，并从最近出口尽快驶离。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第八十一条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-4.1.2.13',
    expectedAnswer: 'A',
    publicQuestionId: '1130500',
    note: '高速公路能见度小于100米时，车速不得超过每小时40公里，与同车道前车保持50米以上距离。',
    lawTitle: '《中华人民共和国道路交通安全法实施条例》第八十一条',
    lawUrl: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
  },
  {
    localId: 'police-public-1.1.1.62',
    expectedAnswer: 'D',
    publicQuestionId: '1134600',
    note: '将机动车交由驾驶证被吊销、暂扣的人驾驶，除罚款外可以并处吊销机动车驾驶证。',
    lawTitle: '《中华人民共和国道路交通安全法》第九十九条',
    lawUrl: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
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
      ...(item.supportingEvidence
        ? [{ type: 'official-explanation', ...item.supportingEvidence }]
        : []),
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
