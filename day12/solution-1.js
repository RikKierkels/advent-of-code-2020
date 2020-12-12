const input = require('../input');
const log = console.log;
const match = (pattern) => (string) => string.match(pattern) ?? [];
const mod = (n, mod) => ((n % mod) + mod) % mod;
const manhattanDistance = (x, y) => Math.abs(x) + Math.abs(y);

// Split into two parts, as part two has no concept of direction but instead uses a waypoint. I could've reused the waypoint as the direction for
// part one but that would've been confusing. This however leads to some duplication between the solutions.

const DIRECTIONS = ['N', 'E', 'S', 'W'];
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
const rotate = (direction, amount) => mod(DIRECTIONS.indexOf(direction) + amount / 90, 4);

const reducer = (ship, { action, amount }) => {
  switch (action) {
    case 'L':
      return { ...ship, direction: DIRECTIONS[rotate(ship.direction, -amount)] };
    case 'R':
      return { ...ship, direction: DIRECTIONS[rotate(ship.direction, amount)] };
    case 'F':
      return { ...ship, position: move(ship.position, amount, DELTAS[ship.direction]) };
    default:
      return { ...ship, position: move(ship.position, amount, DELTAS[action]) };
  }
};

const run = (instructions, ship) => instructions.reduce((ship, instruction) => reducer(ship, instruction), ship);

const parseInstruction = ([_, action, amount]) => ({ action, amount });
const instructions = input(__dirname, './input.txt')
  .split('\n')
  .map(match(/^([NSEWLRF])(\d+)$/))
  .map(parseInstruction);

const ship = run(instructions, { position: { x: 0, y: 0 }, direction: 'E' });
const solution = manhattanDistance(ship.position.x, ship.position.y);
log(`Solution pt.1 ${solution}`);
