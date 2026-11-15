import assert from 'node:assert/strict';
import {
  addDaysToIsoDate,
  buildLoanAmortizationCsv,
  calculateLoan,
  escapeCsvCell,
} from './calculation';
import { createDefaultLoanInput, type LoanInput } from './types';
import { validateLoanInput } from './validation';

function runSuite(name: string, fn: () => void): void {
  fn();
  console.log(`  ok - ${name}`);
}

const BASE_START_DATE = '2026-01-15';

function makeInput(overrides: Partial<LoanInput> = {}): LoanInput {
  return {
    ...createDefaultLoanInput(BASE_START_DATE),
    ...overrides,
  };
}

runSuite('1. Standard monthly amortized benchmark ($25k, 6% APR, 5 yr)', () => {
  const res = calculateLoan(makeInput());
  assert.equal(res.regularPayment, 483.32);
  assert.equal(res.actualPaymentsCount, 60);
  assert.equal(res.remainingBalanceAtEnd, 0);
  assert.equal(res.schedule[0].beginningBalance, 25000);
  assert.equal(res.schedule[0].interestPaid, 125);
  assert.equal(res.schedule[0].principalPaid, 358.32);
  assert.equal(res.schedule[0].endingBalance, 24641.68);
  assert.equal(res.schedule[59].endingBalance, 0);
  assert.equal(res.scheduleTotals.totalPrincipal, 25000);
  assert.equal(
    Number((res.scheduleTotals.totalPrincipal + res.scheduleTotals.totalInterest).toFixed(2)),
    res.scheduleTotals.totalPayment
  );
  assert.equal(res.payoffDate, '2031-01-15');
});

runSuite('2. Independent closed-form algebraic checks for monthly, biweekly, weekly ($10k, 12%, 1 yr)', () => {
  const closedForm = (p: number, r: number, n: number) =>
    Number(((p * r) / (1 - Math.pow(1 + r, -n))).toFixed(2));

  const monthly = calculateLoan(
    makeInput({ loanAmount: 10000, annualInterestRate: 12, loanTermValue: 1, loanTermUnit: 'years', paymentFrequency: 'monthly' })
  );
  assert.equal(monthly.scheduledPaymentsCount, 12);
  assert.equal(monthly.regularPayment, closedForm(10000, 0.12 / 12, 12)); // 888.49
  assert.equal(monthly.remainingBalanceAtEnd, 0);

  const biweekly = calculateLoan(
    makeInput({ loanAmount: 10000, annualInterestRate: 12, loanTermValue: 1, loanTermUnit: 'years', paymentFrequency: 'biweekly' })
  );
  assert.equal(biweekly.scheduledPaymentsCount, 26);
  assert.equal(biweekly.regularPayment, closedForm(10000, 0.12 / 26, 26));
  assert.equal(biweekly.remainingBalanceAtEnd, 0);

  const weekly = calculateLoan(
    makeInput({ loanAmount: 10000, annualInterestRate: 12, loanTermValue: 1, loanTermUnit: 'years', paymentFrequency: 'weekly' })
  );
  assert.equal(weekly.scheduledPaymentsCount, 52);
  assert.equal(weekly.regularPayment, closedForm(10000, 0.12 / 52, 52));
  assert.equal(weekly.remainingBalanceAtEnd, 0);

  // Higher compounding/payment frequency yields lower total interest at same nominal APR and term
  assert.ok(weekly.totalInterest < biweekly.totalInterest);
  assert.ok(biweekly.totalInterest < monthly.totalInterest);
});

runSuite('3. Zero interest (0% APR) & uneven division reconciliation', () => {
  const res = calculateLoan(
    makeInput({ loanAmount: 10000, annualInterestRate: 0, loanTermValue: 36, loanTermUnit: 'months' })
  );
  assert.equal(res.regularPayment, 277.78);
  assert.equal(res.totalInterest, 0);
  assert.equal(res.totalPaid, 10000);
  assert.equal(res.scheduleTotals.totalPrincipal, 10000);
  assert.equal(res.remainingBalanceAtEnd, 0);
  assert.ok(res.finalPayment < res.regularPayment); // 35*277.78 = 9722.30, final = 277.70
});

runSuite('4. Term flexibility (months vs years, short 1-month weekly & 15-year)', () => {
  const oneMonthWeekly = calculateLoan(
    makeInput({ loanAmount: 1000, annualInterestRate: 6, loanTermValue: 1, loanTermUnit: 'months', paymentFrequency: 'weekly' })
  );
  assert.ok(oneMonthWeekly.scheduledPaymentsCount >= 4);
  assert.equal(oneMonthWeekly.remainingBalanceAtEnd, 0);
  assert.equal(oneMonthWeekly.scheduleTotals.totalPrincipal, 1000);

  const longMonthly = calculateLoan(
    makeInput({ loanAmount: 400000, annualInterestRate: 5.25, loanTermValue: 30, loanTermUnit: 'years' })
  );
  assert.equal(longMonthly.actualPaymentsCount, 360);
  assert.equal(longMonthly.remainingBalanceAtEnd, 0);
  assert.equal(longMonthly.scheduleTotals.totalPrincipal, 400000);
});

runSuite('5. Recurring extra payments accelerate payoff and compute savings cleanly', () => {
  const baseline = calculateLoan(makeInput());
  const withExtra = calculateLoan(
    makeInput({ extraPaymentAmount: 150, extraPaymentFrequency: 'every-payment' })
  );

  assert.equal(withExtra.regularPayment, baseline.regularPayment);
  assert.ok(withExtra.actualPaymentsCount < baseline.actualPaymentsCount);
  assert.equal(withExtra.paymentsSaved, baseline.actualPaymentsCount - withExtra.actualPaymentsCount);
  assert.ok(withExtra.totalInterest < baseline.totalInterest);
  assert.equal(
    withExtra.interestSavings,
    Number((baseline.totalInterest - withExtra.totalInterest).toFixed(2))
  );
  assert.equal(withExtra.remainingBalanceAtEnd, 0);
  assert.equal(withExtra.scheduleTotals.totalPrincipal, 25000);
  assert.ok(withExtra.payoffDate < baseline.payoffDate);
});

runSuite('6. Calendar-aligned monthly & yearly extra payments on biweekly schedule', () => {
  const biweeklyMonthlyExtra = calculateLoan(
    makeInput({
      loanAmount: 20000,
      annualInterestRate: 6,
      loanTermValue: 5,
      loanTermUnit: 'years',
      paymentFrequency: 'biweekly',
      extraPaymentAmount: 100,
      extraPaymentFrequency: 'monthly',
    })
  );
  const nonZeroExtras = biweeklyMonthlyExtra.schedule.filter((r) => r.extraPayment > 0);
  assert.ok(nonZeroExtras.length > 0 && nonZeroExtras.length <= 60);
  assert.ok(biweeklyMonthlyExtra.interestSavings > 0);
  assert.equal(biweeklyMonthlyExtra.remainingBalanceAtEnd, 0);

  const biweeklyYearlyExtra = calculateLoan(
    makeInput({
      loanAmount: 20000,
      annualInterestRate: 6,
      loanTermValue: 5,
      loanTermUnit: 'years',
      paymentFrequency: 'biweekly',
      extraPaymentAmount: 1000,
      extraPaymentFrequency: 'yearly',
    })
  );
  const yearlyExtras = biweeklyYearlyExtra.schedule.filter((r) => r.extraPayment > 0);
  assert.ok(yearlyExtras.length >= 1 && yearlyExtras.length <= 5);
  assert.equal(biweeklyYearlyExtra.remainingBalanceAtEnd, 0);
});

runSuite('7. Massive one-time extra payment prevents overpayment and settles at $0.00', () => {
  const earlyPayoff = calculateLoan(
    makeInput({ oneTimeExtraAmount: 40000, oneTimeExtraPeriod: 2 })
  );
  assert.equal(earlyPayoff.actualPaymentsCount, 2);
  assert.equal(earlyPayoff.schedule[1].endingBalance, 0);
  assert.equal(earlyPayoff.remainingBalanceAtEnd, 0);
  assert.equal(earlyPayoff.scheduleTotals.totalPrincipal, 25000);
  // Extra payment applied at period 2 is capped strictly at remaining principal after period 2 regular payment
  assert.ok(earlyPayoff.totalExtraPayments < 25000);
});

runSuite('8. Interest-Only loan: mixed I/O period followed by amortized repayment', () => {
  const mixedIo = calculateLoan(
    makeInput({
      loanMode: 'interest-only',
      loanAmount: 25000,
      annualInterestRate: 6,
      loanTermValue: 5,
      loanTermUnit: 'years',
      interestOnlyValue: 12,
      interestOnlyUnit: 'months',
    })
  );
  assert.equal(mixedIo.regularPayment, 125); // 25000 * 0.005
  assert.equal(mixedIo.interestOnlyPeriods, 12);
  assert.equal(mixedIo.remainingBalanceAfterIo, 25000);
  // First 12 months pay interest only
  for (let i = 0; i < 12; i += 1) {
    assert.equal(mixedIo.schedule[i].phase, 'interest-only');
    assert.equal(mixedIo.schedule[i].principalPaid, 0);
    assert.equal(mixedIo.schedule[i].endingBalance, 25000);
  }
  // Remaining 48 months amortize $25,000 at 6% APR -> 587.13/mo
  assert.equal(mixedIo.postInterestOnlyPayment, 587.13);
  assert.equal(mixedIo.schedule[12].phase, 'amortized');
  assert.equal(mixedIo.schedule[59].endingBalance, 0);
  assert.equal(mixedIo.remainingBalanceAtEnd, 0);
  assert.equal(mixedIo.scheduleTotals.totalPrincipal, 25000);
});

runSuite('9. Interest-Only loan: full-term I/O never claims principal repaid', () => {
  const fullIo = calculateLoan(
    makeInput({
      loanMode: 'interest-only',
      loanAmount: 25000,
      annualInterestRate: 6,
      loanTermValue: 5,
      loanTermUnit: 'years',
      interestOnlyValue: 5,
      interestOnlyUnit: 'years',
    })
  );
  assert.equal(fullIo.regularPayment, 125);
  assert.equal(fullIo.postInterestOnlyPayment, null);
  assert.equal(fullIo.remainingBalanceAtEnd, 25000);
  assert.equal(fullIo.totalInterest, 7500);
  assert.equal(fullIo.totalPaid, 7500);
  assert.equal(fullIo.scheduleTotals.totalPrincipal, 0);
});

runSuite('10. Origination fee: upfront vs financed handling', () => {
  const upfrontFee = calculateLoan(
    makeInput({ originationFeeValue: 2, originationFeeMode: 'percent', feeInclusion: 'upfront' })
  );
  assert.equal(upfrontFee.originationFeeAmount, 500);
  assert.equal(upfrontFee.upfrontFeeAmount, 500);
  assert.equal(upfrontFee.financedFeeAmount, 0);
  assert.equal(upfrontFee.amountFinanced, 25000);
  assert.equal(upfrontFee.regularPayment, 483.32);
  assert.equal(
    upfrontFee.totalCostWithFees,
    Number((upfrontFee.totalPaid + 500).toFixed(2))
  );

  const financedFee = calculateLoan(
    makeInput({ originationFeeValue: 2, originationFeeMode: 'percent', feeInclusion: 'finance' })
  );
  assert.equal(financedFee.originationFeeAmount, 500);
  assert.equal(financedFee.upfrontFeeAmount, 0);
  assert.equal(financedFee.financedFeeAmount, 500);
  assert.equal(financedFee.amountFinanced, 25500);
  assert.equal(financedFee.scheduleTotals.totalPrincipal, 25500);
  assert.ok(financedFee.regularPayment > upfrontFee.regularPayment);
  assert.equal(financedFee.totalCostWithFees, financedFee.totalPaid);
});

runSuite('11. Large loan & 50-year weekly scale with exact yearly reconciliation', () => {
  const largeWeekly = calculateLoan(
    makeInput({
      loanAmount: 50_000_000,
      annualInterestRate: 5.5,
      loanTermValue: 50,
      loanTermUnit: 'years',
      paymentFrequency: 'weekly',
    })
  );
  assert.equal(largeWeekly.scheduledPaymentsCount, 2600);
  assert.equal(largeWeekly.actualPaymentsCount, 2600);
  assert.equal(largeWeekly.remainingBalanceAtEnd, 0);
  assert.equal(largeWeekly.scheduleTotals.totalPrincipal, 50_000_000);

  const yearlyPaymentSum = largeWeekly.yearlySchedule.reduce(
    (sum, yr) => Math.round((sum + yr.totalPayment) * 100) / 100,
    0
  );
  assert.equal(yearlyPaymentSum, largeWeekly.scheduleTotals.totalPayment);
});

runSuite('12. Payment date generation across month ends and leap days', () => {
  const monthEnd = calculateLoan(makeInput({ startDate: '2024-01-31', loanTermValue: 3, loanTermUnit: 'months' }));
  assert.deepEqual(
    monthEnd.schedule.map((r) => r.paymentDate),
    ['2024-02-29', '2024-03-31', '2024-04-30']
  );

  assert.equal(addDaysToIsoDate('2024-02-27', 7), '2024-03-05');
  assert.equal(addDaysToIsoDate('2026-01-15', 14), '2026-01-29');
});

runSuite('13. Validation guards reject invalid domain inputs cleanly', () => {
  assert.equal(validateLoanInput(makeInput({ loanAmount: 0 })).isValid, false);
  assert.equal(validateLoanInput(makeInput({ loanAmount: -500 })).isValid, false);
  assert.equal(validateLoanInput(makeInput({ annualInterestRate: -1 })).isValid, false);
  assert.equal(validateLoanInput(makeInput({ annualInterestRate: 120 })).isValid, false);
  assert.equal(validateLoanInput(makeInput({ loanTermValue: 2.33, loanTermUnit: 'months' })).isValid, false);
  assert.equal(
    validateLoanInput(
      makeInput({ loanMode: 'interest-only', loanTermValue: 3, interestOnlyValue: 4 })
    ).isValid,
    false
  );
  assert.equal(
    validateLoanInput(makeInput({ originationFeeValue: 30000, originationFeeMode: 'amount' })).isValid,
    false
  );
  assert.equal(
    validateLoanInput(makeInput({ oneTimeExtraAmount: 500, oneTimeExtraPeriod: 61 })).isValid,
    false
  );
  assert.equal(validateLoanInput(makeInput({ startDate: '2026-02-30' })).isValid, false);
});

runSuite('14. Amortization CSV export consistency & safe escaping', () => {
  const res = calculateLoan(makeInput({ extraPaymentAmount: 100 }));
  const periodCsv = buildLoanAmortizationCsv(res, 'period', 'USD');
  const periodLines = periodCsv.split('\r\n');
  assert.equal(periodLines.length, res.actualPaymentsCount + 2);
  assert.match(periodLines[0], /^Payment #,Payment Date,Phase/);
  assert.match(periodLines[periodLines.length - 1], new RegExp(`^Total,${res.actualPaymentsCount} monthly payments`));
  assert.ok(periodLines[periodLines.length - 1].endsWith(',0.00'));

  const yearlyCsv = buildLoanAmortizationCsv(res, 'yearly', 'USD');
  const yearlyLines = yearlyCsv.split('\r\n');
  assert.equal(yearlyLines.length, res.yearlySchedule.length + 2);
  assert.match(yearlyLines[0], /^Year,Payments,Beginning Balance \(USD\)/);
  assert.equal(escapeCsvCell('hello, "world"'), '"hello, ""world"""');
});

console.log('loan calculation.test ok (14 test suites passed)');

