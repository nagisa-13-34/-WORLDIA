import{escapeHTML,money,compact,pct}from'./config.js';
export const app=()=>document.querySelector('#app');
export const fmt=(v,type='num')=>type==='money'?money(v):type==='pct'?pct(v):compact(v);
export function toast(message,type='good'){const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;document.querySelector('#toast-layer').append(el);setTimeout(()=>el.remove(),3100)}
export function floatDelta(text,bad=false){const el=document.createElement('div');el.className='float-delta';el.style.color=bad?'var(--red)':'var(--mint)';el.textContent=text;document.body.append(el);setTimeout(()=>el.remove(),1500)}
export function modal(html,{closeable=true}={}){const layer=document.querySelector('#modal-layer');layer.innerHTML=`<div class="modal">${html}</div>`;layer.hidden=false;if(closeable)layer.addEventListener('click',e=>{if(e.target===layer)closeModal()},{once:true})}
export function closeModal(){const layer=document.querySelector('#modal-layer');layer.hidden=true;layer.innerHTML=''}
export const stat=(label,value,type='num',delta='')=>`<div class="stat"><div class="label">${escapeHTML(label)}</div><div class="value">${fmt(value,type)}</div>${delta?`<div class="delta">${escapeHTML(delta)}</div>`:''}</div>`;
export const meter=(label,value)=>`<div class="metric">${escapeHTML(label)}<b>${Math.round(value)}</b><div class="progress"><i style="--value:${Math.max(0,Math.min(100,value))}%"></i></div></div>`;
export const chart=values=>{const max=Math.max(...values,1);return`<div class="chart" aria-label="推移グラフ">${values.map(v=>`<i style="height:${Math.max(5,v/max*100)}%" title="${Math.round(v).toLocaleString()}"></i>`).join('')}</div>`};
export function header(title,turn,unit,onBack,onSave,onSettings){return`<header class="topbar"><button class="icon-btn" id="back-home" aria-label="ホームへ">←</button><div><div class="brand">${escapeHTML(title)}</div><div class="tiny muted">${turn}${unit}目</div></div><div class="spacer"></div><button class="btn" id="manual-save">保存</button><button class="icon-btn" id="game-settings" aria-label="設定">⋯</button></header>`}
export function bindHeader({back,save,settings}){document.querySelector('#back-home')?.addEventListener('click',back);document.querySelector('#manual-save')?.addEventListener('click',save);document.querySelector('#game-settings')?.addEventListener('click',settings)}
export function tabs(items,active){return`<nav class="tabs">${items.map(([id,label])=>`<button class="tab ${active===id?'active':''}" data-tab="${id}">${label}</button>`).join('')}</nav>`}

