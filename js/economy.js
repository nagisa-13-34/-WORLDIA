import{clamp,rnd}from'./config.js';
export const satisfaction=(quality,priceValue,capacity,pressure)=>clamp(quality*.45+priceValue*.25+capacity*.3-pressure);
export const demand=(base,awareness,priceRatio,quality,economy=50)=>Math.max(0,base*(.55+awareness/100)*Math.pow(Math.max(.25,2-priceRatio),1.15)*(.55+quality/180)*(.72+economy/180)*rnd(.94,1.06));
export const trend=(history,value,max=24)=>[...(history||[]),Math.round(value)].slice(-max);
export const growthRate=(investment,tax,stability,shock=0)=>clamp(investment*.045+(100-tax)*.014+stability*.012-shock,-8,12);

