/**
 * Moratorium Calculator — EMI deferment impact (educational).
 *
 * EMI = P r (1+r)^n / ((1+r)^n − 1); r = equivalent monthly rate from nominal R.
 * Capitalized moratorium: B_m = P(1+r)^m
 * Interest-only: principal unchanged; paid interest = P r m
 * Restructuring: same-term EMI, extended-term EMI, or same-EMI tenure solve.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
  type MoratoriumInput,
  type MoratoriumResult,
  type ScheduleRow,
  type TermUnit,
} from './types';

const RATE_TOL = 1e-14;
const MAX_MONTHS = 600;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function scale(currency: SupportedCurrency): number {
  return 10 ** getCurrencyFractionDigits(currency);
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const s = scale(currency);
  return Math.round(amount * s) / s;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function toMonths(
  value: number,
  unit: TermUnit,
  allowZero = false,
): number | null {
  if (!Number.isFinite(value)) return null;
  if (allowZero ? value < 0 : value <= 0) return null;
  if (unit === 'years') {
    const m = value * 12;
    if (!Number.isInteger(m)) return null;
    return m;
  }
  if (!Number.isInteger(value)) return null;
  return value;
}

export function calculateMonthlyInterestRate(
  annualPercent: number,
  compounding: CompoundingFrequency = 'monthly',
): number | null {
  if (!Number.isFinite(annualPercent) || annualPercent < 0) return null;
  const R = annualPercent / 100;
  if (compounding === 'monthly') return R / 12;
  const row = COMPOUNDING_OPTIONS.find((o) => o.value === compounding);
  if (!row) return null;
  const m = row.periodsPerYear;
  const base = 1 + R / m;
  if (!(base > 0)) return null;
  const r = base ** (m / 12) - 1;
  return Number.isFinite(r) ? r : null;
}

export function calculateOriginalEMI(
  principal: number,
  monthlyRate: number,
  months: number,
): number | null {
  if (![principal, monthlyRate, months].every(Number.isFinite)) return null;
  if (principal <= 0 || months <= 0 || !Number.isInteger(months)) return null;
  if (monthlyRate < 0) return null;
  if (monthlyRate < RATE_TOL) return principal / months;
  const growth = (1 + monthlyRate) ** months;
  if (!Number.isFinite(growth) || growth <= 1) return null;
  const emi = (principal * monthlyRate * growth) / (growth - 1);
  return Number.isFinite(emi) && emi > 0 ? emi : null;
}

export function calculateLoanTenureFromEMI(
  principal: number,
  monthlyRate: number,
  emi: number,
): number | null {
  if (![principal, monthlyRate, emi].every(Number.isFinite)) return null;
  if (principal <= 0 || emi <= 0) return null;
  if (monthlyRate < RATE_TOL) {
    const n = principal / emi;
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (emi <= principal * monthlyRate) return null;
  const n =
    -Math.log(1 - (principal * monthlyRate) / emi) / Math.log(1 + monthlyRate);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function outstandingBalanceAfterK(
  principal: number,
  monthlyRate: number,
  emi: number,
  k: number,
): number | null {
  if (k <= 0) return principal;
  if (![principal, monthlyRate, emi, k].every(Number.isFinite)) return null;
  if (!Number.isInteger(k) || k < 0) return null;
  if (monthlyRate < RATE_TOL) {
    return Math.max(0, principal - k * emi);
  }
  const growth = (1 + monthlyRate) ** k;
  const bal =
    principal * growth - (emi * (growth - 1)) / monthlyRate;
  if (!Number.isFinite(bal)) return null;
  return Math.max(0, bal);
}

export function calculateMoratoriumInterest(
  principal: number,
  monthlyRate: number,
  months: number,
  treatment: 'capitalized' | 'paid-monthly',
): {
  balanceAfter: number;
  accrued: number;
  paid: number;
  capitalized: number;
} | null {
  if (![principal, monthlyRate, months].every(Number.isFinite)) return null;
  if (principal < 0 || months < 0 || !Number.isInteger(months)) return null;
  if (months === 0) {
    return { balanceAfter: principal, accrued: 0, paid: 0, capitalized: 0 };
  }
  if (treatment === 'paid-monthly') {
    const paid = principal * monthlyRate * months;
    if (!Number.isFinite(paid)) return null;
    return {
      balanceAfter: principal,
      accrued: paid,
      paid,
      capitalized: 0,
    };
  }
  if (monthlyRate < RATE_TOL) {
    return { balanceAfter: principal, accrued: 0, paid: 0, capitalized: 0 };
  }
  const balanceAfter = principal * (1 + monthlyRate) ** months;
  if (!Number.isFinite(balanceAfter)) return null;
  const accrued = balanceAfter - principal;
  return {
    balanceAfter,
    accrued,
    paid: 0,
    capitalized: accrued,
  };
}

function parseIso(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (y == null || m == null || d == null) return null;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatIso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addMonths(iso: string, months: number): string | null {
  const d = parseIso(iso);
  if (!d || !Number.isFinite(months) || !Number.isInteger(months)) return null;
  d.setUTCMonth(d.getUTCMonth() + months);
  return formatIso(d);
}

/** Whole calendar months from start (exclusive of end month alignment via UTC months). */
export function monthsBetween(startIso: string, endIso: string): number | null {
  const a = parseIso(startIso);
  const b = parseIso(endIso);
  if (!a || !b) return null;
  const months =
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth());
  if (b.getUTCDate() < a.getUTCDate()) {
    return months - 1;
  }
  return months;
}

function amortizePeriods(
  startBalance: number,
  monthlyRate: number,
  emi: number,
  periods: number,
  startDateIso: string,
  startPaymentNumber: number,
  phase: ScheduleRow['phase'],
  currency: SupportedCurrency,
): ScheduleRow[] | null {
  const rows: ScheduleRow[] = [];
  let bal = startBalance;
  for (let i = 1; i <= periods && bal > RATE_TOL; i++) {
    const date = addMonths(startDateIso, i);
    if (!date) return null;
    const opening = bal;
    const interest = monthlyRate < RATE_TOL ? 0 : bal * monthlyRate;
    let payment = emi;
    let principalPaid = payment - interest;
    if (principalPaid >= bal - RATE_TOL || i === periods) {
      principalPaid = bal;
      payment = principalPaid + interest;
      bal = 0;
    } else {
      bal -= principalPaid;
    }
    if (bal < 0) bal = 0;
    rows.push({
      paymentNumber: startPaymentNumber + i - 1,
      paymentDate: date,
      phase,
      openingBalance: roundMoney(opening, currency),
      payment: roundMoney(payment, currency),
      interest: roundMoney(interest, currency),
      principal: roundMoney(principalPaid, currency),
      capitalizedInterest: 0,
      closingBalance: roundMoney(bal, currency),
    });
  }
  return rows;
}

export function calculateMoratoriumFromInput(
  input: MoratoriumInput,
): MoratoriumResult | null {
  const principal = num(input.loanAmount);
  const annualRate = num(input.annualInterestRate);
  if (principal == null || annualRate == null || principal <= 0 || annualRate < 0) {
    return null;
  }

  const compounding = input.enableCustomCompounding
    ? input.compoundingFrequency
    : 'monthly';
  const r = calculateMonthlyInterestRate(annualRate, compounding);
  if (r == null) return null;

  let termMonths: number;
  let originalEMI: number;

  if (input.estimationMode === 'loan-term') {
    const tv = num(input.loanTermValue);
    if (tv == null) return null;
    const months = toMonths(tv, input.loanTermUnit);
    if (months == null || months > MAX_MONTHS) return null;
    termMonths = months;
    const emi = calculateOriginalEMI(principal, r, termMonths);
    if (emi == null) return null;
    originalEMI = emi;
  } else {
    const emi = num(input.monthlyPayment);
    if (emi == null || emi <= 0) return null;
    originalEMI = emi;
    const n = calculateLoanTenureFromEMI(principal, r, emi);
    if (n == null) return null;
    termMonths = Math.ceil(n - 1e-12);
    if (termMonths > MAX_MONTHS) return null;
  }

  const moraMonthsRaw = num(input.moratoriumDurationValue);
  if (moraMonthsRaw == null) return null;
  const moraMonths = toMonths(
    moraMonthsRaw,
    input.moratoriumDurationUnit,
    true,
  );
  if (moraMonths == null || moraMonths < 0 || moraMonths > MAX_MONTHS) return null;

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.dateOfBalance) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.moratoriumStartDate)
  ) {
    return null;
  }

  const monthsBefore = monthsBetween(
    input.dateOfBalance,
    input.moratoriumStartDate,
  );
  if (monthsBefore == null || monthsBefore < 0) return null;
  if (monthsBefore >= termMonths && moraMonths > 0) return null;

  const paymentsBefore = Math.min(monthsBefore, termMonths);
  const balanceAtStart = outstandingBalanceAfterK(
    principal,
    r,
    originalEMI,
    paymentsBefore,
  );
  if (balanceAtStart == null) return null;

  const remainingAtStart = termMonths - paymentsBefore;
  if (moraMonths > remainingAtStart && input.repaymentPlan === 'increased-payment-same-term') {
    // same-term needs some remaining periods after moratorium
  }

  const mora = calculateMoratoriumInterest(
    balanceAtStart,
    r,
    moraMonths,
    input.interestTreatment,
  );
  if (!mora) return null;

  const { currency } = input;
  const originalMaturityDate = addMonths(input.dateOfBalance, termMonths);
  if (!originalMaturityDate) return null;

  let revisedEMI = originalEMI;
  let revisedRemainingPayments = 0;
  let revisedMaturityDate: string | null = null;
  let warning: string | null = null;
  let postSchedule: ScheduleRow[] | null = [];

  const moraEndDate = addMonths(input.moratoriumStartDate, moraMonths);
  if (!moraEndDate) return null;

  if (input.repaymentPlan === 'increased-payment-same-term') {
    const nr = remainingAtStart - moraMonths;
    if (nr <= 0) {
      warning =
        'Moratorium uses all remaining term before original maturity; same-term EMI restructuring needs a balloon or different plan.';
      return null;
    }
    const emiNew = calculateOriginalEMI(mora.balanceAfter, r, nr);
    if (emiNew == null) return null;
    revisedEMI = emiNew;
    revisedRemainingPayments = nr;
    revisedMaturityDate = originalMaturityDate;
    postSchedule = amortizePeriods(
      mora.balanceAfter,
      r,
      revisedEMI,
      nr,
      moraEndDate,
      paymentsBefore + moraMonths + 1,
      'post-moratorium',
      currency,
    );
  } else if (input.repaymentPlan === 'increased-payment-extended-term') {
    const nr = remainingAtStart; // extend by mora months → same count after mora as remaining at start
    if (nr <= 0) return null;
    const emiNew = calculateOriginalEMI(mora.balanceAfter, r, nr);
    if (emiNew == null) return null;
    revisedEMI = emiNew;
    revisedRemainingPayments = nr;
    revisedMaturityDate = addMonths(moraEndDate, nr);
    postSchedule = amortizePeriods(
      mora.balanceAfter,
      r,
      revisedEMI,
      nr,
      moraEndDate,
      paymentsBefore + moraMonths + 1,
      'post-moratorium',
      currency,
    );
  } else {
    // same payment – extended term
    if (r >= RATE_TOL && originalEMI <= mora.balanceAfter * r) {
      warning =
        'Current EMI does not cover monthly interest on the post-moratorium balance; the loan cannot amortize under these assumptions.';
      return null;
    }
    const nExact = calculateLoanTenureFromEMI(
      mora.balanceAfter,
      r,
      originalEMI,
    );
    if (nExact == null) return null;
    const nr = Math.ceil(nExact - 1e-12);
    if (nr > MAX_MONTHS) return null;
    revisedEMI = originalEMI;
    revisedRemainingPayments = nr;
    revisedMaturityDate = addMonths(moraEndDate, nr);
    postSchedule = amortizePeriods(
      mora.balanceAfter,
      r,
      revisedEMI,
      nr,
      moraEndDate,
      paymentsBefore + moraMonths + 1,
      'post-moratorium',
      currency,
    );
  }

  if (!postSchedule || !revisedMaturityDate) return null;

  // Pre-moratorium schedule
  const preSchedule =
    paymentsBefore > 0
      ? amortizePeriods(
          principal,
          r,
          originalEMI,
          paymentsBefore,
          input.dateOfBalance,
          1,
          'pre-moratorium',
          currency,
        )
      : [];
  if (!preSchedule) return null;

  // Moratorium schedule rows
  const moraRows: ScheduleRow[] = [];
  let moraBal = balanceAtStart;
  for (let i = 1; i <= moraMonths; i++) {
    const date = addMonths(input.moratoriumStartDate, i);
    if (!date) return null;
    const interest = r < RATE_TOL ? 0 : moraBal * r;
    if (input.interestTreatment === 'paid-monthly') {
      moraRows.push({
        paymentNumber: paymentsBefore + i,
        paymentDate: date,
        phase: 'moratorium',
        openingBalance: roundMoney(moraBal, currency),
        payment: roundMoney(interest, currency),
        interest: roundMoney(interest, currency),
        principal: 0,
        capitalizedInterest: 0,
        closingBalance: roundMoney(moraBal, currency),
      });
    } else {
      moraBal += interest;
      moraRows.push({
        paymentNumber: paymentsBefore + i,
        paymentDate: date,
        phase: 'moratorium',
        openingBalance: roundMoney(moraBal - interest, currency),
        payment: 0,
        interest: roundMoney(interest, currency),
        principal: 0,
        capitalizedInterest: roundMoney(interest, currency),
        closingBalance: roundMoney(moraBal, currency),
      });
    }
  }

  const schedule = [...preSchedule, ...moraRows, ...postSchedule];

  // Totals
  let originalTotalInterest = 0;
  {
    const baseline = amortizePeriods(
      principal,
      r,
      originalEMI,
      termMonths,
      input.dateOfBalance,
      1,
      'pre-moratorium',
      currency,
    );
    if (!baseline) return null;
    originalTotalInterest = baseline.reduce((s, row) => s + row.interest, 0);
  }

  const revisedInterestFromSchedule = schedule.reduce(
    (s, row) => s + row.interest,
    0,
  );
  const totalRepayment = schedule.reduce((s, row) => s + row.payment, 0);
  const additionalInterestCost =
    revisedInterestFromSchedule - originalTotalInterest;

  const steps = [
    `Principal at balance date = ${money(principal, currency)}`,
    `Monthly rate r = ${r.toExponential(6)} (from ${annualRate}% ${compounding})`,
    `Original term = ${termMonths} months · EMI = ${money(originalEMI, currency)}`,
    `Payments before moratorium = ${paymentsBefore} · balance at start = ${money(balanceAtStart, currency)}`,
    `Moratorium = ${moraMonths} months · treatment = ${input.interestTreatment}`,
    `Balance after moratorium = ${money(mora.balanceAfter, currency)} (accrued ${money(mora.accrued, currency)})`,
    `Plan = ${input.repaymentPlan} · revised EMI = ${money(revisedEMI, currency)} · remaining payments = ${revisedRemainingPayments}`,
    `Maturity ${originalMaturityDate} → ${revisedMaturityDate}`,
    `Additional interest vs original schedule ≈ ${money(additionalInterestCost, currency)}`,
  ];

  const formulaBreakdown = [
    'EMI = P r (1+r)^n / ((1+r)^n − 1); r from nominal annual rate / compounding',
    'Capitalized: B_m = P(1+r)^m',
    'Interest-only: pay P×r each month; principal unchanged',
    'Same-term: EMI_new over remaining periods to original maturity',
    'Extended-term: EMI_new over remaining-at-start periods after mora',
    'Same EMI: n = −ln(1 − P r / EMI) / ln(1+r)',
  ].join('\n');

  const interpretation = `With a ${money(principal, currency)} balance at ${annualRate}% and a ${moraMonths}-month ${input.interestTreatment} moratorium, the estimated revised EMI is ${money(revisedEMI, currency)} (was ${money(originalEMI, currency)}), with about ${money(additionalInterestCost, currency)} extra interest versus the original schedule.`;

  const explanation =
    'Educational model for monthly amortizing loans. Lender policies, fees, and rate resets may differ. Compounding other than monthly uses an equivalent monthly rate r_m = (1+R/m)^(m/12)−1.';

  return {
    currency,
    monthlyRate: r,
    originalEMI: roundMoney(originalEMI, currency),
    revisedEMI: roundMoney(revisedEMI, currency),
    originalTermMonths: termMonths,
    balanceAtMoratoriumStart: roundMoney(balanceAtStart, currency),
    balanceAfterMoratorium: roundMoney(mora.balanceAfter, currency),
    accruedMoratoriumInterest: roundMoney(mora.accrued, currency),
    paidMoratoriumInterest: roundMoney(mora.paid, currency),
    capitalizedInterest: roundMoney(mora.capitalized, currency),
    moratoriumMonths: moraMonths,
    paymentsBeforeMoratorium: paymentsBefore,
    originalRemainingPayments: remainingAtStart,
    revisedRemainingPayments,
    originalMaturityDate,
    revisedMaturityDate,
    originalTotalInterest: roundMoney(originalTotalInterest, currency),
    revisedTotalInterest: roundMoney(revisedInterestFromSchedule, currency),
    additionalInterestCost: roundMoney(additionalInterestCost, currency),
    totalRepayment: roundMoney(totalRepayment, currency),
    interestTreatment: input.interestTreatment,
    repaymentPlan: input.repaymentPlan,
    schedule,
    warning,
    formattedOriginalEMI: money(originalEMI, currency),
    formattedRevisedEMI: money(revisedEMI, currency),
    formattedBalanceAfter: money(mora.balanceAfter, currency),
    formattedAdditionalCost: money(additionalInterestCost, currency),
    steps,
    formulaBreakdown,
    interpretation,
    explanation,
  };
}
