#!/usr/bin/env node
'use strict';

const jsonata = require('./jsonata');
const jmespath = require('jmespath');
const fetch = require('node-fetch');
const Benchmark = require('benchmark');

async function getLaureates() {
  const response = await fetch(
    'http://api.nobelprize.org/2.0/laureates?nobelPrizeYear=2000&yearTo=2005&limit=100'
  );
  return response.json();
}

async function getPrizes() {
  const response = await fetch(
    'http://api.nobelprize.org/2.0/nobelPrizes?nobelPrizeYear=2000&yearTo=2005&limit=100'
  );
  return response.json();
}

const jsonataSimple = jsonata('laureates.knownName.en');

const jsonataComplex = jsonata(`
laureates.{
  "name": knownName.en ? knownName.en : orgName.en,
  "gender": gender,
  "prizes": nobelPrizes.categoryFullName.en[]
}
`);

const jsonataComplexWithSort = jsonata(`
laureates.{
  "name": knownName.en ? knownName.en : orgName.en,
  "gender": gender,
  "prizes": nobelPrizes.categoryFullName.en[]
}^(name)
`);

const jsonataJoin = jsonata(`
(prizes.nobelPrizes)@$p.(laureates.laureates)@$l[$l.id in $p.laureates.id].{
  "name": $l.knownName.en,
  "gender": $l.gender,
  "prize": $p.categoryFullName.en
}
`);

const jsonataAggregates = jsonata(`(
$sp := nobelPrizes.{"count": $count(laureates)}.count;
{
  "count": $count($sp),
  "sum": $sum($sp),
  "average": $average($sp),
  "min": $min($sp),
  "max": $max($sp)
};
)`);

const jmespathSimple = (input) => jmespath.search(input, "laureates.knownName.en")

function jsSimple(input) {
  return input.laureates
    .map((laureate) => laureate?.knownName?.en)
    .filter((name) => name);
}

function jsComplex(input) {
  return input?.laureates.map((l) => ({
    name: l?.knownName?.en || l?.orgName.en,
    gender: l?.gender,
    prizes: l?.nobelPrizes.map((p) => p?.categoryFullName?.en)
  }));
}

function jsComplexWithSort(input) {
  return input?.laureates
    .map((l) => ({
      name: l?.knownName?.en || l?.orgName.en,
      gender: l?.gender,
      prizes: l?.nobelPrizes.map((p) => p?.categoryFullName?.en)
    }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

function jsJoin({laureates, prizes}) {
  // Map over each prize (flatMap automatically removes the resulting nesting)
  return prizes.nobelPrizes.flatMap((prize) =>
    // Filter all laureates who have an id associated with the prize.
    // This is complex because each prize can have multiple laureates.
    laureates.laureates
      .filter((laureate) =>
        prize.laureates
          .map((prizeLaureate) => prizeLaureate.id)
          .includes(laureate.id)
      )
      // Map each laureate and prize to the new data structure
      .map((laureate) => ({
        name: laureate?.knownName?.en,
        gender: laureate?.gender,
        prize: prize?.categoryFullName?.en
      }))
  );
}

function jsAggregates(input) {
  const prizeLaureates = input.nobelPrizes.map(
    (prize) => prize.laureates.length
  );

  // eslint-disable-next-line unicorn/no-reduce
  const sum = prizeLaureates.reduce((previous, cur) => previous + cur, 0);

  return {
    count: prizeLaureates.length,
    sum,
    average: sum / prizeLaureates.length,
    min: Math.min(...prizeLaureates),
    max: Math.max(...prizeLaureates)
  };
}

const delay = async (ms, value) =>
new Promise((resolve) => setTimeout(resolve, ms, value));

async function run2(expr) {
const start = new Date().getTime()
console.log("started")
var expression = jsonata(expr);
expression.registerFunction(
  "Study_all",
  async (a) =>
    await delay(700, [
      { id: 1, name: "StudyA" },
      { id: 2, name: "StudyB" }
    ])
);
expression.registerFunction(
  "Participant_all",
  async (a) => await delay(700, [{ id: 1 }, { id: 2 }])
);
expression.registerFunction(
  "Tags_view",
  async (a) => await delay(700, "TagName" + a)
);
expression.registerFunction(
  "ActivityEvent_all",
  async (a) =>
    await delay(700, [
      { timestamp: 1, data: "A_" + a },
      { timestamp: 2, data: "B_" + a }
    ])
);
expression.registerFunction(
  "SensorEvent_all",
  async (a) =>
    await delay(700, [
      { timestamp: 1, data: "C_" + a },
      { timestamp: 2, data: "D_" + a }
    ])
);
expression.registerFunction("resolveParallel", async (funcs) => {
  //return Promise.all(funcs.map((fn) => fulfill(fn.apply(fn))));
  return resolveParallel(funcs);
});
expression.registerFunction("mapParallel", async (items, func) => {
  return Promise.all(items.map((item) => fulfill(func(item))));
});
let result = await expression.evaluate({}, {})
console.log("time: " + (new Date().getTime() - start))
return result
}

async function resolveParallel(query) {
if (query && query.apply) return fulfill(query.apply(query));
if (Array.isArray(query)) return Promise.all(query.map(resolveParallel));
if (typeof query === "object")
  return Object.fromEntries(
    await Promise.all(
      Object.entries(query).map(async ([k, val]) => [
        k,
        await resolveParallel(val)
      ])
    )
  );
return query;
}

function fulfill(iterator) {
function doNext(arg) {
  const next = iterator.next(arg);
  return next.done ? next.value : Promise.resolve(next.value).then(doNext);
}
//return doNext();
return iterator;
}

const expr = `
$mapParallel($Study_all("dnbd16yj2zkegk67aqm8"), function($s){{
"test": $contains("hello world", /wo/),
"id": $s.id,
"name": $s.name,
"participants": $mapParallel($Participant_all($s.id), function($p){
  $resolveParallel({
    "id": $p.id, 
    "name": function(){$Tags_view($p.id, "lamp.name")},
    "last_activity": function(){$ActivityEvent_all($p.id, null, null, null, 1)},
    "last_sensor": function(){$SensorEvent_all($p.id, "lamp.analytics", null, null, 1)}
  })
})
}})`

const expr2 = `
$Study_all("dnbd16yj2zkegk67aqm8").{
"test": $contains("hello World", /wo/),
"id": id,
"name": name,
"participants": $Participant_all(id).{
  "id": id, 
  "name": $Tags_view(id, "lamp.name"),
  "last_activity": $ActivityEvent_all(id, null, null, null, 1),
  "last_sensor": $SensorEvent_all(id, "lamp.analytics", null, null, 1)
}
}`

const results = [];
async function runTest(name, bench1, bench2) {
  //const test1 = await bench1();
  //const test2 = await bench2();

  /*if (
    !isEqual(
      // JSONata pollutes arrays, see: https://github.com/jsonata-js/jsonata/issues/296
      // Stringify and parse to remove the pollution.
      JSON.parse(JSON.stringify(test1)),
      JSON.parse(JSON.stringify(test2))
    )
  ) {
    console.log(`${name} benchmark 1 output:`);
    console.log(inspect(test1, {colors: true, depth: 8}));
    console.log(`${name} benchmark 2 output:`);
    console.log(inspect(test2, {colors: true, depth: 2}));
    throw new Error(
      'Invalid Test, the benchmarks do not produce the same results'
    );
  }*/

  return new Promise((resolve) => {
    // Add tests
    new Benchmark.Suite()
      .add(`${name} benchmark 1`, {
      defer: true,
      fn: async function(deferred) {
        await bench1();
        deferred.resolve();
      }
    })
      .add(`${name} benchmark 2`, {
      defer: true,
      fn: async function(deferred) {
        await bench2();
        deferred.resolve();
      }
    })
      // Add listeners
      .on('cycle', function (event) {
        console.log(String(event.target));
      })
      .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        results.push({
          name,
          cyclesPerSec1: Math.round(this[0].hz),
          cyclesPerSec2: Math.round(this[1].hz),
          oneOverZero: Math.round(this[0].hz / this[1].hz),
          percentAsFast: Math.round((this[1].hz / this[0].hz) * 100),
          percentSlower: Math.round((1 - this[1].hz / this[0].hz) * 100)
        });
        resolve();
      })
      // Run async
      .run({async: true});
  });
}

async function run() {
  const laureates = await getLaureates();
  const prizes = await getPrizes();
  //console.log(inspect(laureates.laureates[0], {colors: true, depth: 5}));
  //console.log(inspect(prizes.nobelPrizes[0], {colors: true, depth: 5}));

  await runTest(
    'simple mapping',
    async () => jmespathSimple(laureates),
    async () => await jsonataSimple.evaluate(laureates)
  );
  return results
  await runTest(
    'complex mapping',
    async () => jsComplex(laureates),
    async () => await jsonataComplex.evaluate(laureates)
  );
  await runTest(
    'complex join',
    async () => jsJoin({laureates, prizes}),
    async () => await jsonataJoin.evaluate({laureates, prizes})
  );
  await runTest(
    'complex mapping with sort',
    async () => jsComplexWithSort(laureates),
    async () => await jsonataComplexWithSort.evaluate(laureates)
  );
  await runTest(
    'complex join',
    async () => jsJoin({laureates, prizes}),
    async () => await jsonataJoin.evaluate({laureates, prizes})
  );
  await runTest(
    'aggregates',
    async () => jsAggregates(prizes),
    async () => await jsonataAggregates.evaluate(prizes)
  );
  return results
}

run().then(console.dir).catch(console.dir)
//run2(expr).then(console.dir).catch(console.dir)
//run2(expr2).then(console.dir).catch(console.dir)
