const input = require('../input');
const log = console.log;

const traverse = (map, xSlope, ySlope) => {
  const totalMoveCount = map.length / ySlope;
  const width = map[0].length;
  return Array.from({ length: totalMoveCount }, (_, move) => map[move * ySlope][(move * xSlope) % width]);
};
const isTree = (cell) => cell === '#';

const map = input(__dirname, './input.txt')
  .split('\n')
  .map((row) => [...row]);

const solutionOne = traverse(map, 3, 1).filter(isTree).length;
log(`Solution pt.1 ${solutionOne}`);

const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];
const solutionTwo = slopes
  .map(([xSlope, ySlope]) => traverse(map, xSlope, ySlope).filter(isTree).length)
  .reduce((product, trees) => product * trees);

log(`Solution pt.2 ${solutionTwo}`);
