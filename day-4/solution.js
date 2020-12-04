const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const split = (by) => (value) => value.split(by);

const splitOnBlankLine = split('\n\n');
const splitOnFieldSeparator = split(':');
const splitOnNewLine = split(/\s+/);

const parseToRecord = (passport) =>
  passport.reduce((record, field) => {
    const [key, value] = splitOnFieldSeparator(field);
    return { ...record, [key]: value };
  }, {});

const isWithinRange = (min, max) => (number) => number >= min && number <= max;
const hasValidHeight = ([_, height, unit]) => (unit === 'cm' ? isWithinRange(150, 193) : isWithinRange(59, 76))(height);
const match = (pattern) => (string) => string.match(pattern) ?? [];
const matches = (pattern) => (string) => pattern.test(string);
const isAlwaysValid = () => true;

const validator = {
  byr: isWithinRange(1920, 2002),
  iyr: isWithinRange(2010, 2020),
  eyr: isWithinRange(2020, 2030),
  hgt: compose(hasValidHeight, match(/^(\d+)(cm|in)$/)),
  hcl: matches(/^#[0-9a-f]{6}$/),
  ecl: matches(/^(amb|blu|brn|gry|grn|hzl|oth)$/),
  pid: matches(/^\d{9}$/),
  cid: isAlwaysValid,
};

const hasAllRequiredFields = (passport) =>
  ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every((field) => passport[field]);
const hasAllValidFields = (passport) => Object.entries(passport).every(([key, value]) => validator[key](value));

const passports = splitOnBlankLine(input(__dirname, './input.txt')).map(splitOnNewLine).map(parseToRecord);

const solutionOne = passports.filter(hasAllRequiredFields).length;
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = passports.filter(hasAllRequiredFields).filter(hasAllValidFields).length;
log(`Solution pt.2 ${solutionTwo}`);
