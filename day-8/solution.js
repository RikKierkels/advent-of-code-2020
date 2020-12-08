const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const match = (pattern) => (string) => string.match(pattern) ?? [];

const accumulate = (argument, { current, accumulator, executed, ...state }) => ({
  current: current + 1,
  accumulator: accumulator + argument,
  executed: [...executed, current],
  ...state,
});

const jump = (argument, { current, executed, ...state }) => ({
  current: current + argument,
  executed: [...executed, current],
  ...state,
});

const nop = (_, { current, executed, ...state }) => ({
  current: current + 1,
  executed: [...executed, current],
  ...state,
});

const executor = {
  acc: accumulate,
  jmp: jump,
  nop: nop,
};

const parse = ([_, operation, argument]) => [operation, +argument];
const parseInstruction = compose(parse, match(/^(acc|jmp|nop) ([+-]\d+)$/));
const execute = ([operation, argument], state) => executor[operation](argument, state);
const stateFrom = (instructions) => ({ accumulator: 0, current: 0, instructions, executed: [] });
const isInfiniteLoop = ({ current, executed }) => executed.includes(current);
const isValid = ({ current, instructions }) => current > instructions.length - 1;

const run = (state, isEndFn) => {
  while (!isEndFn(state)) {
    const instruction = state.instructions[state.current];
    state = execute(instruction, state);
  }
  return state;
};

const instructions = input(__dirname, './input.txt').split('\n').map(parseInstruction);

let state = run(stateFrom(instructions), isInfiniteLoop);
log(`Solution pt.1 ${state.accumulator}`);

const isSwappableOperation = (operation) => ['nop', 'jmp'].includes(operation);
const swapOperation = (operation) => (operation === 'nop' ? 'jmp' : 'nop');

const getNextInstructions = (indexOfLastSwappedOperation, instructions) => {
  instructions = [...instructions].map((instruction) => [...instruction]);
  const indexOfSwappedOperation = instructions.findIndex(
    ([operation], index) => index > indexOfLastSwappedOperation && isSwappableOperation(operation),
  );
  const [operation, argument] = instructions[indexOfSwappedOperation];
  instructions[indexOfSwappedOperation] = [swapOperation(operation), argument];
  return { indexOfSwappedOperation, instructions };
};

const runTillValidState = (instructions) => {
  let indexOfLastSwappedOperation = 0;

  while (indexOfLastSwappedOperation < instructions.length - 1) {
    const { indexOfSwappedOperation, instructions: nextInstructions } = getNextInstructions(
      indexOfLastSwappedOperation,
      instructions,
    );
    indexOfLastSwappedOperation = indexOfSwappedOperation;

    const state = run(stateFrom(nextInstructions), (state) => isInfiniteLoop(state) || isValid(state));
    if (isValid(state)) return state;
  }
};

state = runTillValidState(instructions);
log(`Solution pt.1 ${state.accumulator}`);
