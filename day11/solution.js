const input = require('../input');
const log = console.log;
const count = (value) => (array) => array.reduce((total, v) => (v === value ? total + 1 : total), 0);

const Area = () => {
  const FLOOR = '.';
  const EMPTY = 'L';
  const OCCUPIED = '#';
  const countOccupiedSeats = count(OCCUPIED);

  const directions = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];

  const countOccupiedSeatsFromNeighbours = (layout, [selfX, selfY]) =>
    countOccupiedSeats(directions.map(([offsetX, offsetY]) => layout[selfY + offsetY]?.[selfX + offsetX]));

  const countOccupiedSeatsWithinLineOfSight = (layout, self, offsetBy = 1) =>
    countOccupiedSeats(directions.map((direction) => findOccupiedSeatForDirection(layout, self, direction, offsetBy)));

  const findOccupiedSeatForDirection = (layout, [selfX, selfY], [offsetX, offsetY], offsetBy) => {
    const neighbour = layout[selfY + offsetY * offsetBy]?.[selfX + offsetX * offsetBy];

    return neighbour && neighbour === FLOOR
      ? findOccupiedSeatForDirection(layout, [selfX, selfY], [offsetX, offsetY], ++offsetBy)
      : neighbour;
  };

  const hasReachedEquilibrium = (currentLayout, nextLayout) =>
    currentLayout.every((row, y) => row.every((column, x) => column === nextLayout[y][x]));

  const tick = (currentLayout, config) => {
    const nextLayout = currentLayout.reduce((nextLayout, row, selfY) => {
      nextLayout[selfY] = row.map((column, selfX) => {
        if (column === FLOOR) return FLOOR;

        const adjacentOccupiedSeatCount = config.isAdjacentLineOfSight
          ? countOccupiedSeatsWithinLineOfSight(currentLayout, [selfX, selfY])
          : countOccupiedSeatsFromNeighbours(currentLayout, [selfX, selfY]);

        if (column === EMPTY) {
          return adjacentOccupiedSeatCount === 0 ? OCCUPIED : EMPTY;
        }

        if (column === OCCUPIED) {
          return adjacentOccupiedSeatCount >= config.occupiedSeatThreshold ? EMPTY : OCCUPIED;
        }
      });
      return nextLayout;
    }, []);

    return hasReachedEquilibrium(currentLayout, nextLayout) ? nextLayout : tick(nextLayout, config);
  };

  return {
    run: tick,
  };
};

const area = Area();
const countOccupiedSeats = count('#');
const layout = input(__dirname, './input.txt')
  .split('\n')
  .map((row) => [...row]);

const solutionOne = countOccupiedSeats(
  area.run(layout, { occupiedSeatThreshold: 4, isAdjacentLineOfSight: false }).flat(),
);
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = countOccupiedSeats(
  area.run(layout, { occupiedSeatThreshold: 5, isAdjacentLineOfSight: true }).flat(),
);
log(`Solution pt.2 ${solutionTwo}`);
