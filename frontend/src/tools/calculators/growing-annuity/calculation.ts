import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  FREQUENCY_OPTIONS,
  type AnnuityType,
  type Frequency,
  type PaymentDirection,
  type SolveFor,
  type TermUnit,
} from './types';

export function periodsPerYear(frequency: Frequency): number {
  return FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 12;
}

export function frequencyLabel(frequency: Frequency): string {
  return FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.label ?? frequency;
}

export function formatGrowingAnnuityMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatGrowingAnnuityPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(percent);
}

export function termToYears(length: number, unit: TermUnit): number | null {
  if (!(length > 0) || !Number.isFinite(length)) return null;
  return unit === 'yrs' ? length : length / 12;
}

export function yearsToPaymentCount(
  termYears: number,
  paymentFrequency: Frequency
): number | null {
  if (!(termYears > 0) || !Number.isFinite(termYears)) return null;
  const q = periodsPerYear(paymentFrequency);
  const n = Math.round(termYears * q);
  return n > 0 ? n : null;
}

/**
 * Equivalent rate per payment period from nominal annual rate with compounding m.
 * i = (1 + r/m)^(m/q) − 1
 */
export function paymentPeriodRate(
  annualRatePercent: number,
  compoundingFrequency: Frequency,
  paymentFrequency: Frequency
): number | null {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  const m = periodsPerYear(compoundingFrequency);
  const q = periodsPerYear(paymentFrequency);
  if (!(m > 0) || !(q > 0)) return null;
  if (annualRatePercent === 0) return 0;
  const base = 1 + annualRatePercent / (100 * m);
  if (!(base > 0)) return null;
  const i = Math.pow(base, m / q) - 1;
  return Number.isFinite(i) ? i : null;
}

/** Periodic growth from annual growth: g = (1+G)^(1/q) − 1 */
export function periodicGrowthFromAnnual(
  annualGrowthPercent: number,
  paymentFrequency: Frequency
): number | null {
  if (!Number.isFinite(annualGrowthPercent)) return null;
  const q = periodsPerYear(paymentFrequency);
  const base = 1 + annualGrowthPercent / 100;
  if (!(base > 0)) return null;
  const g = Math.pow(base, 1 / q) - 1;
  return Number.isFinite(g) ? g : null;
}

/** Annual growth from periodic: G = (1+g)^q − 1 */
export function annualGrowthFromPeriodic(
  periodicGrowthPercent: number,
  paymentFrequency: Frequency
): number | null {
  if (!Number.isFinite(periodicGrowthPercent)) return null;
  const q = periodsPerYear(paymentFrequency);
  const base = 1 + periodicGrowthPercent / 100;
  if (!(base > 0)) return null;
  const G = Math.pow(base, q) - 1;
  return Number.isFinite(G) ? G * 100 : null;
}

function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!(y >= 1 && y <= 9999) || !(m >= 1 && m <= 12) || !(d >= 1 && d <= 31)) {
    return null;
  }
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

function formatIso(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function addCalendarMonths(iso: string, months: number): string | null {
  const parsed = parseIsoDate(iso);
  if (!parsed) return null;
  const total = parsed.y * 12 + (parsed.m - 1) + months;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const d = Math.min(parsed.d, lastDay);
  return formatIso(y, m, d);
}

function addDays(iso: string, days: number): string | null {
  const parsed = parseIsoDate(iso);
  if (!parsed) return null;
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return formatIso(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/** Advance start date by `periods` payment periods. */
export function addPaymentPeriods(
  startIso: string,
  periods: number,
  paymentFrequency: Frequency
): string | null {
  if (!Number.isFinite(periods) || periods < 0) return null;
  const n = Math.round(periods);
  switch (paymentFrequency) {
    case 'yearly':
      return addCalendarMonths(startIso, n * 12);
    case 'semiannually':
      return addCalendarMonths(startIso, n * 6);
    case 'quarterly':
      return addCalendarMonths(startIso, n * 3);
    case 'monthly':
      return addCalendarMonths(startIso, n);
    case 'biweekly':
      return addDays(startIso, n * 14);
    case 'weekly':
      return addDays(startIso, n * 7);
    case 'daily':
      return addDays(startIso, n);
    default:
      return null;
  }
}

export function formatLongDate(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dt);
}

export function lastPaymentDateIso(
  startIso: string,
  paymentCount: number,
  annuityType: AnnuityType,
  paymentFrequency: Frequency
): string | null {
  if (!(paymentCount > 0)) return null;
  // Due: payments at period starts → last at start + (n−1) periods
  // Ordinary: payments at period ends → last at start + n periods
  const offset = annuityType === 'due' ? paymentCount - 1 : paymentCount;
  return addPaymentPeriods(startIso, offset, paymentFrequency);
}

/**
 * Future value from opening balance + growing payment stream.
 * signedPmt > 0 deposits, < 0 withdrawals.
 */
export function futureValueFromSchedule(input: {
  openingBalance: number;
  signedFirstPayment: number;
  paymentCount: number;
  periodRate: number;
  periodGrowth: number;
  annuityType: AnnuityType;
}): number | null {
  const {
    openingBalance,
    signedFirstPayment,
    paymentCount,
    periodRate,
    periodGrowth,
    annuityType,
  } = input;
  if (
    ![openingBalance, signedFirstPayment, paymentCount, periodRate, periodGrowth].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(paymentCount > 0) || periodRate < -1 || periodGrowth <= -1) return null;

  let bal = openingBalance;
  for (let k = 0; k < paymentCount; k += 1) {
    const pmt = signedFirstPayment * Math.pow(1 + periodGrowth, k);
    if (!Number.isFinite(pmt)) return null;
    if (annuityType === 'due') {
      bal += pmt;
      bal *= 1 + periodRate;
    } else {
      bal *= 1 + periodRate;
      bal += pmt;
    }
    if (!Number.isFinite(bal)) return null;
  }
  return bal;
}

export function totalPaymentAmount(
  firstPaymentAbs: number,
  paymentCount: number,
  periodGrowth: number
): number | null {
  if (!(firstPaymentAbs >= 0) || !(paymentCount > 0) || !Number.isFinite(periodGrowth)) {
    return null;
  }
  if (periodGrowth === 0) return firstPaymentAbs * paymentCount;
  if (periodGrowth <= -1) return null;
  const factor = (Math.pow(1 + periodGrowth, paymentCount) - 1) / periodGrowth;
  const total = firstPaymentAbs * factor;
  return Number.isFinite(total) ? total : null;
}

export interface GrowingAnnuityEngineInput {
  solveFor: SolveFor;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
  startDate: string;
  openingBalance: number;
  firstPaymentAbs: number;
  termYears: number;
  annualRatePercent: number;
  periodGrowth: number;
  targetFinalBalance: number;
}

export interface GrowingAnnuityEngineResult {
  openingBalance: number;
  finalBalance: number;
  periodicPayment: number;
  totalPayments: number;
  totalReturn: number;
  numberOfPayments: number;
  lastPaymentDate: string;
  solvedValue: number;
  direction: PaymentDirection;
}

function signedPayment(
  absAmount: number,
  direction: PaymentDirection
): number {
  return direction === 'deposit' ? absAmount : -absAmount;
}

function buildResult(args: {
  openingBalance: number;
  finalBalance: number;
  firstPaymentAbs: number;
  paymentCount: number;
  periodGrowth: number;
  startDate: string;
  annuityType: AnnuityType;
  paymentFrequency: Frequency;
  solvedValue: number;
  direction: PaymentDirection;
}): GrowingAnnuityEngineResult | null {
  const total = totalPaymentAmount(
    args.firstPaymentAbs,
    args.paymentCount,
    args.periodGrowth
  );
  if (total === null) return null;
  const last = lastPaymentDateIso(
    args.startDate,
    args.paymentCount,
    args.annuityType,
    args.paymentFrequency
  );
  if (!last) return null;
  // Deposits add cash (+); withdrawals remove cash (−).
  const netContributions = args.direction === 'deposit' ? total : -total;
  const totalReturn = args.finalBalance - args.openingBalance - netContributions;
  if (![args.finalBalance, totalReturn].every(Number.isFinite)) return null;
  return {
    openingBalance: args.openingBalance,
    finalBalance: args.finalBalance,
    periodicPayment: args.firstPaymentAbs,
    totalPayments: total,
    totalReturn,
    numberOfPayments: args.paymentCount,
    lastPaymentDate: last,
    solvedValue: args.solvedValue,
    direction: args.direction,
  };
}

function fvFor(input: {
  openingBalance: number;
  firstPaymentAbs: number;
  paymentCount: number;
  annualRatePercent: number;
  periodGrowth: number;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
}): number | null {
  const i = paymentPeriodRate(
    input.annualRatePercent,
    input.compoundingFrequency,
    input.paymentFrequency
  );
  if (i === null) return null;
  return futureValueFromSchedule({
    openingBalance: input.openingBalance,
    signedFirstPayment: signedPayment(input.firstPaymentAbs, input.direction),
    paymentCount: input.paymentCount,
    periodRate: i,
    periodGrowth: input.periodGrowth,
    annuityType: input.annuityType,
  });
}

/** Binary search annual rate so schedule FV matches target. */
function solveAnnualRate(input: {
  openingBalance: number;
  firstPaymentAbs: number;
  paymentCount: number;
  periodGrowth: number;
  targetFinalBalance: number;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
}): number | null {
  const target = input.targetFinalBalance;
  const evalFv = (rate: number) =>
    fvFor({ ...input, annualRatePercent: rate });

  const at0 = evalFv(0);
  if (at0 === null) return null;

  let lo = 0;
  let hi = 100;
  let fvHi = evalFv(hi);
  let guard = 0;
  while (fvHi !== null && fvHi < target && hi < 1_000_000 && guard < 40) {
    hi *= 2;
    fvHi = evalFv(hi);
    guard += 1;
  }
  if (fvHi === null) return null;

  // Withdrawals may need negative rates in edge cases — keep rate ≥ 0 for deposits.
  if (input.direction === 'deposit' && at0 > target) return null;

  for (let iter = 0; iter < 80; iter += 1) {
    const mid = (lo + hi) / 2;
    const fv = evalFv(mid);
    if (fv === null) return null;
    if (Math.abs(fv - target) < 1e-6) return mid;
    if (fv < target) lo = mid;
    else hi = mid;
  }
  const rate = (lo + hi) / 2;
  return Number.isFinite(rate) ? rate : null;
}

function solvePaymentCount(input: {
  openingBalance: number;
  firstPaymentAbs: number;
  annualRatePercent: number;
  periodGrowth: number;
  targetFinalBalance: number;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
}): number | null {
  const target = input.targetFinalBalance;
  let lo = 1;
  let hi = 1;
  let fv = fvFor({ ...input, paymentCount: hi });
  let guard = 0;
  while (fv !== null && fv < target && hi < 100_000 && guard < 40) {
    hi *= 2;
    fv = fvFor({ ...input, paymentCount: hi });
    guard += 1;
  }
  if (fv === null) return null;
  if (fvFor({ ...input, paymentCount: 1 }) === null) return null;

  for (let iter = 0; iter < 60; iter += 1) {
    const mid = Math.floor((lo + hi) / 2);
    const midFv = fvFor({ ...input, paymentCount: mid });
    if (midFv === null) return null;
    if (midFv < target) lo = mid + 1;
    else hi = mid;
  }
  const n = hi;
  const check = fvFor({ ...input, paymentCount: n });
  if (check === null || !(n > 0)) return null;
  return n;
}

function solveOpeningBalance(input: {
  firstPaymentAbs: number;
  paymentCount: number;
  annualRatePercent: number;
  periodGrowth: number;
  targetFinalBalance: number;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
}): number | null {
  const i = paymentPeriodRate(
    input.annualRatePercent,
    input.compoundingFrequency,
    input.paymentFrequency
  );
  if (i === null) return null;
  const growth = Math.pow(1 + i, input.paymentCount);
  if (!(growth > 0) || !Number.isFinite(growth)) return null;

  const annuityFv = futureValueFromSchedule({
    openingBalance: 0,
    signedFirstPayment: signedPayment(input.firstPaymentAbs, input.direction),
    paymentCount: input.paymentCount,
    periodRate: i,
    periodGrowth: input.periodGrowth,
    annuityType: input.annuityType,
  });
  if (annuityFv === null) return null;

  const pv = (input.targetFinalBalance - annuityFv) / growth;
  return Number.isFinite(pv) ? pv : null;
}

function solveFirstPayment(input: {
  openingBalance: number;
  paymentCount: number;
  annualRatePercent: number;
  periodGrowth: number;
  targetFinalBalance: number;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
}): number | null {
  const i = paymentPeriodRate(
    input.annualRatePercent,
    input.compoundingFrequency,
    input.paymentFrequency
  );
  if (i === null) return null;
  const unitFv = futureValueFromSchedule({
    openingBalance: 0,
    signedFirstPayment: signedPayment(1, input.direction),
    paymentCount: input.paymentCount,
    periodRate: i,
    periodGrowth: input.periodGrowth,
    annuityType: input.annuityType,
  });
  if (unitFv === null || unitFv === 0) return null;

  const pvGrowth = input.openingBalance * Math.pow(1 + i, input.paymentCount);
  if (!Number.isFinite(pvGrowth)) return null;
  const needed = input.targetFinalBalance - pvGrowth;
  const absPmt = needed / unitFv;
  // unitFv already includes deposit/withdrawal sign, so absPmt is magnitude when direction deposit
  const magnitude = Math.abs(absPmt);
  return Number.isFinite(magnitude) ? magnitude : null;
}

/**
 * Pure annuity engine. Returns null for impossible / non-finite cases.
 */
export function calculateGrowingAnnuity(
  input: GrowingAnnuityEngineInput
): GrowingAnnuityEngineResult | null {
  const {
    solveFor,
    direction,
    paymentFrequency,
    compoundingFrequency,
    annuityType,
    startDate,
    openingBalance,
    firstPaymentAbs,
    termYears,
    annualRatePercent,
    periodGrowth,
    targetFinalBalance,
  } = input;

  if (!parseIsoDate(startDate)) return null;
  if (!(periodGrowth > -1) || !Number.isFinite(periodGrowth)) return null;

  if (solveFor === 'finalBalance') {
    const n = yearsToPaymentCount(termYears, paymentFrequency);
    if (n === null) return null;
    if (!(firstPaymentAbs >= 0) || !Number.isFinite(openingBalance)) return null;
    const fv = fvFor({
      openingBalance,
      firstPaymentAbs,
      paymentCount: n,
      annualRatePercent,
      periodGrowth,
      direction,
      paymentFrequency,
      compoundingFrequency,
      annuityType,
    });
    if (fv === null) return null;
    return buildResult({
      openingBalance,
      finalBalance: fv,
      firstPaymentAbs,
      paymentCount: n,
      periodGrowth,
      startDate,
      annuityType,
      paymentFrequency,
      solvedValue: fv,
      direction,
    });
  }

  if (solveFor === 'initialDeposit') {
    const n = yearsToPaymentCount(termYears, paymentFrequency);
    if (n === null || !(firstPaymentAbs >= 0)) return null;
    const pv = solveOpeningBalance({
      firstPaymentAbs,
      paymentCount: n,
      annualRatePercent,
      periodGrowth,
      targetFinalBalance,
      direction,
      paymentFrequency,
      compoundingFrequency,
      annuityType,
    });
    if (pv === null) return null;
    const fv = fvFor({
      openingBalance: pv,
      firstPaymentAbs,
      paymentCount: n,
      annualRatePercent,
      periodGrowth,
      direction,
      paymentFrequency,
      compoundingFrequency,
      annuityType,
    });
    if (fv === null) return null;
    return buildResult({
      openingBalance: pv,
      finalBalance: fv,
      firstPaymentAbs,
      paymentCount: n,
      periodGrowth,
      startDate,
      annuityType,
      paymentFrequency,
      solvedValue: pv,
      direction,
    });
  }

  if (solveFor === 'annuityAmount') {
    const n = yearsToPaymentCount(termYears, paymentFrequency);
    if (n === null || !Number.isFinite(openingBalance)) return null;
    const pmt = solveFirstPayment({
      openingBalance,
      paymentCount: n,
      annualRatePercent,
      periodGrowth,
      targetFinalBalance,
      direction,
      paymentFrequency,
      compoundingFrequency,
      annuityType,
    });
    if (pmt === null || !(pmt >= 0)) return null;
    const fv = fvFor({
      openingBalance,
      firstPaymentAbs: pmt,
      paymentCount: n,
      annualRatePercent,
      periodGrowth,
      direction,
      paymentFrequency,
      compoundingFrequency,
      annuityType,
    });
    if (fv === null) return null;
    return buildResult({
      openingBalance,
      finalBalance: fv,
      firstPaymentAbs: pmt,
      paymentCount: n,
      periodGrowth,
      startDate,
      annuityType,
      paymentFrequency,
      solvedValue: pmt,
      direction,
    });
  }

  return null;
}

export function buildSummaryText(input: {
  solveFor: SolveFor;
  solvedValue: number;
  finalBalance: number;
  currency: SupportedCurrency;
  currencySymbol: string;
}): string {
  const money = (amount: number) =>
    `${input.currencySymbol}${formatGrowingAnnuityMoney(amount, input.currency)}`;
  switch (input.solveFor) {
    case 'finalBalance':
      return `The final balance (future value) of your annuity is ${money(input.finalBalance)}.`;
    case 'initialDeposit':
      return `The initial deposit (present value) of your annuity is ${money(input.solvedValue)}.`;
    case 'annuityAmount':
      return `The annuity amount (periodic payment) is ${money(input.solvedValue)}.`;
    default:
      return `The final balance of your annuity is ${money(input.finalBalance)}.`;
  }
}
