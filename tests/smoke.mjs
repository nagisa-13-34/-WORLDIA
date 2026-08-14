import assert from 'node:assert/strict';
import{createShopState}from'../games/shop/shop.js';
import{createFestivalState}from'../games/festival/festival.js';
import{createCityState}from'../games/city/city.js';
import{createCountryState}from'../games/country/country.js';
import{demand,satisfaction,trend}from'../js/economy.js';
for(const difficulty of ['EASY','NORMAL','HARD']){
 const states=[createShopState(difficulty),createFestivalState(difficulty),createCityState(difficulty),createCountryState(difficulty)];
 states.forEach(s=>{assert.equal(s.difficulty,difficulty);assert.equal(s.turn,1)});
}
assert.ok(demand(20,60,1,60,50)>0);
assert.ok(satisfaction(80,80,80,0)>50);
assert.deepEqual(trend([1,2],3),[1,2,3]);
assert.equal(createCityState('NORMAL').map.length,64);
assert.equal(createCountryState('NORMAL').industries.length,6);
console.log('WORLDIA smoke tests passed');

