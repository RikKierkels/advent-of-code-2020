const input = require('../input');
const log = console.log;
const ascending = (a, b) => a - b;

const findInvalidNumberInWindow = (numbers, lower = 0, upper = 25) => {
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

  return window.length < 2 ? current : findInvalidNumberInWindow(numbers, ++lower, ++upper);
};

const findEncryptionWeaknessInWindow = (numbers, sumToFind, lower = 0, upper = 1) => {
  if (upper >= numbers.length) return;

  const window = numbers.slice(lower, upper);
  const sum = window.reduce((a, b) => a + b);

  if (sum === sumToFind) return Math.min(...window) + Math.max(...window);
  if (sum < sumToFind) upper++;
  if (sum > sumToFind) lower++;

  return findEncryptionWeaknessInWindow(numbers, sumToFind, lower, upper);
};

const numbers = input(__dirname, './input.txt')
  .split('\n')
  .map((number) => +number);

const solutionOne = findInvalidNumberInWindow(numbers);
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = findEncryptionWeaknessInWindow(numbers, solutionOne);
log(`Solution pt.2 ${solutionTwo}`);
