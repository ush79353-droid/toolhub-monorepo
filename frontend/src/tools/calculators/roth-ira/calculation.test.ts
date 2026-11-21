/**
 * Assert self-check. Run:
 * npx tsx src/tools/calculators/roth-ira/calculation.test.ts
 */
import {
  calculateRothIra,
  futureValueAnnualContributions,
} from './calculation';
import { eligibleRothContributionUsd, ROTH_BASE_LIMIT_USD } from './roth-limits';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Full eligibility MFJ below phase-out
const full = eligibleRothContributionUsd(195_000, 'married_joint', 32);
assert(full.maxContribution === ROTH_BASE_LIMIT_USD, 'max under 50');
assert(full.eligible === ROTH_BASE_LIMIT_USD, 'full eligible MFJ');

// Phase-out midpoint-ish single
const mid = eligibleRothContributionUsd(160_500, 'single', 40);
assert(mid.eligible > 0 && mid.eligible < mid.maxContribution, 'partial');

// Zero at top
const zero = eligibleRothContributionUsd(252_000, 'married_joint', 40);
assert(zero.eligible === 0, 'zero at top');

// Catch-up
const catchUp = eligibleRothContributionUsd(50_000, 'single', 50);
assert(catchUp.maxContribution === 8600, 'catch-up 2026');

const fv = futureValueAnnualContributions(7500, 7, 28);
assert(fv != null && Math.abs(fv! - 605_232.6818307939) < 0.01, `fv ${fv}`);

const shot = calculateRothIra({
  currency: 'MXN',
  magi: 195_000,
  currentAge: 32,
  retirementAge: 60,
  filingStatus: 'married_joint',
  incomeTaxRatePercent: 24,
  annualReturnPercent: 7,
});
assert(shot != null, 'screenshot defaults');
assert(shot!.eligibleContribution === 7500, 'eligible');
assert(
  Math.abs(shot!.eligibleAfterTax - 7500 * 0.76) < 0.01,
  'after-tax'
);
assert(
  Math.abs(shot!.balanceAtRetirement - 605_232.6818307939) < 0.01,
  `balance ${shot!.balanceAtRetirement}`
);

console.log('roth-ira calculation.test.ts: ok');
