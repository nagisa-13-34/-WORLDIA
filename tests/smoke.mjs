import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import{createShopState,chooseProduct,ShopGame}from'../games/shop/shop.js';
import{createFestivalState,FestivalGame}from'../games/festival/festival.js';
import{createCityState,CityGame}from'../games/city/city.js';
import{createCountryState,CountryGame}from'../games/country/country.js';
import{demand,satisfaction,trend}from'../js/economy.js';
import{rollEvent,resolveEvent,eventBadRatio}from'../js/events.js';
import{Save}from'../js/save.js';
import{DIFFICULTY}from'../js/config.js';
for(const difficulty of ['EASY','NORMAL','HARD']){
 const states=[createShopState(difficulty),createFestivalState(difficulty),createCityState(difficulty),createCountryState(difficulty)];
 states.forEach(s=>{assert.equal(s.difficulty,difficulty);assert.equal(s.turn,1)});
 assert.equal(states[0].cash,Math.round(350000*DIFFICULTY[difficulty].capital));
}
assert.ok(eventBadRatio('shop',DIFFICULTY.EASY)<eventBadRatio('shop',DIFFICULTY.NORMAL));
assert.ok(eventBadRatio('shop',DIFFICULTY.NORMAL)<eventBadRatio('shop',DIFFICULTY.HARD));
assert.ok(demand(20,60,1,60,50)>0);
assert.ok(satisfaction(80,80,80,0)>50);
assert.deepEqual(trend([1,2],3),[1,2,3]);
assert.equal(createCityState('NORMAL').map.length,64);
assert.equal(createCountryState('NORMAL').industries.length,6);

const originalRandom=Math.random,originalTimeout=globalThis.setTimeout;
globalThis.setTimeout=()=>0;
const toastLayer={append(){}},modalLayer={hidden:true,innerHTML:'',onclick:null};
globalThis.document={createElement:()=>({style:{},remove(){}}),body:{append(){}},querySelector:selector=>selector==='#toast-layer'?toastLayer:selector==='#modal-layer'?modalLayer:null,querySelectorAll:()=>[]};

const eventState=createShopState('NORMAL');
let randomValues=[0,.999];
Math.random=()=>randomValues.shift()??.999999;
rollEvent('shop',eventState,{eventBad:1});
const restoredEventState=JSON.parse(JSON.stringify(eventState));
assert.ok(restoredEventState.pendingEvent.options.every(option=>!('effect'in option)));
assert.equal(resolveEvent(restoredEventState,0),true);
assert.equal(restoredEventState.pendingEvent,null);

for(const [mode,state,key] of [['festival',createFestivalState('NORMAL'),'companyRep'],['city',createCityState('NORMAL'),'satisfaction'],['country',createCountryState('NORMAL'),'credit']]){
 const before=state[key];randomValues=[0,0];Math.random=()=>randomValues.shift()??.999999;rollEvent(mode,state,{eventBad:1});assert.ok(state[key]>before);
}

Math.random=()=>.5;
const shop=createShopState('NORMAL');
shop.products.forEach(product=>product.stock=1);
shop.popularity=100;shop.quality=100;shop.economy=100;shop.capacity=100;
const shopGame=new ShopGame(()=>{});shopGame.state=shop;shopGame.commit=()=>{};shopGame.nextDay();
assert.equal(shop.customers,3);
assert.equal(shop.products.reduce((total,product)=>total+product.stock,0),0);

Math.random=()=>.1;
assert.equal(chooseProduct([{id:'人気商品',cost:100,price:300,popularity:100},{id:'不人気商品',cost:100,price:300,popularity:1}]).id,'人気商品');
const slowShop=createShopState('NORMAL'),fastShop=structuredClone(slowShop);
for(const state of [slowShop,fastShop]){state.capacity=20;state.popularity=100;state.quality=100;state.economy=100;state.products.forEach(product=>product.stock=100)}
slowShop.speed=0;fastShop.speed=100;
const slowGame=new ShopGame(()=>{}),fastGame=new ShopGame(()=>{});slowGame.state=slowShop;fastGame.state=fastShop;slowGame.commit=()=>{};fastGame.commit=()=>{};
Math.random=()=>.5;slowGame.nextDay();Math.random=()=>.5;fastGame.nextDay();
assert.ok(fastShop.customers>slowShop.customers);

Math.random=()=>.999999;
const city=createCityState('NORMAL');
const cityGame=new CityGame(()=>{});cityGame.state=city;cityGame.commit=()=>{};cityGame.nextMonth();
assert.ok(city.population>0);

const negativeCity=createCityState('NORMAL');negativeCity.funds=-50000;randomValues=[0,.45];Math.random=()=>randomValues.shift()??.999999;rollEvent('city',negativeCity,{eventBad:1});
assert.equal(negativeCity.funds,-140000);
const negativeCountry=createCountryState('NORMAL');negativeCountry.budget=-5;randomValues=[0,.45];Math.random=()=>randomValues.shift()??.999999;rollEvent('country',negativeCountry,{eventBad:1});
assert.equal(negativeCountry.budget,-6);

const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
saved.set('worldia.save.v1.country','{broken json');
assert.equal(Save.load('country'),null);
saved.set('worldia.save.v1.shop',JSON.stringify({version:1,staff:[{salary:10000}]}));
const migratedShop=Save.load('shop');
assert.equal(migratedShop.version,2);
assert.equal(migratedShop.staff[0].salary,3800);
const festival=createFestivalState('NORMAL');
festival.live={running:true};
const festivalGame=new FestivalGame(()=>{});festivalGame.state=festival;festivalGame.save(false);
assert.equal(JSON.parse(saved.get('worldia.save.v1.festival')).live.running,false);
assert.equal(festival.live.running,true);

Math.random=()=>.999999;
const lockedFestival=createFestivalState('NORMAL');
const lockedGame=new FestivalGame(()=>{});lockedGame.state=lockedFestival;lockedGame.commit=()=>{};lockedGame.render=()=>{};
const cashBefore=lockedFestival.cash,paidPlan=structuredClone(lockedFestival.plan);lockedGame.startEvent();
const paidCost=cashBefore-lockedFestival.cash;
lockedFestival.plan.venue='field';lockedFestival.plan.artists=['0'];lockedFestival.plan.promotion=1200000;lockedFestival.plan.sound=100;lockedFestival.plan.lighting=100;
for(let tick=0;tick<10&&lockedFestival.live;tick++)lockedGame.tickLive();
const settledCost=lockedFestival.lastResult.artistFees+lockedFestival.lastResult.venueCost+lockedFestival.lastResult.operations;
assert.equal(settledCost,paidCost);
assert.equal(lockedFestival.lastResult.planName,paidPlan.name);

const crowdAtStages=stages=>{const state=createFestivalState('NORMAL'),game=new FestivalGame(()=>{});state.live={progress:50,minute:15,attendance:250,target:250,sales:0,posts:0,satisfaction:50,crowd:0,weather:'晴れ',running:false,logs:[],cost:0,plan:{...structuredClone(state.plan),stages}};game.state=state;game.commit=()=>{};game.render=()=>{};Math.random=()=>.5;game.tickLive();return state.live.crowd};
assert.ok(crowdAtStages(3)<crowdAtStages(1));

Math.random=()=>.5;
const longShop=createShopState('NORMAL');const longShopGame=new ShopGame(()=>{});longShopGame.state=longShop;longShopGame.commit=()=>{};longShopGame.render=()=>{};longShopGame.hire();
for(let day=0;day<30;day++){for(const product of longShop.products)if(product.stock<8)longShopGame.stock(product.id);longShopGame.nextDay();if(longShop.pendingEvent)longShop.pendingEvent=null}
assert.ok(longShop.cash>0);
assert.ok(longShop.products.some(product=>product.stock>0));

const clearShop=createShopState('NORMAL'),stormShop=structuredClone(clearShop);stormShop.weatherShock=2;
const clearGame=new ShopGame(()=>{}),stormGame=new ShopGame(()=>{});clearGame.state=clearShop;stormGame.state=stormShop;clearGame.commit=()=>{};stormGame.commit=()=>{};
Math.random=()=>.5;clearGame.nextDay();Math.random=()=>.5;stormGame.nextDay();
assert.ok(stormShop.customers<clearShop.customers);

Math.random=()=>.999999;
const officeCity=createCityState('NORMAL');const officeGame=new CityGame(()=>{});officeGame.state=officeCity;officeGame.commit=()=>{};officeGame.render=()=>{};
for(const index of [20,21,22,23]){officeCity.selected='office';officeGame.place(index)}
for(let month=0;month<6;month++)officeGame.nextMonth();
assert.ok(officeCity.taxIncome<300000);
assert.ok(officeCity.jobs>officeCity.population);

const baseServices=createCityState('NORMAL'),facilityServices=structuredClone(baseServices);
facilityServices.map[0]='school';facilityServices.map[1]='hospital';facilityServices.map[2]='police';facilityServices.map[3]='park';
const baseServiceGame=new CityGame(()=>{}),facilityServiceGame=new CityGame(()=>{});baseServiceGame.state=baseServices;facilityServiceGame.state=facilityServices;baseServiceGame.commit=()=>{};facilityServiceGame.commit=()=>{};
for(let month=0;month<6;month++){Math.random=()=>.999999;baseServiceGame.nextMonth();Math.random=()=>.999999;facilityServiceGame.nextMonth();baseServices.pendingEvent=null;facilityServices.pendingEvent=null}
assert.ok(facilityServices.education>baseServices.education);
assert.ok(facilityServices.health>baseServices.health);
assert.ok(facilityServices.safety>baseServices.safety);
assert.ok(facilityServices.environment>baseServices.environment);
const demolitionCity=createCityState('NORMAL'),demolitionGame=new CityGame(()=>{}),fundsBeforeDemolition=demolitionCity.funds;
demolitionGame.state=demolitionCity;demolitionGame.commit=()=>{};demolitionGame.demolish(18);
assert.equal(demolitionCity.map[18],null);
assert.ok(demolitionCity.funds>fundsBeforeDemolition);

const debtCountry=createCountryState('NORMAL');const debtGame=new CountryGame(()=>{});debtGame.state=debtCountry;debtGame.commit=()=>{};debtGame.render=()=>{};
for(let year=0;year<10;year++){debtGame.nextYear();if(debtCountry.pendingEvent)debtCountry.pendingEvent=null}
assert.ok(debtCountry.budget>=-debtCountry.gdp*.31);
assert.ok(debtCountry.policy.education<8);
assert.ok(Math.abs(debtCountry.stability-(debtCountry.safety+debtCountry.credit+debtCountry.satisfaction)/3)<1e-9);
const lowSafetyCountry=createCountryState('NORMAL'),highSafetyCountry=structuredClone(lowSafetyCountry);
lowSafetyCountry.policy.infrastructure=1;highSafetyCountry.policy.infrastructure=16;
const lowSafetyGame=new CountryGame(()=>{}),highSafetyGame=new CountryGame(()=>{});lowSafetyGame.state=lowSafetyCountry;highSafetyGame.state=highSafetyCountry;lowSafetyGame.commit=()=>{};highSafetyGame.commit=()=>{};
Math.random=()=>.5;lowSafetyGame.nextYear();Math.random=()=>.5;highSafetyGame.nextYear();
assert.ok(highSafetyCountry.safety>lowSafetyCountry.safety);

const serviceWorker=readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
assert.match(serviceWorker,/key\.startsWith\('worldia-'\)&&key!==CACHE/);
assert.match(serviceWorker,/event\.request\.mode==='navigate'/);
assert.match(serviceWorker,/if\(response\.ok\)/);
const indexHtml=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.doesNotMatch(indexHtml,/id="app"[^>]*aria-live/);
const mainSource=readFileSync(new URL('../js/main.js',import.meta.url),'utf8');
assert.match(mainSource,/<button type="button" class="mode-card"/);

Math.random=originalRandom;
globalThis.setTimeout=originalTimeout;
console.log('WORLDIA smoke tests passed');
