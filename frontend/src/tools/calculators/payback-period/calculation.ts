import type { PaybackUnit } from './types';

const STEADY_MAX_YEARS = 500;

export function formatPaybackPeriod(years: number | null, unit: PaybackUnit): string {
  if (years === null || !Number.isFinite(years) || years < 0) return 'Not recovered';
  if (unit === 'months') {
    return String(Math.round(years * 12));
  }
  const wholeYears = Math.floor(years + 1e-12);
  let months = Math.round((years - wholeYears) * 12);
  let y = wholeYears;
  if (months === 12) {
    y += 1;
    months = 0;
  }
  if (months === 0) return String(y);
  return `${y} yrs ${months} mos`;
}

/**
 * Fractional payback from a cash-flow series (year 1..n).
 * Returns years from t=0, or null if never recovered within the series.
 */
export function paybackFromSeries(investment: number, cashFlows: number[]): number | null {
  if (!(investment > 0) || cashFlows.length === 0) return null;

  let cumulative = 0;
  for (let i = 0; i < cashFlows.length; i += 1) {
    const cf = cashFlows[i]!;
    if (!Number.isFinite(cf)) return null;
    const before = cumulative;
    cumulative += cf;
    if (cumulative + 1e-12 >= investment) {
      if (!(cf > 0)) {
        return before + 1e-12 >= investment ? i : null;
      }
      const fraction = (investment - before) / cf;
      return i + fraction;
    }
  }
  return null;
}

export function discountCashFlows(cashFlows: number[], rateDecimal: number): number[] {
  return cashFlows.map((cf, index) => {
    const t = index + 1;
    const denom = (1 + rateDecimal) ** t;
    if (!Number.isFinite(denom) || denom === 0) return Number.NaN;
    return cf / denom;
  });
}

/** Steady (level) undiscounted payback: investment / annual CF. */
export function steadyPaybackYears(investment: number, annualCashFlow: number): number | null {
  if (!(investment > 0) || !(annualCashFlow > 0)) return null;
  const years = investment / annualCashFlow;
  return Number.isFinite(years) ? years : null;
}

/**
 * Steady discounted payback by accumulating CF / (1+r)^t until recovery.
 * When r = 0, matches undiscounted payback.
 */
export function steadyDiscountedPaybackYears(
  investment: number,
  annualCashFlow: number,
  rateDecimal: number
): number | null {
  if (!(investment > 0) || !(annualCashFlow > 0) || !(rateDecimal >= 0) || !Number.isFinite(rateDecimal)) {
    return null;
  }
  if (rateDecimal === 0) {
    return steadyPaybackYears(investment, annualCashFlow);
  }
  const pvPerpetuity = annualCashFlow / rateDecimal;
  if (!(pvPerpetuity >= investment)) return null;

  let cumulative = 0;
  for (let t = 1; t <= STEADY_MAX_YEARS; t += 1) {
    const discounted = annualCashFlow / (1 + rateDecimal) ** t;
    if (!Number.isFinite(discounted)) return null;
    const before = cumulative;
    cumulative += discounted;
    if (cumulative + 1e-12 >= investment) {
      const fraction = (investment - before) / discounted;
      return t - 1 + fraction;
    }
  }
  return null;
}

export function irregularPaybackYears(
  investment: number,
  yearCashFlows: number[]
): number | null {
  return paybackFromSeries(investment, yearCashFlows);
}

export function irregularDiscountedPaybackYears(
  investment: number,
  yearCashFlows: number[],
  rateDecimal: number
): number | null {
  if (!(rateDecimal >= 0) || !Number.isFinite(rateDecimal)) return null;
  if (rateDecimal === 0) return paybackFromSeries(investment, yearCashFlows);
  const discounted = discountCashFlows(yearCashFlows, rateDecimal);
  if (discounted.some((v) => !Number.isFinite(v))) return null;
  return paybackFromSeries(investment, discounted);
}
