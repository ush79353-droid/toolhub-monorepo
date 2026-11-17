import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type InterestMethod,
  type PaymentFrequency,
  type TermUnit,
} from './types';

const DAYS_PER_BIWEEK = 14;
const DAYS_PER_WEEK = 7;
const MEAN_GREGORIAN_YEAR_DAYS = 365.25;

export function formatMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatSignedMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const abs = formatMoneyAmount(Math.abs(amount), currency);
  if (Object.is(amount, -0) || amount === 0) return abs;
  return amount < 0 ? `-${abs}` : abs;
}

export function formatTermYearsMonths(years: number, months: number): string {
  const y = Math.max(0, years);
  const m = Math.max(0, months);
  if (y === 0 && m === 0) return '0 yrs 0 mos.';
  if (y === 0) return `0 yrs ${m} mos.`;
  if (m === 0) return `${y} yrs 0 mos.`;
  return `${y} yrs ${m} mos.`;
}

/** Screenshot-style "Nov 11, 2046". */
export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[Number(match[2]) - 1] ?? match[2];
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

export function termToMonths(term: number, unit: TermUnit): number | null {
  if (!(term > 0) || !Number.isFinite(term)) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!(months > 0) || !Number.isFinite(months)) return null;
  return Math.round(months);
}

function usUkMonthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 1200;
}

function canadianMonthlyRate(annualRatePercent: number): number {
  const semi = annualRatePercent / 200;
  return Math.pow(1 + semi, 1 / 6) - 1;
}

export function monthlyPeriodRate(
  annualRatePercent: number,
  method: InterestMethod
): number {
  return method === 'semi_annual_canada'
    ? canadianMonthlyRate(annualRatePercent)
    : usUkMonthlyRate(annualRatePercent);
}

function periodRateFromMonthly(
  monthlyRate: number,
  periodsPerYear: number,
  method: InterestMethod,
  annualRatePercent: number
): number {
  if (periodsPerYear === 12) return monthlyRate;
  if (method === 'semi_annual_canada') {
    const semi = annualRatePercent / 200;
    return Math.pow(1 + semi, 2 / periodsPerYear) - 1;
  }
  return Math.pow(1 + monthlyRate, 12 / periodsPerYear) - 1;
}

export function amortizingPayment(
  principal: number,
  r: number,
  n: number
): number | null {
  if (!(principal > 0) || !(n > 0)) return null;
  if (!Number.isFinite(r) || r < 0) return null;
  if (r === 0) return principal / n;
  const growth = Math.pow(1 + r, n);
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return null;
  const payment = (principal * r * growth) / denom;
  return Number.isFinite(payment) ? payment : null;
}

export function addMonthsIso(isoDate: string, months: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function addDaysIso(isoDate: string, days: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + days);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function addPeriodsIso(
  isoDate: string,
  periods: number,
  periodsPerYear: number
): string | null {
  if (periodsPerYear === 12) return addMonthsIso(isoDate, periods);
  if (periodsPerYear === 26) {
    return addDaysIso(isoDate, periods * DAYS_PER_BIWEEK);
  }
  if (periodsPerYear === 52) {
    return addDaysIso(isoDate, periods * DAYS_PER_WEEK);
  }
  // Semi-monthly and other non-calendar grids: mean Gregorian step.
  const dayStep = MEAN_GREGORIAN_YEAR_DAYS / periodsPerYear;
  return addDaysIso(isoDate, Math.round(periods * dayStep));
}

function compareIso(a: string, b: string): number {
  return a.localeCompare(b);
}

function monthsFromPaymentCount(
  paymentCount: number,
  periodsPerYear: number
): { years: number; months: number } {
  if (periodsPerYear === 12) {
    return {
      years: Math.floor(paymentCount / 12),
      months: paymentCount % 12,
    };
  }
  if (periodsPerYear === 26) {
    const yearsExact =
      (paymentCount * DAYS_PER_BIWEEK) / MEAN_GREGORIAN_YEAR_DAYS;
    const totalMonths = Math.round(yearsExact * 12);
    return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
  }
  if (periodsPerYear === 52) {
    const yearsExact =
      (paymentCount * DAYS_PER_WEEK) / MEAN_GREGORIAN_YEAR_DAYS;
    const totalMonths = Math.round(yearsExact * 12);
    return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
  }
  const totalMonths = Math.round((paymentCount * 12) / periodsPerYear);
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
}

function frequencyMeta(frequency: PaymentFrequency) {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency) ??
    PAYMENT_FREQUENCY_OPTIONS[0]!
  );
}

function scheduledPaymentForFrequency(
  monthlyPayment: number,
  frequency: PaymentFrequency
): number {
  const meta = frequencyMeta(frequency);
  switch (meta.paymentFactor) {
    case 'full':
      return monthlyPayment;
    case 'half':
      return monthlyPayment / 2;
    case 'quarter':
      return monthlyPayment / 4;
    case 'annual_over_ppy':
      return (monthlyPayment * 12) / meta.periodsPerYear;
    default:
      return monthlyPayment;
  }
}

interface RawRun {
  paymentCount: number;
  totalInterest: number;
  totalOfPayments: number;
  periodicPayment: number;
}

/**
 * Fixed scheduled payment amortization with optional periodic extra and one lump sum.
 * Lump sum applies on the first payment date on/after lumpSumDate.
 * Periodic extras apply on payment dates on/after periodicStartDate.
 */
function runSchedule(params: {
  principal: number;
  periodicRate: number;
  scheduledPayment: number;
  periodsPerYear: number;
  maxPeriods: number;
  dueDate: string;
  periodicExtra: number;
  periodicStartDate: string;
  lumpSum: number;
  lumpSumDate: string;
}): RawRun | null {
  const {
    principal,
    periodicRate,
    scheduledPayment,
    periodsPerYear,
    maxPeriods,
    dueDate,
    periodicExtra,
    periodicStartDate,
    lumpSum,
    lumpSumDate,
  } = params;

  if (!(principal > 0) || !(maxPeriods > 0)) return null;
  if (!(scheduledPayment >= 0) || !(periodicExtra >= 0) || !(lumpSum >= 0)) {
    return null;
  }
  if (!Number.isFinite(periodicRate) || periodicRate < 0) return null;

  let balance = principal;
  let totalInterest = 0;
  let totalOfPayments = 0;
  let paymentCount = 0;
  let lumpApplied = lumpSum <= 0;

  // ponytail: float residual ceiling ~1¢; upgrade to cents ledger if needed
  const BALANCE_EPS = 0.005;

  for (let i = 0; i < maxPeriods && balance > BALANCE_EPS; i += 1) {
    const paymentDate = addPeriodsIso(dueDate, i, periodsPerYear);
    if (!paymentDate) return null;

    const interest = periodicRate === 0 ? 0 : balance * periodicRate;
    if (!Number.isFinite(interest)) return null;

    let extra = 0;
    if (!lumpApplied && compareIso(paymentDate, lumpSumDate) >= 0) {
      extra += Math.min(lumpSum, Math.max(0, balance));
      lumpApplied = true;
    }
    if (periodicExtra > 0 && compareIso(paymentDate, periodicStartDate) >= 0) {
      extra += periodicExtra;
    }

    let payment = scheduledPayment + extra;
    if (payment + BALANCE_EPS >= balance + interest) {
      payment = balance + interest;
    } else if (periodicRate > 0 && payment <= interest + 1e-12 && extra <= 0) {
      return null;
    }

    balance -= payment - interest;
    if (balance < BALANCE_EPS) balance = 0;

    totalInterest += interest;
    totalOfPayments += payment;
    paymentCount += 1;
  }

  if (paymentCount === 0 || balance > BALANCE_EPS) return null;

  return {
    paymentCount,
    totalInterest,
    totalOfPayments,
    periodicPayment: scheduledPayment,
  };
}

function subtractTerms(
  aYears: number,
  aMonths: number,
  bYears: number,
  bMonths: number
): { years: number; months: number } {
  let total = aYears * 12 + aMonths - (bYears * 12 + bMonths);
  if (total < 0) total = 0;
  return { years: Math.floor(total / 12), months: total % 12 };
}

export interface MortgageWithExtraPaymentsCanonicalInput {
  mortgageAmount: number;
  annualRatePercent: number;
  termMonths: number;
  interestMethod: InterestMethod;
  paymentFrequency: PaymentFrequency;
  dueDate: string;
  periodicExtra: number;
  periodicStartDate: string;
  lumpSum: number;
  lumpSumDate: string;
  currency: SupportedCurrency;
}

export interface MortgageWithExtraPaymentsCanonicalResult {
  currency: SupportedCurrency;
  monthlyPayment: number;
  original: RawRun & {
    payoffDate: string;
    termYears: number;
    termMonths: number;
    freqLabel: string;
  };
  withExtra: RawRun & {
    payoffDate: string;
    termYears: number;
    termMonths: number;
    freqLabel: string;
    periodsPerYear: number;
  };
  termSavedYears: number;
  termSavedMonths: number;
  interestDifference: number;
  totalPaymentDifference: number;
  paymentDifference: number;
}

/**
 * Original = standard monthly amortization (no extras).
 * With extra = selected payment frequency + periodic extra + optional lump sum.
 */
export function calculateMortgageWithExtraPayments(
  input: MortgageWithExtraPaymentsCanonicalInput
): MortgageWithExtraPaymentsCanonicalResult | null {
  const {
    mortgageAmount,
    annualRatePercent,
    termMonths,
    interestMethod,
    paymentFrequency,
    dueDate,
    periodicExtra,
    periodicStartDate,
    lumpSum,
    lumpSumDate,
    currency,
  } = input;

  if (
    ![
      mortgageAmount,
      annualRatePercent,
      termMonths,
      periodicExtra,
      lumpSum,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(mortgageAmount > 0) || !(termMonths > 0) || annualRatePercent < 0) {
    return null;
  }
  if (periodicExtra < 0 || lumpSum < 0) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(periodicStartDate)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lumpSumDate)) return null;

  const monthlyRate = monthlyPeriodRate(annualRatePercent, interestMethod);
  const monthlyPayment = amortizingPayment(
    mortgageAmount,
    monthlyRate,
    termMonths
  );
  if (monthlyPayment === null || !(monthlyPayment >= 0)) return null;

  const originalRun = runSchedule({
    principal: mortgageAmount,
    periodicRate: monthlyRate,
    scheduledPayment: monthlyPayment,
    periodsPerYear: 12,
    maxPeriods: Math.max(termMonths * 2, termMonths + 1),
    dueDate,
    periodicExtra: 0,
    periodicStartDate,
    lumpSum: 0,
    lumpSumDate,
  });
  if (!originalRun) return null;
  const originalPayoff = addPeriodsIso(
    dueDate,
    Math.max(0, originalRun.paymentCount - 1),
    12
  );
  if (!originalPayoff) return null;
  const originalTerm = monthsFromPaymentCount(originalRun.paymentCount, 12);

  const meta = frequencyMeta(paymentFrequency);
  const withPayment = scheduledPaymentForFrequency(
    monthlyPayment,
    paymentFrequency
  );
  const withRate = periodRateFromMonthly(
    monthlyRate,
    meta.periodsPerYear,
    interestMethod,
    annualRatePercent
  );

  const withRun = runSchedule({
    principal: mortgageAmount,
    periodicRate: withRate,
    scheduledPayment: withPayment,
    periodsPerYear: meta.periodsPerYear,
    maxPeriods: Math.max(termMonths * 4, 2000),
    dueDate,
    periodicExtra,
    periodicStartDate,
    lumpSum,
    lumpSumDate,
  });
  if (!withRun) return null;
  const withPayoff = addPeriodsIso(
    dueDate,
    Math.max(0, withRun.paymentCount - 1),
    meta.periodsPerYear
  );
  if (!withPayoff) return null;
  const withTerm = monthsFromPaymentCount(
    withRun.paymentCount,
    meta.periodsPerYear
  );

  const saved = subtractTerms(
    originalTerm.years,
    originalTerm.months,
    withTerm.years,
    withTerm.months
  );

  return {
    currency,
    monthlyPayment,
    original: {
      ...originalRun,
      payoffDate: originalPayoff,
      termYears: originalTerm.years,
      termMonths: originalTerm.months,
      freqLabel: 'Monthly',
    },
    withExtra: {
      ...withRun,
      payoffDate: withPayoff,
      termYears: withTerm.years,
      termMonths: withTerm.months,
      freqLabel: meta.freqLabel,
      periodsPerYear: meta.periodsPerYear,
    },
    termSavedYears: saved.years,
    termSavedMonths: saved.months,
    interestDifference: withRun.totalInterest - originalRun.totalInterest,
    totalPaymentDifference:
      withRun.totalOfPayments - originalRun.totalOfPayments,
    paymentDifference: withRun.periodicPayment - originalRun.periodicPayment,
  };
}
