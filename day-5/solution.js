const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const replace = (...args) => (string) => string.replace(...args);

const toNumberFromBinaryString = (string) => parseInt(string, 2);
const convertUpperSeatsToBinaryString = replace(/[BR]/g, 1);
const convertLowerSeatsToBinaryString = replace(/[FL]/g, 0);
const toSeatID = compose(toNumberFromBinaryString, convertLowerSeatsToBinaryString, convertUpperSeatsToBinaryString);

const ascending = (a, b) => (a > b ? 1 : -1);
const isCurrentSeatMissingSeatBehind = (id, _, ids) => !ids.includes(id - 1) && ids.includes(id - 2);
const toSeatBehindCurrentSeat = (seat) => seat - 1;

const seatIDs = input(__dirname, '/input.txt').split('\n').map(toSeatID);

const solutionOne = Math.max(...seatIDs);
log(`Solution p1. ${solutionOne}`);

const [solutionTwo] = seatIDs.sort(ascending).filter(isCurrentSeatMissingSeatBehind).map(toSeatBehindCurrentSeat);
log(`Solution p2. ${solutionTwo}`);
