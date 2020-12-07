const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const match = (pattern) => (string) => string.match(pattern) ?? [];

const toBag = ([_, type, contents]) => ({
  type,
  contents: contents
    .split(',')
    .map(toBagContentFromRule)
    .filter(({ count }) => count),
});
const toBagContent = ([_, count, type]) => ({ count: +count, type });
const toBagFromRule = compose(toBag, match(/^(\w+ \w+) bags contain (.*)\.$/));
const toBagContentFromRule = compose(toBagContent, match(/^\s*(\d+) (\w+ \w+).*/));

const hasBagInContents = (bags, contents = [], match = 'shiny gold') => {
  if (contents.some((bag) => bag.type === match)) return true;
  return contents.some(({ type }) => hasBagInContents(bags, bags[type]));
};

const getTotalBagsInBagContent = (bags, contents = []) =>
  contents.reduce((total, { count, type }) => total + count + count * getTotalBagsInBagContent(bags, bags[type]), 0);

const bags = input(__dirname, './input.txt')
  .split('\n')
  .map(toBagFromRule)
  .reduce((bags, { type, contents }) => ({ ...bags, [type]: contents }), {});

const solutionOne = Object.keys(bags).filter((type) => hasBagInContents(bags, bags[type])).length;
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = getTotalBagsInBagContent(bags, bags['shiny gold']);
log(`Solution pt.2 ${solutionTwo}`);
