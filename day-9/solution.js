const input = require('../input');
const log = console.log;
const ascending = (a, b) => a - b;

const findInvalidNumber = (numbers, lower = 0, upper = 25) => {
  if (upper >= numbers.length) return;

  const window = numbers.slice(lower, upper).sort(ascending);
  const current = numbers[upper];

  while (window.length >= 2) {
    const first = window[0];
    const last = window[window.length - 1];
    const sum = first + last;

    if (sum === current) break;
    if (sum < current) window.shift();
    if (sum > current) window.pop();
  }

  return window.length < 2 ? current : findInvalidNumber(numbers, ++lower, ++upper);
};

const findEncryptionWeakness = (numbers, sumTill) => {
  let lower = 0;
  let upper = 1;
  let sum = numbers[lower] + numbers[upper];

  while (upper < numbers.length) {
    if (sum === sumTill) break;

    if (sum < sumTill) {
      sum += numbers[upper + 1];
      upper++;
    }

    if (sum > sumTill) {
      sum -= numbers[lower];
      lower++;
    }
  }

  const window = numbers.slice(lower, upper);
  return Math.min(...window) + Math.max(...window);
};

const numbers = input(__dirname, './input.txt')
  .split('\n')
  .map((number) => +number);

const solutionOne = findInvalidNumber(numbers);
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = findEncryptionWeakness(numbers, solutionOne);
log(`Solution pt.2 ${solutionTwo}`);
