const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicIndexPath = path.join(root, 'data', 'jiakao-public-index.json');
const localBankPath = path.join(root, 'data', 'question-bank.json');
const cachePath = path.join(root, 'audit', 'jiakao-detail-crosscheck-cache.json');
const outputPath = path.join(root, 'data', 'jiakao-crosscheck.json');
const batchSize = Number(process.env.JIAKAO_BATCH_SIZE || 100);
const delayMs = Number(process.env.JIAKAO_DELAY_MS || 250);
const concurrency = Math.max(1, Number(process.env.JIAKAO_CONCURRENCY || 3));
const requestTimeoutMs = Number(process.env.JIAKAO_TIMEOUT_MS || 15000);

const publicIndex = JSON.parse(fs.readFileSync(publicIndexPath, 'utf8'));
const localBank = JSON.parse(fs.readFileSync(localBankPath, 'utf8'));
const cache = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  : {};

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function normalize(value) {
  return decodeHtml(String(value || ''))
    .replace(/<[^>]+>/g, '')
    .replace(/[\s　，。！？；：、“”‘’（）()【】《》〈〉…—·,.!?;:'"`~\-_]/g, '')
    .toLowerCase();
}

function parseDetail(html, questionId) {
  const title = html.match(/<title>([\s\S]*?)\s*-\s*驾考宝典<\/title>/i);
  const answer = html.match(/<p\b(?=[^>]*\bclass="[^"]*\bsuccess\b[^"]*")(?=[^>]*\bdata-right=(?:"?true"?))[^>]*>\s*([A-H])、([\s\S]*?)<\/p>/i);
  if (!title || !answer) throw new Error(`Cannot parse public detail ${questionId}`);
  const correctOptionText = decodeHtml(answer[2].replace(/<[^>]+>/g, '').trim());
  return {
    questionId: String(questionId),
    fingerprint: normalize(title[1]),
    answer: answer[1].toUpperCase(),
    correctOptionFingerprint: normalize(correctOptionText),
    url: `https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-${questionId}.html`,
    checkedAt: new Date().toISOString(),
  };
}

function saveCache() {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}

async function fetchOne(questionId) {
  const url = `https://www.jiakaobaodian.com/tiku/shiti/car-kemu1-${questionId}.html`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(requestTimeoutMs),
    headers: {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': 'drivertest-answer-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return parseDetail(await response.text(), questionId);
}

async function updateCache() {
  const remaining = publicIndex.questionIds
    .filter((id) => !cache[id] || (!cache[id].error && !cache[id].correctOptionFingerprint))
    .slice(0, batchSize);
  let cursor = 0;
  let completed = 0;
  async function worker() {
    while (cursor < remaining.length) {
      const index = cursor;
      cursor += 1;
      const id = remaining[index];
      try {
        cache[id] = await fetchOne(id);
      } catch (error) {
        cache[id] = {
          questionId: String(id),
          error: error.message,
          checkedAt: new Date().toISOString(),
        };
      }
      completed += 1;
      if (completed % 10 === 0) {
        saveCache();
        console.log(`Fetched ${completed}/${remaining.length} in this batch.`);
      }
      if (cursor < remaining.length) await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, remaining.length) }, worker));
  saveCache();
}

function buildCrosscheck() {
  const byFingerprint = new Map();
  Object.values(cache).forEach((item) => {
    if (!item.error && item.fingerprint) {
      const list = byFingerprint.get(item.fingerprint) || [];
      list.push(item);
      byFingerprint.set(item.fingerprint, list);
    }
  });

  const candidates = localBank.questions.filter((question) => question.category === 'car-general');
  const results = candidates.map((question) => {
    if (question.needsImage) {
      return { localId: question.id, status: 'missing-image', answer: question.answer };
    }
    const matches = byFingerprint.get(normalize(question.stem)) || [];
    if (matches.length !== 1) {
      return {
        localId: question.id,
        status: matches.length ? 'ambiguous-match' : 'not-matched-yet',
        answer: question.answer,
        publicQuestionIds: matches.map((item) => item.questionId),
      };
    }
    const match = matches[0];
    const localCorrectOption = question.options['ABCDEFGH'.indexOf(question.answer)] || '';
    const answerTextAgrees = normalize(localCorrectOption) === match.correctOptionFingerprint;
    return {
      localId: question.id,
      status: answerTextAgrees ? 'answer-agrees' : 'answer-conflict',
      answer: question.answer,
      publicAnswer: match.answer,
      answerTextFingerprint: normalize(localCorrectOption),
      publicAnswerTextFingerprint: match.correctOptionFingerprint,
      publicQuestionId: match.questionId,
      evidenceUrl: match.url,
      checkedAt: match.checkedAt,
    };
  });

  const counts = results.reduce((all, item) => {
    all[item.status] = (all[item.status] || 0) + 1;
    return all;
  }, {});
  const payload = {
    generatedAt: new Date().toISOString(),
    note: '驾考宝典仅作交叉验证；answer-agrees 不等于法规核验完成。',
    publicIndexCount: publicIndex.questionCount,
    publicDetailsChecked: Object.values(cache).filter((item) => !item.error).length,
    localCandidateCount: candidates.length,
    counts,
    results,
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload.counts));
}

updateCache().then(buildCrosscheck).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
