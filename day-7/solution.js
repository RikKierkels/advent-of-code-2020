const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const match = (pattern) => (string) => string.match(pattern) ?? [];
const split = (on) => (string) => string.split(on);

const splitOnNewLine = split('\n');
const splitOnBagSeparator = split(',');

const matchBag = match(/^(\w+ \w+) bags contain (.*)\.$/);
const matchBagContents = match(/^\s*(\d+) (\w+ \w+).*/);
const toBagContent = ([_, count, type]) => (count ? [{ count: +count, type }] : []);
const parseBagContent = compose(toBagContent, matchBagContents);

const hasBagInContents = (bags, type, match = 'shiny gold') => {
  const contents = bags[type];

  if (!contents) return false;
  if (contents.some((bag) => bag.type === match)) return true;

  return contents.some(({ type }) => hasBagInContents(bags, type));
};

// TODO: Rename :)
const countBagContents = (bags, type) => {
  const contents = bags[type];
  return contents
    ? contents.reduce((total, { count, type }) => total + count + count * countBagContents(bags, type), 0)
    : 0;
};

const bags = splitOnNewLine(input(__dirname, './input.txt')).reduce((bags, rule) => {
  let [, type, contents] = matchBag(rule);
  contents = splitOnBagSeparator(contents);
  return { ...bags, [type]: contents.flatMap(parseBagContent) };
}, {});

const solutionOne = Object.keys(bags).filter((type) => hasBagInContents(bags, type)).length;
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = countBagContents(bags, 'shiny gold');
log(`Solution pt.2 ${solutionTwo}`);
