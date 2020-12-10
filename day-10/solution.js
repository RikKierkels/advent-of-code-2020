const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const ascending = (a, b) => a - b;
const includes = (values) => (value) => values.includes(value);
const takeLast = (array) => array.pop();
const toInt = (int) => +int;

const difference = (array) => array.map((item, index, items) => items[index + 1] - item);
const filter = (predicate) => (array) => array.filter(predicate);
const partition = (predicate) => (array) =>
  array.reduce((acc, i) => (acc[predicate(i) ? 0 : 1].push(i), acc), [[], []]);

const getDifferencesOfOneAndThreeJolts = compose(
  partition((jolts) => jolts === 1),
  filter(includes([1, 3])),
  difference,
);

let jolts = input(__dirname, './input.txt').split('\n').map(toInt).sort(ascending);

const [ones, threes] = getDifferencesOfOneAndThreeJolts([0, ...jolts, jolts[jolts.length - 1] + 3]);
log(`Solution pt.1 ${ones.length * threes.length}`);

const getArrangements = (jolts) =>
  takeLast(
    jolts.reduce(
      (jolts, jolt) => {
        const waysToReach = (jolts[jolt - 1] ?? 0) + (jolts[jolt - 2] ?? 0) + (jolts[jolt - 3] ?? 0);
        return (jolts[jolt] = waysToReach), jolts;
      },
      [1],
    ),
  );

const arrangements = getArrangements(jolts);
log(`Solution pt.2 ${arrangements}`);
