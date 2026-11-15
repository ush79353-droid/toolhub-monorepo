import assert from 'node:assert/strict';
import { calculateTreynorRatio } from './calculation';

const example = calculateTreynorRatio({
  beginningValue: 10_000,
  endingValue: 11_500,
  riskFreeRatePercent: 4,
  beta: 1.2,
});

assert.ok(example);
assert.equal(example.formattedPortfolioReturn, '15');
assert.equal(example.formattedTreynorRatio, '9.1667');

assert.equal(
  calculateTreynorRatio({
    beginningValue: 0,
    endingValue: 100,
    riskFreeRatePercent: 1,
    beta: 1,
  }),
  null,
);

assert.equal(
  calculateTreynorRatio({
    beginningValue: 100,
    endingValue: 110,
    riskFreeRatePercent: 1,
    beta: 0,
  }),
  null,
);

const negative = calculateTreynorRatio({
  beginningValue: 10_000,
  endingValue: 9_000,
  riskFreeRatePercent: 4,
  beta: 1.2,
});
assert.ok(negative);
assert.ok(negative.treynorRatioPercent < 0);

console.log('treynor-ratio calculation.test.ts: ok');
