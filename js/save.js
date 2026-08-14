const PREFIX='worldia.save.v1.';
const META='worldia.meta.v1';
const migrate=(mode,state)=>{if(mode==='shop'&&(state.version||1)<2){state.loan=state.loan||0;(state.staff||[]).forEach(member=>{if(member.salary>6000)member.salary=Math.round(member.salary*.38)});state.version=2}if(mode==='city'&&state.externalJobs===undefined)state.externalJobs=0;return state};
export const Save={
  load(mode){try{const raw=localStorage.getItem(PREFIX+mode);return raw?migrate(mode,JSON.parse(raw)):null}catch{return null}},
  save(mode,state){try{const data={...state,savedAt:Date.now()};localStorage.setItem(PREFIX+mode,JSON.stringify(data));return true}catch{return false}},
  remove(mode){localStorage.removeItem(PREFIX+mode)},
  has(mode){return localStorage.getItem(PREFIX+mode)!==null},
  meta(){try{return JSON.parse(localStorage.getItem(META))||{tutorials:{},sound:true}}catch{return{tutorials:{},sound:true}}},
  setMeta(next){localStorage.setItem(META,JSON.stringify(next))},
  summary(mode){const s=this.load(mode);if(!s)return null;return{turn:s.turn||0,difficulty:s.difficulty||'NORMAL',savedAt:s.savedAt}}
};
