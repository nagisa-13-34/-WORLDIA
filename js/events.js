import{pick,rnd,clamp}from'./config.js';
const COMMON=[
 {title:'SNSで話題に',text:'思いがけない投稿が広く拡散しました。',tone:'good',apply:s=>{s.reputation=clamp((s.reputation||50)+6);s.popularity=clamp((s.popularity||50)+7)}},
 {title:'景気上昇',text:'消費意欲が高まり、需要が増えています。',tone:'good',apply:s=>{s.economy=clamp((s.economy||50)+8)}},
 {title:'原材料価格の上昇',text:'仕入れや建設に一時的な負担が発生します。',tone:'bad',apply:s=>{s.costShock=2}},
 {title:'大雨',text:'移動と屋外活動に影響が出ています。',tone:'bad',apply:s=>{s.weatherShock=2}}
];
const MODE={shop:[{title:'競合店が開店',text:'近くに新しい店ができました。どう対応しますか？',options:[{label:'品質を磨く（¥30,000）',effect:s=>{s.cash-=30000;s.reputation=clamp(s.reputation+5)}},{label:'価格で対抗',effect:s=>{s.popularity=clamp(s.popularity+3);s.marginPenalty=2}},{label:'様子を見る',effect:s=>{s.popularity=clamp(s.popularity-4)}}]}],festival:[{title:'出演者から追加提案',text:'特別演出を加えればSNSで注目されそうです。',options:[{label:'演出を追加（¥120,000）',effect:s=>{s.cash-=120000;s.companyRep=clamp(s.companyRep+6)}},{label:'今回は見送る',effect:()=>{}}]}],city:[{title:'企業から進出相談',text:'税の優遇と引き換えに雇用を増やす提案です。',options:[{label:'誘致する（¥500,000）',effect:s=>{s.funds-=500000;s.jobs+=180;s.landValue=clamp(s.landValue+4)}},{label:'条件を断る',effect:s=>{s.satisfaction=clamp(s.satisfaction+1)}}]}],country:[{title:'国際共同研究の提案',text:'隣国から技術協力の打診が届きました。',options:[{label:'参加する（予算2B）',effect:s=>{s.budget-=2;s.technology=clamp(s.technology+5);s.credit=clamp(s.credit+3)}},{label:'国内研究を優先',effect:s=>{s.technology=clamp(s.technology+2)}}]}]};
export function rollEvent(mode,state,difficulty){if(state.pendingEvent||Math.random()>.15*difficulty.eventBad)return null;const list=[...COMMON,...(MODE[mode]||[])];const event={...pick(list)};if(!event.options)event.apply(state);state.pendingEvent={title:event.title,text:event.text,tone:event.tone||'warn',options:event.options||null};return state.pendingEvent}
export function resolveEvent(state,index){const event=state.pendingEvent;if(!event?.options?.[index])return;event.options[index].effect(state);state.pendingEvent=null}

