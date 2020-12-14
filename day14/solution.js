const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const join = (char) => (array) => array.join(char);
const replace = (...args) => (string) => string.replace(...args);
const match = (pattern) => (string) => string.match(pattern) ?? [];
const map = (fn) => (array) => array.map(fn);

const parseBinaryStringToInt = (string) => parseInt(string, 2);
const replaceXWithOne = replace('X', '1');
const replaceXWithZero = replace('X', 0);
const toMaskAnd = compose(BigInt, parseBinaryStringToInt, join(''), map(replaceXWithOne));
const toMaskOr = compose(BigInt, parseBinaryStringToInt, join(''), map(replaceXWithZero));

const initialize = (instructions, masks = { '&': [], '|': [] }, memory = {}) => {
  const [instruction, ...remaining] = instructions;

  if (!instruction) return memory;

  if (instruction.mask) {
    masks['&'] = toMaskAnd([...instruction.mask]);
    masks['|'] = toMaskOr([...instruction.mask]);
  } else {
    memory[instruction.address] = (BigInt(instruction.value) & masks['&']) | masks['|'];
  }

  return initialize(remaining, masks, memory);
};

const matchMask = match(/^mask = ([01X]+)$/);
const toMask = ([_, mask]) => ({ mask });
const matchMemory = match(/^mem\[(\d+)] = (\d+)$/);
const toMemory = ([_, address, value]) => ({ address, value });
const parseLineToMaskOrMemory = (line) =>
  (line.startsWith('mask') ? compose(toMask, matchMask) : compose(toMemory, matchMemory))(line);

const instructions = input(__dirname, './input.txt').split('\n').map(parseLineToMaskOrMemory);

const memory = initialize(instructions);
log(`Solution pt.1 ${Object.values(memory).reduce((a, b) => a + b, 0n)}`);

log(`Solution pt.2 ${[]}`);
