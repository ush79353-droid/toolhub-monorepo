/**
 * SIP Calculator + Lumpsum — compound growth of an initial lump sum plus the
 * future value of a level SIP annuity (begin or end), with matched rate/period
 * conversions from nominal annual return and compounding frequency.
 *
 * FV = PV·(1+i)^n + PMT · annuityFactor(i, n, timing)
 * i = (1 + r/m)^(m/k) − 1   (continuous: e^(r/k) − 1)
 *
 * Screenshot check: PV 1,000 · 10% · 10y · monthly compound · PMT 0 → ≈ 2,707.04
 */

import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  type CompoundFrequency,
  type DepositFrequency,
  type DepositTiming,
  type SipLumpsumScheduleRow,
  type SipLumpsumSolveFor,
  type TermUnit,
} from './types';

const RATE_EPS = 1e-12;
const MAX_TERM_YEARS = 100;
const MAX_SCHEDULE_ROWS = 600;

export function compoundPeriodsPerYear(
  compounding: CompoundFrequency
): number | null {
  const row = COMPOUNDING_OPTIONS.find((o) => o.value === compounding);
  return row ? row.periodsPerYear : null;
}

export function depositPeriodsPerYear(frequency: DepositFrequency): number {
  const row = DEPOSIT_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return row ? row.periodsPerYear : 12;
}

export function termToYears(value: number, unit: TermUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return unit === 'mos' ? value / 12 : value;
}

/**
 * Effective interest rate per deposit period from nominal annual rate r
 * (as a decimal) compounded `m` times per year, with `k` deposits per year.
 */
export function periodicRate(
  annualRateDecimal: number,
  compounding: CompoundFrequency,
  depositFreqPerYear: number
): number | null {
  if (![annualRateDecimal, depositFreqPerYear].every(Number.isFinite)) {
    return null;
  }
  if (!(depositFreqPerYear > 0)) return null;
  if (compounding === 'continuously') {
    const i = Math.exp(annualRateDecimal / depositFreqPerYear) - 1;
    return Number.isFinite(i) ? i : null;
  }
  const m = compoundPeriodsPerYear(compounding);
  if (m == null || !(m > 0)) return null;
  if (annualRateDecimal === 0) return 0;
  const base = 1 + annualRateDecimal / m;
  if (!(base > 0)) return null;
  const i = Math.pow(base, m / depositFreqPerYear) - 1;
  return Number.isFinite(i) ? i : null;
}

/** Ordinary (end) or due (beginning) level-annuity FV factor for unit PMT. */
export function annuityFvFactor(
  periodicRateValue: number,
  periods: number,
  timing: DepositTiming
): number | null {
  if (![periodicRateValue, periods].every(Number.isFinite)) return null;
  if (!(periods > 0) || !Number.isInteger(periods)) return null;
  if (periodicRateValue <= -1) return null;

  let ordinary: number;
  if (Math.abs(periodicRateValue) < RATE_EPS) {
    ordinary = periods;
  } else {
    ordinary =
      (Math.pow(1 + periodicRateValue, periods) - 1) / periodicRateValue;
  }
  if (!Number.isFinite(ordinary)) return null;
  const factor =
    timing === 'beginning' ? ordinary * (1 + periodicRateValue) : ordinary;
  return Number.isFinite(factor) ? factor : null;
}

export function futureValueCombined(input: {
  pv: number;
  pmt: number;
  periodicRate: number;
  periods: number;
  timing: DepositTiming;
}): number | null {
  const { pv, pmt, periodicRate: i, periods: n, timing } = input;
  if (![pv, pmt, i, n].every(Number.isFinite)) return null;
  if (pv < 0 || n < 0 || !Number.isInteger(n)) return null;
  if (n === 0) return pv;
  if (i <= -1) return null;

  const growth = Math.pow(1 + i, n);
  if (!Number.isFinite(growth)) return null;
  const lumpsumFv = pv * growth;
  if (pmt === 0) {
    return Number.isFinite(lumpsumFv) ? lumpsumFv : null;
  }
  const factor = annuityFvFactor(i, n, timing);
  if (factor === null) return null;
  const fv = lumpsumFv + pmt * factor;
  return Number.isFinite(fv) ? fv : null;
}

export function solveDeposit(input: {
  targetFv: number;
  pv: number;
  periodicRate: number;
  periods: number;
  timing: DepositTiming;
}): number | null {
  const { targetFv, pv, periodicRate: i, periods: n, timing } = input;
  if (![targetFv, pv, i, n].every(Number.isFinite)) return null;
  if (n <= 0 || !Number.isInteger(n) || i <= -1) return null;
  const growth = Math.pow(1 + i, n);
  if (!Number.isFinite(growth)) return null;
  const factor = annuityFvFactor(i, n, timing);
  if (factor === null || Math.abs(factor) < RATE_EPS) return null;
  const pmt = (targetFv - pv * growth) / factor;
  return Number.isFinite(pmt) ? pmt : null;
}

export function solveLumpsum(input: {
  targetFv: number;
  pmt: number;
  periodicRate: number;
  periods: number;
  timing: DepositTiming;
}): number | null {
  const { targetFv, pmt, periodicRate: i, periods: n, timing } = input;
  if (![targetFv, pmt, i, n].every(Number.isFinite)) return null;
  if (n <= 0 || !Number.isInteger(n) || i <= -1) return null;
  const growth = Math.pow(1 + i, n);
  if (!Number.isFinite(growth) || Math.abs(growth) < RATE_EPS) return null;
  let annuityPart = 0;
  if (pmt !== 0) {
    const factor = annuityFvFactor(i, n, timing);
    if (factor === null) return null;
    annuityPart = pmt * factor;
  }
  const pv = (targetFv - annuityPart) / growth;
  return Number.isFinite(pv) ? pv : null;
}

/** Bisection on annual percent return for a target FV. */
export function solveAnnualReturnPercent(input: {
  targetFv: number;
  pv: number;
  pmt: number;
  periods: number;
  timing: DepositTiming;
  compounding: CompoundFrequency;
  depositFreqPerYear: number;
}): number | null {
  const {
    targetFv,
    pv,
    pmt,
    periods: n,
    timing,
    compounding,
    depositFreqPerYear: k,
  } = input;
  if (![targetFv, pv, pmt, n, k].every(Number.isFinite)) return null;
  if (n <= 0 || !(k > 0)) return null;
  if (pv < 0) return null;

  const fvAt = (annualPercent: number): number | null => {
    const i = periodicRate(annualPercent / 100, compounding, k);
    if (i === null) return null;
    return futureValueCombined({ pv, pmt, periodicRate: i, periods: n, timing });
  };

  const atZero = fvAt(0);
  if (atZero === null) return null;
  // Need growth beyond zero-rate FV, or allow negative rates when target is lower.
  let lo = -99.999;
  let hi = 500;
  const fLo = fvAt(lo);
  const fHi = fvAt(hi);
  if (fLo === null || fHi === null) return null;
  if ((targetFv - fLo) * (targetFv - fHi) > 0) {
    // Expand high bound once for aggressive targets
    hi = 2000;
    const fHi2 = fvAt(hi);
    if (fHi2 === null || (targetFv - fLo) * (targetFv - fHi2) > 0) return null;
  }

  for (let iter = 0; iter < 80; iter += 1) {
    const mid = (lo + hi) / 2;
    const fMid = fvAt(mid);
    if (fMid === null) return null;
    if (Math.abs(fMid - targetFv) < 1e-7) return mid;
    if (fMid < targetFv) lo = mid;
    else hi = mid;
  }
  const result = (lo + hi) / 2;
  return Number.isFinite(result) ? result : null;
}

/** Bisection on whole deposit periods for a target FV; returns years. */
export function solveTermYears(input: {
  targetFv: number;
  pv: number;
  pmt: number;
  annualReturnPercent: number;
  timing: DepositTiming;
  compounding: CompoundFrequency;
  depositFreqPerYear: number;
}): number | null {
  const {
    targetFv,
    pv,
    pmt,
    annualReturnPercent,
    timing,
    compounding,
    depositFreqPerYear: k,
  } = input;
  if (![targetFv, pv, pmt, annualReturnPercent, k].every(Number.isFinite)) {
    return null;
  }
  if (!(k > 0) || pv < 0) return null;

  const i = periodicRate(annualReturnPercent / 100, compounding, k);
  if (i === null || i <= -1) return null;

  if (Math.abs(targetFv - pv) < 1e-9 && pmt === 0) return 0;

  const maxN = Math.floor(MAX_TERM_YEARS * k);
  const fvAtN = (n: number): number | null => {
    if (n === 0) return pv;
    return futureValueCombined({
      pv,
      pmt,
      periodicRate: i,
      periods: n,
      timing,
    });
  };

  const fMax = fvAtN(maxN);
  if (fMax === null) return null;
  if (targetFv > fMax + 1e-6 && (i > 0 || pmt > 0)) {
    // May still be unreachable with negative rates / withdrawals
  }
  if ((i <= 0 && pmt <= 0 && targetFv > pv) || fMax < targetFv - 1e-6) {
    return null;
  }

  let lo = 0;
  let hi = maxN;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const fMid = fvAtN(mid);
    if (fMid === null) return null;
    if (fMid < targetFv) lo = mid + 1;
    else hi = mid;
  }
  const n = lo;
  const fN = fvAtN(n);
  if (fN === null || fN < targetFv - 1e-4) return null;
  return n / k;
}

export function addYearsToDate(isoDate: string, years: number): Date | null {
  const start = parseIsoDate(isoDate);
  if (!start) return null;
  if (!(years >= 0) || !Number.isFinite(years)) return null;
  const wholeYears = Math.floor(years);
  const frac = years - wholeYears;
  const end = new Date(start.getTime());
  end.setFullYear(end.getFullYear() + wholeYears);
  if (frac > 0) {
    end.setTime(end.getTime() + frac * 365.25 * 24 * 60 * 60 * 1000);
  }
  return Number.isFinite(end.getTime()) ? end : null;
}

export function parseIsoDate(raw: string): Date | null {
  const t = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [ys, ms, ds] = t.split('-').map(Number);
  if (!ys || !ms || !ds) return null;
  const d = new Date(Date.UTC(ys, ms - 1, ds));
  if (
    d.getUTCFullYear() !== ys ||
    d.getUTCMonth() !== ms - 1 ||
    d.getUTCDate() !== ds
  ) {
    return null;
  }
  return d;
}

export function formatEndDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function buildSchedule(input: {
  pv: number;
  pmt: number;
  i: number;
  n: number;
  timing: DepositTiming;
  start: Date;
  depositFreqPerYear: number;
}): SipLumpsumScheduleRow[] {
  const { pv, pmt, i, n, timing, start, depositFreqPerYear: k } = input;
  const rows: SipLumpsumScheduleRow[] = [];
  const limit = Math.min(n, MAX_SCHEDULE_ROWS);
  let balance = pv;
  const msPerPeriod = (365.25 * 24 * 60 * 60 * 1000) / k;

  for (let p = 1; p <= limit; p += 1) {
    let deposit = 0;
    let interest = 0;
    if (timing === 'beginning') {
      deposit = pmt;
      balance += deposit;
      interest = balance * i;
      balance += interest;
    } else {
      interest = balance * i;
      balance += interest;
      deposit = pmt;
      balance += deposit;
    }
    const when = new Date(start.getTime() + p * msPerPeriod);
    rows.push({
      period: p,
      dateLabel: formatEndDateLabel(when),
      deposit,
      balance,
      interest,
    });
  }
  return rows;
}

export function roundMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): number {
  const digits = getCurrencyFractionDigits(currency);
  const s = 10 ** digits;
  return Math.round(amount * s) / s;
}

export function formatSipLumpsumMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMoneyWithCode(
  amount: number,
  currency: SupportedCurrency
): string {
  return `${getCurrencySymbol(currency)}${formatSipLumpsumMoney(amount, currency)}`;
}

export interface SipLumpsumMathInput {
  solveFor: SipLumpsumSolveFor;
  currency: SupportedCurrency;
  pv: number;
  annualReturnPercent: number;
  termYears: number;
  startDateIso: string;
  inflationPercent: number;
  compounding: CompoundFrequency;
  pmt: number;
  depositFrequency: DepositFrequency;
  timing: DepositTiming;
  targetFv: number;
}

export interface SipLumpsumMathResult {
  openingBalance: number;
  finalBalance: number;
  realFinalBalance: number | null;
  periodicDeposit: number;
  totalDeposits: number;
  totalReturn: number;
  annualReturnPercent: number;
  termYears: number;
  depositPeriods: number;
  compoundPeriods: number;
  numberOfTransactions: number;
  endDate: Date;
  inflationPercent: number;
  schedule: SipLumpsumScheduleRow[];
}

export function calculateSipLumpsum(
  input: SipLumpsumMathInput
): SipLumpsumMathResult | null {
  const {
    solveFor,
    currency: _currency,
    startDateIso,
    inflationPercent,
    compounding,
    depositFrequency,
    timing,
  } = input;
  void _currency;

  const k = depositPeriodsPerYear(depositFrequency);
  const start = parseIsoDate(startDateIso);
  if (!start) return null;
  if (!(inflationPercent >= 0) || !Number.isFinite(inflationPercent)) {
    return null;
  }

  let pv = input.pv;
  let pmt = input.pmt;
  let annualReturnPercent = input.annualReturnPercent;
  let termYears = input.termYears;
  const targetFv = input.targetFv;

  if (solveFor === 'finalBalance') {
    if (!(pv >= 0) || !Number.isFinite(pv)) return null;
    if (!Number.isFinite(pmt)) return null;
    if (!(termYears > 0) || termYears > MAX_TERM_YEARS) return null;
    if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -99.999) {
      return null;
    }
  } else if (solveFor === 'deposit') {
    if (!(pv >= 0) || !Number.isFinite(pv)) return null;
    if (!(termYears > 0) || termYears > MAX_TERM_YEARS) return null;
    if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -99.999) {
      return null;
    }
    if (!Number.isFinite(targetFv)) return null;
  } else if (solveFor === 'lumpsum') {
    if (!Number.isFinite(pmt)) return null;
    if (!(termYears > 0) || termYears > MAX_TERM_YEARS) return null;
    if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -99.999) {
      return null;
    }
    if (!Number.isFinite(targetFv)) return null;
  } else if (solveFor === 'return') {
    if (!(pv >= 0) || !Number.isFinite(pv)) return null;
    if (!Number.isFinite(pmt)) return null;
    if (!(termYears > 0) || termYears > MAX_TERM_YEARS) return null;
    if (!Number.isFinite(targetFv)) return null;
  } else if (solveFor === 'term') {
    if (!(pv >= 0) || !Number.isFinite(pv)) return null;
    if (!Number.isFinite(pmt)) return null;
    if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -99.999) {
      return null;
    }
    if (!Number.isFinite(targetFv)) return null;
  }

  if (solveFor === 'return') {
    const nGuess = Math.max(1, Math.round(termYears * k));
    const solved = solveAnnualReturnPercent({
      targetFv,
      pv,
      pmt,
      periods: nGuess,
      timing,
      compounding,
      depositFreqPerYear: k,
    });
    if (solved === null) return null;
    annualReturnPercent = solved;
  }

  if (solveFor === 'term') {
    const solvedYears = solveTermYears({
      targetFv,
      pv,
      pmt,
      annualReturnPercent,
      timing,
      compounding,
      depositFreqPerYear: k,
    });
    if (solvedYears === null) return null;
    termYears = solvedYears;
  }

  const n = Math.round(termYears * k);
  if (solveFor !== 'term' && (!(n > 0) || n > MAX_TERM_YEARS * k)) return null;
  if (solveFor === 'term' && n < 0) return null;

  const i = periodicRate(annualReturnPercent / 100, compounding, k);
  if (i === null || i <= -1) return null;

  if (solveFor === 'deposit') {
    const solved = solveDeposit({
      targetFv,
      pv,
      periodicRate: i,
      periods: Math.max(n, 1),
      timing,
    });
    if (solved === null) return null;
    pmt = solved;
  }

  if (solveFor === 'lumpsum') {
    const solved = solveLumpsum({
      targetFv,
      pmt,
      periodicRate: i,
      periods: Math.max(n, 1),
      timing,
    });
    if (solved === null) return null;
    pv = solved;
  }

  const periods = Math.max(n, 0);
  const finalBalance =
    periods === 0
      ? pv
      : futureValueCombined({
          pv,
          pmt,
          periodicRate: i,
          periods,
          timing,
        });
  if (finalBalance === null) return null;

  const totalDeposits = pmt * periods;
  const totalReturn = finalBalance - pv - totalDeposits;
  if (!Number.isFinite(totalReturn)) return null;

  let realFinalBalance: number | null = null;
  if (inflationPercent > 0 && termYears > 0) {
    const real =
      finalBalance / Math.pow(1 + inflationPercent / 100, termYears);
    if (!Number.isFinite(real)) return null;
    realFinalBalance = real;
  }

  const m = compoundPeriodsPerYear(compounding);
  const compoundPeriods =
    m == null
      ? periods
      : Math.round(termYears * m);

  const endDate = addYearsToDate(startDateIso, termYears);
  if (!endDate) return null;

  const schedule =
    periods > 0
      ? buildSchedule({
          pv,
          pmt,
          i,
          n: periods,
          timing,
          start,
          depositFreqPerYear: k,
        })
      : [];

  return {
    openingBalance: pv,
    finalBalance,
    realFinalBalance,
    periodicDeposit: pmt,
    totalDeposits,
    totalReturn,
    annualReturnPercent,
    termYears,
    depositPeriods: periods,
    compoundPeriods,
    numberOfTransactions: periods > 0 ? periods : Math.max(compoundPeriods, 0),
    endDate,
    inflationPercent,
    schedule,
  };
}
