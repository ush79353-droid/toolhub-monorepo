import type { IrrResult } from './types';

function formatIrrPercent(irrPercent: number): string {
  const rounded = Number(irrPercent.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/** NPV of -initial + cash flows at annual rate r (decimal). Requires r > -1. */
export function npvAtRate(
  initialInvestment: number,
  cashFlows: number[],
  rate: number
): number {
  if (!(rate > -1) || !Number.isFinite(rate)) return Number.NaN;
  let npv = -initialInvestment;
  for (let t = 0; t < cashFlows.length; t += 1) {
    const denom = Math.pow(1 + rate, t + 1);
    if (!Number.isFinite(denom) || denom === 0) return Number.NaN;
    npv += cashFlows[t]! / denom;
  }
  return npv;
}

function npvDerivative(
  cashFlows: number[],
  rate: number
): number {
  if (!(rate > -1) || !Number.isFinite(rate)) return Number.NaN;
  let d = 0;
  for (let t = 0; t < cashFlows.length; t += 1) {
    const power = t + 2; // d/dr of 1/(1+r)^(t+1) = -(t+1)/(1+r)^(t+2)
    const denom = Math.pow(1 + rate, power);
    if (!Number.isFinite(denom) || denom === 0) return Number.NaN;
    d += (-(t + 1) * cashFlows[t]!) / denom;
  }
  return d;
}

/** Count sign changes in the cash-flow series (zeros skipped). */
export function countSignChanges(series: number[]): number {
  let changes = 0;
  let prev: number | null = null;
  for (const v of series) {
    if (!Number.isFinite(v) || v === 0) continue;
    if (prev !== null && Math.sign(prev) !== Math.sign(v)) changes += 1;
    prev = v;
  }
  return changes;
}

/**
 * Solve 0 = -I + Σ CF_t / (1+r)^t for annual IRR r.
 * Returns null when no stable unique root (including multiple sign changes).
 */
export function calculateIrr(
  initialInvestment: number,
  cashFlows: number[]
): IrrResult | null {
  if (!Number.isFinite(initialInvestment) || initialInvestment <= 0) return null;
  if (cashFlows.length === 0) return null;
  if (!cashFlows.every(Number.isFinite)) return null;

  const series = [-initialInvestment, ...cashFlows];
  // Descartes: more than one sign change → IRR may not be unique
  if (countSignChanges(series) !== 1) return null;

  const f = (r: number) => npvAtRate(initialInvestment, cashFlows, r);

  // Newton–Raphson
  let r = 0.1;
  let converged = false;
  for (let i = 0; i < 60; i += 1) {
    const val = f(r);
    const deriv = npvDerivative(cashFlows, r);
    if (!Number.isFinite(val) || !Number.isFinite(deriv)) break;
    if (Math.abs(val) < 1e-10) {
      converged = true;
      break;
    }
    if (Math.abs(deriv) < 1e-14) break;
    const next = r - val / deriv;
    if (!(next > -0.999999) || !Number.isFinite(next)) break;
    if (Math.abs(next - r) < 1e-12) {
      r = next;
      converged = true;
      break;
    }
    r = next;
  }

  // Bisection fallback on (-0.999999, 10]
  if (!converged || !Number.isFinite(r) || !(r > -1)) {
    let low = -0.999999;
    let high = 10;
    let fLow = f(low);
    let fHigh = f(high);
    if (![fLow, fHigh].every(Number.isFinite)) return null;

    if (fLow * fHigh > 0) {
      let found = false;
      let prevR = low;
      let prevF = fLow;
      for (let i = 1; i <= 120; i += 1) {
        const mid = low + ((high - low) * i) / 120;
        const fm = f(mid);
        if (!Number.isFinite(fm)) continue;
        if (prevF * fm <= 0) {
          low = prevR;
          high = mid;
          fLow = prevF;
          fHigh = fm;
          found = true;
          break;
        }
        prevR = mid;
        prevF = fm;
      }
      if (!found) return null;
    }

    for (let i = 0; i < 100; i += 1) {
      const mid = (low + high) / 2;
      const fm = f(mid);
      if (!Number.isFinite(fm)) return null;
      if (Math.abs(fm) < 1e-10 || high - low < 1e-12) {
        r = mid;
        converged = true;
        break;
      }
      if (fLow * fm <= 0) {
        high = mid;
        fHigh = fm;
      } else {
        low = mid;
        fLow = fm;
      }
      r = mid;
    }
  }

  if (!converged || !Number.isFinite(r) || !(r > -1)) return null;
  // Verify NPV near zero
  const check = f(r);
  if (!Number.isFinite(check) || Math.abs(check) > 1e-4 * Math.max(1, initialInvestment)) {
    return null;
  }

  const irrPercent = r * 100;
  if (!Number.isFinite(irrPercent)) return null;

  return {
    irrPercent,
    formattedIrr: formatIrrPercent(irrPercent),
    yearsUsed: cashFlows.length,
  };
}
