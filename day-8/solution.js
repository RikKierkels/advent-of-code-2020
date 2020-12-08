const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const match = (pattern) => (string) => string.match(pattern) ?? [];
const clone = (array) => [...array].map((item) => ({ ...item }));

const Program = () => {
  const operations = {
    acc: (argument, { current, accumulator, executed, ...state }) => ({
      current: current + 1,
      accumulator: accumulator + argument,
      executed: [...executed, current],
      ...state,
    }),
    jmp: (argument, { current, executed, ...state }) => ({
      current: current + argument,
      executed: [...executed, current],
      ...state,
    }),
    nop: (_, { current, executed, ...state }) => ({
      current: current + 1,
      executed: [...executed, current],
      ...state,
    }),
  };

  const execute = ({ operation, argument }, state) => operations[operation](argument, state);
  const isLooping = ({ current, executed }) => executed.includes(current);
  const hasTerminated = ({ current, instructions }) => current > instructions.length - 1;

  const process = (state) => {
    if (isLooping(state) || hasTerminated(state)) {
      return { value: state.accumulator, hasTerminated: hasTerminated(state) };
    }

    const instruction = state.instructions[state.current];
    state = execute(instruction, state);
    return process(state);
  };

  return {
    run: (instructions) => process({ accumulator: 0, current: 0, executed: [], instructions }),
  };
};

const parseInstruction = ([_, operation, argument]) => ({ operation, argument: +argument });
const parseInstructionFromLine = compose(parseInstruction, match(/^(acc|jmp|nop) ([+-]\d+)$/));
const instructions = input(__dirname, './input.txt').split('\n').map(parseInstructionFromLine);

const program = Program();

let result = program.run(instructions);
log(`Solution pt.1 ${result.value}`);

const isSwappableOperation = (operation) => ['nop', 'jmp'].includes(operation);
const swapOperation = (operation) => (operation === 'nop' ? 'jmp' : 'nop');

result = instructions.reduce((result, { operation, argument }, index, instructions) => {
  if (result) return result;
  if (!isSwappableOperation(operation)) return null;

  instructions = clone(instructions);
  instructions[index] = { operation: swapOperation(operation), argument };
  result = program.run(instructions);

  return result.hasTerminated ? result : null;
}, null);
log(`Solution pt.2 ${result.value}`);
