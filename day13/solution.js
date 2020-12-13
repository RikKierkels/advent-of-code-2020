const input = require('../input');
const log = console.log;
const not = (fn) => (...args) => !fn(...args);
const isNumber = not(isNaN);

const toNextDeparture = (timestamp) => (id) => ({ id, departure: Math.ceil(timestamp / id) * id });

let [timestamp, ids] = input(__dirname, './input.txt').split('\n');
ids = ids.split(',');

let [earliest] = ids
  .filter(isNumber)
  .map(toNextDeparture(timestamp))
  .sort((a, b) => a.departure - b.departure);
log(`Solution pt.1 ${earliest.id * (earliest.departure - timestamp)}`);

earliest = ids.reduce(
  ({ timestamp, period }, id, index) => {
    if (isNaN(id)) return { timestamp, period };

    while ((timestamp + index) % id) {
      timestamp += period;
    }

    return { timestamp, period: period * id };
  },
  { timestamp: 0, period: 1 },
);
log(`Solution pt.2 ${earliest.timestamp}`);
