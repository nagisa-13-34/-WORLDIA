import assert from 'node:assert/strict';
import{createShopState}from'../games/shop/shop.js';
import{ShopGame}from'../games/shop/shop.js';
import{createFestivalState,FestivalGame}from'../games/festival/festival.js';
import{createCityState,CityGame}from'../games/city/city.js';
import{createCountryState}from'../games/country/country.js';
import{demand,satisfaction,trend}from'../js/economy.js';
import{rollEvent,resolveEvent}from'../js/events.js';
for(const difficulty of ['EASY','NORMAL','HARD']){
 const states=[createShopState(difficulty),createFestivalState(difficulty),createCityState(difficulty),createCountryState(difficulty)];
 states.forEach(s=>{assert.equal(s.difficulty,difficulty);assert.equal(s.turn,1)});
}
assert.ok(demand(20,60,1,60,50)>0);
assert.ok(satisfaction(80,80,80,0)>50);
assert.deepEqual(trend([1,2],3),[1,2,3]);
assert.equal(createCityState('NORMAL').map.length,64);
assert.equal(createCountryState('NORMAL').industries.length,6);

const originalRandom=Math.random,originalTimeout=globalThis.setTimeout;
globalThis.setTimeout=()=>0;
globalThis.document={createElement:()=>({style:{},remove(){}}),body:{append(){}},querySelector:()=>null,querySelectorAll:()=>[]};

const eventState=createShopState('NORMAL');
let randomValues=[0,.999];
Math.random=()=>randomValues.shift()??1;
rollEvent('shop',eventState,{eventBad:1});
const restoredEventState=JSON.parse(JSON.stringify(eventState));
assert.ok(restoredEventState.pendingEvent.options.every(option=>!('effect'in option)));
assert.equal(resolveEvent(restoredEventState,0),true);
assert.equal(restoredEventState.pendingEvent,null);

for(const [mode,state,key] of [['festival',createFestivalState('NORMAL'),'companyRep'],['city',createCityState('NORMAL'),'satisfaction'],['country',createCountryState('NORMAL'),'credit']]){
 const before=state[key];randomValues=[0,0];Math.random=()=>randomValues.shift()??1;rollEvent(mode,state,{eventBad:1});assert.ok(state[key]>before);
}

Math.random=()=>.5;
const shop=createShopState('NORMAL');
shop.products.forEach(product=>product.stock=1);
shop.popularity=100;shop.quality=100;shop.economy=100;shop.capacity=100;
const shopGame=new ShopGame(()=>{});shopGame.state=shop;shopGame.commit=()=>{};shopGame.nextDay();
assert.equal(shop.customers,3);
assert.equal(shop.products.reduce((total,product)=>total+product.stock,0),0);

Math.random=()=>1;
const city=createCityState('NORMAL');
const cityGame=new CityGame(()=>{});cityGame.state=city;cityGame.commit=()=>{};cityGame.nextMonth();
assert.ok(city.population>0);

const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
const festival=createFestivalState('NORMAL');
festival.live={running:true};
const festivalGame=new FestivalGame(()=>{});festivalGame.state=festival;festivalGame.save(false);
assert.equal(JSON.parse(saved.get('worldia.save.v1.festival')).live.running,false);
assert.equal(festival.live.running,true);

Math.random=originalRandom;
globalThis.setTimeout=originalTimeout;
console.log('WORLDIA smoke tests passed');
