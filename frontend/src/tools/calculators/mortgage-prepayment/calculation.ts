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
import type { ChartPoint, ScheduleSummary } from './types';

export function formatMortgagePrepaymentMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatTermYearsMonths(years: number, months: number): string {
  const y = Math.max(0, years);
  const m = Math.max(0, months);
  if (y === 0 && m === 0) return '0 years 0 months';
  if (y === 0) return `0 years ${m} months`;
  if (m === 0) return `${y} years 0 months`;
  return `${y} years ${m} months`;
}

export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

export function termToPeriods(
  term: number,
  unit: TermUnit,
  periodsPerYear: number
): number | null {
  if (!(term > 0) || !Number.isFinite(term)) return null;
  const years = unit === 'yrs' ? term : term / 12;
  const periods = Math.round(years * periodsPerYear);
  return periods > 0 ? periods : null;
}

function usUkPeriodRate(annualRatePercent: number, periodsPerYear: number): number {
  return annualRatePercent / (100 * periodsPerYear);
}

function canadianPeriodRate(
  annualRatePercent: number,
  periodsPerYear: number
): number {
  const semi = annualRatePercent / 200;
  return Math.pow(1 + semi, 2 / periodsPerYear) - 1;
}

export function periodRate(
  annualRatePercent: number,
  method: InterestMethod,
  periodsPerYear: number
): number {
  return method === 'semi_annual_canada'
    ? canadianPeriodRate(annualRatePercent, periodsPerYear)
    : usUkPeriodRate(annualRatePercent, periodsPerYear);
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

export function addPeriodsIso(
  isoDate: string,
  periods: number,
  periodsPerYear: number
): string | null {
  if (periodsPerYear === 12) return addMonthsIso(isoDate, periods);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const dayStep = 365.25 / periodsPerYear;
  utc.setUTCDate(utc.getUTCDate() + Math.round(periods * dayStep));
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function compareIso(a: string, b: string): number {
  return a.localeCompare(b);
}

function frequencyMeta(frequency: PaymentFrequency) {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency) ??
    PAYMENT_FREQUENCY_OPTIONS[0]!
  );
}

function monthsFromPaymentCount(
  paymentCount: number,
  periodsPerYear: number
): { years: number; months: number } {
  const totalMonths = Math.round((paymentCount * 12) / periodsPerYear);
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
}

interface RawRun {
  paymentCount: number;
  totalInterest: number;
  totalOfPayments: number;
  periodicPayment: number;
  /** End-of-year snapshots for charting (year index from start). */
  annual: { yearIndex: number; balance: number; cumulativeInterest: number }[];
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
  const annual: RawRun['annual'] = [
    { yearIndex: 0, balance: principal, cumulativeInterest: 0 },
  ];

  for (let i = 0; i < maxPeriods && balance > 1e-9; i += 1) {
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
    if (payment >= balance + interest) {
      payment = balance + interest;
    } else if (periodicRate > 0 && payment <= interest + 1e-12 && extra <= 0) {
      return null;
    }

    const principalPortion = payment - interest;
    balance -= principalPortion;
    if (balance < 1e-9) balance = 0;

    totalInterest += interest;
    totalOfPayments += payment;
    paymentCount += 1;

    const yearIndex = Math.ceil((paymentCount * 12) / periodsPerYear);
    const isYearEnd = paymentCount % periodsPerYear === 0;
    const isLast = balance <= 1e-9;
    if (isYearEnd || isLast) {
      const last = annual[annual.length - 1];
      if (last && last.yearIndex === yearIndex) {
        last.balance = balance;
        last.cumulativeInterest = totalInterest;
      } else {
        annual.push({
          yearIndex,
          balance,
          cumulativeInterest: totalInterest,
        });
      }
    }
  }

  if (paymentCount === 0 || balance > 1e-6) return null;

  return {
    paymentCount,
    totalInterest,
    totalOfPayments,
    periodicPayment: scheduledPayment,
    annual,
  };
}

function toSummary(
  run: RawRun,
  dueDate: string,
  periodsPerYear: number,
  adverb: string,
  currency: SupportedCurrency
): ScheduleSummary | null {
  const payoffDate = addPeriodsIso(dueDate, Math.max(0, run.paymentCount - 1), periodsPerYear);
  if (!payoffDate) return null;
  const { years, months } = monthsFromPaymentCount(run.paymentCount, periodsPerYear);
  return {
    payoffDate,
    formattedPayoffDate: formatDisplayDate(payoffDate),
    periodicPayment: run.periodicPayment,
    formattedPeriodicPayment: formatMortgagePrepaymentMoney(
      run.periodicPayment,
      currency
    ),
    paymentAdverb: adverb,
    paymentCount: run.paymentCount,
    termYears: years,
    termMonths: months,
    formattedTerm: formatTermYearsMonths(years, months),
    totalInterest: run.totalInterest,
    formattedTotalInterest: formatMortgagePrepaymentMoney(
      run.totalInterest,
      currency
    ),
    totalPayment: run.totalOfPayments,
    formattedTotalPayment: formatMortgagePrepaymentMoney(
      run.totalOfPayments,
      currency
    ),
  };
}

function buildChart(baseline: RawRun, prepaid: RawRun, startYear: number): ChartPoint[] {
  const yearSet = new Set<number>();
  for (const p of baseline.annual) yearSet.add(p.yearIndex);
  for (const p of prepaid.annual) yearSet.add(p.yearIndex);
  const years = [...yearSet].sort((a, b) => a - b);

  const baselineMap = new Map(baseline.annual.map((p) => [p.yearIndex, p]));
  const prepaidMap = new Map(prepaid.annual.map((p) => [p.yearIndex, p]));

  let lastBase = baseline.annual[0]!;
  let lastPre = prepaid.annual[0]!;

  return years.map((yearIndex) => {
    const b = baselineMap.get(yearIndex) ?? lastBase;
    const p = prepaidMap.get(yearIndex) ?? lastPre;
    lastBase = b;
    lastPre = p;
    return {
      year: startYear + yearIndex,
      remainingBalance: b.balance,
      cumulativeInterest: b.cumulativeInterest,
      prepaidRemainingBalance: p.balance,
      prepaidCumulativeInterest: p.cumulativeInterest,
    };
  });
}

export interface MortgagePrepaymentCanonicalInput {
  mortgageAmount: number;
  annualRatePercent: number;
  termPeriods: number;
  interestMethod: InterestMethod;
  paymentFrequency: PaymentFrequency;
  dueDate: string;
  periodicPrepayment: number;
  periodicStartDate: string;
  lumpSumPrepayment: number;
  lumpSumDate: string;
  currency: SupportedCurrency;
}

export function calculateMortgagePrepayment(
  input: MortgagePrepaymentCanonicalInput
): {
  baseline: ScheduleSummary;
  prepaid: ScheduleSummary | null;
  hasPrepayments: boolean;
  chart: ChartPoint[];
  currency: SupportedCurrency;
} | null {
  const {
    mortgageAmount,
    annualRatePercent,
    termPeriods,
    interestMethod,
    paymentFrequency,
    dueDate,
    periodicPrepayment,
    periodicStartDate,
    lumpSumPrepayment,
    lumpSumDate,
    currency,
  } = input;

  if (
    ![
      mortgageAmount,
      annualRatePercent,
      termPeriods,
      periodicPrepayment,
      lumpSumPrepayment,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(mortgageAmount > 0) || !(termPeriods > 0) || annualRatePercent < 0) {
    return null;
  }
  if (periodicPrepayment < 0 || lumpSumPrepayment < 0) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(periodicStartDate)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lumpSumDate)) return null;

  const meta = frequencyMeta(paymentFrequency);
  const r = periodRate(annualRatePercent, interestMethod, meta.periodsPerYear);
  const scheduled = amortizingPayment(mortgageAmount, r, termPeriods);
  if (scheduled === null || !(scheduled >= 0)) return null;

  const maxPeriods = Math.max(termPeriods * 2, termPeriods + 1);

  const baselineRun = runSchedule({
    principal: mortgageAmount,
    periodicRate: r,
    scheduledPayment: scheduled,
    periodsPerYear: meta.periodsPerYear,
    maxPeriods,
    dueDate,
    periodicExtra: 0,
    periodicStartDate,
    lumpSum: 0,
    lumpSumDate,
  });
  if (!baselineRun) return null;

  const baseline = toSummary(
    baselineRun,
    dueDate,
    meta.periodsPerYear,
    meta.adverb,
    currency
  );
  if (!baseline) return null;

  const hasPrepayments = periodicPrepayment > 0 || lumpSumPrepayment > 0;
  let prepaid: ScheduleSummary | null = null;
  let prepaidRun = baselineRun;

  if (hasPrepayments) {
    const run = runSchedule({
      principal: mortgageAmount,
      periodicRate: r,
      scheduledPayment: scheduled,
      periodsPerYear: meta.periodsPerYear,
      maxPeriods,
      dueDate,
      periodicExtra: periodicPrepayment,
      periodicStartDate,
      lumpSum: lumpSumPrepayment,
      lumpSumDate,
    });
    if (!run) return null;
    prepaidRun = run;
    prepaid = toSummary(
      run,
      dueDate,
      meta.periodsPerYear,
      meta.adverb,
      currency
    );
    if (!prepaid) return null;
  }

  const startYearMatch = /^(\d{4})/.exec(dueDate);
  const startYear = startYearMatch ? Number(startYearMatch[1]) : new Date().getFullYear();

  return {
    baseline,
    prepaid,
    hasPrepayments,
    chart: buildChart(baselineRun, prepaidRun, startYear),
    currency,
  };
}
