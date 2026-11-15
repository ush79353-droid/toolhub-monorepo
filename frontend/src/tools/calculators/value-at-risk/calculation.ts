import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  TIMEFRAME_UNIT_OPTIONS,
  type TimeframeUnit,
  type ValueAtRiskResult,
} from './types';

/** Known one-sided normal quantiles for common VaR tails. */
export const Z_10 = 1.2815515655446004;
export const Z_5 = 1.6448536269514722;
export const Z_1 = 2.3263478740408408;

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Approximate inverse standard normal CDF (Acklam's algorithm).
 * Accurate for p in (0, 1); returns ±Infinity at the endpoints.
 */
export function inverseNormalCdf(p: number): number {
  if (!Number.isFinite(p) || p <= 0 || p >= 1) {
    if (p === 0) return Number.NEGATIVE_INFINITY;
    if (p === 1) return Number.POSITIVE_INFINITY;
    return Number.NaN;
  }

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416,
  ];

  const plow = 0.02425;
  const phigh = 1 - plow;

  let q: number;
  let r: number;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }

  if (p <= phigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
      (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
    );
  }

  q = Math.sqrt(-2 * Math.log(1 - p));
  return (
    -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
    ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
  );
}

export function zForTailPercent(tailPercent: number): number | null {
  if (!Number.isFinite(tailPercent) || tailPercent <= 0 || tailPercent >= 50) return null;
  if (Math.abs(tailPercent - 10) < 1e-12) return Z_10;
  if (Math.abs(tailPercent - 5) < 1e-12) return Z_5;
  if (Math.abs(tailPercent - 1) < 1e-12) return Z_1;
  const confidence = 1 - tailPercent / 100;
  const z = inverseNormalCdf(confidence);
  return Number.isFinite(z) ? z : null;
}

export function timeframeToDays(amount: number, unit: TimeframeUnit): number | null {
  if (!Number.isFinite(amount) || !(amount > 0)) return null;
  const opt = TIMEFRAME_UNIT_OPTIONS.find((o) => o.value === unit);
  if (!opt) return null;
  const days = amount * opt.daysPerUnit;
  return Number.isFinite(days) && days > 0 ? days : null;
}

/**
 * Parametric VaR (daily σ, μ convention):
 * VaR = Portfolio × max(0, Z × σ × √t − μ × t)
 * where t is in days and σ, μ are daily decimals.
 */
export function calculateValueAtRisk(input: {
  portfolioValue: number;
  standardDeviationPercent: number;
  expectedReturnPercent: number;
  timeframeAmount: number;
  timeframeUnit: TimeframeUnit;
  tailProbabilityPercent: number;
  currency: SupportedCurrency;
}): ValueAtRiskResult | null {
  const {
    portfolioValue,
    standardDeviationPercent,
    expectedReturnPercent,
    timeframeAmount,
    timeframeUnit,
    tailProbabilityPercent,
    currency,
  } = input;

  if (
    ![
      portfolioValue,
      standardDeviationPercent,
      expectedReturnPercent,
      timeframeAmount,
      tailProbabilityPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (portfolioValue < 0 || standardDeviationPercent < 0) return null;

  const t = timeframeToDays(timeframeAmount, timeframeUnit);
  if (t === null) return null;

  const z = zForTailPercent(tailProbabilityPercent);
  if (z === null) return null;

  const sigma = standardDeviationPercent / 100;
  const mu = expectedReturnPercent / 100;
  const sqrtT = Math.sqrt(t);
  if (!Number.isFinite(sqrtT)) return null;

  const factor = z * sigma * sqrtT - mu * t;
  if (!Number.isFinite(factor)) return null;

  const raw = portfolioValue * factor;
  if (!Number.isFinite(raw)) return null;

  const varAmount = roundMoney(Math.max(0, raw));
  if (!Number.isFinite(varAmount)) return null;

  return {
    varAmount,
    portfolioValue: roundMoney(portfolioValue),
    standardDeviationPercent,
    expectedReturnPercent,
    timeframeDays: t,
    tailProbabilityPercent,
    zScore: z,
    currency,
    formattedVar: formatCurrencyValue(varAmount, currency),
  };
}
