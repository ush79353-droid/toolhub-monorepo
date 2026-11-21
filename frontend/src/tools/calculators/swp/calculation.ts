import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  SWP_FREQUENCY_OPTIONS,
  type SwpFrequency,
  type SwpResult,
  type SwpSolveMode,
} from './types';

const RATE_TOL = 1e-12;
const MAX_PERIODS = 1200 * 12;

export interface SwpCanonicalInput {
  mode: SwpSolveMode;
  currency: SupportedCurrency;
  withdrawalAmount: number;
  initialInvestment: number;
  frequency: SwpFrequency;
  durationYears: number;
  annualReturnPercent: number;
  inflationPercent: number;
  firstWithdrawalDate: { y: number; m: number; d: number };
  endBalance: number;
}

export function formatSwpMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function periodsPerYear(frequency: SwpFrequency): number {
  return (
    SWP_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ??
    12
  );
}

/** Nominal period rate i/q (matches Omni SWP screenshot defaults). */
export function nominalPeriodRate(
  annualPercent: number,
  frequency: SwpFrequency
): number | null {
  if (!Number.isFinite(annualPercent)) return null;
  const q = periodsPerYear(frequency);
  if (!(q > 0)) return null;
  return annualPercent / 100 / q;
}

export function periodGrowth(
  annualInflationPercent: number,
  frequency: SwpFrequency
): number | null {
  if (!Number.isFinite(annualInflationPercent)) return null;
  const q = periodsPerYear(frequency);
  if (!(q > 0)) return null;
  if (annualInflationPercent === 0) return 0;
  const g = Math.pow(1 + annualInflationPercent / 100, 1 / q) - 1;
  return Number.isFinite(g) ? g : null;
}

export function parseIsoDate(
  raw: string
): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (![y, m, d].every(Number.isFinite)) return null;
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

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function addCalendarMonths(
  date: { y: number; m: number; d: number },
  delta: number
): { y: number; m: number; d: number } {
  const idx = date.y * 12 + (date.m - 1) + delta;
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  const d = Math.min(date.d, daysInMonth(y, m));
  return { y, m, d };
}

export function formatSwpDate(date: {
  y: number;
  m: number;
  d: number;
}): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(date.y, date.m - 1, date.d)));
}

/** Months between consecutive withdrawals for frequency. */
function monthsPerPeriod(frequency: SwpFrequency): number {
  return 12 / periodsPerYear(frequency);
}

/**
 * PV of n beginning-of-period growing withdrawals leaving endBalance.
 * First withdrawal W, growth g, period rate r.
 */
export function presentValueGrowingDue(
  w0: number,
  r: number,
  g: number,
  n: number,
  endBalance: number
): number | null {
  if (![w0, r, g, n, endBalance].every(Number.isFinite) || !(n > 0)) return null;
  if (w0 < 0 || endBalance < 0) return null;
  if (r <= -1 || 1 + g <= 0) return null;

  const discFv = endBalance / Math.pow(1 + r, n);
  if (!Number.isFinite(discFv)) return null;

  let annuity: number;
  if (Math.abs(g) < RATE_TOL && Math.abs(r) < RATE_TOL) {
    annuity = n;
  } else if (Math.abs(g) < RATE_TOL) {
    annuity = ((1 - Math.pow(1 + r, -n)) / r) * (1 + r);
  } else if (Math.abs(r - g) < RATE_TOL) {
    annuity = n; // begin, r≈g
  } else {
    const ratio = (1 + g) / (1 + r);
    annuity = (1 - Math.pow(ratio, n)) / (1 - ratio);
  }
  if (!Number.isFinite(annuity)) return null;
  const pv = w0 * annuity + discFv;
  return Number.isFinite(pv) && pv >= 0 ? pv : null;
}

export function withdrawalFromPvGrowingDue(
  pv: number,
  r: number,
  g: number,
  n: number,
  endBalance: number
): number | null {
  if (![pv, r, g, n, endBalance].every(Number.isFinite) || !(n > 0)) return null;
  if (pv < 0 || endBalance < 0) return null;
  const unit = presentValueGrowingDue(1, r, g, n, 0);
  if (unit === null || !(unit > 0)) return null;
  const discFv = endBalance / Math.pow(1 + r, n);
  const capital = pv - discFv;
  if (!(capital >= 0)) return null;
  const w = capital / unit;
  return Number.isFinite(w) && w >= 0 ? w : null;
}

export function periodsUntilEnd(
  pv: number,
  w0: number,
  r: number,
  g: number,
  endBalance: number
): { periods: number; neverDepletes: boolean } | null {
  if (
    ![pv, w0, r, g, endBalance].every(Number.isFinite) ||
    !(pv >= 0) ||
    !(w0 > 0) ||
    endBalance < 0
  ) {
    return null;
  }
  let bal = pv;
  let w = w0;
  let periods = 0;
  while (periods < MAX_PERIODS) {
    if (bal <= endBalance + 1e-9) {
      return { periods, neverDepletes: false };
    }
    bal -= w;
    if (bal < endBalance - 1e-9) {
      return { periods: periods + 1, neverDepletes: false };
    }
    bal *= 1 + r;
    periods += 1;
    w *= 1 + g;
  }
  return { periods: MAX_PERIODS, neverDepletes: true };
}

export function futureValueAfterWithdrawals(
  pv: number,
  w0: number,
  r: number,
  g: number,
  n: number
): number | null {
  if (![pv, w0, r, g, n].every(Number.isFinite) || !(n >= 0)) return null;
  let bal = pv;
  let w = w0;
  for (let i = 0; i < n; i++) {
    bal -= w;
    bal *= 1 + r;
    w *= 1 + g;
    if (!Number.isFinite(bal)) return null;
  }
  return bal;
}

/** Solve annual % return (nominal) for given PV, W, n, endBal, g (begin). */
export function solveAnnualReturnPercent(
  pv: number,
  w0: number,
  n: number,
  endBalance: number,
  inflationPercent: number,
  frequency: SwpFrequency
): number | null {
  if (!(pv > 0) || !(w0 > 0) || !(n > 0)) return null;
  const g = periodGrowth(inflationPercent, frequency);
  if (g === null) return null;
  const q = periodsPerYear(frequency);

  const f = (annualPercent: number) => {
    const r = nominalPeriodRate(annualPercent, frequency);
    if (r === null) return null;
    const computed = presentValueGrowingDue(w0, r, g, n, endBalance);
    if (computed === null) return null;
    return computed - pv;
  };

  let lo = -50;
  let hi = 100;
  let fLo = f(lo);
  let fHi = f(hi);
  if (fLo === null || fHi === null) return null;
  // Expand if needed
  let guard = 0;
  while (fLo * fHi > 0 && guard < 20) {
    hi += 50;
    fHi = f(hi);
    if (fHi === null) return null;
    guard += 1;
  }
  if (fLo * fHi > 0) return null;

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === null) return null;
    if (Math.abs(fm) < 1e-6) return mid;
    if (fLo! * fm <= 0) {
      hi = mid;
      fHi = fm;
    } else {
      lo = mid;
      fLo = fm;
    }
  }
  return (lo + hi) / 2;
}

function withdrawalLabel(frequency: SwpFrequency): string {
  switch (frequency) {
    case 'monthly':
      return 'Monthly withdrawal';
    case 'quarterly':
      return 'Quarterly withdrawal';
    case 'semiannually':
      return 'Semiannual withdrawal';
    case 'annually':
      return 'Annual withdrawal';
    default:
      return 'Periodic withdrawal';
  }
}

export function calculateSwp(
  input: SwpCanonicalInput
): SwpResult | null {
  const {
    mode,
    currency,
    withdrawalAmount,
    initialInvestment,
    frequency,
    durationYears,
    annualReturnPercent,
    inflationPercent,
    firstWithdrawalDate,
    endBalance,
  } = input;

  const q = periodsPerYear(frequency);
  const g = periodGrowth(inflationPercent, frequency);
  if (g === null) return null;

  let n = Math.round(durationYears * q);
  let w = withdrawalAmount;
  let pv = initialInvestment;
  let rAnnual = annualReturnPercent;
  let ending = endBalance;
  let neverDepletes = false;

  if (mode === 'initial' || mode === 'withdrawal' || mode === 'final') {
    if (!(n > 0)) return null;
  }

  if (mode === 'initial') {
    if (!(w > 0)) return null;
    const r = nominalPeriodRate(rAnnual, frequency);
    if (r === null) return null;
    const solved = presentValueGrowingDue(w, r, g, n, endBalance);
    if (solved === null) return null;
    pv = solved;
    ending = endBalance;
  } else if (mode === 'withdrawal') {
    if (!(pv > 0)) return null;
    const r = nominalPeriodRate(rAnnual, frequency);
    if (r === null) return null;
    const solved = withdrawalFromPvGrowingDue(pv, r, g, n, endBalance);
    if (solved === null) return null;
    w = solved;
    ending = endBalance;
  } else if (mode === 'duration') {
    if (!(pv > 0) || !(w > 0)) return null;
    const r = nominalPeriodRate(rAnnual, frequency);
    if (r === null) return null;
    const solved = periodsUntilEnd(pv, w, r, g, endBalance);
    if (!solved) return null;
    neverDepletes = solved.neverDepletes;
    n = solved.periods;
    ending = endBalance;
  } else if (mode === 'final') {
    if (!(pv >= 0) || !(w >= 0) || !(n > 0)) return null;
    const r = nominalPeriodRate(rAnnual, frequency);
    if (r === null) return null;
    const fv = futureValueAfterWithdrawals(pv, w, r, g, n);
    if (fv === null) return null;
    ending = fv;
  } else if (mode === 'rate') {
    if (!(pv > 0) || !(w > 0) || !(n > 0)) return null;
    const solved = solveAnnualReturnPercent(
      pv,
      w,
      n,
      endBalance,
      inflationPercent,
      frequency
    );
    if (solved === null) return null;
    rAnnual = solved;
    ending = endBalance;
  } else {
    return null;
  }

  // Total withdrawn (nominal sum of growing withdrawals)
  let totalWithdrawal = 0;
  {
    let wi = w;
    for (let i = 0; i < n; i++) {
      totalWithdrawal += wi;
      wi *= 1 + g;
    }
  }

  const totalReturn = totalWithdrawal + ending - pv;
  const monthsStep = monthsPerPeriod(frequency);
  const lastDate =
    n > 0
      ? addCalendarMonths(firstWithdrawalDate, monthsStep * (n - 1))
      : firstWithdrawalDate;

  const symbol = getCurrencySymbol(currency);
  const money = (x: number) => `${symbol}${formatSwpMoney(x, currency)}`;
  const freqLabel =
    SWP_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.label ??
    'Monthly';

  let summaryMessage: string;
  if (neverDepletes) {
    summaryMessage = `At ${money(w)} per period, the balance does not reach ${money(endBalance)} within the modeled horizon.`;
  } else if (mode === 'initial') {
    summaryMessage = `You should have an SWP investment of ${money(pv)} to be able to make the specified withdrawals.`;
  } else if (mode === 'withdrawal') {
    summaryMessage = `You can withdraw ${money(w)} ${freqLabel.toLowerCase()} from ${money(pv)}.`;
  } else if (mode === 'duration') {
    summaryMessage = `Your SWP lasts ${n} withdrawals (${(n / q).toFixed(2)} years) at ${money(w)} per period.`;
  } else if (mode === 'final') {
    summaryMessage = `After ${n} withdrawals, your ending balance is about ${money(ending)}.`;
  } else {
    summaryMessage = `You need about ${rAnnual.toFixed(2)}% annual return for this SWP plan.`;
  }

  return {
    mode,
    currency,
    openingBalance: pv,
    periodicWithdrawal: w,
    totalWithdrawal,
    totalReturn,
    numberOfWithdrawals: n,
    lastWithdrawalDate: formatSwpDate(lastDate),
    endingBalance: ending,
    annualReturnPercent: rAnnual,
    inflationPercent,
    frequency,
    frequencyLabel: freqLabel,
    summaryMessage,
    formattedOpening: money(pv),
    formattedWithdrawal: money(w),
    formattedTotalWithdrawal: money(totalWithdrawal),
    formattedTotalReturn: money(totalReturn),
    formattedEnding: money(ending),
    assumptionNotes: [
      'Withdrawals at the beginning of each period; period rate = annual ÷ periods/year (nominal).',
      inflationPercent !== 0
        ? `Withdrawals grow with ${inflationPercent}%/yr inflation (period-converted).`
        : 'Inflation is 0% — level withdrawals.',
      'Currency labels amounts only (no FX conversion).',
      `${withdrawalLabel(frequency)} shown for the first period.`,
    ],
  };
}

/** Screenshot default: 1000/mo × 10y @ 5%, begin, FV=0 → PV ≈ 94674.19 */
export function screenshotDefaultInitialInvestment(): number {
  const r = nominalPeriodRate(5, 'monthly')!;
  return presentValueGrowingDue(1000, r, 0, 120, 0) ?? NaN;
}
