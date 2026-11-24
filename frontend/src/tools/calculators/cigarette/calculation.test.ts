/**
 * Cigarette Calculator — assert-based engine check.
 * Run: backend npx tsx path/to/calculation.test.ts
 */

import {
  calculateCigarette,
  cigarettesFromPacks,
  totalCigarettes,
  timeFrameToDays,
} from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

assert(cigarettesFromPacks(1, 20) === 20, '1 pack × 20 = 20 cigs/day');
assert(totalCigarettes(20, 365) === 7300, '20×365 = 7300');
assert(timeFrameToDays(1, 'years') === 365, '1 year = 365 days');
assert(approx(timeFrameToDays(12, 'months'), 365), '12 months = 365 days');

const fixture = calculateCigarette({
  ...createDefaultInput(),
  packsPerDayText: '1',
  cigarettesInPackText: '20',
  timeFrameText: '1',
  timeFrameUnit: 'years',
  rateDriver: 'packs',
});
assert(fixture.totalCigarettes === 7300, `fixture total ${fixture.totalCigarettes}`);
assert(fixture.cigarettesPerDay === 20, 'synced cigs/day');

const zero = calculateCigarette({
  ...createDefaultInput(),
  cigarettesPerDayText: '0',
  cigarettesInPackText: '20',
  timeFrameText: '10',
  timeFrameUnit: 'years',
  rateDriver: 'cigarettes',
});
assert(zero.totalCigarettes === 0, 'zero exposure → 0');

const months = calculateCigarette({
  ...createDefaultInput(),
  cigarettesPerDayText: '10',
  cigarettesInPackText: '20',
  timeFrameText: '1',
  timeFrameUnit: 'months',
  rateDriver: 'cigarettes',
});
assert(
  months.totalCigarettes !== null &&
    approx(months.totalCigarettes, 10 * (365 / 12)),
  `1 month total ${months.totalCigarettes}`,
);

console.log('cigarette calculation.test.ts: ok');
