const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const match = (pattern) => (string) => string.match(pattern) ?? [];

const toBag = ([_, type, contents]) => ({
  type,
  contents: contents.split(',').map(toBagContentFromRule).filter(hasPositiveCount),
});
const toBagContent = ([_, count, type]) => ({ count: +count, type });
const hasPositiveCount = ({ count }) => count;
const toBagFromRule = compose(toBag, match(/^(\w+ \w+) bags contain (.*)\.$/));
const toBagContentFromRule = compose(toBagContent, match(/^\s*(\d+) (\w+ \w+).*/));

const hasBagInContents = (bags, bag) => (contents = []) => {
  return contents.some(({ type }) => type === bag)
    ? true
    : contents.some(({ type }) => hasBagInContents(bags, bag)(bags[type]));
};

const countBagsInContents = (bags, contents = []) =>
  contents.reduce((total, { count, type }) => total + count + count * countBagsInContents(bags, bags[type]), 0);

const bags = input(__dirname, './input.txt')
  .split('\n')
  .map(toBagFromRule)
  .reduce((bags, { type, contents }) => ({ ...bags, [type]: contents }), {});

const hasShinyGoldBagInContents = hasBagInContents(bags, 'shiny gold');
const solutionOne = Object.values(bags).filter(hasShinyGoldBagInContents).length;
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = countBagsInContents(bags, bags['shiny gold']);
log(`Solution pt.2 ${solutionTwo}`);
