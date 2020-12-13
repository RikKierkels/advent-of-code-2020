const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const ascending = (a, b) => a - b;
const includes = (values) => (value) => values.includes(value);
const last = (array) => array[array.length - 1];
const toInt = (int) => +int;

const difference = (array) => array.map((item, index, items) => items[index + 1] - item);
const filter = (predicate) => (array) => array.filter(predicate);
const partition = (predicate) => (array) =>
  array.reduce((acc, i) => (acc[predicate(i) ? 0 : 1].push(i), acc), [[], []]);

const findDifferencesOneOrThreeJolts = compose(
  partition((jolts) => jolts === 1),
  filter(includes([1, 3])),
  difference,
);

const findPossibleJoltPaths = (jolts) =>
  jolts.reduce(
    (paths, jolt) => {
      const waysToReachJolt = (paths[jolt - 1] ?? 0) + (paths[jolt - 2] ?? 0) + (paths[jolt - 3] ?? 0);
      return (paths[jolt] = waysToReachJolt), paths;
    },
    [1],
  );

const jolts = input(__dirname, './input.txt').split('\n').map(toInt).sort(ascending);
const joltsChargingOutlet = 0;
const joltsDevice = last(jolts) + 3;

const [ones, threes] = findDifferencesOneOrThreeJolts([joltsChargingOutlet, ...jolts, joltsDevice]);
log(`Solution pt.1 ${ones.length * threes.length}`);

const paths = last(findPossibleJoltPaths(jolts));
log(`Solution pt.2 ${paths}`);
