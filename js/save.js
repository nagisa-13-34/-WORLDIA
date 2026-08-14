const PREFIX='worldia.save.v1.';
const META='worldia.meta.v1';
export const Save={
  load(mode){try{const raw=localStorage.getItem(PREFIX+mode);return raw?JSON.parse(raw):null}catch{return null}},
  save(mode,state){try{const data={...state,savedAt:Date.now()};localStorage.setItem(PREFIX+mode,JSON.stringify(data));return true}catch{return false}},
  remove(mode){localStorage.removeItem(PREFIX+mode)},
  has(mode){return localStorage.getItem(PREFIX+mode)!==null},
  meta(){try{return JSON.parse(localStorage.getItem(META))||{tutorials:{},sound:true}}catch{return{tutorials:{},sound:true}}},
  setMeta(next){localStorage.setItem(META,JSON.stringify(next))},
  summary(mode){const s=this.load(mode);if(!s)return null;return{turn:s.turn||0,difficulty:s.difficulty||'NORMAL',savedAt:s.savedAt}}
};

