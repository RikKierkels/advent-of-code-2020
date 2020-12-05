const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const replace = (...args) => (string) => string.replace(...args);

const toNumberFromBinary = (string) => parseInt(string, 2);
const convertUpperSeatsToBinary = replace(/[BR]/g, 1);
const convertLowerSeatsToBinary = replace(/[FL]/g, 0);
const toSeatID = compose(toNumberFromBinary, convertLowerSeatsToBinary, convertUpperSeatsToBinary);

const ascending = (a, b) => (a > b ? 1 : -1);
const hasSeatNoSeatBehind = (id, _, ids) => !ids.includes(id - 1) && ids.includes(id - 2);

const seatIDs = input(__dirname, '/input.txt').split('\n').map(toSeatID);

const solutionOne = Math.max(...seatIDs);
log(`Solution p1. ${solutionOne}`);

const seatInFrontOfOwnSeat = seatIDs.sort(ascending).find(hasSeatNoSeatBehind);
const solutionTwo = seatInFrontOfOwnSeat - 1;
log(`Solution p2. ${solutionTwo}`);
