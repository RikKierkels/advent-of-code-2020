const fs = require('fs');
const path = require('path');
const log = console.log;

const toMatchedLine = (line) => line.match(/^(\d+)-(\d+) (\w): (\w+)$/);
const withoutMatchAll = ([_, ...rest]) => rest;
const pathToInput = path.join(__dirname, './input.txt');
const lines = fs.readFileSync(pathToInput, 'utf-8').split('\n').map(toMatchedLine).map(withoutMatchAll);

const asRegex = (value) => new RegExp(value, 'g');
const getCharCount = (char, string) => (string.match(asRegex(char)) ?? []).length;
const hasMatchingCharCount = ([min, max, char, password]) => {
  const charCount = getCharCount(char, password);
  return charCount >= min && charCount <= max;
};

const solutionOne = lines.flatMap((line) => (hasMatchingCharCount(line) ? [line] : []));
log(`Solution pt.1 ${solutionOne.length}`);

const asIndex = (x) => x - 1;
const normalizeIndex = ([pos1, pos2, ...rest]) => [asIndex(pos1), asIndex(pos2), ...rest];
const hasMatchingCharPosition = ([pos1, pos2, char, password]) =>
  (password[pos1] === char && password[pos2] !== char) || (password[pos1] !== char && password[pos2] === char);

const solutionTwo = lines.map(normalizeIndex).flatMap((line) => (hasMatchingCharPosition(line) ? [line] : []));
log(`Solution pt.2 ${solutionTwo.length}`);
