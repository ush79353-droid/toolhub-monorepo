import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  type CompoundingFrequency,
  type FinanceChartPoint,
  type FinanceInput,
  type FinanceMode,
  type FinanceResult,
  type FinanceScheduleRow,
  type PaymentFrequency,
  type PaymentTiming,
} from './types';

const RATE_TOL = 1e-12;
const RESIDUAL_TOL = 1e-8;
const MAX_SCHEDULE_ROWS = 600;

export function paymentsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 1
  );
}

export function compoundingPerYear(frequency: CompoundingFrequency): number | null {
  return (
    COMPOUNDING_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ??
    null
  );
}

/**
 * Equivalent interest rate per payment period from nominal annual I/Y %.
 * Discrete: (1 + i/m)^(m/q) − 1
 * Continuous: exp(i/q) − 1
 */
export function periodRateFromAnnual(
  annualPercent: number,
  compounding: CompoundingFrequency,
  paymentFrequency: PaymentFrequency,
): number | null {
  if (!Number.isFinite(annualPercent)) return null;
  const q = paymentsPerYear(paymentFrequency);
  if (!(q > 0)) return null;
  const i = annualPercent / 100;
  if (annualPercent === 0) return 0;
  if (compounding === 'continuously') {
    const r = Math.exp(i / q) - 1;
    return Number.isFinite(r) ? r : null;
  }
  const m = compoundingPerYear(compounding);
  if (m === null || !(m > 0)) return null;
  const base = 1 + i / m;
  if (!(base > 0)) return null;
  const r = Math.pow(base, m / q) - 1;
  return Number.isFinite(r) ? r : null;
}

/** Annuity factor type: 0 end-of-period, 1 beginning-of-period. */
export function timingFactor(timing: PaymentTiming): 0 | 1 {
  return timing === 'beginning' ? 1 : 0;
}

/**
 * TVM residual: PV(1+r)^n + PMT(1+r·type)·[((1+r)^n−1)/r] + FV
 * Must equal 0 when all five are consistent.
 */
export function tvmResidual(
  pv: number,
  pmt: number,
  fv: number,
  r: number,
  n: number,
  timing: PaymentTiming,
): number | null {
  if (![pv, pmt, fv, r, n].every(Number.isFinite)) return null;
  if (!(n >= 0)) return null;
  const type = timingFactor(timing);
  if (Math.abs(r) < RATE_TOL) {
    return pv + pmt * n + fv;
  }
  if (r <= -1) return null;
  const growth = Math.pow(1 + r, n);
  if (!Number.isFinite(growth)) return null;
  const annuity = (((growth - 1) / r) * (1 + r * type));
  if (!Number.isFinite(annuity)) return null;
  const residual = pv * growth + pmt * annuity + fv;
  return Number.isFinite(residual) ? residual : null;
}

export function calculateFutureValue(
  pv: number,
  pmt: number,
  r: number,
  n: number,
  timing: PaymentTiming,
): number | null {
  if (![pv, pmt, r, n].every(Number.isFinite) || !(n >= 0)) return null;
  const type = timingFactor(timing);
  if (Math.abs(r) < RATE_TOL) {
    return -(pv + pmt * n);
  }
  if (r <= -1) return null;
  const growth = Math.pow(1 + r, n);
  if (!Number.isFinite(growth)) return null;
  const annuity = ((growth - 1) / r) * (1 + r * type);
  const fv = -(pv * growth + pmt * annuity);
  return Number.isFinite(fv) ? fv : null;
}

export function calculatePresentValue(
  fv: number,
  pmt: number,
  r: number,
  n: number,
  timing: PaymentTiming,
): number | null {
  if (![fv, pmt, r, n].every(Number.isFinite) || !(n >= 0)) return null;
  const type = timingFactor(timing);
  if (Math.abs(r) < RATE_TOL) {
    return -(fv + pmt * n);
  }
  if (r <= -1) return null;
  const growth = Math.pow(1 + r, n);
  if (!(growth > 0) || !Number.isFinite(growth)) return null;
  const annuity = ((1 - Math.pow(1 + r, -n)) / r) * (1 + r * type);
  const pv = -(fv / growth + pmt * annuity);
  return Number.isFinite(pv) ? pv : null;
}

export function calculatePayment(
  pv: number,
  fv: number,
  r: number,
  n: number,
  timing: PaymentTiming,
): number | null {
  if (![pv, fv, r, n].every(Number.isFinite) || !(n > 0)) return null;
  const type = timingFactor(timing);
  if (Math.abs(r) < RATE_TOL) {
    return -((pv + fv) / n);
  }
  if (r <= -1) return null;
  const growth = Math.pow(1 + r, n);
  if (!Number.isFinite(growth)) return null;
  const denom = ((growth - 1) / r) * (1 + r * type);
  if (!Number.isFinite(denom) || Math.abs(denom) < 1e-15) return null;
  const pmt = -((pv * growth + fv) / denom);
  return Number.isFinite(pmt) ? pmt : null;
}

export function calculateNumberOfPeriods(
  pv: number,
  pmt: number,
  fv: number,
  r: number,
  timing: PaymentTiming,
): number | null {
  if (![pv, pmt, fv, r].every(Number.isFinite)) return null;
  const type = timingFactor(timing);

  if (Math.abs(r) < RATE_TOL) {
    if (Math.abs(pmt) < 1e-15) return null;
    const n = -(pv + fv) / pmt;
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  if (r <= -1) return null;

  // Closed form for ordinary / due annuity when denom is valid.
  // n = ln( (PMT·(1+r·type) − FV·r) / (PMT·(1+r·type) + PV·r) ) / ln(1+r)
  const adj = 1 + r * type;
  const num = pmt * adj - fv * r;
  const den = pmt * adj + pv * r;
  if (Math.abs(den) < 1e-15) return null;
  const ratio = num / den;
  if (!(ratio > 0)) return null;
  const n = Math.log(ratio) / Math.log(1 + r);
  if (!Number.isFinite(n) || n < 0) return null;

  // Verify residual; fall back to bisection if closed form is off.
  const check = tvmResidual(pv, pmt, fv, r, n, timing);
  if (check !== null && Math.abs(check) < 1e-4) return n;

  return solvePeriodsNumerically(pv, pmt, fv, r, timing);
}

function solvePeriodsNumerically(
  pv: number,
  pmt: number,
  fv: number,
  r: number,
  timing: PaymentTiming,
): number | null {
  const f = (n: number) => tvmResidual(pv, pmt, fv, r, n, timing);
  let lo = 0;
  let hi = 1;
  let fLo = f(lo);
  let fHi = f(hi);
  let guard = 0;
  while (
    fLo !== null &&
    fHi !== null &&
    fLo * fHi > 0 &&
    hi < 1_000_000 &&
    guard < 40
  ) {
    hi *= 2;
    fHi = f(hi);
    guard += 1;
  }
  fLo = f(lo);
  fHi = f(hi);
  if (fLo === null || fHi === null || fLo * fHi > 0) return null;

  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === null) return null;
    if (Math.abs(fm) < RESIDUAL_TOL) return mid;
    if (fLo * fm <= 0) {
      hi = mid;
      fHi = fm;
    } else {
      lo = mid;
      fLo = fm;
    }
  }
  const n = (lo + hi) / 2;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Solve annual I/Y % so TVM residual is zero.
 * Returns percent (not decimal). Uses Newton with bisection fallback.
 */
export function calculateInterestRatePercent(
  pv: number,
  pmt: number,
  fv: number,
  n: number,
  timing: PaymentTiming,
  compounding: CompoundingFrequency,
  paymentFrequency: PaymentFrequency,
): number | null {
  if (![pv, pmt, fv, n].every(Number.isFinite) || !(n > 0)) return null;

  const residualAtAnnual = (annualPercent: number): number | null => {
    const r = periodRateFromAnnual(annualPercent, compounding, paymentFrequency);
    if (r === null) return null;
    return tvmResidual(pv, pmt, fv, r, n, timing);
  };

  // Zero-rate check
  const at0 = residualAtAnnual(0);
  if (at0 !== null && Math.abs(at0) < RESIDUAL_TOL) return 0;

  // Try Newton on annual percent with finite differences
  let guess = 6;
  for (let iter = 0; iter < 40; iter += 1) {
    const f0 = residualAtAnnual(guess);
    if (f0 === null) break;
    if (Math.abs(f0) < RESIDUAL_TOL) {
      return Number.isFinite(guess) ? guess : null;
    }
    const h = Math.max(1e-6, Math.abs(guess) * 1e-6);
    const f1 = residualAtAnnual(guess + h);
    if (f1 === null) break;
    const deriv = (f1 - f0) / h;
    if (Math.abs(deriv) < 1e-18) break;
    const next = guess - f0 / deriv;
    if (!Number.isFinite(next) || next < -99.999 || next > 1_000_000) break;
    if (Math.abs(next - guess) < 1e-10) return next;
    guess = next;
  }

  // Bisection over a widening bracket
  let lo = -99;
  let hi = 100;
  let fLo = residualAtAnnual(lo);
  let fHi = residualAtAnnual(hi);
  let expand = 0;
  while (
    fLo !== null &&
    fHi !== null &&
    fLo * fHi > 0 &&
    hi < 1_000_000 &&
    expand < 30
  ) {
    hi *= 2;
    fHi = residualAtAnnual(hi);
    expand += 1;
  }
  fLo = residualAtAnnual(lo);
  fHi = residualAtAnnual(hi);
  if (fLo === null || fHi === null || fLo * fHi > 0) {
    // Try positive-only bracket if cash flows suggest growth
    lo = 0;
    hi = 100;
    fLo = residualAtAnnual(lo);
    fHi = residualAtAnnual(hi);
    expand = 0;
    while (
      fLo !== null &&
      fHi !== null &&
      fLo * fHi > 0 &&
      hi < 1_000_000 &&
      expand < 30
    ) {
      hi *= 2;
      fHi = residualAtAnnual(hi);
      expand += 1;
    }
    fLo = residualAtAnnual(lo);
    fHi = residualAtAnnual(hi);
    if (fLo === null || fHi === null || fLo * fHi > 0) return null;
  }

  for (let i = 0; i < 100; i += 1) {
    const mid = (lo + hi) / 2;
    const fm = residualAtAnnual(mid);
    if (fm === null) return null;
    if (Math.abs(fm) < RESIDUAL_TOL) return mid;
    if (fLo! * fm <= 0) {
      hi = mid;
      fHi = fm;
    } else {
      lo = mid;
      fLo = fm;
    }
  }
  const rate = (lo + hi) / 2;
  return Number.isFinite(rate) ? rate : null;
}

export function generateSchedule(input: {
  pv: number;
  pmt: number;
  r: number;
  n: number;
  timing: PaymentTiming;
}): FinanceScheduleRow[] {
  const { pv, pmt, r, timing } = input;
  const periods = Math.max(0, Math.min(MAX_SCHEDULE_ROWS, Math.ceil(input.n)));
  if (!(periods > 0) || !Number.isFinite(pv) || !Number.isFinite(pmt) || !Number.isFinite(r)) {
    return [];
  }

  const rows: FinanceScheduleRow[] = [];
  let balance = pv;
  const type = timingFactor(timing);

  for (let period = 1; period <= periods; period += 1) {
    const opening = balance;
    let interest: number;
    let ending: number;
    if (type === 1) {
      // Beginning: payment first, then interest on (opening + payment)
      const afterPmt = opening + pmt;
      interest = afterPmt * r;
      ending = afterPmt + interest;
    } else {
      interest = opening * r;
      ending = opening + interest + pmt;
    }
    if (![interest, ending].every(Number.isFinite)) break;
    rows.push({
      period,
      openingBalance: opening,
      payment: pmt,
      interest,
      endingBalance: ending,
    });
    balance = ending;
  }
  return rows;
}

export function generateChartPoints(
  schedule: FinanceScheduleRow[],
  pv: number,
): FinanceChartPoint[] {
  const points: FinanceChartPoint[] = [
    { period: 0, balance: pv, sumOfPmt: 0, accumulatedInterest: 0 },
  ];
  let sumPmt = 0;
  let sumInterest = 0;
  for (const row of schedule) {
    sumPmt += row.payment;
    sumInterest += row.interest;
    points.push({
      period: row.period,
      balance: row.endingBalance,
      sumOfPmt: sumPmt,
      accumulatedInterest: sumInterest,
    });
  }
  return points;
}

export function formatFinanceMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(abs);
  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatFinancePercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(percent);
}

export function formatFinancePeriods(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(n);
}

function modeLabel(mode: FinanceMode): string {
  switch (mode) {
    case 'FV':
      return 'FV';
    case 'PMT':
      return 'PMT';
    case 'IY':
      return 'I/Y';
    case 'N':
      return 'N';
    case 'PV':
      return 'PV';
  }
}

export function buildSummaryText(result: {
  mode: FinanceMode;
  calculatedValue: number;
  currency: SupportedCurrency;
}): string {
  const symbol = getCurrencySymbol(result.currency);
  switch (result.mode) {
    case 'FV':
      return `Based on the values provided, the calculated future value is ${symbol}${formatFinanceMoney(result.calculatedValue, result.currency)}.`;
    case 'PMT':
      return `Based on the values provided, the calculated periodic payment is ${symbol}${formatFinanceMoney(result.calculatedValue, result.currency)}.`;
    case 'IY':
      return `Based on the values provided, the calculated interest rate is ${formatFinancePercent(result.calculatedValue)}% per year.`;
    case 'N':
      return `Based on the values provided, the calculated number of periods is ${formatFinancePeriods(result.calculatedValue)}.`;
    case 'PV':
      return `Based on the values provided, the calculated present value is ${symbol}${formatFinanceMoney(result.calculatedValue, result.currency)}.`;
  }
}

export function shareFinanceText(result: FinanceResult): string {
  const symbol = getCurrencySymbol(result.currency);
  const money = (v: number) => `${symbol}${formatFinanceMoney(v, result.currency)}`;
  return [
    `Finance Calculator (${modeLabel(result.mode)})`,
    `N: ${formatFinancePeriods(result.n)}`,
    `I/Y: ${formatFinancePercent(result.iy)}%`,
    `PV: ${money(result.pv)}`,
    `PMT: ${money(result.pmt)}`,
    `FV: ${money(result.fv)}`,
    `Total payments: ${money(result.totalPayments)}`,
    `Total interest: ${money(result.totalInterest)}`,
    `Payment frequency: ${result.paymentFrequency}`,
    `Payment timing: ${result.paymentTiming}`,
    result.summaryText,
  ].join('\n');
}

export interface FinanceEngineValues {
  mode: FinanceMode;
  n: number;
  iy: number;
  pv: number;
  pmt: number;
  fv: number;
  paymentFrequency: PaymentFrequency;
  compoundingFrequency: CompoundingFrequency;
  paymentTiming: PaymentTiming;
  currency: SupportedCurrency;
}

/**
 * Solve the selected TVM variable and build schedule/chart.
 */
export function calculateFinance(values: FinanceEngineValues): FinanceResult | null {
  const {
    mode,
    paymentFrequency,
    compoundingFrequency,
    paymentTiming,
    currency,
  } = values;

  let { n, iy, pv, pmt, fv } = values;
  let calculatedValue: number;

  if (mode === 'FV') {
    const r = periodRateFromAnnual(iy, compoundingFrequency, paymentFrequency);
    if (r === null) return null;
    const solved = calculateFutureValue(pv, pmt, r, n, paymentTiming);
    if (solved === null) return null;
    fv = solved;
    calculatedValue = solved;
  } else if (mode === 'PV') {
    const r = periodRateFromAnnual(iy, compoundingFrequency, paymentFrequency);
    if (r === null) return null;
    const solved = calculatePresentValue(fv, pmt, r, n, paymentTiming);
    if (solved === null) return null;
    pv = solved;
    calculatedValue = solved;
  } else if (mode === 'PMT') {
    const r = periodRateFromAnnual(iy, compoundingFrequency, paymentFrequency);
    if (r === null) return null;
    const solved = calculatePayment(pv, fv, r, n, paymentTiming);
    if (solved === null) return null;
    pmt = solved;
    calculatedValue = solved;
  } else if (mode === 'N') {
    const r = periodRateFromAnnual(iy, compoundingFrequency, paymentFrequency);
    if (r === null) return null;
    const solved = calculateNumberOfPeriods(pv, pmt, fv, r, paymentTiming);
    if (solved === null) return null;
    n = solved;
    calculatedValue = solved;
  } else {
    const solved = calculateInterestRatePercent(
      pv,
      pmt,
      fv,
      n,
      paymentTiming,
      compoundingFrequency,
      paymentFrequency,
    );
    if (solved === null) return null;
    iy = solved;
    calculatedValue = solved;
  }

  const r = periodRateFromAnnual(iy, compoundingFrequency, paymentFrequency);
  if (r === null) return null;

  const schedule = generateSchedule({
    pv,
    pmt,
    r,
    n,
    timing: paymentTiming,
  });
  const chartPoints = generateChartPoints(schedule, pv);
  const totalPayments = pmt * n;
  // Interest ≈ ending − starting − sum of payments (cash-flow identity)
  const totalInterest = fv - pv - totalPayments;

  const result: FinanceResult = {
    mode,
    n,
    iy,
    pv,
    pmt,
    fv,
    calculatedValue,
    totalPayments,
    totalInterest,
    paymentFrequency,
    compoundingFrequency,
    paymentTiming,
    currency,
    periodRate: r,
    schedule,
    chartPoints,
    summaryText: '',
  };
  result.summaryText = buildSummaryText(result);
  return result;
}

/** Parse optional signed money/number string. Empty → null. */
export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function isInputBlank(input: FinanceInput): boolean {
  const fieldsByMode: Record<FinanceMode, (keyof FinanceInput)[]> = {
    FV: ['n', 'iy', 'pv', 'pmt'],
    PMT: ['n', 'iy', 'pv', 'fv'],
    IY: ['n', 'pv', 'pmt', 'fv'],
    N: ['iy', 'pv', 'pmt', 'fv'],
    PV: ['n', 'iy', 'pmt', 'fv'],
  };
  return fieldsByMode[input.mode].every((key) => String(input[key]).trim() === '');
}
