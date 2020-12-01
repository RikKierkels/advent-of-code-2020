const fs = require('fs');
const path = require('path');
const log = console.log;

const findProductsOfPairs = (entries, sum = 2020) =>
  entries.flatMap((entry) => (entries.includes(sum - entry) ? entry * (sum - entry) : []));

const findProductsOfTriplets = (entries, sum = 2020) =>
  entries.flatMap((entry) => {
    const productsOfPairs = findProductsOfPairs(entries, sum - entry);
    return productsOfPairs.length ? productsOfPairs.map((product) => product * entry) : [];
  });

const pathToEntries = path.join(__dirname, './input.txt');
const entries = fs
  .readFileSync(pathToEntries, 'utf-8')
  .split('\n')
  .map((entry) => +entry);

log(findProductsOfPairs(entries));
log(findProductsOfTriplets(entries));
