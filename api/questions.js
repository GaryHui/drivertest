const ALLOWED_MODELS=new Set(['c1','c2','a1','a2','b1','b2']);
module.exports=async function handler(req,res){
  const key=process.env.JUHE_KEY;
  if(!key)return res.status(503).json({error:'JUHE_KEY_NOT_CONFIGURED',message:'在线题库密钥尚未配置'});
  const model=ALLOWED_MODELS.has(String(req.query.model||'').toLowerCase())?String(req.query.model).toLowerCase():'c1';
  const testType=req.query.type==='order'?'order':'rand';
  const url=new URL('https://v.juhe.cn/jztk/query');
  url.searchParams.set('subject','1');url.searchParams.set('model',model);url.searchParams.set('testType',testType);url.searchParams.set('key',key);
  try{
    const response=await fetch(url,{headers:{accept:'application/json'}});const data=await response.json();
    if(data.error_code!==0)return res.status(502).json({error:'UPSTREAM_ERROR',code:data.error_code,message:data.reason||'题库接口返回错误'});
    res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({source:'聚合数据驾照题库',model,subject:1,count:data.result?.length||0,questions:data.result||[]});
  }catch(error){return res.status(502).json({error:'UPSTREAM_UNAVAILABLE',message:'在线题库暂时不可用'});}
}
