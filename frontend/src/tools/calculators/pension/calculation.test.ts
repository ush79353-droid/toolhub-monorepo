import assert from 'node:assert/strict';
import {
  calculatePensionComparison,
  formatBreakEvenAge,
  monthlyRateFromAnnualPercent,
} from './calculation';

const rm = monthlyRateFromAnnualPercent(5);
assert.ok(Math.abs(rm - (Math.pow(1.05, 1 / 12) - 1)) < 1e-12);

// Screenshot defaults: 65 · 800k · 5% · 5k/mo · 3.5% COLA
const example = calculatePensionComparison({
  retirementAge: 65,
  lumpSum: 800_000,
  annualReturnPercent: 5,
  monthlyPension: 5_000,
  colaPercent: 3.5,
});
assert.ok(example);
assert.ok(example!.breakEvenAge !== null);
assert.ok(example!.breakEvenAge! > 80 && example!.breakEvenAge! < 81);
assert.equal(example!.yearRows[0]?.ageEnd, 66);
assert.ok(example!.yearRows[0]!.annualPension > 59_000);
assert.ok(example!.yearRows[0]!.remainingLumpSum < 800_000);
assert.ok(example!.yearRows.some((r) => r.depletedDuringYear));

// Zero pension — no depletion
const zeroPay = calculatePensionComparison({
  retirementAge: 65,
  lumpSum: 100_000,
  annualReturnPercent: 5,
  monthlyPension: 0,
  colaPercent: 0,
});
assert.ok(zeroPay);
assert.equal(zeroPay!.breakEvenAge, null);

// Zero lump sum — immediate break-even
const zeroLump = calculatePensionComparison({
  retirementAge: 65,
  lumpSum: 0,
  annualReturnPercent: 5,
  monthlyPension: 1_000,
  colaPercent: 0,
});
assert.ok(zeroLump);
assert.equal(zeroLump!.breakEvenAge, 65);

// Zero return still depletes with positive withdrawals
const zeroR = calculatePensionComparison({
  retirementAge: 60,
  lumpSum: 120_000,
  annualReturnPercent: 0,
  monthlyPension: 5_000,
  colaPercent: 0,
});
assert.ok(zeroR);
assert.ok(zeroR!.breakEvenAge !== null);
assert.ok(Math.abs(zeroR!.breakEvenAge! - 62) < 0.05);

assert.equal(formatBreakEvenAge(null), 'No depletion in horizon');
assert.match(formatBreakEvenAge(80.1667), /Age 80/);

console.log('pension calculation.test.ts: ok');
