import{pick,clamp}from'./config.js';

const add=(state,key,amount)=>{if(typeof state[key]==='number')state[key]+=amount};
const raise=(state,key,amount)=>{if(typeof state[key]==='number')state[key]=clamp(state[key]+amount)};
const pay=(state,key,amount)=>{if(typeof state[key]!=='number'||state[key]<amount)return false;state[key]-=amount;return true};

const COMMON=[
 {id:'viral',title:'SNSで話題に',text:'思いがけない投稿が広く拡散しました。',tone:'good',apply:s=>{raise(s,'reputation',6);raise(s,'popularity',7);add(s,'followers',Math.max(120,Math.round((s.followers||0)*.08)));raise(s,'companyRep',5);raise(s,'satisfaction',3);raise(s,'credit',2);raise(s,'landValue',2)}},
 {id:'economy_up',title:'景気上昇',text:'消費意欲が高まり、需要が増えています。',tone:'good',apply:s=>{raise(s,'economy',8);raise(s,'companyRep',2);raise(s,'landValue',3);raise(s,'credit',2);if(typeof s.gdp==='number')s.gdp=Math.round(s.gdp*1.012*10)/10}},
 {id:'cost_rise',title:'原材料価格の上昇',text:'仕入れや建設に一時的な負担が発生します。',tone:'bad',apply:s=>{if('costShock'in s)s.costShock=2;if('cash'in s&&'companyRep'in s)s.cash=Math.max(0,s.cash-60000);if('funds'in s)s.funds=Math.max(0,s.funds-90000);if('budget'in s)s.budget=Math.max(0,s.budget-1)}},
 {id:'heavy_rain',title:'大雨',text:'移動と屋外活動に影響が出ています。',tone:'bad',apply:s=>{if('weatherShock'in s)s.weatherShock=2;raise(s,'popularity',-2);raise(s,'companyRep',-2);raise(s,'satisfaction',-2);raise(s,'environment',-1);raise(s,'food',-2);if('funds'in s)s.funds=Math.max(0,s.funds-70000)}}
];

const MODE={
 shop:[{id:'shop_competitor',title:'競合店が開店',text:'近くに新しい店ができました。どう対応しますか？',options:[{id:'quality',label:'品質を磨く（¥30,000）',effect:s=>pay(s,'cash',30000)&&(s.reputation=clamp(s.reputation+5))},{id:'price',label:'価格で対抗',effect:s=>{s.popularity=clamp(s.popularity+3);s.marginPenalty=2}},{id:'wait',label:'様子を見る',effect:s=>{s.popularity=clamp(s.popularity-4)}}]}],
 festival:[{id:'festival_show',title:'出演者から追加提案',text:'特別演出を加えればSNSで注目されそうです。',options:[{id:'accept',label:'演出を追加（¥120,000）',effect:s=>pay(s,'cash',120000)&&(s.companyRep=clamp(s.companyRep+6))},{id:'decline',label:'今回は見送る',effect:()=>true}]}],
 city:[{id:'city_business',title:'企業から進出相談',text:'税の優遇と引き換えに雇用を増やす提案です。',options:[{id:'invite',label:'誘致する（¥500,000）',effect:s=>{if(!pay(s,'funds',500000))return false;s.externalJobs=(s.externalJobs||0)+180;s.jobs+=180;s.landValue=clamp(s.landValue+4);return true}},{id:'decline',label:'条件を断る',effect:s=>{s.satisfaction=clamp(s.satisfaction+1)}}]}],
 country:[{id:'country_research',title:'国際共同研究の提案',text:'隣国から技術協力の打診が届きました。',options:[{id:'join',label:'参加する（予算2B）',effect:s=>{if(!pay(s,'budget',2))return false;s.technology=clamp(s.technology+5);s.credit=clamp(s.credit+3);return true}},{id:'domestic',label:'国内研究を優先',effect:s=>{s.technology=clamp(s.technology+2)}}]}]
};

const definitions=mode=>[...COMMON,...(MODE[mode]||[])];
const storedEvent=event=>({id:event.id,title:event.title,text:event.text,tone:event.tone||'warn',options:event.options?.map(({id,label})=>({id,label}))||null});

export function rollEvent(mode,state,difficulty){
 if(state.pendingEvent||Math.random()>.15)return null;
 const list=definitions(mode),badWeight=Math.max(1,Math.round(difficulty.eventBad*2));
 const weighted=list.flatMap(event=>event.tone==='bad'?Array(badWeight).fill(event):[event]);
 const event=pick(weighted);
 if(!event.options)event.apply(state);
 state.pendingEvent=storedEvent(event);
 return state.pendingEvent;
}

export function resolveEvent(state,index){
 const pending=state.pendingEvent;
 if(!pending?.options?.[index])return false;
 const all=[...COMMON,...Object.values(MODE).flat()];
 const definition=all.find(event=>event.id===pending.id)||all.find(event=>event.title===pending.title);
 const storedOption=pending.options[index];
 const option=definition?.options?.find(item=>item.id===storedOption.id)||definition?.options?.[index];
 if(!option){state.pendingEvent=null;return false}
 const result=option.effect(state);
 if(result===false)return false;
 state.pendingEvent=null;
 return true;
}
