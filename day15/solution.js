const log = console.log;

const play = (starting, maxTurns) => {
  let memory = new Map();
  let next;

  for (let turn = 1; turn < maxTurns; turn++) {
    const current = turn <= starting.length ? starting[turn - 1] : next;
    next = memory.has(current) ? turn - memory.get(current) : 0;
    memory = memory.set(current, turn);
  }

  return next;
};

log(`Solution pt.1 ${play([15, 5, 1, 4, 7, 0], 2020)}`);

log(`Solution pt.2 ${play([15, 5, 1, 4, 7, 0], 30000000)}`);
