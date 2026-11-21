/**
 * Effective Duration Calculator — pure engine (ADR-018).
 *
 * D_eff = (P− − P+) / (2 × P0 × Δy)
 *
 * Mode A prices an option-free fixed-coupon bond with parallel yield shocks
 * (same contractual cash flows). Mode B accepts externally modeled scenario
 * prices (required for true option-aware effective duration).
 *
 * UI percentages are converted to decimals before math (8% → 0.08).
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  BOND_FREQUENCY_MAP,
  type EffectiveDurationInput,
  type EffectiveDurationResult,
} from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function pctToDecimal(pct: number): number {
  return pct / 100;
}

/**
 * Fixed-coupon bond price with m payments/year.
 * Requires an integer number of remaining coupon periods (no silent rounding).
 */
export function calculateBondPrice(
  faceValue: number,
  annualCouponRateDecimal: number,
  annualYieldDecimal: number,
  yearsToMaturity: number,
  frequency: number,
): number | null {
  const values = [
    faceValue,
    annualCouponRateDecimal,
    annualYieldDecimal,
    yearsToMaturity,
    frequency,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (
    faceValue <= 0 ||
    annualCouponRateDecimal < 0 ||
    yearsToMaturity <= 0 ||
    ![1, 2, 4, 12].includes(frequency)
  ) {
    return null;
  }

  const periodsExact = yearsToMaturity * frequency;
  // Require whole coupon periods — do not silently round.
  if (
    !Number.isFinite(periodsExact) ||
    Math.abs(periodsExact - Math.round(periodsExact)) > 1e-9
  ) {
    return null;
  }
  const periods = Math.round(periodsExact);
  if (periods < 1) return null;

  const periodicRate = annualYieldDecimal / frequency;
  if (periodicRate <= -1) return null;

  const coupon = (faceValue * annualCouponRateDecimal) / frequency;
  let price = 0;
  for (let period = 1; period <= periods; period++) {
    const discountFactor = Math.pow(1 + periodicRate, period);
    if (!Number.isFinite(discountFactor) || discountFactor === 0) return null;
    const cashFlow = coupon + (period === periods ? faceValue : 0);
    price += cashFlow / discountFactor;
  }
  return Number.isFinite(price) ? price : null;
}

export function calculateEffectiveDuration(
  priceYieldDown: number,
  priceYieldUp: number,
  basePrice: number,
  yieldDifferentialDecimal: number,
): number | null {
  if (
    !Number.isFinite(priceYieldDown) ||
    !Number.isFinite(priceYieldUp) ||
    !Number.isFinite(basePrice) ||
    !Number.isFinite(yieldDifferentialDecimal)
  ) {
    return null;
  }
  if (
    basePrice <= 0 ||
    priceYieldDown <= 0 ||
    priceYieldUp <= 0 ||
    yieldDifferentialDecimal <= 0
  ) {
    return null;
  }
  const duration =
    (priceYieldDown - priceYieldUp) /
    (2 * basePrice * yieldDifferentialDecimal);
  return Number.isFinite(duration) ? duration : null;
}

export function calculateEffectiveConvexity(
  priceYieldDown: number,
  priceYieldUp: number,
  basePrice: number,
  yieldDifferentialDecimal: number,
): number | null {
  if (
    !Number.isFinite(priceYieldDown) ||
    !Number.isFinite(priceYieldUp) ||
    !Number.isFinite(basePrice) ||
    !Number.isFinite(yieldDifferentialDecimal) ||
    basePrice <= 0 ||
    yieldDifferentialDecimal <= 0
  ) {
    return null;
  }
  const conv =
    (priceYieldDown + priceYieldUp - 2 * basePrice) /
    (basePrice * yieldDifferentialDecimal * yieldDifferentialDecimal);
  return Number.isFinite(conv) ? conv : null;
}

function fmtMoney(
  n: number,
  currency: EffectiveDurationInput['currency'],
): string {
  return formatCurrencyValue(n, currency);
}

function fmtPct(n: number, digits = 4): string {
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  })}%`;
}

function fmtYears(n: number): string {
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })} years`;
}

function buildResult(args: {
  mode: EffectiveDurationResult['mode'];
  currency: EffectiveDurationInput['currency'];
  couponPerPeriod: number;
  annualCoupon: number;
  faceValue: number;
  annualCouponRatePercent: number;
  frequency: EffectiveDurationInput['frequency'];
  paymentsPerYear: number;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
  yieldDifferentialDecimal: number;
  basePrice: number;
  priceYieldDown: number;
  priceYieldUp: number;
  effectiveDuration: number;
}): EffectiveDurationResult | null {
  const {
    mode,
    currency,
    couponPerPeriod,
    annualCoupon,
    faceValue,
    annualCouponRatePercent,
    frequency,
    paymentsPerYear,
    yearsToMaturity,
    yieldToMaturityPercent,
    yieldDifferentialDecimal,
    basePrice,
    priceYieldDown,
    priceYieldUp,
    effectiveDuration,
  } = args;

  const pctChangeUp = ((priceYieldUp - basePrice) / basePrice) * 100;
  const pctChangeDown = ((priceYieldDown - basePrice) / basePrice) * 100;
  const approxPriceImpactUp = -effectiveDuration * yieldDifferentialDecimal * 100;
  const dollarDuration = effectiveDuration * basePrice;
  const dv01 = effectiveDuration * basePrice * 0.0001;
  const convexity = calculateEffectiveConvexity(
    priceYieldDown,
    priceYieldUp,
    basePrice,
    yieldDifferentialDecimal,
  );
  if (convexity === null) return null;

  const dyPp = yieldDifferentialDecimal * 100;
  const modeLabel =
    mode === 'standard'
      ? 'Effective Duration Estimate — Fixed Cash Flows'
      : 'Scenario-Based Effective Duration';

  const formulaBreakdown =
    mode === 'standard'
      ? [
          `Coupon per period = Face × (coupon%/100) / m`,
          `= ${fmtMoney(faceValue, currency)} × ${annualCouponRatePercent / 100} / ${paymentsPerYear}`,
          `= ${fmtMoney(couponPerPeriod, currency)}`,
          `Annual coupon = ${fmtMoney(annualCoupon, currency)}`,
          '',
          `Base price P0 at YTM ${fmtPct(yieldToMaturityPercent)} ≈ ${fmtMoney(basePrice, currency)}`,
          `P− (yield − ${dyPp} pp) ≈ ${fmtMoney(priceYieldDown, currency)}`,
          `P+ (yield + ${dyPp} pp) ≈ ${fmtMoney(priceYieldUp, currency)}`,
          '',
          `D_eff = (P− − P+) / (2 × P0 × Δy)`,
          `= (${fmtMoney(priceYieldDown, currency)} − ${fmtMoney(priceYieldUp, currency)}) / (2 × ${fmtMoney(basePrice, currency)} × ${yieldDifferentialDecimal})`,
          `= ${fmtYears(effectiveDuration)}`,
        ].join('\n')
      : [
          `D_eff = (P− − P+) / (2 × P0 × Δy)`,
          `P0 = ${fmtMoney(basePrice, currency)}`,
          `P− = ${fmtMoney(priceYieldDown, currency)}`,
          `P+ = ${fmtMoney(priceYieldUp, currency)}`,
          `Δy = ${yieldDifferentialDecimal}`,
          `= (${fmtMoney(priceYieldDown, currency)} − ${fmtMoney(priceYieldUp, currency)}) / (2 × ${fmtMoney(basePrice, currency)} × ${yieldDifferentialDecimal})`,
          `= ${fmtYears(effectiveDuration)}`,
        ].join('\n');

  const steps =
    mode === 'standard'
      ? [
          `Annual coupon = ${fmtMoney(annualCoupon, currency)}; coupon/period = ${fmtMoney(couponPerPeriod, currency)}`,
          `Price contractual cash flows at YTM ${fmtPct(yieldToMaturityPercent)} → P0 = ${fmtMoney(basePrice, currency)}`,
          `Reprice at YTM − ${dyPp} pp → P− = ${fmtMoney(priceYieldDown, currency)}`,
          `Reprice at YTM + ${dyPp} pp → P+ = ${fmtMoney(priceYieldUp, currency)}`,
          `Apply central difference: D_eff = ${fmtYears(effectiveDuration)}`,
        ]
      : [
          'Use consistent scenario prices (include option effects when modeling callable/putable/MBS cash flows).',
          `P0 = ${fmtMoney(basePrice, currency)}, P− = ${fmtMoney(priceYieldDown, currency)}, P+ = ${fmtMoney(priceYieldUp, currency)}`,
          `Δy = ${yieldDifferentialDecimal} (${dyPp} percentage points)`,
          `D_eff = ${fmtYears(effectiveDuration)}`,
        ];

  return {
    mode,
    currency,
    couponPerPeriod,
    annualCoupon,
    faceValue,
    annualCouponRatePercent,
    frequency,
    paymentsPerYear,
    yearsToMaturity,
    yieldToMaturityPercent,
    yieldDifferentialDecimal,
    basePrice,
    priceYieldDown,
    priceYieldUp,
    effectiveDuration,
    pctChangeUp,
    pctChangeDown,
    approxPriceImpactUp,
    dollarDuration,
    dv01,
    effectiveConvexity: convexity,
    formattedCouponPerPeriod: fmtMoney(couponPerPeriod, currency),
    formattedAnnualCoupon: fmtMoney(annualCoupon, currency),
    formattedBasePrice: fmtMoney(basePrice, currency),
    formattedPriceDown: fmtMoney(priceYieldDown, currency),
    formattedPriceUp: fmtMoney(priceYieldUp, currency),
    formattedDuration: fmtYears(effectiveDuration),
    formattedPctChangeUp: fmtPct(pctChangeUp),
    formattedPctChangeDown: fmtPct(pctChangeDown),
    formattedDv01: fmtMoney(dv01, currency),
    formattedConvexity: convexity.toLocaleString('en-US', {
      maximumFractionDigits: 4,
    }),
    formulaBreakdown,
    steps,
    interpretation: `The estimated duration is ${fmtYears(effectiveDuration)}. For a small parallel yield increase of ${dyPp} percentage point(s), the first-order duration approximation suggests a bond price change of about ${fmtPct(approxPriceImpactUp)} (opposite direction to the yield move), before considering convexity.`,
    explanation:
      mode === 'standard'
        ? 'This is a central-difference duration estimate for fixed contractual cash flows. It does not model call, put, prepayment, or other embedded-option cash-flow changes. Actual finite shifts can differ because price–yield is nonlinear; use scenario mode with option-aware prices for true effective duration on option-embedded bonds.'
        : 'Scenario mode applies the effective-duration formula to supplied prices. For option-embedded bonds, those prices must come from consistent valuations that allow cash flows to change with yields.',
    modeLabel,
  };
}

export function calculateEffectiveDurationFromInput(
  input: EffectiveDurationInput,
): EffectiveDurationResult | null {
  const dyPct = num(input.yieldDifferentialPercent);
  if (dyPct == null || dyPct <= 0) return null;
  const yieldDifferentialDecimal = pctToDecimal(dyPct);

  if (input.mode === 'scenario') {
    const p0 = num(input.basePrice);
    const pDown = num(input.priceYieldDown);
    const pUp = num(input.priceYieldUp);
    if (p0 == null || pDown == null || pUp == null) return null;
    const duration = calculateEffectiveDuration(
      pDown,
      pUp,
      p0,
      yieldDifferentialDecimal,
    );
    if (duration === null) return null;
    return buildResult({
      mode: 'scenario',
      currency: input.currency,
      couponPerPeriod: 0,
      annualCoupon: 0,
      faceValue: 0,
      annualCouponRatePercent: 0,
      frequency: input.frequency,
      paymentsPerYear: BOND_FREQUENCY_MAP[input.frequency],
      yearsToMaturity: 0,
      yieldToMaturityPercent: 0,
      yieldDifferentialDecimal,
      basePrice: p0,
      priceYieldDown: pDown,
      priceYieldUp: pUp,
      effectiveDuration: duration,
    });
  }

  const face = num(input.faceValue);
  const couponPct = num(input.annualCouponRatePercent);
  const years = num(input.yearsToMaturity);
  const ytmPct = num(input.yieldToMaturityPercent);
  if (face == null || couponPct == null || years == null || ytmPct == null) {
    return null;
  }
  if (face <= 0 || couponPct < 0 || years <= 0) return null;

  const m = BOND_FREQUENCY_MAP[input.frequency];
  if (!m) return null;

  const c = pctToDecimal(couponPct);
  const y = pctToDecimal(ytmPct);

  const basePrice = calculateBondPrice(face, c, y, years, m);
  const priceYieldDown = calculateBondPrice(
    face,
    c,
    y - yieldDifferentialDecimal,
    years,
    m,
  );
  const priceYieldUp = calculateBondPrice(
    face,
    c,
    y + yieldDifferentialDecimal,
    years,
    m,
  );
  if (
    basePrice === null ||
    priceYieldDown === null ||
    priceYieldUp === null
  ) {
    return null;
  }

  const duration = calculateEffectiveDuration(
    priceYieldDown,
    priceYieldUp,
    basePrice,
    yieldDifferentialDecimal,
  );
  if (duration === null) return null;

  const annualCoupon = face * c;
  const couponPerPeriod = annualCoupon / m;

  return buildResult({
    mode: 'standard',
    currency: input.currency,
    couponPerPeriod,
    annualCoupon,
    faceValue: face,
    annualCouponRatePercent: couponPct,
    frequency: input.frequency,
    paymentsPerYear: m,
    yearsToMaturity: years,
    yieldToMaturityPercent: ytmPct,
    yieldDifferentialDecimal,
    basePrice,
    priceYieldDown,
    priceYieldUp,
    effectiveDuration: duration,
  });
}
