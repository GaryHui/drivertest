const topics=[
{id:'points',icon:'🧮',name:'记分题',tag:'12 · 9 · 6 · 3 · 1',intro:'先看危险程度，再找车型和道路。旧资料里的“2分”已取消。',cards:[
['饮酒驾驶','机动车驾驶人','饮酒后驾驶机动车','12分','不分车型','酒驾12分；醉驾还涉及刑事责任'],['肇事逃逸','机动车驾驶人','致人轻伤以上或死亡后逃逸，尚不犯罪','12分','造成轻微伤/财产损失逃逸为6分','先看伤情：“轻伤以上”才12'],['高速倒车','机动车驾驶人','高速公路或城市快速路倒车、逆行、穿越中央分隔带','12分','普通道路逆行为3分','高速危险翻倍，直接12'],['准驾不符','机动车驾驶人','驾驶与准驾车型不符的机动车','9分','无证驾驶是处罚概念，不等同记分','新规从旧12分降为9分'],['遮挡号牌','机动车驾驶人','故意遮挡、污损机动车号牌','9分','不按规定安装号牌为3分','“故意遮污”9，“安装不规”3'],['高速违法停车','机动车驾驶人','高速公路或城市快速路违法停车','9分','一般道路违法停车通常不记分、依法罚款','停车地点决定9分'],['占应急车道','机动车驾驶人','违法占用高速公路应急车道行驶','6分','违法停车是9分','应急道行驶6，停下9'],['不让校车','机动车驾驶人','未按规定避让校车','3分','校车超员按比例可能6或12','避让看3分'],['不系安全带','机动车驾驶人','在道路上行驶未按规定系安全带','1分','乘客不系带处罚不记驾驶人分','新规为1分'] ]},
{id:'speed',icon:'⚡',name:'速度题',tag:'道路 · 天气 · 能见度',intro:'无标志先看“有没有中心线”，高速恶劣天气只背 261、145、520。',cards:[
['无中心线城市路','小型汽车','无道路中心线的城市道路','30 km/h','公路为40','城3公4'],['同向一车道城市路','小型汽车','同方向只有1条机动车道的城市道路','50 km/h','公路为70','城5公7'],['高速最低速度','小型汽车','高速公路正常行驶','60 km/h','最高不超过120','高低是60—120'],['能见度＜200米','高速驾驶人','雾雨雪等能见度小于200米','≤60 km/h','车距≥100米','261：200看见、60速度、100距离'],['能见度＜100米','高速驾驶人','能见度小于100米','≤40 km/h','车距≥50米','145：100、40、50'],['能见度＜50米','高速驾驶人','能见度小于50米','≤20 km/h','尽快驶离高速','520：50、20、离开'] ]},
{id:'time',icon:'⏱',name:'时间题',tag:'拘留 · 换证 · 实习 · 审验',intro:'时间题先辨“天、月、年”，再辨起点是到期前、到期后还是记分周期后。',cards:[
['满分学习·小型车','小型汽车驾驶人','一个周期内每增加一次满分教育或累积记分每增加12分','7天起；每次＋7天','每次最多60天','大中型重点车型是30、30、120'],['满分学习·重点车','大客/重牵/公交/中客/大货驾驶人','一个周期满分及递增','30天起；每次＋30天','每次最多120天','小型车是7、7、60'],['换证窗口','驾驶人','驾驶证有效期届满换证','到期前90日内','可向核发地或核发地以外车管所申请','不是30日'],['实习期','初次申领汽车类或摩托车类驾驶证人','初次取得准驾车型','12个月','增驾同类车型不再单设实习期','实习标志贴车身后部'],['信息变更','驾驶人','户籍迁出或联系方式等变化','30日内','迁入地车管所换证','换证90日，变更30日'],['审验学习','需审验驾驶人','有记分的审验教育','不少于3小时','部分情形可网络学习','不是满分学习7天'] ]},
{id:'distance',icon:'📏',name:'距离题',tag:'停车 · 警告 · 跟车',intro:'距离题画一条路来记：普通路50—100，高速警告150以外。',cards:[
['普通路故障警告','机动车驾驶人','车辆在道路上故障难以移动','车后50—100米','夜间还应开示廓灯和后位灯','普通路一个足球场以内'],['高速故障警告','机动车驾驶人','车辆在高速公路故障','车后150米以外','人员迅速转移到右侧路肩或应急车道','高速更快，所以更远'],['禁停30米','机动车驾驶人','公交站、急救站、加油站、消防站等','30米以内禁停','使用上述设施的车辆除外','站点30米'],['禁停50米','机动车驾驶人','路口、铁道路口、急弯、窄路、桥梁等','50米以内禁停','无特殊例外','路口弯桥50米'],['高速车距','高速驾驶人','车速超过100 km/h','≥100米','低于100时≥50米','速度100对应距离100'] ]},
{id:'fine',icon:'🧾',name:'罚款题',tag:'金额区间 · 违法性质',intro:'罚款金额会受具体法条和地方裁量影响；先按违法性质分组，不拿口诀替代法条。',cards:[
['补换证后用原证','驾驶人','补领驾驶证后继续使用原驾驶证','20—200元','由交管部门收回原证','“一人两证”低档罚款'],['实习期违规牵引','实习期驾驶人','驾驶机动车牵引挂车','20—200元','实习期本就禁止牵引挂车','实习违规常见20—200'],['逾期不审验仍驾驶','驾驶人','逾期不参加审验仍驾驶机动车','200—500元','交管部门先公告停止使用等依情形处理','逾期类看200—500'],['伪造变造证牌','机动车驾驶人','伪造、变造或使用伪造证牌','2000—5000元','并可拘留；构成犯罪追刑责','高额＋拘留＋12分风险'],['饮酒驾驶','机动车驾驶人','饮酒后驾驶机动车','1000—2000元','暂扣6个月驾驶证并记12分','罚款、暂扣、记分三件套'] ]},
{id:'license',icon:'🪪',name:'证件题',tag:'申领 · 补换 · 注销',intro:'先分清四个词：注销是资格消灭；吊销是处罚；撤销针对不正当取得；扣留是暂时控制。',cards:[
['遗失补证','驾驶人','驾驶证遗失','向车管所申请补发','补发后原证作废','不得同时使用原证'],['期满换证','驾驶人','驾驶证有效期满','提前90日内','逾期一年内仍可正常换；超一年未满三年考科一恢复','“补”因丢损，“换”因到期/信息变更'],['身体不适合驾驶','驾驶人','身体条件不再适合驾驶机动车','注销驾驶证','有适合其他准驾车型的可降级换证','注销不是行政处罚'],['醉酒驾驶','机动车驾驶人','醉酒驾驶机动车','吊销驾驶证','依法追究刑事责任，5年内不得重申；营运车10年','饮酒是暂扣，醉酒是吊销'],['欺骗贿赂取得','申请人','以欺骗、贿赂等不正当手段取得驾驶证','撤销驾驶许可','3年内不得再次申领','考试作弊常见1年，不正当取得3年'] ]},
{id:'lights',icon:'💡',name:'灯光通行题',tag:'夜间 · 会车 · 特殊路段',intro:'灯光不是越亮越安全：近距离跟车、会车、照明良好都别用远光。',cards:[
['夜间会车','机动车驾驶人','夜间与对向车会车','距对向来车150米外改近光','窄路窄桥与非机动车会车也用近光','150米切近光'],['夜间超车','机动车驾驶人','夜间准备超越前车','交替使用远近光灯示意','确认安全后从左侧超越','不是一直开远光'],['雾天行驶','机动车驾驶人','雾天行驶','开雾灯和危险报警闪光灯','能见度低时还须按261/145/520控速','双闪不是所有恶劣天气都开'],['无信号环岛','机动车驾驶人','进入环形路口','准备进入者让已在路口内者先行','转弯让直行的一般原则仍适用','进环岛让环内'],['特殊路段','机动车驾驶人','急弯、坡路、拱桥、人行横道、无信号路口','交替使用远近光灯示意','夜间照明不良可开远光','“提示”用交替，不是常亮远光'] ]}
];

// 补充现行法规中的高频规则。每条规则都会在下方自动生成一道对应练习题。
topics.find(t=>t.id==='points').cards.push(
['手持电话','机动车驾驶人','驾驶时拨打、接听手持电话','3分','停车且不妨碍通行后使用不属于驾驶中','不是旧资料的2分'],
['违反信号灯','机动车驾驶人','驾驶机动车不按交通信号灯指示通行','6分','交通警察指挥与信号灯不一致时服从交警','闯红灯记6分'],
['高速低于最低速度','机动车驾驶人','高速公路行驶低于规定最低时速','3分','恶劣天气等依法降速除外','超速看比例，过慢固定3分'],
['普通道路逆行','机动车驾驶人','在高速、城市快速路以外道路逆行','3分','高速或城市快速路逆行12分','普通3，高速12'],
['轻微事故逃逸','机动车驾驶人','造成致人轻微伤或财产损失事故后逃逸，尚不犯罪','6分','致人轻伤以上或死亡后逃逸为12分','轻微6，轻伤以上12'],
['不按规定年检','机动车驾驶人','驾驶未按规定定期进行安全技术检验的公路客运、旅游客运、危险品运输车辆上路','3分','其他机动车同类行为记1分','重点车3，普通车1'],
['载货汽车超载','载货汽车驾驶人','载物超过最大允许总质量30%以上未达50%','3分','50%以上记6分','三到五记3，过半记6']
);
topics.find(t=>t.id==='speed').cards.push(
['特殊路段限速','机动车驾驶人','进出非机动车道、铁路道口、急弯、窄路、窄桥等','≤30 km/h','冰雪泥泞道路、掉头转弯、下陡坡同样限30','特殊情况统一想30'],
['高速同向两车道','小型汽车驾驶人','高速公路同方向有2条车道','左侧最低100 km/h','右侧不得低于高速最低60','两车道：左100'],
['高速同向三车道','小型汽车驾驶人','高速公路同方向有3条以上车道','最左最低110；中间最低90','最右侧不低于60；标志另有规定从标志','三车道：110、90、60'],
['摩托车高速速度','摩托车驾驶人','摩托车在高速公路行驶','≤80 km/h','同时不得载人','摩托上高速：80且不载人'],
['牵引故障车','机动车驾驶人','牵引发生故障的机动车','≤30 km/h','转向/照明失效宜用专用清障车','牵引慢行30']
);
topics.find(t=>t.id==='time').cards.push(
['学习驾驶证明','申请机动车驾驶证的人','科目一合格后取得学习驾驶证明','有效期3年','截止日期不得超过申请年龄条件上限','三年内完成科二科三'],
['科目补考预约','考试不合格申请人','科目二或科目三考试不合格后重新预约','10日以后','科目一可当场补考一次','技能考试挂科等10天'],
['考试次数','驾驶证申请人','学习驾驶证明有效期内预约科目二和科目三','各不超过5次','第五次仍不合格，已合格的其他科目成绩作废','科二5次、科三5次'],
['驾驶证审验','大中型客货车驾驶人','一个记分周期内有记分','周期结束后30日内','无记分免予本周期审验','有分30日，无分免审'],
['事故身体证明','70周岁以上驾驶人','发生责任交通事故造成人员重伤或死亡','事故处理结束后30日内','参加审验并提交身体条件证明','事故结束30日']
);
topics.find(t=>t.id==='distance').cards.push(
['高速100以上车距','高速驾驶人','车速超过100 km/h','车距≥100米','同车道前车','速度100，距离也100'],
['高速100以下车距','高速驾驶人','车速低于100 km/h','车距≥50米','不得低于规定的最低车速','低于100，至少50'],
['夜间故障警告','机动车驾驶人','夜间车辆故障难以移动','警告牌＋危险报警闪光灯','同时开启示廓灯和后位灯','夜间不仅放牌，还要亮灯']
);
topics.find(t=>t.id==='license').cards.push(
['驾驶证有效期','初次领取驾驶证的人','机动车驾驶证首次有效期','6年','每周期均未记满12分，换发10年证','先6后10再长期'],
['长期驾驶证','驾驶人','10年有效期内每个记分周期均未记满12分','换发长期有效证','到期仍须按规定换领','6年→10年→长期'],
['驾驶证扣留','交通警察','依法查处酒驾、记满12分等法定情形','暂时扣留证件','不是取消驾驶资格','扣留是暂时拿走'],
['驾驶证暂扣','饮酒驾驶人','饮酒后驾驶机动车','暂扣6个月','同时罚款并记12分','饮酒暂扣，醉酒吊销'],
['考试作弊','驾驶证申请人','考试过程中有贿赂、舞弊行为','取消考试资格；已通过科目成绩无效','1年内不得再次申领','作弊1年，骗取证3年']
);
topics.find(t=>t.id==='lights').cards.push(
['转弯让直行','机动车驾驶人','无方向指示信号灯的交叉路口转弯','让直行车辆、行人先行','相对方向右转还要让左转','转弯让直行，右转让左转'],
['右方道路来车','机动车驾驶人','无信号、无标志、无交警指挥的交叉路口','让右方道路来车先行','转弯车仍须让直行车','没有信号就让右'],
['狭窄坡路会车','机动车驾驶人','狭窄坡路会车','上坡一方先行','下坡车已到中途而上坡车未上坡时，下坡先行','通常让上坡，已经下到一半别逼退'],
['狭窄山路会车','机动车驾驶人','狭窄山路会车','不靠山体一方先行','给临崖一侧更安全的通行机会','不靠山的先走'],
['进入环岛','准备进入环形路口的驾驶人','无信号控制进入环岛','让已在环岛内车辆先行','驶出环岛提前开启右转向灯','进让出，出打灯'],
['有障碍路段会车','机动车驾驶人','没有中心线道路，一方有障碍','无障碍一方先行','有障碍一方已驶入而对方未驶入时，其先行','通常有障碍的让']
);

const contrasts=[
['满分学习','小型车','7＋7，最多60天','重点大车','30＋30，最多120天','小车按周，大车按月','小型车每多一次满分教育，学习增加几天？','增加7天，最多60天'],
['故障警告','普通道路','车后50—100米','高速公路','车后150米以外','车越快，牌放越远','高速发生故障，警告牌放多远？','车后150米以外'],
['禁止停车','公交站等站点','30米以内禁停','路口、弯道、桥','50米以内禁停','站三，口五','公交站附近多少米内不能停车？','30米以内'],
['大雾高速','看得见200米','60速度，100车距','看得见100米','40速度，50车距','看得越近，开得越慢','能见度不到100米，最高开多快？','40 km/h，车距至少50米'],
['证件处理','醉酒驾驶','吊销','骗取驾驶证','撤销','开车违法叫吊销，拿证违法叫撤销','醉酒驾驶，驾驶证怎么处理？','吊销驾驶证'],
['高速行为','占应急道行驶','6分','高速违法停车','9分','高速停下更危险：6变9','高速公路违法停车记几分？','9分']
];

contrasts.push(
['逆向行驶','普通道路逆行','3分','高速/快速路逆行','12分','道路越快，危险越大','普通道路逆行记几分？','3分'],
['事故逃逸','轻微伤或财损','6分','轻伤以上或死亡','12分','先看伤情，再选6或12','轻微事故逃逸且不犯罪记几分？','6分'],
['驾驶证期限','第一次领证','6年','下一档','10年','6、10、长期，一级一级换','首次驾驶证有效期多久？','6年'],
['换证与变更','到期换证','提前90日','信息变化','30日内','到期九十，变化三十','驾驶证到期最早提前多久换？','90日'],
['饮酒与醉酒','饮酒驾驶','暂扣6个月','醉酒驾驶','吊销','喝了暂扣，醉了吊销','醉酒驾驶如何处理驾驶证？','吊销'],
['逆行与应急道','高速逆行','12分','占应急道行驶','6分','逆着开最危险，直接12','高速占应急道行驶记几分？','6分'],
['号牌违法','故意遮挡污损','9分','安装不规范','3分','故意遮污处罚更重','故意遮挡号牌记几分？','9分'],
['考试限制','考试作弊','1年不得申领','骗取驾驶证','3年不得申领','考场作弊1，拿证作假3','考试作弊多久不能再申领？','1年'],
['道路速度','无中心线城市路','30 km/h','无中心线公路','40 km/h','城三公四','无中心线城市道路最高多快？','30 km/h']
);

const questions=[
{t:'小型载客汽车驾驶人在一个记分周期内参加满分教育次数每增加一次，学习时间增加7天，每次最多60天。',a:['正确','错误'],c:0,e:'正确。记成“7起、加7、封顶60”；重点车型才是“30、30、120”。',topic:'时间题',number:true},
{t:'现行道路交通违法一次记分仍包含2分档。',a:['正确','错误'],c:1,e:'错误。现行档位是12、9、6、3、1分，旧口诀中的2分已取消。',topic:'记分题',number:true},
{t:'在高速公路违法占用应急车道行驶，一次记多少分？',a:['3分','6分','9分','12分'],c:1,e:'记6分。容易与“高速违法停车9分”混淆。',topic:'记分题',number:true},
{t:'高速公路能见度小于100米时，最高车速和最小车距正确的是？',a:['60 km/h，100米','40 km/h，50米','20 km/h，50米','30 km/h，100米'],c:1,e:'口诀“145”：能见度100、车速40、车距50。',topic:'速度题',number:true},
{t:'车辆在普通道路故障且难以移动，警告标志应放在车后多远？',a:['30米以内','50—100米','100—150米','150米以外'],c:1,e:'普通道路50—100米；高速公路是150米以外。',topic:'距离题',number:true},
{t:'驾驶证有效期满，最早可在到期前多久申请换证？',a:['30日','60日','90日','120日'],c:2,e:'到期前90日内。注意信息变化通常是30日内办理。',topic:'时间题',number:true},
{t:'夜间会车应在距对向来车多少米以外改用近光灯？',a:['50米','100米','150米','200米'],c:2,e:'150米以外改近光。近距离跟车和会车均不要用远光。',topic:'灯光题',number:true},
{t:'故意遮挡机动车号牌，一次记多少分？',a:['3分','6分','9分','12分'],c:2,e:'故意遮挡、污损号牌记9分；不按规定安装号牌记3分。',topic:'记分题',number:true},
{t:'公交站、急救站、加油站等站点多少米以内不得停车？',a:['20米','30米','50米','100米'],c:1,e:'站点30米；路口、急弯、窄路、桥梁等是50米。',topic:'距离题',number:true},
{t:'醉酒驾驶机动车，驾驶证处理方式是？',a:['扣留','暂扣','吊销','撤销'],c:2,e:'醉驾吊销；通过欺骗、贿赂等不正当手段取得驾驶证才是撤销。',topic:'证件题'},
{t:'高速公路能见度小于50米时，应将车速控制在20 km/h以下并尽快驶离。',a:['正确','错误'],c:0,e:'正确。口诀“520”：50米能见度、20速度、尽快离开。',topic:'速度题',number:true},
{t:'机动车在高速公路违法停车，一次记6分。',a:['正确','错误'],c:1,e:'错误，高速违法停车记9分；违法占用应急车道行驶才是6分。',topic:'记分题',number:true}
];

// 一条规则至少对应一道题，保证7张表与练习题库同步覆盖。
const allCards=topics.flatMap(t=>t.cards.map((card,index)=>({topic:t.name,card,index})));
allCards.forEach((item,idx)=>{
  const correct=item.card[3];
  const candidates=allCards.filter(x=>x.topic===item.topic&&x.card[3]!==correct).map(x=>x.card[3]);
  const distractors=[...new Set(candidates)].slice(idx%Math.max(1,candidates.length)).concat([...new Set(candidates)]).slice(0,3);
  if(distractors.length<3)return;
  const correctAt=idx%4,answers=distractors.slice();answers.splice(correctAt,0,correct);
  questions.push({
    t:`关于“${item.card[0]}”，正确的数字或处理结果是？`,a:answers,c:correctAt,
    e:`${item.card[1]}，${item.card[2]}：${correct}。易混提醒：${item.card[5]}。`,
    topic:item.topic,number:/\d/.test(correct),rule:`${topics.find(t=>t.name===item.topic).id}-${item.index}`
  });
});

const state=JSON.parse(localStorage.getItem('yue-drive-state')||'{"mastered":[],"wrong":[],"answered":0,"correct":0,"last":"","streak":0}');
let currentTopic=topics[0].id,quizMode='mixed',quiz=[],qIndex=0,locked=false,officialQuestions=[];
const save=()=>{localStorage.setItem('yue-drive-state',JSON.stringify(state));updateStats()};
function initStreak(){const today=new Date().toISOString().slice(0,10);if(state.last!==today){const yesterday=new Date(Date.now()-864e5).toISOString().slice(0,10);state.streak=state.last===yesterday?(state.streak||0)+1:1;state.last=today;save()}}
function updateStats(){document.querySelector('#learnedCount').textContent=state.mastered.length;document.querySelector('#wrongCount').textContent=state.wrong.length;document.querySelector('#accuracy').textContent=state.answered?Math.round(state.correct/state.answered*100)+'%':'—';document.querySelector('#streak b').textContent=state.streak||0}
function renderTabs(){topicTabs.innerHTML=topics.map(t=>`<button class="${t.id===currentTopic?'active':''}" data-topic="${t.id}">${t.icon} ${t.name}</button>`).join('');topicTabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{currentTopic=b.dataset.topic;renderTabs();renderCards()})}
function renderCards(){const t=topics.find(x=>x.id===currentTopic);topicIntro.innerHTML=`<b>${t.icon} ${t.name}</b><span>${t.intro}</span>`;cards.innerHTML=t.cards.map((c,i)=>{const id=`${t.id}-${i}`,done=state.mastered.includes(id);return `<article class="rule-card ${done?'mastered':''}"><div class="rule-card-head"><h3>${c[0]}</h3><button class="master-btn" data-id="${id}" aria-label="标记掌握">${done?'✓':'○'}</button></div><div class="fields"><div class="field"><small>谁</small><b>${c[1]}</b></div><div class="field"><small>什么情况</small><b>${c[2]}</b></div><div class="field number"><small>多少数字 / 结果</small><b>${c[3]}</b></div><div class="field"><small>上限 / 例外</small><b>${c[4]}</b></div></div><div class="mixup">⚠ 易混项：${c[5]}</div></article>`}).join('');cards.querySelectorAll('.master-btn').forEach(b=>b.onclick=()=>toggleMaster(b.dataset.id))}
function toggleMaster(id){const i=state.mastered.indexOf(id);i<0?state.mastered.push(id):state.mastered.splice(i,1);save();renderCards();toast(i<0?'已收入你的掌握清单 ✓':'已取消掌握标记')}
function renderContrasts(){contrastGrid.innerHTML=contrasts.map(c=>`<article class="versus"><div class="example-question"><small>考试可能这样问</small><b>${c[6]}</b><span>答案：${c[7]}</span></div><div class="simple-compare"><div><small>${c[1]}</small><strong>${c[2]}</strong></div><i>别和</i><div><small>${c[3]}</small><strong>${c[4]}</strong></div></div><div class="tip">记住：${c[5]}</div></article>`).join('')}
function startQuiz(){let pool=quizMode==='wrong'?questions.filter((_,i)=>state.wrong.includes(i)):quizMode==='numbers'?questions.filter(q=>q.number):quizMode==='official'?officialQuestions:questions;if(!pool.length){quizBox.innerHTML=`<div class="empty"><h3>${quizMode==='official'?'题库正在载入':'错题本还是空的 🎉'}</h3><p>${quizMode==='official'?'请稍候再试。':'先完成一轮摸底，答错的题会自动来到这里。'}</p></div>`;return}quiz=[...pool].sort(()=>Math.random()-.5).slice(0,10);qIndex=0;renderQuestion()}
function renderQuestion(){locked=false;if(qIndex>=quiz.length){const score=quiz.filter(q=>q._ok).length;quizBox.innerHTML=`<div class="empty"><p class="eyebrow">本轮完成</p><h3>${score===quiz.length?'满分通关！':'答对 '+score+' / '+quiz.length}</h3><p>${score/quiz.length>=.9?'已经达到90分合格线，继续保持。':'回到错题急救，把混淆数字再对比一次。'}</p><button class="primary" onclick="startQuiz()">再来一轮</button></div>`;return}const q=quiz[qIndex];quizBox.innerHTML=`<div class="quiz-progress"><i style="width:${qIndex/quiz.length*100}%"></i></div><div class="quiz-meta"><span>${q.topic}</span><b>${qIndex+1} / ${quiz.length}</b></div><h3>${q.t}</h3><div class="answers">${q.a.map((a,i)=>`<button class="answer" data-a="${i}"><b>${String.fromCharCode(65+i)}.</b> ${a}</button>`).join('')}</div><div id="feedback"></div>`;quizBox.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answer(+b.dataset.a))}
function answer(choice){if(locked)return;locked=true;const q=quiz[qIndex],ok=choice===q.c,globalIndex=questions.indexOf(q);q._ok=ok;state.answered++;if(ok){state.correct++;if(globalIndex>=0)state.wrong=state.wrong.filter(i=>i!==globalIndex)}else if(globalIndex>=0&&!state.wrong.includes(globalIndex))state.wrong.push(globalIndex);save();quizBox.querySelectorAll('.answer').forEach((b,i)=>{if(i===q.c)b.classList.add('correct');else if(i===choice)b.classList.add('wrong');b.disabled=true});feedback.innerHTML=`<div class="explain"><b>${ok?'✓ 判断正确':'✕ 这题混淆了'}</b><br>${q.e}</div><button class="next-btn">下一题 →</button>`;feedback.querySelector('button').onclick=()=>{qIndex++;renderQuestion()}}
function toast(s){const el=document.querySelector('#toast');el.textContent=s;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>document.querySelector('#'+b.dataset.view).scrollIntoView({behavior:'smooth'}));
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');quizMode=b.dataset.mode;startQuiz()});
async function loadOfficialBank(){try{const data=await fetch('data/official-bank.json').then(r=>r.json());officialQuestions=data.questions.filter(q=>!q.needsImage&&q.options.length>=2).map(q=>{const answerIndex=/^[A-D]$/.test(q.answer)?q.answer.charCodeAt(0)-65:q.answer==='正确'?0:1;return{t:q.stem,a:q.options.length?q.options:['正确','错误'],c:answerIndex,e:`公安公开题库原题 ${q.id}。注意：该附件含旧规题，答案正在按现行法规复核。`,topic:'公安公开题库',legacy:true}}).filter(q=>q.c>=0&&q.c<q.a.length);document.querySelector('#bankCount').textContent=questions.length+officialQuestions.length;if(quizMode==='official')startQuiz()}catch(e){console.warn('官方题库载入失败',e)}}
initStreak();renderTabs();renderCards();renderContrasts();startQuiz();updateStats();document.querySelector('#bankCount').textContent=questions.length;loadOfficialBank();
