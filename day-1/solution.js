const fs = require('fs');
const path = require('path');
const log = console.log;

const findSumsOfPairs = (entries, sum = 2020) =>
  entries.flatMap((entry) => {
    const diff = sum - entry;
    return entries.includes(diff)
      ? {
          matches: [entry, diff],
          product: entry * diff,
        }
      : [];
  });

const findSumsOfTriplets = (entries, sum = 2020) =>
  entries.flatMap((entry) => {
    const sumsOfPairs = findSumsOfPairs(entries, sum - entry);

    return sumsOfPairs.length
      ? sumsOfPairs.flatMap(({ matches, product }) =>
          product
            ? {
                matches: [...matches, entry],
                product: matches.reduce((acc, curr) => acc * curr, entry),
              }
            : [],
        )
      : [];
  });

const pathToEntries = path.join(__dirname, './input.txt');
const entries = fs
  .readFileSync(pathToEntries, 'utf-8')
  .split('\n')
  .map((entry) => +entry);

log(findSumsOfPairs(entries));

log(findSumsOfTriplets(entries));
