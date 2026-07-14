const fs=require('fs');
const path=require('path');
const src=path.join(__dirname,'..','audit','official-bank-utf8.txt');
const out=path.join(__dirname,'..','data','official-bank.json');
const buf=fs.readFileSync(src);
const text=(buf[0]===0xff&&buf[1]===0xfe?buf.toString('utf16le'):buf.toString('utf8')).replace(/\r/g,'');
const lines=text.split('\n').map(s=>s.replace(/[\u3000\t]+/g,' ').trim()).filter(Boolean);
const start=/^(\d+(?:\.\d+){3})\s*(.*)$/;
const opt=/^([A-D])[\.．、]\s*(.*)$/i;
const ans=/答案\s*[：:]\s*([A-D]|正确|错误)/i;
const questions=[];let q=null,part='stem';
function finish(){if(!q)return;if(q.answer&&q.stem){q.needsImage=/图中|图示|如图|图标|标志是/.test(q.stem);q.legacy=true;questions.push(q)}q=null}
for(const line of lines){const s=line.match(start);if(s){finish();q={id:s[1],stem:s[2],options:[],answer:'',source:'承德市公安局2025-08-20公开汽车类题库（原文档为旧版题库）'};part='stem';continue}if(!q)continue;const a=line.match(ans);if(a){q.answer=a[1].toUpperCase();continue}const o=line.match(opt);if(o){q.options.push(o[2]);part='option';continue}if(part==='stem'&&!/^\d+(\.\d+){1,2}/.test(line))q.stem+=' '+line;else if(part==='option'&&q.options.length)q.options[q.options.length-1]+=' '+line}
finish();fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify({meta:{title:'汽车类题库',declaredCount:1346,parsedCount:questions.length,legacy:true,warning:'该公安网站2025年发布的附件源文档内容形成于旧规时期，题目需按现行法规复核。'},questions}));console.log(JSON.stringify({parsed:questions.length,withImage:questions.filter(q=>q.needsImage).length,usableText:questions.filter(q=>!q.needsImage).length}));
