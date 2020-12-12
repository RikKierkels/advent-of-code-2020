const input = require('../input');
const log = console.log;
const match = (pattern) => (string) => string.match(pattern) ?? [];
const mod = (n, mod) => ((n % mod) + mod) % mod;
const manhattanDistance = (x, y) => Math.abs(x) + Math.abs(y);

const DELTAS = {
  N: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
};

const move = (position, amount, direction) => ({
  x: position.x + direction.x * amount,
  y: position.y + direction.y * amount,
});
const rotate = (position, times) => Array.from({ length: times }).reduce(({ x, y }) => ({ x: -y, y: x }), position);

const reducer = (ship, { action, amount }) => {
  switch (action) {
    case 'L':
      return { ...ship, waypoint: rotate(ship.waypoint, mod(amount / 90, 4)) };
    case 'R':
      return { ...ship, waypoint: rotate(ship.waypoint, 4 - mod(amount / 90, 4)) };
    case 'F':
      return { ...ship, position: move(ship.position, amount, ship.waypoint) };
    default:
      return { ...ship, waypoint: move(ship.waypoint, amount, DELTAS[action]) };
  }
};

const run = (instructions, ship) => instructions.reduce((ship, instruction) => reducer(ship, instruction), ship);

const parseInstruction = ([_, action, amount]) => ({ action, amount });
const instructions = input(__dirname, './input.txt')
  .split('\n')
  .map(match(/^([NSEWLRF])(\d+)$/))
  .map(parseInstruction);

const ship = run(instructions, { position: { x: 0, y: 0 }, waypoint: { x: 10, y: 1 } });
const solution = manhattanDistance(ship.position.x, ship.position.y);
log(`Solution pt.2 ${solution}`);
