import assert from 'node:assert/strict';
import {
  calculateAverageTenure,
  calculateSpecificTenure,
  formatYmdDuration,
} from './calculation';

assert.equal(calculateAverageTenure(100, 650, 'years')?.display, '6.5');
assert.equal(calculateAverageTenure(0, 650, 'years'), null);
assert.equal(calculateAverageTenure(100, -1, 'years'), null);
assert.equal(calculateAverageTenure(100, 7800, 'months')?.display, '6.5');

const fiveYears = calculateSpecificTenure('2020-01-01', '2025-01-01');
assert.ok(fiveYears);
assert.equal(fiveYears.years, 5);
assert.equal(fiveYears.months, 0);
assert.equal(fiveYears.days, 0);
assert.equal(fiveYears.display, '5 years');

assert.equal(calculateSpecificTenure('2025-01-01', '2020-01-01'), null);

const sameDay = calculateSpecificTenure('2024-06-15', '2024-06-15');
assert.ok(sameDay);
assert.equal(sameDay.display, '0 days');

assert.equal(formatYmdDuration(1, 2, 3), '1 year, 2 months, 3 days');

console.log('tenure/calculation.test.ts: ok');
