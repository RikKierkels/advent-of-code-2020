const input = require('../input');
const log = console.log;
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);
const replace = (...args) => (string) => string.replace(...args);

const toIntFromBinaryString = (string) => parseInt(string, 2);
const convertUpperHalfsToOne = replace(/[BR]/g, 1);
const convertLowerHalfsToZero = replace(/[FL]/g, 0);
const toSeatID = compose(toIntFromBinaryString, convertLowerHalfsToZero, convertUpperHalfsToOne);

const ascending = (a, b) => (a > b ? 1 : -1);
const isMissingSeatBehind = (id, _, ids) => !ids.includes(id - 1) && ids.includes(id - 2);

const seatIDs = input(__dirname, '/input.txt').split('\n').map(toSeatID);

const solutionOne = Math.max(...seatIDs);
log(`Solution p1. ${solutionOne}`);

const seatInFrontOfOwn = seatIDs.sort(ascending).find(isMissingSeatBehind);
const solutionTwo = seatInFrontOfOwn - 1;
log(`Solution p2. ${solutionTwo}`);
