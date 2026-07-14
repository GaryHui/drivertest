const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const IMPORTS = path.join(DATA, 'imports');
const OUTPUT = path.join(DATA, 'question-bank.json');
const DECISIONS = path.join(DATA, 'verification-decisions.json');
const TODAY = new Date().toISOString().slice(0, 10);

const sha = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const answerLetter = answer => {
  const value = clean(answer).toUpperCase();
  if (/^[A-D]$/.test(value)) return value;
  if (/^[1-4]$/.test(value)) return String.fromCharCode(64 + Number(value));
  if (value === '正确' || value === '对') return 'A';
  if (value === '错误' || value === '错') return 'B';
  return '';
};

// 只能自动识别明确的旧记分表述；其余题目仍保留“待人工核验”，不冒充官方已核验。
function reviewQuestion(question) {
  const text = [question.stem, ...question.options, question.explanation].join(' ');
  const twoPointRule = /(一次记|记|扣|违法记)\s*2\s*分|记二分|扣二分|记分分值[^。]{0,20}2分/i;
  const obsoleteScore = /(拨打|接听).*手持电话[^。]{0,25}(2分|二分)|(故意遮挡|污损).*号牌[^。]{0,25}(12分|十二分)/i;
  const legacySensitive = /(记分|满分学习|审验教育|实习期|有效期满换证|学法减分|准驾车型不符|遮挡.*号牌|污损.*号牌)/i;
  const supersededAge = /(年龄|年满|达到)\s*60\s*(周岁|岁)|60\s*(周岁|岁)以上.*(大型客车|牵引车|大型货车|身体条件)/i;
  if (twoPointRule.test(text)) return { status: 'excluded', reason: '疑似旧规：包含已取消的2分记分表述' };
  if (obsoleteScore.test(text)) return { status: 'excluded', reason: '疑似旧版记分答案' };
  if (question.legacy && supersededAge.test(text)) return { status: 'excluded', reason: '旧年龄规则：第172号令已将相关重点车型年龄节点调整为63周岁' };
  if (question.legacy && legacySensitive.test(text)) return { status: 'excluded', reason: '旧版附件中的新规敏感题，隔离等待人工对照现行法规' };
  if (question.legacy) return { status: 'pending', reason: '公安公开附件为旧版题库，已通过自动旧规筛查，仍待逐题人工核验' };
  return { status: 'pending', reason: '外部补充题，待按现行法规人工核验' };
}

function normalize(raw, source) {
  const stem = clean(raw.stem || raw.question || raw.title);
  let options = raw.options || [raw.item1, raw.item2, raw.item3, raw.item4].filter(Boolean);
  options = Array.isArray(options) ? options.map(clean).filter(Boolean) : [];
  const rawAnswer = raw.answer ?? raw.correct ?? raw.result;
  if (!options.length && /^(正确|错误|对|错)$/i.test(clean(rawAnswer))) options = ['正确', '错误'];
  const answer = answerLetter(rawAnswer);
  if (!stem || options.length < 2 || !answer || answer.charCodeAt(0) - 65 >= options.length) return null;
  const rawId = clean(raw.id || raw.questionId || sha(stem + options.join('|')));
  const category = raw.category || source.category || 'car-general';
  // 公安附件的客车、货车和轮式机械车章节会从1.1.1.1重新编号。
  // 专用车型必须带类别前缀，否则会与C1通用题共享审核结论。
  const id = category === 'car-general'
    ? `${source.code}-${rawId}`
    : `${source.code}-${category}-${rawId}`;
  const question = {
    id,
    stem,
    options,
    answer,
    explanation: clean(raw.explanation || raw.explains || raw.analysis || ''),
    image: clean(raw.image || raw.url || ''),
    needsImage: Boolean(raw.needsImage || raw.image || raw.url),
    source: { code: source.code, name: source.name, url: source.url, importedAt: TODAY },
    region: raw.region || source.region || '全国',
    category,
    subject: 1,
    vehicle: raw.vehicle || source.vehicle || 'C1',
    legacy: Boolean(raw.legacy || source.legacy),
    updatedAt: clean(raw.updatedAt || raw.updateTime || source.updatedAt || TODAY)
  };
  question.review = reviewQuestion(question);
  return question;
}

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function extractRows(data) {
  if (Array.isArray(data)) return data;
  return data?.questions || data?.result?.list || data?.result || data?.data?.list || data?.data || [];
}

function addSource(target, file, source) {
  const data = readJson(file);
  if (!data) return 0;
  const rows = extractRows(data);
  let count = 0;
  for (const raw of rows) {
    const q = normalize(raw, source);
    if (q) {
      // 源附件自身偶有重复编号（例如2.3.1.12同时用于选择题和判断题）。
      // 保留首题原编号，后续同编号题使用内容指纹，确保每道题可独立审核。
      if (target.some((existing) => existing.id === q.id)) {
        q.id = `${q.id}-dup-${sha(q.stem + '|' + q.options.join('|'))}`;
      }
      target.push(q);
      count++;
    }
  }
  return count;
}

async function fetchJisu() {
  const appkey = process.env.JISU_APPKEY;
  if (!appkey) return null;
  const all = [];
  for (let page = 1; page <= 50; page++) {
    const url = new URL('https://api.jisuapi.com/driverexam/query');
    Object.entries({ appkey, type: 'C1', subject: '1', pagesize: '100', pagenum: String(page), sort: 'normal' }).forEach(([k, v]) => url.searchParams.set(k, v));
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`极速数据请求失败：HTTP ${response.status}`);
    const data = await response.json();
    if (String(data.status) !== '0' && String(data.status) !== '200') throw new Error(`极速数据请求失败：${data.msg || data.message || data.status}`);
    const list = extractRows(data);
    if (!Array.isArray(list) || !list.length) break;
    all.push(...list);
    const total = Number(data.result?.total || data.result?.totalcount || 0);
    if (list.length < 100 || (total && all.length >= total)) break;
  }
  const file = path.join(IMPORTS, 'jisu.json');
  fs.writeFileSync(file, JSON.stringify({ fetchedAt: new Date().toISOString(), questions: all }, null, 2));
  return all.length;
}

function deduplicate(rows) {
  const seen = new Map();
  for (const q of rows) {
    const key = sha(q.stem.replace(/[，。！？,.!?\s]/g, '') + q.options.join('|'));
    const old = seen.get(key);
    // 同题优先保留已核验，其次保留公安公开来源。
    if (!old || (old.review.status !== 'verified' && q.review.status === 'verified') || (q.source.code === 'police-public' && old.source.code !== 'police-public')) seen.set(key, q);
  }
  return [...seen.values()];
}

async function main() {
  fs.mkdirSync(IMPORTS, { recursive: true });
  const fetched = await fetchJisu();
  if (fetched !== null) console.log(`已从极速数据一次性同步 ${fetched} 道题到本地导入文件。`);
  const rows = [];
  const counts = {};
  counts.police = addSource(rows, path.join(DATA, 'official-bank.json'), {
    code: 'police-public', name: '承德市公安局公开汽车类题库',
    url: 'https://ga.chengde.gov.cn/art/2025/8/20/art_2935_1079682.html',
    region: '全国通用规则', legacy: true, updatedAt: '2025-08-20'
  });
  counts.jisu = addSource(rows, path.join(IMPORTS, 'jisu.json'), {
    code: 'jisu', name: '极速数据驾考题库（一次性导入）', url: 'https://www.jisuapi.com/api/driverexam/', region: '广东', updatedAt: TODAY
  });
  counts.roll = addSource(rows, path.join(IMPORTS, 'roll.json'), {
    code: 'roll', name: 'ROLL驾考题库（一次性导入）', url: 'https://www.mxnzp.com/doc/detail?id=33', region: '广东', updatedAt: TODAY
  });
  const questions = deduplicate(rows);
  const decisions = readJson(DECISIONS)?.decisions || {};
  for (const q of questions) {
    const decision = decisions[q.id];
    if (!decision) continue;
    if (decision.status === 'excluded') {
      q.review = {
        status: 'excluded',
        reason: decision.note,
        verifiedAt: decision.verifiedAt,
        evidence: decision.evidence || []
      };
      continue;
    }
    if (decision.expectedAnswer !== q.answer) {
      q.review = { status: 'conflict', reason: `核验记录答案为${decision.expectedAnswer}，导入答案为${q.answer}` };
      continue;
    }
    q.review = { status: 'verified', reason: decision.note, verifiedAt: decision.verifiedAt, evidence: decision.evidence };
  }
  const stats = questions.reduce((a, q) => { a[q.review.status] = (a[q.review.status] || 0) + 1; return a; }, {});
  const output = {
    meta: {
      title: '粤驾速记本地题库', generatedAt: new Date().toISOString(), region: '广东', subject: 1, vehicle: 'C1',
      policy: '网站只读取本文件；第三方接口仅用于维护时一次性同步。疑似旧规题自动隔离，未核验题明确标记。',
      total: questions.length, c1Candidates: questions.filter(q => q.category === 'car-general').length,
      playable: questions.filter(q => q.category === 'car-general' && q.review.status === 'verified' && !q.needsImage).length,
      verified: stats.verified || 0, pending: stats.pending || 0, excluded: stats.excluded || 0, imports: counts
    },
    questions
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output.meta, null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
