import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import{createShopState}from'../games/shop/shop.js';
import{ShopGame}from'../games/shop/shop.js';
import{createFestivalState,FestivalGame}from'../games/festival/festival.js';
import{createCityState,CityGame}from'../games/city/city.js';
import{createCountryState,CountryGame}from'../games/country/country.js';
import{demand,satisfaction,trend}from'../js/economy.js';
import{rollEvent,resolveEvent}from'../js/events.js';
import{Save}from'../js/save.js';
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
const toastLayer={append(){}};
globalThis.document={createElement:()=>({style:{},remove(){}}),body:{append(){}},querySelector:selector=>selector==='#toast-layer'?toastLayer:null,querySelectorAll:()=>[]};

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

const negativeCity=createCityState('NORMAL');negativeCity.funds=-50000;randomValues=[0,.3];Math.random=()=>randomValues.shift()??1;rollEvent('city',negativeCity,{eventBad:1});
assert.equal(negativeCity.funds,-140000);
const negativeCountry=createCountryState('NORMAL');negativeCountry.budget=-5;randomValues=[0,.3];Math.random=()=>randomValues.shift()??1;rollEvent('country',negativeCountry,{eventBad:1});
assert.equal(negativeCountry.budget,-6);

const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
saved.set('worldia.save.v1.shop',JSON.stringify({version:1,staff:[{salary:10000}]}));
const migratedShop=Save.load('shop');
assert.equal(migratedShop.version,2);
assert.equal(migratedShop.staff[0].salary,3800);
const festival=createFestivalState('NORMAL');
festival.live={running:true};
const festivalGame=new FestivalGame(()=>{});festivalGame.state=festival;festivalGame.save(false);
assert.equal(JSON.parse(saved.get('worldia.save.v1.festival')).live.running,false);
assert.equal(festival.live.running,true);

Math.random=()=>1;
const lockedFestival=createFestivalState('NORMAL');
const lockedGame=new FestivalGame(()=>{});lockedGame.state=lockedFestival;lockedGame.commit=()=>{};lockedGame.render=()=>{};
const cashBefore=lockedFestival.cash,paidPlan=structuredClone(lockedFestival.plan);lockedGame.startEvent();
const paidCost=cashBefore-lockedFestival.cash;
lockedFestival.plan.venue='field';lockedFestival.plan.artists=['0'];lockedFestival.plan.promotion=1200000;lockedFestival.plan.sound=100;lockedFestival.plan.lighting=100;
for(let tick=0;tick<10&&lockedFestival.live;tick++)lockedGame.tickLive();
const settledCost=lockedFestival.lastResult.artistFees+lockedFestival.lastResult.venueCost+lockedFestival.lastResult.operations;
assert.equal(settledCost,paidCost);
assert.equal(lockedFestival.lastResult.planName,paidPlan.name);

Math.random=()=>.5;
const longShop=createShopState('NORMAL');const longShopGame=new ShopGame(()=>{});longShopGame.state=longShop;longShopGame.commit=()=>{};longShopGame.render=()=>{};longShopGame.hire();
for(let day=0;day<30;day++){for(const product of longShop.products)if(product.stock<8)longShopGame.stock(product.id);longShopGame.nextDay();if(longShop.pendingEvent)longShop.pendingEvent=null}
assert.ok(longShop.cash>0);
assert.ok(longShop.products.some(product=>product.stock>0));

Math.random=()=>1;
const officeCity=createCityState('NORMAL');const officeGame=new CityGame(()=>{});officeGame.state=officeCity;officeGame.commit=()=>{};officeGame.render=()=>{};
for(const index of [20,21,22,23]){officeCity.selected='office';officeGame.place(index)}
for(let month=0;month<6;month++)officeGame.nextMonth();
assert.ok(officeCity.taxIncome<300000);
assert.ok(officeCity.jobs>officeCity.population);

const debtCountry=createCountryState('NORMAL');const debtGame=new CountryGame(()=>{});debtGame.state=debtCountry;debtGame.commit=()=>{};debtGame.render=()=>{};
for(let year=0;year<10;year++){debtGame.nextYear();if(debtCountry.pendingEvent)debtCountry.pendingEvent=null}
assert.ok(debtCountry.budget>=-debtCountry.gdp*.31);
assert.ok(debtCountry.policy.education<8);

const serviceWorker=readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
assert.match(serviceWorker,/key\.startsWith\('worldia-'\)&&key!==CACHE/);

Math.random=originalRandom;
globalThis.setTimeout=originalTimeout;
console.log('WORLDIA smoke tests passed');
