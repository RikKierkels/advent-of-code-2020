const input = require('../input');
const log = console.log;

const map = input(__dirname, './input.txt')
  .split('\n')
  .map((row) => [...row]);

const traverse = (map, right, down) => {
  const moveCount = map.length / down;
  const width = map[0].length;
  return Array.from({ length: moveCount }, (_, move) => map[move * down][(move * right) % width]);
};
const isTree = (cell) => cell === '#';

const solutionOne = traverse(map, 3, 1).filter(isTree).length;
const solutionTwo = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]
  .map(([right, down]) => traverse(map, right, down).filter(isTree).length)
  .reduce((product, trees) => product * trees);

log(`Solution pt.1 ${solutionOne}`);
log(`Solution pt.2 ${solutionTwo}`);
