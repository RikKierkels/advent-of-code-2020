const input = require('../input');
const log = console.log;
const regex = (string) => new RegExp(string, 'g');
const match = (pattern) => (string) => string.match(pattern) ?? [];

const hasValidCharacterCount = ({ min, max, char, password }) => {
  const matches = match(regex(char))(password).length;
  return matches >= min && matches <= max;
};

const hasValidCharacterPositions = ({ min, max, char, password }) => {
  const hasCharacterAtMin = password[min - 1] === char;
  const hasCharacterAtMax = password[max - 1] === char;
  return (hasCharacterAtMin && !hasCharacterAtMax) || (!hasCharacterAtMin && hasCharacterAtMax);
};

const passwords = input(__dirname, './input.txt')
  .split('\n')
  .map(match(/^(\d+)-(\d+) (\w): (\w+)$/))
  .map(([_, min, max, char, password]) => ({ min, max, char, password }));

const solutionOne = passwords.filter(hasValidCharacterCount).length;
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = passwords.filter(hasValidCharacterPositions).length;
log(`Solution pt.2 ${solutionTwo}`);
