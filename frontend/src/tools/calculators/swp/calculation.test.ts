/**
 * Assert self-check. Run: npx tsx src/tools/calculators/swp/calculation.test.ts
 */
import {
  calculateSwp,
  presentValueGrowingDue,
  nominalPeriodRate,
  screenshotDefaultInitialInvestment,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const shot = screenshotDefaultInitialInvestment();
assert(Math.abs(shot - 94674.19) < 0.02, `screenshot PV ${shot}`);

const r = nominalPeriodRate(5, 'monthly')!;
const pv = presentValueGrowingDue(1000, r, 0, 120, 0)!;
assert(Math.abs(pv - 94674.19) < 0.02, `pv ${pv}`);

const full = calculateSwp({
  mode: 'initial',
  currency: 'PKR',
  withdrawalAmount: 1000,
  initialInvestment: 0,
  frequency: 'monthly',
  durationYears: 10,
  annualReturnPercent: 5,
  inflationPercent: 0,
  firstWithdrawalDate: { y: 2026, m: 11, d: 21 },
  endBalance: 0,
});
assert(full != null, 'full');
assert(Math.abs(full!.openingBalance - 94674.19) < 0.02, 'opening');
assert(full!.numberOfWithdrawals === 120, 'n');
assert(full!.lastWithdrawalDate === 'Oct 21, 2036', full!.lastWithdrawalDate);
assert(Math.abs(full!.totalWithdrawal - 120_000) < 0.01, 'total W');
assert(
  Math.abs(full!.totalReturn - 25_325.81) < 0.02,
  `return ${full!.totalReturn}`
);

const zero = calculateSwp({
  mode: 'initial',
  currency: 'USD',
  withdrawalAmount: 1000,
  initialInvestment: 0,
  frequency: 'annually',
  durationYears: 10,
  annualReturnPercent: 0,
  inflationPercent: 0,
  firstWithdrawalDate: { y: 2026, m: 1, d: 1 },
  endBalance: 0,
});
assert(zero != null && Math.abs(zero!.openingBalance - 10_000) < 0.01, 'zero r');

console.log('swp calculation.test.ts: ok');
