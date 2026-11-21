import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { MaturityTimeUnit } from './types';

/**
 * Dividend-adjusted Black–Scholes–Merton European prices.
 *
 * d1 = [ln(S/K) + (r − q + σ²/2) T] / (σ √T)
 * d2 = d1 − σ √T
 * Call = S e^(−qT) N(d1) − K e^(−rT) N(d2)
 * Put  = K e^(−rT) N(−d2) − S e^(−qT) N(−d1)
 *
 * Boundaries:
 * - T = 0 → intrinsic: call = max(S−K, 0), put = max(K−S, 0)
 * - σ = 0 (T > 0) → discounted forward intrinsic (no Infinity)
 *
 * Percentages enter as decimals. Full IEEE precision; round only for display.
 */

/** Abramowitz & Stegun 26.2.17 Φ approximation via erf (max |error| ~ 7.5e-8). */
export function normalCdf(x: number): number {
  if (!Number.isFinite(x)) return Number.NaN;
  if (x === 0) return 0.5;
  // Φ(x) = ½ (1 + erf(x / √2))
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function erf(z: number): number {
  // A&S 7.1.26
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z);
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const t = 1 / (1 + p * a);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-a * a);
  return sign * y;
}

export function timeToYears(value: number, unit: MaturityTimeUnit): number {
  switch (unit) {
    case 'years':
      return value;
    case 'months':
      return value / 12;
    case 'days':
      return value / 365;
  }
}

export function formatBlackScholesMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  return formatCurrencyValue(amount, currency);
}

export interface BlackScholesNumericInput {
  stock: number;
  strike: number;
  timeYears: number;
  dividendYield: number;
  volatility: number;
  riskFreeRate: number;
}

export interface BlackScholesNumericResult {
  d1: number | null;
  d2: number | null;
  call: number;
  put: number;
  boundaryNote: string | null;
}

export function calculateBlackScholes(
  input: BlackScholesNumericInput
): BlackScholesNumericResult | null {
  const { stock: S, strike: K, timeYears: T, dividendYield: q, volatility: sigma, riskFreeRate: r } =
    input;

  if (
    ![S, K, T, q, sigma, r].every((n) => Number.isFinite(n)) ||
    S <= 0 ||
    K <= 0 ||
    T < 0 ||
    sigma < 0
  ) {
    return null;
  }

  // Zero time → European intrinsic at expiry (spot vs strike).
  if (T === 0) {
    const call = Math.max(S - K, 0);
    const put = Math.max(K - S, 0);
    if (![call, put].every((n) => Number.isFinite(n))) return null;
    return {
      d1: null,
      d2: null,
      call,
      put,
      boundaryNote: 'Time to maturity is zero — prices are European intrinsic values.',
    };
  }

  // Zero volatility → deterministic discounted forward values.
  if (sigma === 0) {
    const forwardDiff = S * Math.exp(-q * T) - K * Math.exp(-r * T);
    const call = Math.max(forwardDiff, 0);
    const put = Math.max(-forwardDiff, 0);
    if (![call, put].every((n) => Number.isFinite(n))) return null;
    return {
      d1: null,
      d2: null,
      call,
      put,
      boundaryNote:
        'Volatility is zero — prices use the discounted forward intrinsic (no diffusion).',
    };
  }

  const sqrtT = Math.sqrt(T);
  if (!(sqrtT > 0) || !Number.isFinite(sqrtT)) return null;

  const d1 =
    (Math.log(S / K) + (r - q + (sigma * sigma) / 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  if (![d1, d2].every((n) => Number.isFinite(n))) return null;

  const discQ = Math.exp(-q * T);
  const discR = Math.exp(-r * T);
  const call = S * discQ * normalCdf(d1) - K * discR * normalCdf(d2);
  const put = K * discR * normalCdf(-d2) - S * discQ * normalCdf(-d1);

  if (![call, put].every((n) => Number.isFinite(n))) return null;

  return {
    d1,
    d2,
    call: Math.max(call, 0),
    put: Math.max(put, 0),
    boundaryNote: null,
  };
}
