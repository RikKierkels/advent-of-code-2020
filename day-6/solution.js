const input = require('../input');
const log = console.log;
const includes = (values) => (value) => values.includes(value);
const join = (on) => (string) => string.join(on);
const length = (array) => array.length;
const split = (on) => (string) => string.split(on);

const splitOnBlankLine = split('\n\n');
const splitOnNewLine = split(/\s+/);

const unique = (values) => [...new Set(values)];
const sum = (a, b) => a + b;
const intersection = (array) => array.reduce((intersection, values) => unique(values).filter(includes(intersection)));

const answersByGroup = splitOnBlankLine(input(__dirname, './input.txt')).map(splitOnNewLine);

const solutionOne = answersByGroup.map(join('')).map(unique).map(length).reduce(sum);
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = answersByGroup.map(intersection).map(length).reduce(sum);
log(`Solution pt.2 ${solutionTwo}`);
