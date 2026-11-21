import type { CouponFrequency } from './types';
import { periodsPerYear } from './types';

const MAX_PERIODS = 100_000;
const YIELD_ABS_MAX = 10; // 1000% annual — initial search ceiling
const ROOT_TOL = 1e-12;

/** Display rounding only — math stays full precision. */
export function formatYieldPercent(yieldPercent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(yieldPercent);
}

/**
 * Coupon-date clean price:
 * P = Σ_{t=1}^{N} C / (1 + y/m)^t + F / (1 + y/m)^N
 * with C = F × (r/m), N = years × m, y = annual nominal YTM.
 */
export function bondPriceFromYield(opts: {
  faceValue: number;
  yieldAnnual: number;
  totalPeriods: number;
  couponPerPeriod: number;
  periodsPerYear: number;
}): number | null {
  const { faceValue: F, yieldAnnual: y, totalPeriods: N, couponPerPeriod: C, periodsPerYear: m } =
    opts;
  if (![F, y, N, C, m].every(Number.isFinite)) return null;
  if (!(F > 0) || !(N > 0) || !(m > 0) || C < 0) return null;
  if (!Number.isInteger(N)) return null;
  if (y <= -m) return null; // 1 + y/m must be > 0

  const r = y / m;
  if (Math.abs(r) < 1e-15) {
    const flat = C * N + F;
    return Number.isFinite(flat) ? flat : null;
  }

  const onePlusR = 1 + r;
  const dfN = Math.pow(onePlusR, -N);
  if (!Number.isFinite(dfN)) return null;

  const annuity = (1 - dfN) / r;
  if (!Number.isFinite(annuity)) return null;

  const price = C * annuity + F * dfN;
  return Number.isFinite(price) ? price : null;
}

/** Bounded bisection on f(y) = price(y) − P. Supports premium, discount, par, zero-coupon. */
function findYieldRoot(
  F: number,
  P: number,
  N: number,
  C: number,
  m: number
): number | null {
  // Zero-coupon closed form when C ≈ 0: P = F / (1 + y/m)^N
  if (C <= 1e-15) {
    if (!(P > 0) || !(F > 0)) return null;
    const ratio = F / P;
    if (!(ratio > 0)) return null;
    const y = m * (Math.pow(ratio, 1 / N) - 1);
    return Number.isFinite(y) && y > -m ? y : null;
  }

  const f = (y: number) => {
    const px = bondPriceFromYield({
      faceValue: F,
      yieldAnnual: y,
      totalPeriods: N,
      couponPerPeriod: C,
      periodsPerYear: m,
    });
    if (px === null) return null;
    return px - P;
  };

  let lo = -m + 1e-12;
  let hi = YIELD_ABS_MAX;
  let flo = f(lo);
  let fhi = f(hi);
  if (flo === null || fhi === null) return null;

  // Expand high bound if needed (price falls as yield rises for typical coupons)
  for (let i = 0; i < 40 && flo * fhi > 0; i += 1) {
    hi *= 2;
    if (hi > 1e6) break;
    fhi = f(hi);
    if (fhi === null) return null;
  }
  if (flo * fhi > 0) {
    const guesses = [0, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, -0.5, -0.9];
    let found = false;
    for (const g of guesses) {
      if (g <= -m) continue;
      const fg = f(g);
      if (fg === null) continue;
      if (flo * fg <= 0) {
        hi = g;
        fhi = fg;
        found = true;
        break;
      }
      if (fhi * fg <= 0) {
        lo = g;
        flo = fg;
        found = true;
        break;
      }
    }
    if (!found) return null;
  }

  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === null) return null;
    if (Math.abs(fm) < ROOT_TOL || (hi - lo) / 2 < ROOT_TOL) {
      return mid;
    }
    if (flo * fm <= 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  return (lo + hi) / 2;
}

/**
 * Solve annual nominal yield to maturity (%) from clean coupon-date price.
 * Returns null on invalid inputs, non-integer period counts, solver failure, or overflow.
 */
export function calculateBondYield(input: {
  faceValue: number;
  bondPrice: number;
  annualCouponRatePercent: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
}): {
  bondYieldPercent: number;
  periodsPerYear: number;
  totalPeriods: number;
} | null {
  const {
    faceValue: F,
    bondPrice: P,
    annualCouponRatePercent,
    couponFrequency,
    yearsToMaturity,
  } = input;

  if (
    ![F, P, annualCouponRatePercent, yearsToMaturity].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(F > 0) || !(P > 0) || !(yearsToMaturity > 0)) {
    return null;
  }
  if (annualCouponRatePercent < 0) {
    return null;
  }

  const m = periodsPerYear(couponFrequency);
  if (!(m > 0) || !Number.isFinite(m)) {
    return null;
  }

  const rawPeriods = yearsToMaturity * m;
  if (
    !Number.isFinite(rawPeriods) ||
    rawPeriods <= 0 ||
    Math.abs(rawPeriods - Math.round(rawPeriods)) > 1e-9
  ) {
    return null;
  }
  const N = Math.round(rawPeriods);
  if (N > MAX_PERIODS) {
    return null;
  }

  const r = annualCouponRatePercent / 100;
  const C = (F * r) / m;
  if (!(C >= 0) || !Number.isFinite(C)) {
    return null;
  }

  const y = findYieldRoot(F, P, N, C, m);
  if (y === null || !Number.isFinite(y) || y <= -m) {
    return null;
  }

  const bondYieldPercent = y * 100;
  if (!Number.isFinite(bondYieldPercent)) {
    return null;
  }

  return {
    bondYieldPercent,
    periodsPerYear: m,
    totalPeriods: N,
  };
}
