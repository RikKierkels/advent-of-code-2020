const input = require('../input');
const log = console.log;
const count = (value) => (array) => array.reduce((total, v) => (v === value ? total + 1 : total), 0);

const Area = () => {
  const FLOOR = '.';
  const EMPTY = 'L';
  const OCCUPIED = '#';
  const countOccupiedSeats = count(OCCUPIED);

  const DIRECTIONS = [
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
  ];

  const countOccupiedSeatsFromNeighbours = (layout, position) =>
    countOccupiedSeats(DIRECTIONS.map((direction) => layout[position.y + direction.y]?.[position.x + direction.x]));

  const countOccupiedSeatsWithinLineOfSight = (layout, position) =>
    countOccupiedSeats(DIRECTIONS.map((direction) => findOccupiedSeatForDirection(layout, position, direction)));

  const findOccupiedSeatForDirection = (layout, position, direction, offsetBy = 1) => {
    const neighbour = layout[position.y + direction.y * offsetBy]?.[position.x + direction.x * offsetBy];

    return neighbour && neighbour === FLOOR
      ? findOccupiedSeatForDirection(layout, position, direction, ++offsetBy)
      : neighbour;
  };

  const hasReachedEquilibrium = (currentLayout, nextLayout) =>
    currentLayout.every((row, y) => row.every((column, x) => column === nextLayout[y][x]));

  const tick = (currentLayout, config) => {
    const nextLayout = currentLayout.reduce((nextLayout, row, y) => {
      nextLayout[y] = row.map((column, x) => {
        if (column === FLOOR) return FLOOR;

        const adjacentOccupiedSeatCount = config.isAdjacentLineOfSight
          ? countOccupiedSeatsWithinLineOfSight(currentLayout, { x, y })
          : countOccupiedSeatsFromNeighbours(currentLayout, { x, y });

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
    simulate: tick,
  };
};

const area = Area();
const countOccupiedSeats = count('#');
const layout = input(__dirname, './input.txt')
  .split('\n')
  .map((row) => [...row]);

const solutionOne = countOccupiedSeats(
  area.simulate(layout, { occupiedSeatThreshold: 4, isAdjacentLineOfSight: false }).flat(),
);
log(`Solution pt.1 ${solutionOne}`);

const solutionTwo = countOccupiedSeats(
  area.simulate(layout, { occupiedSeatThreshold: 5, isAdjacentLineOfSight: true }).flat(),
);
log(`Solution pt.2 ${solutionTwo}`);
