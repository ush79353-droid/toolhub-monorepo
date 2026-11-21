import assert from 'node:assert/strict';
import {
  calculateSocialSecurity,
  monthlyRateFromAnnualPercent,
  simulateClaimPath,
} from './calculation';
import {
  fullRetirementAgeForBirthYear,
  piaMultiplierForClaimAge,
} from './ssa-rules';

// FRA table
assert.deepEqual(fullRetirementAgeForBirthYear(1970), {
  years: 67,
  months: 0,
});
assert.deepEqual(fullRetirementAgeForBirthYear(1957), {
  years: 66,
  months: 6,
});
assert.deepEqual(fullRetirementAgeForBirthYear(1954), {
  years: 66,
  months: 0,
});

// Early reduction: FRA 67, claim 62 → 60 months → 30%
assert.ok(Math.abs((piaMultiplierForClaimAge(1960, 62) ?? 0) - 0.7) < 1e-12);

// FRA claim → 100%
assert.equal(piaMultiplierForClaimAge(1960, 67), 1);

// Delay to 70: 36 months × 2/3% = 24%
assert.ok(Math.abs((piaMultiplierForClaimAge(1960, 70) ?? 0) - 1.24) < 1e-12);

// FRA 66y6m (1957), claim 62 → 54 months early → 27.5% reduction
assert.ok(
  Math.abs((piaMultiplierForClaimAge(1957, 62) ?? 0) - 0.725) < 1e-12
);

// Zero COLA / zero return: cumulative = months × starting
const path = simulateClaimPath(67, 1000, 1, 68, 0, 0);
assert.ok(path);
assert.equal(path!.monthsPaid, 12);
assert.equal(path!.startingMonthlyBenefit, 1000);
assert.ok(Math.abs(path!.cumulativeNominal - 12_000) < 1e-6);
assert.ok(Math.abs(path!.investedTerminalValue - 12_000) < 1e-6);

// Invalid: LE <= claim age
assert.equal(simulateClaimPath(70, 1000, 1.24, 70, 0, 0), null);

const example = calculateSocialSecurity({
  birthYear: 1970,
  lifeExpectancy: 83,
  annualReturnPercent: 5,
  colaPercent: 3,
  piaMonthly: 1922,
});
assert.ok(example);
assert.equal(example!.fra.years, 67);
assert.equal(example!.scenarios.length, 9);
assert.ok(example!.idealClaimAge >= 62 && example!.idealClaimAge <= 70);

// Higher return should not crash and still pick a claim age
const highR = calculateSocialSecurity({
  birthYear: 1970,
  lifeExpectancy: 83,
  annualReturnPercent: 12,
  colaPercent: 0,
  piaMonthly: 1000,
});
assert.ok(highR);
assert.ok(highR!.idealClaimAge <= 67);

const rm = monthlyRateFromAnnualPercent(5);
assert.ok(Math.abs(rm - (Math.pow(1.05, 1 / 12) - 1)) < 1e-12);

console.log('social-security calculation.test.ts: ok');
