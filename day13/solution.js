const input = require('../input');
const log = console.log;
const not = (fn) => (...args) => !fn(...args);
const isNumber = not(isNaN);
const first = ([first]) => first;

const withNextDeparture = (timestamp) => (id) => ({ id, departure: Math.ceil(timestamp / id) * id });

const findEarliestDepartingBus = (timestamp, busses) =>
  first(
    busses
      .filter(isNumber)
      .map(withNextDeparture(timestamp))
      .sort((a, b) => a.departure - b.departure),
  );

const findEarliestTimestampOfSubsequentDepartures = (busses) =>
  busses.reduce(
    ({ timestamp, period }, bus, index) => {
      if (isNaN(bus)) return { timestamp, period };

      while ((timestamp + index) % bus) {
        timestamp += period;
      }

      return { timestamp, period: period * bus };
    },
    { timestamp: 0, period: 1 },
  );

let [timestamp, busses] = input(__dirname, './input.txt').split('\n');
busses = busses.split(',');

const bus = findEarliestDepartingBus(timestamp, busses);
log(`Solution pt.1 ${bus.id * (bus.departure - timestamp)}`);

const earliest = findEarliestTimestampOfSubsequentDepartures(busses);
log(`Solution pt.2 ${earliest.timestamp}`);
