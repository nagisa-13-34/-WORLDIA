export const MODES={shop:{name:'小さなお店経営',icon:'▣',accent:'#47d7ff',unit:'日'},festival:{name:'フェス・ライブ運営',icon:'♫',accent:'#ff637a',unit:'週'},city:{name:'街づくり',icon:'▦',accent:'#43e5b1',unit:'月'},country:{name:'国家運営',icon:'◉',accent:'#8b6cff',unit:'年'}};
export const DIFFICULTY={EASY:{capital:1.35,cost:.86,demand:1.15,decay:.75,eventBad:.75,label:'成長しやすい'},NORMAL:{capital:1,cost:1,demand:1,decay:1,eventBad:1,label:'標準バランス'},HARD:{capital:.72,cost:1.2,demand:.88,decay:1.35,eventBad:1.35,label:'判断が重要'}};
export const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
export const rnd=(min,max)=>Math.random()*(max-min)+min;
export const pick=list=>list[Math.floor(Math.random()*list.length)];
export const money=value=>`${value<0?'-':''}¥${Math.abs(Math.round(value)).toLocaleString('ja-JP')}`;
export const compact=value=>Intl.NumberFormat('ja-JP',{notation:'compact',maximumFractionDigits:1}).format(value);
export const pct=value=>`${Number(value).toFixed(1)}%`;
export const uid=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
export const escapeHTML=value=>String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

