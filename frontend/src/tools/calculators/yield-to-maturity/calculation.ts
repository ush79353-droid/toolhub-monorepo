/**
 * Yield to Maturity Calculator — pure engine (ADR-018).
 *
 * P = Σ C/(1+y/m)^t + F/(1+y/m)^N
 * Solved for y via bounded bisection (zero-coupon closed form).
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  BondPriceRelation,
  CouponFrequency,
  YieldToMaturityInput,
  YieldToMaturityResult,
} from './types';

const MAX_PERIODS = 100_000;
const YIELD_ABS_MAX = 10;
const ROOT_TOL = 1e-12;
const PERIOD_INT_TOL = 1e-9;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/** Coupon-date clean price from annual nominal yield y (decimal). */
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
  if (y <= -m) return null;

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

function findYieldRoot(
  F: number,
  P: number,
  N: number,
  C: number,
  m: number,
): number | null {
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

export function resolvePeriods(
  yearsToMaturity: number,
  m: CouponFrequency,
): number | null {
  if (!(yearsToMaturity > 0) || !Number.isFinite(yearsToMaturity)) return null;
  const raw = yearsToMaturity * m;
  if (
    !Number.isFinite(raw) ||
    raw <= 0 ||
    Math.abs(raw - Math.round(raw)) > PERIOD_INT_TOL
  ) {
    return null;
  }
  const N = Math.round(raw);
  if (N > MAX_PERIODS) return null;
  return N;
}

export function calculateYTM(inputs: {
  faceValue: number;
  bondPrice: number;
  annualCouponRate: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
}): {
  yieldToMaturityPercent: number;
  periodicYieldPercent: number;
  effectiveAnnualYieldPercent: number;
  couponPayment: number;
  annualCouponIncome: number;
  numberOfPeriods: number;
  totalCouponIncome: number;
  totalCashReceived: number;
  capitalGainOrLoss: number;
} | null {
  const {
    faceValue: F,
    bondPrice: P,
    annualCouponRate,
    couponFrequency: m,
    yearsToMaturity,
  } = inputs;
  if (![F, P, annualCouponRate, yearsToMaturity].every(Number.isFinite)) {
    return null;
  }
  if (!(F > 0) || !(P > 0) || !(yearsToMaturity > 0) || annualCouponRate < 0) {
    return null;
  }
  if (![1, 2, 4, 12].includes(m)) return null;

  const N = resolvePeriods(yearsToMaturity, m);
  if (N === null) return null;

  const c = annualCouponRate / 100;
  const C = (F * c) / m;
  if (!(C >= 0) || !Number.isFinite(C)) return null;

  const y = findYieldRoot(F, P, N, C, m);
  if (y === null || !Number.isFinite(y) || y <= -m) return null;

  const periodic = y / m;
  const eay = Math.pow(1 + periodic, m) - 1;
  if (!Number.isFinite(eay)) return null;

  const annualCouponIncome = C * m;
  const totalCouponIncome = C * N;
  const totalCashReceived = totalCouponIncome + F;
  const capitalGainOrLoss = F - P;

  return {
    yieldToMaturityPercent: y * 100,
    periodicYieldPercent: periodic * 100,
    effectiveAnnualYieldPercent: eay * 100,
    couponPayment: C,
    annualCouponIncome,
    numberOfPeriods: N,
    totalCouponIncome,
    totalCashReceived,
    capitalGainOrLoss,
  };
}

export function calculateBondPriceFromYtm(opts: {
  faceValue: number;
  annualCouponRatePercent: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
}): number | null {
  const {
    faceValue: F,
    annualCouponRatePercent,
    couponFrequency: m,
    yearsToMaturity,
    yieldToMaturityPercent,
  } = opts;
  if (
    ![F, annualCouponRatePercent, yearsToMaturity, yieldToMaturityPercent].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (!(F > 0) || !(yearsToMaturity > 0) || annualCouponRatePercent < 0) {
    return null;
  }
  const N = resolvePeriods(yearsToMaturity, m);
  if (N === null) return null;
  const y = yieldToMaturityPercent / 100;
  if (y <= -m) return null;
  const C = (F * (annualCouponRatePercent / 100)) / m;
  return bondPriceFromYield({
    faceValue: F,
    yieldAnnual: y,
    totalPeriods: N,
    couponPerPeriod: C,
    periodsPerYear: m,
  });
}

export function calculateFaceValueFromYtm(opts: {
  bondPrice: number;
  annualCouponRatePercent: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
}): number | null {
  const {
    bondPrice: P,
    annualCouponRatePercent,
    couponFrequency: m,
    yearsToMaturity,
    yieldToMaturityPercent,
  } = opts;
  if (
    ![P, annualCouponRatePercent, yearsToMaturity, yieldToMaturityPercent].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (!(P > 0) || !(yearsToMaturity > 0) || annualCouponRatePercent < 0) {
    return null;
  }
  const N = resolvePeriods(yearsToMaturity, m);
  if (N === null) return null;
  const y = yieldToMaturityPercent / 100;
  if (y <= -m) return null;
  const c = annualCouponRatePercent / 100;
  const r = y / m;

  let unitPrice: number;
  if (Math.abs(r) < 1e-15) {
    unitPrice = (c / m) * N + 1;
  } else {
    const dfN = Math.pow(1 + r, -N);
    if (!Number.isFinite(dfN)) return null;
    const annuity = (1 - dfN) / r;
    if (!Number.isFinite(annuity)) return null;
    unitPrice = (c / m) * annuity + dfN;
  }
  if (!(unitPrice > 0) || !Number.isFinite(unitPrice)) return null;
  const F = P / unitPrice;
  return Number.isFinite(F) && F > 0 ? F : null;
}

export function calculateCouponRateFromYtm(opts: {
  faceValue: number;
  bondPrice: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
}): number | null {
  const {
    faceValue: F,
    bondPrice: P,
    couponFrequency: m,
    yearsToMaturity,
    yieldToMaturityPercent,
  } = opts;
  if (
    ![F, P, yearsToMaturity, yieldToMaturityPercent].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(F > 0) || !(P > 0) || !(yearsToMaturity > 0)) return null;
  const N = resolvePeriods(yearsToMaturity, m);
  if (N === null) return null;
  const y = yieldToMaturityPercent / 100;
  if (y <= -m) return null;
  const r = y / m;

  let annuity: number;
  let dfN: number;
  if (Math.abs(r) < 1e-15) {
    annuity = N;
    dfN = 1;
  } else {
    dfN = Math.pow(1 + r, -N);
    if (!Number.isFinite(dfN)) return null;
    annuity = (1 - dfN) / r;
    if (!Number.isFinite(annuity) || Math.abs(annuity) < 1e-15) return null;
  }

  // P = (F*c/m)*annuity + F*dfN  →  c = (P − F*dfN) * m / (F * annuity)
  const c = ((P - F * dfN) * m) / (F * annuity);
  if (!Number.isFinite(c) || c < 0) return null;
  return c * 100;
}

function relation(P: number, F: number): BondPriceRelation {
  const tol = Math.max(1e-9, Math.abs(F) * 1e-12);
  if (Math.abs(P - F) <= tol) return 'par';
  return P < F ? 'discount' : 'premium';
}

export function calculateYieldToMaturityFromInput(
  input: YieldToMaturityInput,
): YieldToMaturityResult | null {
  const { solveTarget, currency, couponFrequency: m } = input;
  const years = num(input.yearsToMaturity);
  if (years == null) return null;

  let F: number;
  let P: number;
  let couponRatePercent: number;
  let ytmPercent: number;

  if (solveTarget === 'ytm') {
    const face = num(input.faceValue);
    const price = num(input.bondPrice);
    const coup = num(input.annualCouponRatePercent);
    if (face == null || price == null || coup == null) return null;
    const calc = calculateYTM({
      faceValue: face,
      bondPrice: price,
      annualCouponRate: coup,
      couponFrequency: m,
      yearsToMaturity: years,
    });
    if (!calc) return null;
    F = face;
    P = price;
    couponRatePercent = coup;
    ytmPercent = calc.yieldToMaturityPercent;
    return buildResult({
      solveTarget,
      currency,
      F,
      P,
      couponRatePercent,
      m,
      years,
      ytmPercent,
      calc,
    });
  }

  if (solveTarget === 'bondPrice') {
    const face = num(input.faceValue);
    const coup = num(input.annualCouponRatePercent);
    const ytm = num(input.yieldToMaturityPercent);
    if (face == null || coup == null || ytm == null) return null;
    const price = calculateBondPriceFromYtm({
      faceValue: face,
      annualCouponRatePercent: coup,
      couponFrequency: m,
      yearsToMaturity: years,
      yieldToMaturityPercent: ytm,
    });
    if (price === null) return null;
    F = face;
    P = price;
    couponRatePercent = coup;
    ytmPercent = ytm;
  } else if (solveTarget === 'faceValue') {
    const price = num(input.bondPrice);
    const coup = num(input.annualCouponRatePercent);
    const ytm = num(input.yieldToMaturityPercent);
    if (price == null || coup == null || ytm == null) return null;
    const face = calculateFaceValueFromYtm({
      bondPrice: price,
      annualCouponRatePercent: coup,
      couponFrequency: m,
      yearsToMaturity: years,
      yieldToMaturityPercent: ytm,
    });
    if (face === null) return null;
    F = face;
    P = price;
    couponRatePercent = coup;
    ytmPercent = ytm;
  } else {
    const face = num(input.faceValue);
    const price = num(input.bondPrice);
    const ytm = num(input.yieldToMaturityPercent);
    if (face == null || price == null || ytm == null) return null;
    const coup = calculateCouponRateFromYtm({
      faceValue: face,
      bondPrice: price,
      couponFrequency: m,
      yearsToMaturity: years,
      yieldToMaturityPercent: ytm,
    });
    if (coup === null) return null;
    F = face;
    P = price;
    couponRatePercent = coup;
    ytmPercent = ytm;
  }

  const calc = calculateYTM({
    faceValue: F,
    bondPrice: P,
    annualCouponRate: couponRatePercent,
    couponFrequency: m,
    yearsToMaturity: years,
  });
  if (!calc) return null;
  // Prefer entered/solved YTM for reverse modes so display matches inputs;
  // recalc fills derived cash-flow metrics.
  return buildResult({
    solveTarget,
    currency,
    F,
    P,
    couponRatePercent,
    m,
    years,
    ytmPercent,
    calc: { ...calc, yieldToMaturityPercent: ytmPercent },
  });
}

function buildResult(args: {
  solveTarget: YieldToMaturityResult['solveTarget'];
  currency: YieldToMaturityInput['currency'];
  F: number;
  P: number;
  couponRatePercent: number;
  m: CouponFrequency;
  years: number;
  ytmPercent: number;
  calc: NonNullable<ReturnType<typeof calculateYTM>>;
}): YieldToMaturityResult {
  const {
    solveTarget,
    currency,
    F,
    P,
    couponRatePercent,
    m,
    years,
    ytmPercent,
    calc,
  } = args;

  const y = ytmPercent / 100;
  const periodic = y / m;
  const eay = Math.pow(1 + periodic, m) - 1;
  const currentYield =
    P > 0 ? (calc.annualCouponIncome / P) * 100 : Number.NaN;
  const rel = relation(P, F);

  const interpretation =
    rel === 'discount'
      ? `This bond trades below its ${formatCurrencyValue(F, currency)} face value at a price of ${formatCurrencyValue(P, currency)}. Its yield to maturity (${formatPercent(ytmPercent)}) is higher than its ${formatPercent(couponRatePercent)} coupon rate because an investor holding to maturity receives coupon payments and the capital gain to face value, assuming all promised payments are made.`
      : rel === 'premium'
        ? `This bond trades above face value. Its yield to maturity (${formatPercent(ytmPercent)}) is below the ${formatPercent(couponRatePercent)} coupon rate because the premium amortizes over the remaining term under the standard model, assuming payments are made as promised.`
        : `This bond is priced at par. Under the standard fixed-coupon model, yield to maturity equals the coupon rate (${formatPercent(couponRatePercent)}).`;

  const explanation =
    'YTM is the internal rate of return that equates the bond price with the present value of remaining coupons and principal. It assumes the bond is held to maturity, coupons are paid as scheduled, and interim coupons are reinvested at the YTM — it is not a guaranteed return and ignores taxes, fees, and default.';

  const formulaBreakdown = [
    'P = Σ C/(1+y/m)^t + F/(1+y/m)^N',
    `C = F × c / m = ${formatCurrencyValue(F, currency)} × ${couponRatePercent / 100} / ${m} = ${formatCurrencyValue(calc.couponPayment, currency)}`,
    `N = m × T = ${m} × ${years} = ${calc.numberOfPeriods}`,
    `Nominal annual YTM y = ${formatPercent(ytmPercent)}`,
    `Periodic yield = y/m = ${formatPercent(periodic * 100)}`,
    `Effective annual yield = (1+y/m)^m − 1 = ${formatPercent(eay * 100)}`,
  ].join('\n');

  const steps = [
    `Face value F = ${formatCurrencyValue(F, currency)}`,
    `Bond price P = ${formatCurrencyValue(P, currency)}`,
    `Annual coupon rate c = ${formatPercent(couponRatePercent)}`,
    `Coupon frequency m = ${m}`,
    `Years to maturity T = ${years}`,
    `Periods N = ${calc.numberOfPeriods}; coupon/period C = ${formatCurrencyValue(calc.couponPayment, currency)}`,
    `Solve P = PV(y) by bisection (or closed form if C = 0) → y = ${formatPercent(ytmPercent)}`,
  ];

  return {
    solveTarget,
    currency,
    faceValue: F,
    bondPrice: P,
    annualCouponRatePercent: couponRatePercent,
    couponFrequency: m,
    yearsToMaturity: years,
    yieldToMaturityPercent: ytmPercent,
    periodicYieldPercent: periodic * 100,
    effectiveAnnualYieldPercent: eay * 100,
    currentYieldPercent: currentYield,
    couponPayment: calc.couponPayment,
    annualCouponIncome: calc.annualCouponIncome,
    numberOfPeriods: calc.numberOfPeriods,
    totalCouponIncome: calc.totalCouponIncome,
    totalCashReceived: calc.totalCashReceived,
    capitalGainOrLoss: calc.capitalGainOrLoss,
    relation: rel,
    formattedFace: formatCurrencyValue(F, currency),
    formattedPrice: formatCurrencyValue(P, currency),
    formattedCouponRate: formatPercent(couponRatePercent),
    formattedYtm: formatPercent(ytmPercent),
    formattedPeriodicYield: formatPercent(periodic * 100),
    formattedEay: formatPercent(eay * 100),
    formattedCurrentYield: Number.isFinite(currentYield)
      ? formatPercent(currentYield)
      : '—',
    formattedCouponPayment: formatCurrencyValue(calc.couponPayment, currency),
    formattedAnnualCoupon: formatCurrencyValue(
      calc.annualCouponIncome,
      currency,
    ),
    formattedTotalCoupons: formatCurrencyValue(
      calc.totalCouponIncome,
      currency,
    ),
    formattedTotalCash: formatCurrencyValue(calc.totalCashReceived, currency),
    formattedCapitalGainLoss: formatCurrencyValue(
      calc.capitalGainOrLoss,
      currency,
    ),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
