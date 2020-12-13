const input = require('../input');
const log = console.log;
const array = (n) => Array.from({ length: n });
const manhattanDistance = (x, y) => Math.abs(x) + Math.abs(y);
const match = (pattern) => (string) => string.match(pattern) ?? [];
const mod = (n, mod) => ((n % mod) + mod) % mod;

const DIRECTIONS = {
  N: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
};

const move = (position, direction, amount) => ({
  x: position.x + direction.x * amount,
  y: position.y + direction.y * amount,
});
const rotate = (position, times) => array(times).reduce(({ x, y }) => ({ x: -y, y: x }), position);

const createReducer = (moving) => (ship, { action, amount }) => {
  switch (action) {
    case 'L':
      return { ...ship, waypoint: rotate(ship.waypoint, mod(amount / 90, 4)) };
    case 'R':
      return { ...ship, waypoint: rotate(ship.waypoint, 4 - mod(amount / 90, 4)) };
    case 'F':
      return { ...ship, position: move(ship.position, ship.waypoint, amount) };
    default:
      return { ...ship, [moving]: move(ship[moving], DIRECTIONS[action], amount) };
  }
};

const run = (reducer) => (instructions, ship) => instructions.reduce(reducer, ship);

const runPartOne = run(createReducer('position'));
const runPartTwo = run(createReducer('waypoint'));

const parseInstruction = ([_, action, amount]) => ({ action, amount });
const instructions = input(__dirname, './input.txt')
  .split('\n')
  .map(match(/^([NSEWLRF])(\d+)$/))
  .map(parseInstruction);

let ship = runPartOne(instructions, { position: { x: 0, y: 0 }, waypoint: DIRECTIONS.E });
log(`Solution pt.1 ${manhattanDistance(ship.position.x, ship.position.y)}`);

ship = runPartTwo(instructions, { position: { x: 0, y: 0 }, waypoint: { x: 10, y: 1 } });
log(`Solution pt.2 ${manhattanDistance(ship.position.x, ship.position.y)}`);
