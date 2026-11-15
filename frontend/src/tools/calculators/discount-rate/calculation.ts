import type {
  CashFlowFrequency,
  CashFlowTiming,
  CompoundFrequency,
  DiscountRateResult,
  TermUnit,
} from './types';

export function compoundsPerYear(f: CompoundFrequency): number {
  switch (f) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    case 'daily':
      return 365;
    default:
      return 1;
  }
}

export function cashFlowsPerYear(f: CashFlowFrequency): number {
  switch (f) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    default:
      return 1;
  }
}

export function termToYears(term: number, unit: TermUnit): number {
  return unit === 'mos' ? term / 12 : term;
}

/** Payment times in years for periodic cash flows over the term. */
export function cashFlowTimesYears(
  termYears: number,
  cashFlowFrequency: CashFlowFrequency,
  timing: CashFlowTiming
): number[] {
  const c = cashFlowsPerYear(cashFlowFrequency);
  if (c <= 0 || termYears <= 0) return [];
  const count = Math.round(termYears * c);
  if (count <= 0 || count > 100_000) return [];
  const times: number[] = [];
  for (let k = 1; k <= count; k += 1) {
    // End: 1/c, 2/c, … ; Beginning: 0, 1/c, … (count−1)/c
    const time = timing === 'end' ? k / c : (k - 1) / c;
    if (time <= termYears + 1e-12) times.push(time);
  }
  return times;
}

function discountFactor(annualRate: number, m: number, timeYears: number): number {
  // (1 + r/m)^(m × time)
  const base = 1 + annualRate / m;
  if (base <= 0 || !Number.isFinite(base)) return Number.NaN;
  return Math.pow(base, m * timeYears);
}

/**
 * Present value of FV + periodic CFs at nominal annual rate r (compounded m times/year).
 * PV_model(r) = FV / (1+r/m)^(m×t) + Σ CF / (1+r/m)^(m×time_i)
 */
export function presentValueAtRate(
  annualRate: number,
  futureValue: number,
  cashFlow: number,
  termYears: number,
  m: number,
  times: number[]
): number {
  if (!Number.isFinite(annualRate) || !Number.isFinite(futureValue) || !Number.isFinite(cashFlow)) {
    return Number.NaN;
  }
  if (m <= 0 || termYears < 0) return Number.NaN;

  const fvFactor = discountFactor(annualRate, m, termYears);
  if (!Number.isFinite(fvFactor) || fvFactor === 0) return Number.NaN;
  let pv = futureValue / fvFactor;

  for (const time of times) {
    if (cashFlow === 0) break;
    const factor = discountFactor(annualRate, m, time);
    if (!Number.isFinite(factor) || factor === 0) return Number.NaN;
    pv += cashFlow / factor;
  }

  return pv;
}

/** Closed form when CF = 0: r = m × [(FV/PV)^(1/(m×t)) − 1] */
export function closedFormDiscountRate(
  presentValue: number,
  futureValue: number,
  termYears: number,
  m: number
): number | null {
  if (presentValue === 0 || termYears <= 0 || m <= 0) return null;
  if (!Number.isFinite(presentValue) || !Number.isFinite(futureValue)) return null;
  if (presentValue < 0 || futureValue < 0) return null;
  if (futureValue === 0 && presentValue === 0) return null;

  const ratio = futureValue / presentValue;
  if (ratio <= 0 || !Number.isFinite(ratio)) return null;

  const exponent = 1 / (m * termYears);
  if (!Number.isFinite(exponent)) return null;
  const root = Math.pow(ratio, exponent);
  if (!Number.isFinite(root)) return null;
  const rate = m * (root - 1);
  if (!Number.isFinite(rate)) return null;
  return rate;
}

/**
 * Solve PV = PV_model(r) for nominal annual discount rate r via bisection.
 * Returns null when no stable solution in a reasonable bracket.
 */
export function solveDiscountRate(input: {
  presentValue: number;
  futureValue: number;
  cashFlow: number;
  termYears: number;
  compoundFrequency: CompoundFrequency;
  cashFlowFrequency: CashFlowFrequency;
  cashFlowTiming: CashFlowTiming;
}): DiscountRateResult | null {
  const {
    presentValue,
    futureValue,
    cashFlow,
    termYears,
    compoundFrequency,
    cashFlowFrequency,
    cashFlowTiming,
  } = input;

  if (![presentValue, futureValue, cashFlow, termYears].every(Number.isFinite)) return null;
  if (presentValue <= 0 || futureValue < 0 || cashFlow < 0 || termYears <= 0) return null;

  const m = compoundsPerYear(compoundFrequency);
  const times = cashFlow === 0 ? [] : cashFlowTimesYears(termYears, cashFlowFrequency, cashFlowTiming);

  if (cashFlow === 0) {
    const rate = closedFormDiscountRate(presentValue, futureValue, termYears, m);
    if (rate === null) return null;
    return formatResult(rate, m, termYears);
  }

  // f(r) = PV_model(r) - presentValue ; seek root
  const f = (r: number): number => {
    const pvModel = presentValueAtRate(r, futureValue, cashFlow, termYears, m, times);
    return pvModel - presentValue;
  };

  // At r → -m (base→0+) factors explode; keep r > -m + eps
  const minRate = -m + 1e-6;
  const maxRate = 10; // 1000% nominal ceiling

  let low = minRate;
  let high = maxRate;
  let fLow = f(low);
  let fHigh = f(high);

  if (![fLow, fHigh].every(Number.isFinite)) return null;

  // Expand / scan for a sign change if needed
  if (fLow * fHigh > 0) {
    let found = false;
    let prevR = low;
    let prevF = fLow;
    const steps = 80;
    for (let i = 1; i <= steps; i += 1) {
      const r = low + ((high - low) * i) / steps;
      const fr = f(r);
      if (!Number.isFinite(fr)) continue;
      if (prevF * fr <= 0) {
        low = prevR;
        high = r;
        fLow = prevF;
        fHigh = fr;
        found = true;
        break;
      }
      prevR = r;
      prevF = fr;
    }
    if (!found) return null;
  }

  let mid = 0;
  for (let i = 0; i < 100; i += 1) {
    mid = (low + high) / 2;
    const fm = f(mid);
    if (!Number.isFinite(fm)) return null;
    if (Math.abs(fm) < 1e-8 || high - low < 1e-10) break;
    if (fLow * fm <= 0) {
      high = mid;
      fHigh = fm;
    } else {
      low = mid;
      fLow = fm;
    }
  }

  if (!Number.isFinite(mid)) return null;
  // Reject nonsense leftovers
  if (mid <= minRate || mid > maxRate) return null;

  return formatResult(mid, m, termYears);
}

function formatResult(
  annualRate: number,
  m: number,
  termYears: number
): DiscountRateResult | null {
  const annualDiscountRatePercent = annualRate * 100;
  if (!Number.isFinite(annualDiscountRatePercent)) return null;
  const formattedRate = Number(annualDiscountRatePercent.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
  return {
    annualDiscountRatePercent,
    formattedRate,
    compoundsPerYear: m,
    termYears,
  };
}
