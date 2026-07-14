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

const uncorroboratedCurrentRules = [
  ['police-public-1.1.1.46', '违法停车且驾驶人不在现场、妨碍通行的罚款题'],
  ['police-public-1.1.1.47', '违法停车且驾驶人在现场拒绝驶离的罚款题'],
  ['police-public-1.1.1.51', '不按规定安装机动车号牌的警告或罚款题'],
  ['police-public-1.1.1.54', '非法安装警报器、标志灯具的罚款题'],
  ['police-public-1.1.1.72', '逾期不履行行政处罚决定的强制执行题'],
  ['police-public-1.1.1.73', '交通违法行为人15日内接受处理题'],
  ['police-public-1.1.1.74', '无正当理由逾期未接受处理的吊证题'],
  ['police-public-1.1.2.34', '设计最高时速低于70公里的机动车能否进入高速公路题'],
  ['police-public-1.1.2.38', '道路交通安全违法行为处罚种类题'],
  ['police-public-1.1.2.42', '到期不缴罚款每日加处3%题'],
  ['police-public-1.1.2.43', '道路交通安全法“道路”定义题'],
  ['police-public-1.1.2.44', '广场、公共停车场是否属于“道路”题'],
  ['police-public-1.1.2.45', '道路交通安全法“交通事故”定义题'],
];

exclusions.push({
  localId: 'police-public-1.3.1.1',
  verificationClass: 'superseded-wording-exclusion',
  note: '旧表述隔离：题干把“因逃逸致人死亡”写成7年以上15年以下；现行刑法第一百三十三条及当前C1公开题均表述为7年以上有期徒刑。为避免学生把15年误记成该条文固定上限，本题不开放。',
  evidence: [
    {
      type: 'law', title: '《中华人民共和国刑法》第一百三十三条',
      url: 'https://www.npc.gov.cn/zgrdw/npc/lfzt/rlys/2008-08/21/content_1882895.htm',
    },
    {
      type: 'cross-check', title: '驾考宝典当前公开C1题：因逃逸致人死亡处7年以上有期徒刑',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-827900.html',
    },
  ],
});

exclusions.push(...uncorroboratedCurrentRules.map(([localId, label]) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: `证据不足隔离：${label}在现行法规中可找到相关规则，但在2026-07-14抓取的驾考宝典当前C1公开索引及1168个可读详情页中未找到可靠同题；补齐当前题页交叉证据前不得开放。`,
  evidence: [
    {
      type: 'law',
      title: '现行道路交通安全法律法规检索入口',
      url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（未检出可靠同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedCivilRules = [
  ['police-public-1.4.1.1', '危险由自然原因引起时紧急避险人的民事责任题'],
  ['police-public-1.4.2.1', '机动车撞伤行人的概括性民事责任题'],
  ['police-public-1.4.2.2', '紧急避险措施不当造成损害的民事责任题'],
  ['police-public-1.4.2.3', '因过错侵害他人人身财产的民事责任题'],
  ['police-public-1.4.2.4', '正常行驶意外致人伤亡是否当然承担刑事与行政责任题'],
];

exclusions.push(...uncorroboratedCivilRules.map(([localId, label]) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: `证据不足隔离：${label}可在现行民法典等法律中找到相关原则，但在2026-07-14抓取的驾考宝典当前C1公开索引及1168个可读详情页中未找到可靠同题；补齐当前题页交叉证据前不得开放。`,
  evidence: [
    {
      type: 'law', title: '《中华人民共和国民法典》（全国人大法律文本）',
      url: 'https://wb.flk.npc.gov.cn/flfg/PDF/bd53dd912c1048f2aecbaa229238334b.pdf',
    },
    {
      type: 'cross-check-absent', title: '驾考宝典2026小车科目一公开顺序练习（未检出可靠同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedEnforcementProcedureIds = [
  'police-public-1.5.1.1', 'police-public-1.5.1.2', 'police-public-1.5.1.3',
  'police-public-1.5.1.5', 'police-public-1.5.1.6', 'police-public-1.5.1.7',
  'police-public-1.5.1.8', 'police-public-1.5.1.9', 'police-public-1.5.1.10',
  'police-public-1.5.2.1', 'police-public-1.5.2.2', 'police-public-1.5.2.3',
  'police-public-1.5.2.5', 'police-public-1.5.2.6', 'police-public-1.5.2.8',
  'police-public-1.5.2.9', 'police-public-1.5.2.10', 'police-public-1.5.2.11',
  'police-public-1.5.2.12', 'police-public-1.5.2.13', 'police-public-1.5.2.14',
  'police-public-1.5.2.16', 'police-public-1.5.2.17',
];

exclusions.push(...uncorroboratedEnforcementProcedureIds.map((localId) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: '证据不足隔离：本题属于旧版交通违法处理程序细节；已对照公安部令第157号现行程序规定，但在2026-07-14抓取的驾考宝典当前C1公开索引及1168个可读详情页中未找到可靠同题。为避免把旧程序措辞教给学生，补齐当前题页证据前不开放。',
  evidence: [
    {
      type: 'current-regulation', title: '《道路交通安全违法行为处理程序规定》（公安部令第157号）',
      url: 'https://www.beijing.gov.cn/zhengce/zhengcefagui/202004/t20200415_1803977.html',
    },
    {
      type: 'cross-check-absent', title: '驾考宝典2026小车科目一公开顺序练习（未检出可靠同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedAccidentProcedureIds = [
  'police-public-1.6.1.1', 'police-public-1.6.1.2', 'police-public-1.6.1.3',
  'police-public-1.6.2.4', 'police-public-1.6.2.5', 'police-public-1.6.2.6',
];

exclusions.push(...uncorroboratedAccidentProcedureIds.map((localId) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: '证据不足隔离：本题属于旧版道路交通事故处理或调解程序细节；已对照现行事故处理程序规定，但在2026-07-14抓取的驾考宝典当前C1公开索引及1168个可读详情页中未找到可靠同题。补齐当前题页证据前不开放。',
  evidence: [
    {
      type: 'current-regulation', title: '《道路交通事故处理程序规定》（公安部令第146号）',
      url: 'https://www.gov.cn/zhengce/2021-12/25/content_5712900.htm',
    },
    {
      type: 'cross-check-absent', title: '驾考宝典2026小车科目一公开顺序练习（未检出可靠同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedRegistrationIds = [
  'police-public-1.8.1.1', 'police-public-1.8.1.2', 'police-public-1.8.2.1',
  'police-public-1.8.2.2', 'police-public-1.8.2.3', 'police-public-1.8.2.6',
  'police-public-1.8.2.8',
];

exclusions.push(...uncorroboratedRegistrationIds.map((localId) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: '证据不足隔离：本题属于旧版机动车登记、变更或转让程序细节；已对照公安部令第164号现行《机动车登记规定》，但在2026-07-14抓取的驾考宝典当前C1公开索引及1168个可读详情页中未找到可靠同题。补齐当前题页证据前不开放。',
  evidence: [
    {
      type: 'current-regulation', title: '《机动车登记规定》（公安部令第164号）',
      url: 'https://www.moj.gov.cn/pub/sfbgw/flfggz/flfggzbmgz/202305/t20230509_478410.html',
    },
    {
      type: 'cross-check-absent', title: '驾考宝典2026小车科目一公开顺序练习（未检出可靠同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

exclusions.push({
  localId: 'police-public-1.8.2.5',
  verificationClass: 'current-regulation-answer-conflict',
  note: '答案冲突隔离：旧题把“改变车身颜色后10日内申请变更登记”判为错误；公安部令第164号第十六条明确规定，改变车身颜色后应在10日内申请变更登记，当前公开题也确认需要办理变更登记。',
  evidence: [
    {
      type: 'current-regulation', title: '《机动车登记规定》第十六条',
      url: 'https://www.moj.gov.cn/pub/sfbgw/flfggz/flfggzbmgz/202305/t20230509_478410.html',
    },
    {
      type: 'cross-check', title: '驾考宝典当前公开C1题：改变车身颜色应办理变更登记',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-1123900.html',
    },
  ],
});

const uncorroboratedCompulsoryInsuranceIds = [
  'police-public-1.9.1.1', 'police-public-1.9.1.2', 'police-public-1.9.1.3',
  'police-public-1.9.1.4', 'police-public-1.9.1.5', 'police-public-1.9.1.6',
  'police-public-1.9.1.7', 'police-public-1.9.1.8', 'police-public-1.9.1.9',
  'police-public-1.9.1.10', 'police-public-1.9.2.1', 'police-public-1.9.2.2',
  'police-public-1.9.2.3', 'police-public-1.9.2.4', 'police-public-1.9.2.5',
  'police-public-1.9.2.6', 'police-public-1.9.2.7',
];

exclusions.push(...uncorroboratedCompulsoryInsuranceIds.map((localId) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: '证据不足隔离：本题属于旧版交强险责任、费率或处罚细节；已对照现行《机动车交通事故责任强制保险条例》，但在2026-07-14抓取的驾考宝典当前C1公开索引及1168个可读详情页中未找到可靠同题。补齐当前题页交叉证据前不开放，避免把仍有效的法规知识误当成当前C1必考原题。',
  evidence: [
    {
      type: 'current-regulation',
      title: '《机动车交通事故责任强制保险条例》（国家行政法规库，现行有效）',
      url: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=1248',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（未检出可靠同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedTunnelSafetyIds = [
  'police-public-4.3.1.1',
  'police-public-4.3.1.2',
];

exclusions.push(...uncorroboratedTunnelSafetyIds.map((localId) => ({
  localId,
  verificationClass: 'current-public-bank-not-corroborated',
  note: localId.endsWith('.2')
    ? '证据不足隔离：本地旧题的正确选项混入下一章节标题，且“示宽灯或近光灯”比当前公开题常用的“开启近光灯”范围更宽；2026-07-14抓取的驾考宝典当前C1科目一索引中未找到可逐项核对的同题详情页，因此不开放。'
    : '证据不足隔离：本题属于单向放行隧道会车处置的旧版安全常识题；在2026-07-14抓取的驾考宝典当前C1科目一索引及1168个可读详情页中未找到可靠同题，补齐当前题页证据前不开放。',
  evidence: [
    {
      type: 'current-regulation',
      title: '《中华人民共和国道路交通安全法实施条例》（隧道及灯光通行规则）',
      url: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=75',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（未检出可可靠核对的同题详情页）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedEngineStallIds = [
  'police-public-5.4.1.1',
  'police-public-5.4.2.1',
  'police-public-5.4.2.2',
];

exclusions.push(...uncorroboratedEngineStallIds.map((localId) => ({
  localId,
  verificationClass: 'current-c1-subject-one-not-corroborated',
  note: localId === 'police-public-5.4.1.1'
    ? '证据不足隔离：正确选项混入下一章节标题，原题数据已污染；当前公开页面将同类发动机熄火应急处置题放在安全文明驾驶题页，2026-07-14抓取的C1科目一详情索引中没有可逐项核对的同题，因此不开放。'
    : '证据不足隔离：题目所述应急处置与GA/T 1773.2-2021相关规则方向一致，驾考宝典也有安全文明驾驶同题，但2026-07-14抓取的当前C1科目一详情索引未收录该题；为防止把科目三安全文明题混入科目一，暂不开放。',
  evidence: [
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典当前安全文明驾驶题页：发动机熄火后靠边停车检查',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu3-981600.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1科目一索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedCrosswindIds = [
  'police-public-5.11.1.1',
  'police-public-5.11.2.1',
  'police-public-5.11.2.2',
  'police-public-5.11.2.3',
];

exclusions.push(...uncorroboratedCrosswindIds.map((localId) => ({
  localId,
  verificationClass: 'current-c1-subject-one-not-corroborated',
  note: localId === 'police-public-5.11.1.1'
    ? '证据不足隔离：本地旧题正确选项混入下一章节标题，题目数据已污染；当前公开题页可确认隧道出口横风会导致方向偏移，但未找到当前C1科目一同题来核对本题四个处置选项，因此不开放。'
    : '证据不足隔离：本题属于横风应急操控旧题，当前公开页面仍有“隧道出口横风导致方向偏移”的相关题，但2026-07-14抓取的C1科目一详情索引中没有可逐项核对的同题；缺少现行科目一同题证据，暂不开放。',
  evidence: [
    {
      type: 'cross-check-related',
      title: '驾考宝典2026小车页面：隧道出口横风会引起车辆方向偏移',
      url: 'https://www.jiakaobaodian.com/shaoxing/',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedEmergencyAvoidanceIds = [
  'police-public-5.12.1.1',
  'police-public-5.12.1.2',
  'police-public-5.12.2.1',
  'police-public-5.12.2.2',
  'police-public-5.12.2.3',
];

exclusions.push(...uncorroboratedEmergencyAvoidanceIds.map((localId) => ({
  localId,
  verificationClass: 'current-c1-subject-one-not-corroborated',
  note: ['police-public-5.12.1.2', 'police-public-5.12.2.3'].includes(localId)
    ? '证据不足隔离：本地旧题题干或正确选项混入相邻章节标题，数据已污染；相关安全原理虽可在当前公开页面找到，但无法把污染题原样开放给学生。'
    : '证据不足隔离：本题属于紧急避险安全文明驾驶旧题；驾考宝典当前公开页把同题或同规则放在科目三安全文明驾驶题页，2026-07-14抓取的C1科目一详情索引没有可逐项核验的同题，因此不混入科目一练习。',
  evidence: [
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典当前安全文明驾驶题页：紧急避险先避人后避物',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu3-976900.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1科目一索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

exclusions.push({
  localId: 'police-public-2.2.2.50',
  verificationClass: 'current-public-bank-not-corroborated',
  note: '证据不足隔离：现行GB 5768.3-2025仍规定道路交通标线，但2026-07-14抓取的驾考宝典当前C1科目一详情索引中未找到“立面标记”同题；搜索结果仅有客车、货车题页，不能据此确认其仍属于当前C1科目一题，暂不开放。',
  evidence: [
    {
      type: 'current-standard',
      title: 'GB 5768.3-2025《道路交通标志和标线 第3部分：道路交通标线》',
      url: 'https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=A9BE85F3DDD0EC531B98C84B3312E240',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
});

const uncorroboratedRolloverEscapeIds = [
  'police-public-5.7.1.1', 'police-public-5.7.1.2', 'police-public-5.7.1.3',
  'police-public-5.7.2.1', 'police-public-5.7.2.2', 'police-public-5.7.2.3',
  'police-public-5.7.2.4',
];

exclusions.push(...uncorroboratedRolloverEscapeIds.map((localId) => ({
  localId,
  verificationClass: 'legacy-emergency-escape-not-corroborated',
  note: localId === 'police-public-5.7.1.3'
    ? '证据不足隔离：本地旧题正确选项混入下一章节标题，数据已污染；且本题属于翻车逃生安全文明驾驶内容，当前C1科目一详情索引未收录同题，不开放。'
    : '证据不足隔离：本题涉及翻车时跳车、身体姿势或落地滚动等高风险逃生动作；2026-07-14抓取的驾考宝典当前C1科目一索引及1168个可读详情页中未找到同题，也未取得现行权威操作规范逐项支持。为避免教授危险或过时动作，暂不开放。',
  evidence: [
    {
      type: 'source',
      title: '承德市公安局公开汽车类旧版题库（翻车逃生章节）',
      url: 'https://ga.chengde.gov.cn/art/2025/8/20/art_2935_1079682.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedCollisionPostureIds = [
  'police-public-5.6.1.1', 'police-public-5.6.1.2', 'police-public-5.6.1.3',
  'police-public-5.6.2.1', 'police-public-5.6.2.2', 'police-public-5.6.2.3',
  'police-public-5.6.2.4', 'police-public-5.6.2.5',
];

exclusions.push(...uncorroboratedCollisionPostureIds.map((localId) => ({
  localId,
  verificationClass: 'current-c1-subject-one-not-corroborated',
  note: localId === 'police-public-5.6.1.3'
    ? '证据不足隔离：本地旧题正确选项混入下一章节标题，数据已污染；同类碰撞姿势题当前归在安全文明驾驶题页，不应原样进入科目一。'
    : '证据不足隔离：本题属于碰撞前操控或身体保护姿势等高风险安全文明驾驶内容；驾考宝典当前同类详情页位于小车安全文明驾驶题库，2026-07-14抓取的C1科目一详情索引没有同题。为避免把不同科目或过时动作混入科目一，暂不开放。',
  evidence: [
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典当前安全文明驾驶题页：正面碰撞不可避免时的处置',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu3-982000.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedSkidRecoveryIds = [
  'police-public-5.5.1.1', 'police-public-5.5.1.2', 'police-public-5.5.1.3',
  'police-public-5.5.1.4', 'police-public-5.5.1.5', 'police-public-5.5.2.1',
  'police-public-5.5.2.2', 'police-public-5.5.2.3', 'police-public-5.5.2.4',
  'police-public-5.5.2.5',
];

exclusions.push(...uncorroboratedSkidRecoveryIds.map((localId) => ({
  localId,
  verificationClass: 'current-c1-subject-one-not-corroborated',
  note: localId === 'police-public-5.5.1.5'
    ? '证据不足隔离：本地旧题正确选项混入下一章节标题，数据已污染；同类侧滑操控题当前主要归入安全文明驾驶题页，不开放。'
    : '证据不足隔离：本题属于侧滑成因或失控后的具体操控动作；驾考宝典当前公开页面将同类题主要列在小车安全文明驾驶范围，2026-07-14抓取的C1科目一详情索引未找到可逐项核对的同题。涉及制动和转向动作，不能仅凭旧题答案开放。',
  evidence: [
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典当前小车页面：泥泞、溜滑路面猛转方向题列于科目四章节练习',
      url: 'https://www.jiakaobaodian.com/mnks/car.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const uncorroboratedVehicleFireIds = [
  'police-public-5.8.1.1', 'police-public-5.8.1.2', 'police-public-5.8.1.3',
  'police-public-5.8.1.4', 'police-public-5.8.2.1', 'police-public-5.8.2.2',
  'police-public-5.8.2.3', 'police-public-5.8.2.4', 'police-public-5.8.2.5',
  'police-public-5.8.2.6', 'police-public-5.8.2.7', 'police-public-5.8.2.8',
  'police-public-5.8.2.9',
];

exclusions.push(...uncorroboratedVehicleFireIds.map((localId) => ({
  localId,
  verificationClass: 'current-c1-subject-one-not-corroborated',
  note: localId === 'police-public-5.8.1.4'
    ? '证据不足隔离：本地旧题正确选项混入下一章节标题，数据已污染；车辆灭火同类题当前位于安全文明驾驶题页，不开放。'
    : '证据不足隔离：本题涉及车辆火灾、燃油或电器灭火及人员防护等高风险操作；驾考宝典当前同类详情页位于小车安全文明驾驶题库，2026-07-14抓取的C1科目一详情索引没有同题。缺少当前科目一同题及独立权威消防依据，不开放。',
  evidence: [
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典当前安全文明驾驶题页：发动机着火处置',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu3-983000.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const vehicleWaterEscapeIds = [
  'police-public-5.9.1.2', 'police-public-5.9.1.3', 'police-public-5.9.1.4',
  'police-public-5.9.1.5', 'police-public-5.9.1.6', 'police-public-5.9.2.1',
  'police-public-5.9.2.2', 'police-public-5.9.2.3', 'police-public-5.9.2.4',
  'police-public-5.9.2.5',
];

exclusions.push(...vehicleWaterEscapeIds.map((localId) => {
  const waitsForCabinToFill = ['police-public-5.9.1.5', 'police-public-5.9.2.2'].includes(localId);
  const corruptedDangerousOption = localId === 'police-public-5.9.1.6';
  return {
    localId,
    verificationClass: waitsForCabinToFill
      ? 'current-official-guidance-conflict'
      : corruptedDangerousOption
        ? 'dangerous-or-corrupted-answer-exclusion'
        : 'high-risk-escape-guidance-not-corroborated',
    note: waitsForCabinToFill
      ? '现行指引冲突隔离：旧题把“等待水灌满或接近灌满车厢后再逃生”作为正确做法；交通运输部与应急管理部当前公开指引均强调车辆落水后立即开门、开窗，无法开启时迅速破窗逃生，不能把延迟逃生当作通用首选规则。'
      : corruptedDangerousOption
        ? '危险且数据污染隔离：选项包含“塑料袋套头并扎紧脖子”等不可作为教学内容的高风险表述，题目还混入下一章节标题；即使正确答案不是该选项，也不得向学生展示。'
        : '高风险逃生题隔离：题目方向虽可能与“立即开门/开窗、必要时破窗”一致，但当前C1科目一详情索引未找到可逐项核对的同题。车辆落水逃生涉及生命安全，在题干、选项及答案获得当前题页和权威指引双重确认前不开放。',
    evidence: [
      {
        type: 'current-official-guidance',
        title: '交通运输部安全生产事故警示通报：车辆涉水应开门、砸窗、疏散、逃生',
        url: 'https://www.dhlh.gov.cn/jtj/Web/_F0_0_5L4T0RLC59B782242C89482CBC.htm',
      },
      {
        type: 'current-official-guidance',
        title: '应急管理部车辆落水自救提示：打、砸、快、逃',
        url: 'https://www.mem.gov.cn/xw/jyll/202007/t20200730_357204.shtml',
      },
      {
        type: 'cross-check-absent',
        title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
        url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
      },
    ],
  };
}));

const highwayEmergencyAvoidanceIds = [
  'police-public-5.10.1.1', 'police-public-5.10.1.2', 'police-public-5.10.1.3',
  'police-public-5.10.1.4', 'police-public-5.10.1.5', 'police-public-5.10.1.6',
  'police-public-5.10.1.7', 'police-public-5.10.1.8', 'police-public-5.10.1.9',
  'police-public-5.10.1.10', 'police-public-5.10.1.11', 'police-public-5.10.1.12',
  'police-public-5.10.2.1', 'police-public-5.10.2.2', 'police-public-5.10.2.3',
  'police-public-5.10.2.4', 'police-public-5.10.2.5', 'police-public-5.10.2.6',
  'police-public-5.10.2.7', 'police-public-5.10.2.8', 'police-public-5.10.2.9',
  'police-public-5.10.2.10', 'police-public-5.10.2.11', 'police-public-5.10.2.12',
  'police-public-5.10.2.13', 'police-public-5.10.2.14', 'police-public-5.10.2.15',
  'police-public-5.10.2.16',
];

exclusions.push(...highwayEmergencyAvoidanceIds.map((localId) => ({
  localId,
  verificationClass: localId === 'police-public-5.10.1.12'
    ? 'dangerous-or-corrupted-answer-exclusion'
    : 'high-risk-emergency-guidance-not-corroborated',
  note: localId === 'police-public-5.10.1.12'
    ? '数据污染隔离：正确选项混入“5.10.2 判断题：（16题）”章节标题，原始题目结构已损坏；完成当前公开题页逐项复原前不得进入练习。'
    : '高风险应急题隔离：本题涉及高速公路水滑、急转避险、碰撞护栏或故障停车后的具体操作。现行法规和公安交管公开指引只足以确认“车靠边、人撤离、即报警”、150米外警示等通用规则；当前C1科目一详情索引未找到可逐项核对的同题，不能据旧题库推定整道题及全部干扰项仍有效。',
  evidence: [
    {
      type: 'current-regulation',
      title: '《中华人民共和国道路交通安全法》第六十八条：高速公路故障警示、人员转移及报警',
      url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_79dc72ea621f4a9b8adec327abf5d0e1.html',
    },
    {
      type: 'current-official-guidance',
      title: '深圳交警：高速公路意外停车应车移应急车道、人员撤至护栏外并在150米外警示',
      url: 'https://szjj.sz.gov.cn/m/YD_ZWGK/YD_QT/YD_YJGL/content/post_11158757.html',
    },
    {
      type: 'current-official-guidance',
      title: '交通运输部道路运输驾驶员应急驾驶操作指南（试行）',
      url: 'https://www.dhlh.gov.cn/jtj/Web/_F0_0_5L4T0RLC59B782242C89482CBC.htm',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const brakeFailureAndWheelLockIds = [
  'police-public-5.3.1.1', 'police-public-5.3.1.3', 'police-public-5.3.1.4',
  'police-public-5.3.1.5', 'police-public-5.3.2.1', 'police-public-5.3.2.2',
  'police-public-5.3.2.4', 'police-public-5.3.2.5', 'police-public-5.3.2.6',
  'police-public-5.3.2.7', 'police-public-5.3.2.8', 'police-public-5.3.2.9',
  'police-public-5.3.2.10', 'police-public-5.3.2.11', 'police-public-5.3.2.12',
  'police-public-5.3.2.13',
];

exclusions.push(...brakeFailureAndWheelLockIds.map((localId) => {
  const corrupted = ['police-public-5.3.1.5', 'police-public-5.3.2.8'].includes(localId);
  return {
    localId,
    verificationClass: corrupted
      ? 'dangerous-or-corrupted-answer-exclusion'
      : 'current-c1-subject-one-not-corroborated',
    note: corrupted
      ? '数据污染隔离：题目或选项混入下一章节标题、异常标点，且内容涉及制动失效时的高风险操作；当前公开题页无法证明污染后的题干、选项及答案仍完整，不得开放。'
      : '科目归属隔离：本题涉及车轮抱死、ABS或制动失效后的具体应急操控。驾考宝典当前公开同题明确位于小车安全文明驾驶或货车安全文明驾驶题页，而不是已抓取的C1科目一详情索引；虽有交通运输部应急指南支持部分操作方向，仍不能把科目三/安全文明题直接并入C1科目一。',
    evidence: [
      {
        type: 'cross-check-related-subject',
        title: '驾考宝典当前小车安全文明驾驶题页：下坡路制动突然失效',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu3-980500.html',
      },
      {
        type: 'cross-check-related-subject',
        title: '驾考宝典当前货车安全文明驾驶题页：行车中制动突然失灵',
        url: 'https://www.jiakaobaodian.com/tiku/shiti/truck-kemu3-1079900.html',
      },
      {
        type: 'current-official-guidance',
        title: '交通运输部《道路运输驾驶员应急驾驶操作指南（试行）》制动失效处置',
        url: 'https://jtj.cq.gov.cn/ztzl/aqsc/zcfg/202106/t20210611_9393317.html',
      },
      {
        type: 'cross-check-absent',
        title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
        url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
      },
    ],
  };
}));

const steeringFailureIds = [
  'police-public-5.2.1.1', 'police-public-5.2.1.2', 'police-public-5.2.1.3',
  'police-public-5.2.1.4', 'police-public-5.2.1.5', 'police-public-5.2.2.1',
  'police-public-5.2.2.2', 'police-public-5.2.2.3', 'police-public-5.2.2.4',
  'police-public-5.2.2.5', 'police-public-5.2.2.6',
];

exclusions.push(...steeringFailureIds.map((localId) => ({
  localId,
  verificationClass: localId === 'police-public-5.2.1.5'
    ? 'dangerous-or-corrupted-answer-exclusion'
    : 'current-c1-subject-one-not-corroborated',
  note: localId === 'police-public-5.2.1.5'
    ? '数据污染隔离：正确选项混入“5.2.2 判断题：（6题）”章节标题，题目结构已损坏；本题又涉及高速转向失控时的高风险操作，不得依据残缺旧题开放。'
    : '科目归属隔离：本题考查转向装置失控后的具体紧急操控。驾考宝典当前公开同类题明确列在小车科目四/安全文明驾驶专项中，当前C1科目一详情索引未检出可逐项核对的同题；操作性应急知识不能只凭旧附件答案并入科目一。',
  evidence: [
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典当前小车安全文明驾驶题页：高速转向失控紧急制动',
      url: 'https://www.jiakaobaodian.com/tiku/shiti/car-kemu3-979800.html',
    },
    {
      type: 'cross-check-related-subject',
      title: '驾考宝典2026小车页面：转向失控题列于科目四专项练习',
      url: 'https://www.jiakaobaodian.com/jingzhou/',
    },
    {
      type: 'current-official-guidance',
      title: '交通运输部《道路运输驾驶员应急驾驶操作指南（试行）》',
      url: 'https://jtj.cq.gov.cn/ztzl/aqsc/zcfg/202106/t20210611_9393317.html',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出同题）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

const tireLeakAndBlowoutExclusionIds = [
  'police-public-5.1.1.1', 'police-public-5.1.1.2', 'police-public-5.1.1.3',
  'police-public-5.1.1.4', 'police-public-5.1.1.5', 'police-public-5.1.1.7',
  'police-public-5.1.1.8', 'police-public-5.1.1.9', 'police-public-5.1.1.10',
  'police-public-5.1.1.12', 'police-public-5.1.2.1', 'police-public-5.1.2.2',
  'police-public-5.1.2.3', 'police-public-5.1.2.4', 'police-public-5.1.2.5',
  'police-public-5.1.2.6', 'police-public-5.1.2.7', 'police-public-5.1.2.8',
  'police-public-5.1.2.10', 'police-public-5.1.2.12',
];

exclusions.push(...tireLeakAndBlowoutExclusionIds.map((localId) => ({
  localId,
  verifiedAt: '2026-07-15',
  verificationClass: localId === 'police-public-5.1.1.12'
    ? 'dangerous-or-corrupted-answer-exclusion'
    : 'high-risk-emergency-guidance-not-fully-corroborated',
  note: localId === 'police-public-5.1.1.12'
    ? '数据污染隔离：正确选项混入“5.1.2 判断题：（12题）”章节标题，原始选项已损坏；当前公开题页虽仍出现相似题名，但无法证明污染后的整题与答案完整。'
    : '暂缓开放：当前驾考宝典不同城市页面把爆胎题分别列入科目一和科目四，具体题目归属存在交叉；交通运输部指南可支持“握稳方向、缓慢减速、避免紧急制动”等原则，但当前C1科目一详情索引没有足够的同题答案页逐项核对。本题涉及高风险应急操作，证据不足时继续隔离。',
  evidence: [
    {
      type: 'current-official-guidance',
      title: '交通运输部《道路运输驾驶员应急驾驶操作指南（试行）》车辆爆胎处置',
      url: 'https://jtj.cq.gov.cn/ztzl/aqsc/zcfg/202106/t20210611_9393317.html',
    },
    {
      type: 'cross-check-current-c1-and-subject-four-overlap',
      title: '驾考宝典2026小车页面：爆胎题在科目一与科目四专项中均有出现',
      url: 'https://www.jiakaobaodian.com/taiyuan/',
    },
    {
      type: 'cross-check-absent',
      title: '驾考宝典2026小车科目一公开顺序练习（当前C1详情索引未检出足够同题答案页）',
      url: 'https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1.html',
    },
  ],
})));

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
    verifiedAt: item.verifiedAt || '2026-07-14',
    verificationClass: item.verificationClass || 'reviewed-scope-exclusion',
    note: item.note,
    evidence: item.evidence,
  };
}

fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);
console.log(`Recorded ${exclusions.length} reviewed exclusions.`);
