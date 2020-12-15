const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const join = (char) => (array) => array.join(char);
const replace = (...args) => (string) => string.replace(...args);
const match = (pattern) => (string) => string.match(pattern) ?? [];
const map = (fn) => (array) => array.map(fn);

const parseNumberToBinaryString = (number) => Number(number).toString(2);
const parseBinaryStringToNumber = (string) => parseInt(string, 2);
const replaceXWithOne = replace('X', '1');
const replaceXWithZero = replace('X', 0);
const toMaskAnd = compose(BigInt, parseBinaryStringToNumber, join(''), map(replaceXWithOne));
const toMaskOr = compose(BigInt, parseBinaryStringToNumber, join(''), map(replaceXWithZero));
const sumMemory = (memory) => Object.values(memory).reduce((a, b) => a + b, 0n);

const initializeV1 = (instructions, masks = { '&': [], '|': [] }, memory = {}) => {
  const [instruction, ...remaining] = instructions;

  if (!instruction) return memory;

  if (instruction.mask) {
    masks['&'] = toMaskAnd([...instruction.mask]);
    masks['|'] = toMaskOr([...instruction.mask]);
  } else {
    memory[instruction.address] = (BigInt(instruction.value) & masks['&']) | masks['|'];
  }

  return initializeV1(remaining, masks, memory);
};

const shift = map((value) => value << 1n);
const makeOne = map((value) => value | 1n);

const initializeV2 = (instructions, mask = [], memory = {}) => {
  const [instruction, ...remaining] = instructions;

  if (!instruction) return memory;

  if (instruction.mask) {
    mask = instruction.mask;
  } else {
    const address = parseNumberToBinaryString(instruction.address).padStart(36, '0');

    [...mask]
      .reduce(
        (addresses, bit, index) => {
          addresses = shift(addresses);

          if (bit === 'X') return [...addresses, ...makeOne(addresses)];
          if (bit === '1' || address[index] === '1') return makeOne(addresses);

          return addresses;
        },
        [0n],
      )
      .forEach((address) => (memory[address] = BigInt(instruction.value)));
  }

  return initializeV2(remaining, mask, memory);
};

const matchMask = match(/^mask = ([01X]+)$/);
const toMask = ([_, mask]) => ({ mask });
const matchMemory = match(/^mem\[(\d+)] = (\d+)$/);
const toMemory = ([_, address, value]) => ({ address, value });
const parseLineToMaskOrMemory = (line) =>
  (line.startsWith('mask') ? compose(toMask, matchMask) : compose(toMemory, matchMemory))(line);

const instructions = input(__dirname, './input.txt').split('\n').map(parseLineToMaskOrMemory);

let memory = initializeV1(instructions);
log(`Solution pt.1 ${sumMemory(memory)}`);

memory = initializeV2(instructions);
log(`Solution pt.2 ${sumMemory(memory)}`);
