import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  FREQUENCY_MAP,
  frequencyLabel,
  type CouponFrequency,
  type CouponRateInput,
  type CouponRateResult,
  type CouponSolveTarget,
} from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundRate(n: number): number {
  return Math.round(n * 1e10) / 1e10;
}

function fmtPct(n: number): string {
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}%`;
}

export function paymentsPerYear(frequency: CouponFrequency): number {
  return FREQUENCY_MAP[frequency];
}

/**
 * Pure coupon-rate engine for fixed-coupon bonds.
 * r% = (C_period × f / F) × 100. Zero coupons allowed; never returns Infinity/NaN.
 */
export function calculateCouponRate(
  input: CouponRateInput
): CouponRateResult | null {
  const { currency, solveTarget, frequency } = input;
  const f = paymentsPerYear(frequency);
  if (!f || f <= 0) return null;

  const faceIn = num(input.faceValue);
  const periodIn = num(input.couponPerPeriod);
  const annualIn = num(input.annualCoupon);
  const ratePctIn = num(input.couponRatePercent);

  let faceValue: number;
  let couponPerPeriod: number;
  let annualCoupon: number;
  let couponRatePercent: number;
  const steps: string[] = [];

  if (solveTarget === 'couponRate') {
    if (faceIn == null || faceIn <= 0 || periodIn == null || periodIn < 0) {
      return null;
    }
    faceValue = faceIn;
    couponPerPeriod = periodIn;
    annualCoupon = roundMoney(couponPerPeriod * f);
    couponRatePercent = roundRate((annualCoupon / faceValue) * 100);
    steps.push(
      `Annual coupon = ${formatCurrencyValue(couponPerPeriod, currency)} × ${f} = ${formatCurrencyValue(annualCoupon, currency)}.`
    );
    steps.push(
      `Coupon rate = (${formatCurrencyValue(annualCoupon, currency)} / ${formatCurrencyValue(faceValue, currency)}) × 100 = ${fmtPct(couponRatePercent)}.`
    );
  } else if (solveTarget === 'couponPerPeriod') {
    if (
      faceIn == null ||
      faceIn <= 0 ||
      ratePctIn == null ||
      ratePctIn < 0
    ) {
      return null;
    }
    faceValue = faceIn;
    couponRatePercent = ratePctIn;
    annualCoupon = roundMoney(faceValue * (couponRatePercent / 100));
    couponPerPeriod = roundMoney(annualCoupon / f);
    steps.push(
      `Annual coupon = ${formatCurrencyValue(faceValue, currency)} × ${fmtPct(couponRatePercent)} = ${formatCurrencyValue(annualCoupon, currency)}.`
    );
    steps.push(
      `Coupon per period = ${formatCurrencyValue(annualCoupon, currency)} / ${f} = ${formatCurrencyValue(couponPerPeriod, currency)}.`
    );
  } else if (solveTarget === 'annualCoupon') {
    if (
      faceIn == null ||
      faceIn <= 0 ||
      ratePctIn == null ||
      ratePctIn < 0
    ) {
      return null;
    }
    faceValue = faceIn;
    couponRatePercent = ratePctIn;
    annualCoupon = roundMoney(faceValue * (couponRatePercent / 100));
    couponPerPeriod = roundMoney(annualCoupon / f);
    steps.push(
      `Annual coupon = F × r = ${formatCurrencyValue(faceValue, currency)} × (${couponRatePercent}/100) = ${formatCurrencyValue(annualCoupon, currency)}.`
    );
    steps.push(
      `Coupon per period = ${formatCurrencyValue(annualCoupon, currency)} / ${f} = ${formatCurrencyValue(couponPerPeriod, currency)}.`
    );
  } else if (solveTarget === 'faceValue') {
    if (
      annualIn == null ||
      annualIn < 0 ||
      ratePctIn == null ||
      ratePctIn <= 0
    ) {
      return null;
    }
    annualCoupon = annualIn;
    couponRatePercent = ratePctIn;
    faceValue = roundMoney(annualCoupon / (couponRatePercent / 100));
    couponPerPeriod = roundMoney(annualCoupon / f);
    steps.push(
      `Face value = C_annual / r = ${formatCurrencyValue(annualCoupon, currency)} / (${couponRatePercent}/100) = ${formatCurrencyValue(faceValue, currency)}.`
    );
    steps.push(
      `Coupon per period = ${formatCurrencyValue(annualCoupon, currency)} / ${f} = ${formatCurrencyValue(couponPerPeriod, currency)}.`
    );
  } else {
    return null;
  }

  if (
    ![faceValue, couponPerPeriod, annualCoupon, couponRatePercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  const couponRateDecimal = couponRatePercent / 100;
  const isZeroCoupon = annualCoupon === 0;
  const label = frequencyLabel(frequency);

  const interpretation = isZeroCoupon
    ? 'A zero-coupon bond does not make periodic coupon payments. Investor return typically comes from the difference between purchase price and redemption value, subject to the bond’s terms.'
    : `This bond has a ${fmtPct(couponRatePercent)} annual coupon rate. Based on its ${formatCurrencyValue(faceValue, currency)} face value, it pays ${formatCurrencyValue(annualCoupon, currency)} in interest annually, divided into ${f} payment(s) of ${formatCurrencyValue(couponPerPeriod, currency)}.`;

  return {
    currency,
    solveTarget,
    frequency,
    frequencyLabel: label,
    paymentsPerYear: f,
    faceValue,
    couponPerPeriod,
    annualCoupon,
    couponRateDecimal,
    couponRatePercent,
    isZeroCoupon,
    formattedFaceValue: formatCurrencyValue(faceValue, currency),
    formattedCouponPerPeriod: formatCurrencyValue(couponPerPeriod, currency),
    formattedAnnualCoupon: formatCurrencyValue(annualCoupon, currency),
    formattedCouponRate: fmtPct(couponRatePercent),
    formulaBreakdown: [
      'C_annual = C_period × f',
      'r% = (C_annual / F) × 100',
      'C_annual = F × (r% / 100)',
      'C_period = C_annual / f',
      'F = C_annual / (r% / 100)',
    ].join('\n'),
    steps,
    interpretation,
    explanation:
      'Coupon rate is contractual interest relative to face (par) value; not current yield or YTM. Currency is denomination only (not FX). Fixed-rate coupons generally do not change when market yields move; prices do.',
  };
}

export function solveTargets(): CouponSolveTarget[] {
  return ['couponRate', 'couponPerPeriod', 'annualCoupon', 'faceValue'];
}
