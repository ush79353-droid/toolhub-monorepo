/**
 * Assert self-check. Run:
 * npx tsx src/tools/calculators/retirement-withdrawal/calculation.test.ts
 */
import {
  calculateRetirementWithdrawal,
  firstWithdrawalLevel,
  periodRateFromAnnual,
  screenshotDefaultWithdrawal,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const shot = screenshotDefaultWithdrawal();
assert(Math.abs(shot - 600.25) < 0.01, `screenshot default got ${shot}`);

const r = periodRateFromAnnual(4, 'annually', 'monthly');
assert(r != null && r > 0, 'period rate');
const w = firstWithdrawalLevel(100_000, 0, r!, 240, 'beginning');
assert(w != null && Math.abs(w - 600.25) < 0.01, `level W ${w}`);

const full = calculateRetirementWithdrawal({
  mode: 'withdrawal',
  currency: 'PKR',
  balanceAtRetirement: 100_000,
  ageNow: 30,
  retireAge: 50,
  yearsInRetirement: 20,
  withdrawalAmount: 0,
  annualInterestRatePercent: 4,
  inflationBeforePercent: 0,
  inflationAfterPercent: 0,
  paymentFrequency: 'monthly',
  compounding: 'annually',
  timing: 'beginning',
  endBalance: 0,
  baseCalendarYear: 2026,
});
assert(full != null, 'full result');
assert(
  Math.abs(full!.withdrawalAmount - 600.25) < 0.01,
  `full W ${full!.withdrawalAmount}`
);
assert(full!.yearlyBalances.length > 1, 'yearly chart points');
assert(full!.yearlyBalances[0]!.calendarYear === 2046, 'retire year 2026+20');

const zeroRate = calculateRetirementWithdrawal({
  mode: 'withdrawal',
  currency: 'USD',
  balanceAtRetirement: 120_000,
  ageNow: 65,
  retireAge: 65,
  yearsInRetirement: 10,
  withdrawalAmount: 0,
  annualInterestRatePercent: 0,
  inflationBeforePercent: 0,
  inflationAfterPercent: 0,
  paymentFrequency: 'annually',
  compounding: 'annually',
  timing: 'end',
  endBalance: 0,
  baseCalendarYear: 2026,
});
assert(zeroRate != null, 'zero rate');
assert(
  Math.abs(zeroRate!.withdrawalAmount - 12_000) < 0.01,
  `zero-rate W ${zeroRate!.withdrawalAmount}`
);

const duration = calculateRetirementWithdrawal({
  mode: 'duration',
  currency: 'USD',
  balanceAtRetirement: 100_000,
  ageNow: 65,
  retireAge: 65,
  yearsInRetirement: 0,
  withdrawalAmount: 600.25,
  annualInterestRatePercent: 4,
  inflationBeforePercent: 0,
  inflationAfterPercent: 0,
  paymentFrequency: 'monthly',
  compounding: 'annually',
  timing: 'beginning',
  endBalance: 0,
  baseCalendarYear: 2026,
});
assert(duration != null && !duration!.neverDepletes, 'duration solves');
assert(
  Math.abs(duration!.yearsInRetirement - 20) < 0.15,
  `duration years ${duration!.yearsInRetirement}`
);

console.log('retirement-withdrawal calculation.test.ts: ok');
