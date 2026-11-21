import type {
  BondResult,
  BondSolveTarget,
  CouponFrequency,
  CouponMode,
} from './types';

export const PERIODS_PER_YEAR: Record<CouponFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
};

export const FREQUENCY_LABEL: Record<CouponFrequency, string> = {
  annually: 'annually',
  semiannually: 'semiannually',
  quarterly: 'quarterly',
  monthly: 'monthly',
};

const MAX_PERIODS = 1200;
const YIELD_ABS_MAX = 10; // 1000% annual — search ceiling
const PRICE_MATCH_TOL = 1e-7;
const ROOT_TOL = 1e-12;

export function formatBondUsd(amount: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatBondPercent(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatBondYears(years: number): string {
  const digits = Number.isInteger(years) ? 0 : 4;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: 4,
  }).format(years);
}

/** Coupon payment per period from annual coupon mode. */
export function couponPerPeriod(
  annualCoupon: number,
  couponMode: CouponMode,
  faceValue: number,
  m: number
): number {
  if (couponMode === 'percent') {
    return ((annualCoupon / 100) * faceValue) / m;
  }
  return annualCoupon / m;
}

/**
 * Coupon-date bond price:
 * P = Σ_{t=1}^{N} C / (1 + y/m)^t + F / (1 + y/m)^N
 */
export function bondPrice(opts: {
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
    return C * N + F;
  }

  const onePlusR = 1 + r;
  const dfN = Math.pow(onePlusR, -N);
  if (!Number.isFinite(dfN)) return null;

  // Annuity factor: Σ (1+r)^{-t} = (1 − (1+r)^{-N}) / r
  const annuity = (1 - dfN) / r;
  if (!Number.isFinite(annuity)) return null;

  const price = C * annuity + F * dfN;
  return Number.isFinite(price) ? price : null;
}

function annuityFactor(r: number, N: number): number | null {
  if (Math.abs(r) < 1e-15) return N;
  const dfN = Math.pow(1 + r, -N);
  if (!Number.isFinite(dfN)) return null;
  const a = (1 - dfN) / r;
  return Number.isFinite(a) ? a : null;
}

export function solveBondPrice(input: {
  faceValue: number;
  yieldPercent: number;
  timeToMaturityYears: number;
  annualCoupon: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}): { ok: true; value: number; totalPeriods: number; couponPerPeriod: number } | { ok: false; message: string } {
  const m = PERIODS_PER_YEAR[input.couponFrequency];
  const years = input.timeToMaturityYears;
  const N = years * m;
  if (!Number.isFinite(N) || N <= 0 || !Number.isInteger(N) || N > MAX_PERIODS) {
    return {
      ok: false,
      message:
        'Time to maturity × coupon frequency must be a positive whole number of periods (coupon date).',
    };
  }
  const C = couponPerPeriod(input.annualCoupon, input.couponMode, input.faceValue, m);
  if (!(C >= 0) || !Number.isFinite(C)) {
    return { ok: false, message: 'Annual coupon must be zero or positive.' };
  }
  const y = input.yieldPercent / 100;
  const P = bondPrice({
    faceValue: input.faceValue,
    yieldAnnual: y,
    totalPeriods: N,
    couponPerPeriod: C,
    periodsPerYear: m,
  });
  if (P === null || !(P > 0)) {
    return { ok: false, message: 'Could not compute a valid bond price for these inputs.' };
  }
  return { ok: true, value: P, totalPeriods: N, couponPerPeriod: C };
}

export function solveBondFaceValue(input: {
  price: number;
  yieldPercent: number;
  timeToMaturityYears: number;
  annualCoupon: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}): { ok: true; value: number; totalPeriods: number; couponPerPeriod: number } | { ok: false; message: string } {
  const m = PERIODS_PER_YEAR[input.couponFrequency];
  const N = input.timeToMaturityYears * m;
  if (!Number.isFinite(N) || N <= 0 || !Number.isInteger(N) || N > MAX_PERIODS) {
    return {
      ok: false,
      message:
        'Time to maturity × coupon frequency must be a positive whole number of periods (coupon date).',
    };
  }
  const y = input.yieldPercent / 100;
  if (y <= -m) {
    return { ok: false, message: 'Yield is too low for this coupon frequency.' };
  }
  const r = y / m;
  const a = annuityFactor(r, N);
  if (a === null) {
    return { ok: false, message: 'Could not solve for face value.' };
  }
  const dfN = Math.abs(r) < 1e-15 ? 1 : Math.pow(1 + r, -N);

  let F: number;
  if (input.couponMode === 'percent') {
    // C = (c/100)·F/m  →  P = F · ((c/100)/m · a + dfN)
    const c = input.annualCoupon;
    if (!(c >= 0)) {
      return { ok: false, message: 'Annual coupon rate cannot be negative.' };
    }
    const factor = (c / 100 / m) * a + dfN;
    if (!(factor > 0) || !Number.isFinite(factor)) {
      return { ok: false, message: 'Could not solve for face value.' };
    }
    F = input.price / factor;
  } else {
    // Fixed annual coupon amount A: C = A/m independent of F
    const A = input.annualCoupon;
    if (!(A >= 0)) {
      return { ok: false, message: 'Annual coupon amount cannot be negative.' };
    }
    const C = A / m;
    const remainder = input.price - C * a;
    if (!Number.isFinite(remainder)) {
      return { ok: false, message: 'Could not solve for face value.' };
    }
    if (Math.abs(dfN) < 1e-18) {
      return { ok: false, message: 'Could not solve for face value.' };
    }
    F = remainder / dfN;
  }

  if (!(F > 0) || !Number.isFinite(F)) {
    return { ok: false, message: 'No positive face value satisfies these inputs.' };
  }
  const C = couponPerPeriod(input.annualCoupon, input.couponMode, F, m);
  return { ok: true, value: F, totalPeriods: N, couponPerPeriod: C };
}

export function solveBondAnnualCoupon(input: {
  price: number;
  faceValue: number;
  yieldPercent: number;
  timeToMaturityYears: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}): { ok: true; value: number; totalPeriods: number; couponPerPeriod: number } | { ok: false; message: string } {
  const m = PERIODS_PER_YEAR[input.couponFrequency];
  const N = input.timeToMaturityYears * m;
  if (!Number.isFinite(N) || N <= 0 || !Number.isInteger(N) || N > MAX_PERIODS) {
    return {
      ok: false,
      message:
        'Time to maturity × coupon frequency must be a positive whole number of periods (coupon date).',
    };
  }
  const y = input.yieldPercent / 100;
  if (y <= -m) {
    return { ok: false, message: 'Yield is too low for this coupon frequency.' };
  }
  const r = y / m;
  const a = annuityFactor(r, N);
  const dfN = Math.abs(r) < 1e-15 ? 1 : Math.pow(1 + r, -N);
  if (a === null || !(a > 0)) {
    return { ok: false, message: 'Could not solve for annual coupon.' };
  }
  const C = (input.price - input.faceValue * dfN) / a;
  if (!Number.isFinite(C) || C < -1e-9) {
    return { ok: false, message: 'No non-negative coupon satisfies these inputs.' };
  }
  const Cclamped = Math.max(0, C);
  const annual =
    input.couponMode === 'percent'
      ? (Cclamped * m * 100) / input.faceValue
      : Cclamped * m;
  if (!Number.isFinite(annual) || annual < 0) {
    return { ok: false, message: 'Could not solve for annual coupon.' };
  }
  return { ok: true, value: annual, totalPeriods: N, couponPerPeriod: Cclamped };
}

function priceAtYield(
  y: number,
  F: number,
  N: number,
  C: number,
  m: number
): number | null {
  return bondPrice({
    faceValue: F,
    yieldAnnual: y,
    totalPeriods: N,
    couponPerPeriod: C,
    periodsPerYear: m,
  });
}

/** Brent-style bisection on f(y) = price(y) − P. */
function findYieldRoot(
  F: number,
  P: number,
  N: number,
  C: number,
  m: number
): number | null {
  // Zero-coupon closed form when C ≈ 0
  if (C <= 1e-15) {
    if (!(P > 0) || !(F > 0)) return null;
    const ratio = F / P;
    if (!(ratio > 0)) return null;
    const y = m * (Math.pow(ratio, 1 / N) - 1);
    return Number.isFinite(y) && y > -m ? y : null;
  }

  const f = (y: number) => {
    const px = priceAtYield(y, F, N, C, m);
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
    // Try narrowing from a mid guess near coupon rate
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

export function solveBondYield(input: {
  price: number;
  faceValue: number;
  timeToMaturityYears: number;
  annualCoupon: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}): { ok: true; value: number; totalPeriods: number; couponPerPeriod: number } | { ok: false; message: string } {
  const m = PERIODS_PER_YEAR[input.couponFrequency];
  const N = input.timeToMaturityYears * m;
  if (!Number.isFinite(N) || N <= 0 || !Number.isInteger(N) || N > MAX_PERIODS) {
    return {
      ok: false,
      message:
        'Time to maturity × coupon frequency must be a positive whole number of periods (coupon date).',
    };
  }
  if (!(input.price > 0) || !(input.faceValue > 0)) {
    return { ok: false, message: 'Price and face value must be positive.' };
  }
  const C = couponPerPeriod(input.annualCoupon, input.couponMode, input.faceValue, m);
  if (!(C >= 0) || !Number.isFinite(C)) {
    return { ok: false, message: 'Annual coupon must be zero or positive.' };
  }
  const y = findYieldRoot(input.faceValue, input.price, N, C, m);
  if (y === null || !Number.isFinite(y) || y <= -m) {
    return { ok: false, message: 'Could not find a convergent yield for these inputs.' };
  }
  return { ok: true, value: y * 100, totalPeriods: N, couponPerPeriod: C };
}

export function solveBondTimeToMaturity(input: {
  price: number;
  faceValue: number;
  yieldPercent: number;
  annualCoupon: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}): { ok: true; value: number; totalPeriods: number; couponPerPeriod: number } | { ok: false; message: string } {
  const m = PERIODS_PER_YEAR[input.couponFrequency];
  const y = input.yieldPercent / 100;
  if (y <= -m) {
    return { ok: false, message: 'Yield is too low for this coupon frequency.' };
  }
  if (!(input.price > 0) || !(input.faceValue > 0)) {
    return { ok: false, message: 'Price and face value must be positive.' };
  }
  const C = couponPerPeriod(input.annualCoupon, input.couponMode, input.faceValue, m);
  if (!(C >= 0) || !Number.isFinite(C)) {
    return { ok: false, message: 'Annual coupon must be zero or positive.' };
  }

  // Zero periods immediately at face — not useful; search N = 1..MAX
  let bestN: number | null = null;
  let bestErr = Infinity;

  for (let N = 1; N <= MAX_PERIODS; N += 1) {
    const px = bondPrice({
      faceValue: input.faceValue,
      yieldAnnual: y,
      totalPeriods: N,
      couponPerPeriod: C,
      periodsPerYear: m,
    });
    if (px === null) continue;
    const err = Math.abs(px - input.price);
    if (err < bestErr) {
      bestErr = err;
      bestN = N;
      if (err < PRICE_MATCH_TOL) break;
    }
  }

  if (bestN === null || bestErr > Math.max(1e-4, Math.abs(input.price) * 1e-6)) {
    return {
      ok: false,
      message:
        'No coupon-date maturity (whole number of periods) matches this price closely enough.',
    };
  }

  const years = bestN / m;
  return { ok: true, value: years, totalPeriods: bestN, couponPerPeriod: C };
}

export interface BondEngineInput {
  solveFor: BondSolveTarget;
  price?: number;
  faceValue?: number;
  yieldPercent?: number;
  timeToMaturityYears?: number;
  annualCoupon?: number;
  couponMode: CouponMode;
  couponFrequency: CouponFrequency;
}

function givenLabels(solved: BondSolveTarget): string {
  const all: BondSolveTarget[] = [
    'price',
    'faceValue',
    'yield',
    'timeToMaturity',
    'annualCoupon',
  ];
  const names: Record<BondSolveTarget, string> = {
    price: 'price',
    faceValue: 'face value',
    yield: 'yield',
    timeToMaturity: 'time to maturity',
    annualCoupon: 'annual coupon',
  };
  return all
    .filter((f) => f !== solved)
    .map((f) => names[f])
    .join(', ');
}

function solvedLead(solved: BondSolveTarget): string {
  switch (solved) {
    case 'price':
      return 'the price is:';
    case 'faceValue':
      return 'the face value is:';
    case 'yield':
      return 'the yield is:';
    case 'timeToMaturity':
      return 'the time to maturity is:';
    case 'annualCoupon':
      return 'the annual coupon is:';
  }
}

function solvedValue(
  solved: BondSolveTarget,
  formatted: string,
  couponMode: CouponMode
): string {
  switch (solved) {
    case 'price':
    case 'faceValue':
      return `$${formatted}`;
    case 'yield':
      return `${formatted}%`;
    case 'timeToMaturity':
      return `${formatted} years`;
    case 'annualCoupon':
      return couponMode === 'percent' ? `${formatted}%` : `$${formatted}`;
  }
}

/**
 * Solve exactly one unknown among price, face, yield, maturity, annual coupon.
 * Coupon frequency is always known.
 */
export function calculateBond(input: BondEngineInput): BondResult | null {
  const m = PERIODS_PER_YEAR[input.couponFrequency];
  let price = input.price;
  let faceValue = input.faceValue;
  let yieldPercent = input.yieldPercent;
  let timeToMaturityYears = input.timeToMaturityYears;
  let annualCoupon = input.annualCoupon;
  let totalPeriods = 0;
  let C = 0;

  switch (input.solveFor) {
    case 'price': {
      if (
        faceValue === undefined ||
        yieldPercent === undefined ||
        timeToMaturityYears === undefined ||
        annualCoupon === undefined
      ) {
        return null;
      }
      const solved = solveBondPrice({
        faceValue,
        yieldPercent,
        timeToMaturityYears,
        annualCoupon,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!solved.ok) return null;
      price = solved.value;
      totalPeriods = solved.totalPeriods;
      C = solved.couponPerPeriod;
      break;
    }
    case 'faceValue': {
      if (
        price === undefined ||
        yieldPercent === undefined ||
        timeToMaturityYears === undefined ||
        annualCoupon === undefined
      ) {
        return null;
      }
      const solved = solveBondFaceValue({
        price,
        yieldPercent,
        timeToMaturityYears,
        annualCoupon,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!solved.ok) return null;
      faceValue = solved.value;
      totalPeriods = solved.totalPeriods;
      C = solved.couponPerPeriod;
      break;
    }
    case 'yield': {
      if (
        price === undefined ||
        faceValue === undefined ||
        timeToMaturityYears === undefined ||
        annualCoupon === undefined
      ) {
        return null;
      }
      const solved = solveBondYield({
        price,
        faceValue,
        timeToMaturityYears,
        annualCoupon,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!solved.ok) return null;
      yieldPercent = solved.value;
      totalPeriods = solved.totalPeriods;
      C = solved.couponPerPeriod;
      break;
    }
    case 'timeToMaturity': {
      if (
        price === undefined ||
        faceValue === undefined ||
        yieldPercent === undefined ||
        annualCoupon === undefined
      ) {
        return null;
      }
      const solved = solveBondTimeToMaturity({
        price,
        faceValue,
        yieldPercent,
        annualCoupon,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!solved.ok) return null;
      timeToMaturityYears = solved.value;
      totalPeriods = solved.totalPeriods;
      C = solved.couponPerPeriod;
      break;
    }
    case 'annualCoupon': {
      if (
        price === undefined ||
        faceValue === undefined ||
        yieldPercent === undefined ||
        timeToMaturityYears === undefined
      ) {
        return null;
      }
      const solved = solveBondAnnualCoupon({
        price,
        faceValue,
        yieldPercent,
        timeToMaturityYears,
        couponMode: input.couponMode,
        couponFrequency: input.couponFrequency,
      });
      if (!solved.ok) return null;
      annualCoupon = solved.value;
      totalPeriods = solved.totalPeriods;
      C = solved.couponPerPeriod;
      break;
    }
  }

  if (
    price === undefined ||
    faceValue === undefined ||
    yieldPercent === undefined ||
    timeToMaturityYears === undefined ||
    annualCoupon === undefined
  ) {
    return null;
  }

  const formattedPrice = formatBondUsd(price);
  const formattedFaceValue = formatBondUsd(faceValue);
  const formattedYieldPercent = formatBondPercent(yieldPercent);
  const formattedTimeToMaturityYears = formatBondYears(timeToMaturityYears);
  const formattedAnnualCoupon =
    input.couponMode === 'percent'
      ? formatBondPercent(annualCoupon)
      : formatBondUsd(annualCoupon);

  const solvedFormatted =
    input.solveFor === 'price'
      ? formattedPrice
      : input.solveFor === 'faceValue'
        ? formattedFaceValue
        : input.solveFor === 'yield'
          ? formattedYieldPercent
          : input.solveFor === 'timeToMaturity'
            ? formattedTimeToMaturityYears
            : formattedAnnualCoupon;

  const summaryLead = `Given the ${givenLabels(input.solveFor)}, ${solvedLead(input.solveFor)}`;
  const summaryValue = solvedValue(input.solveFor, solvedFormatted, input.couponMode);
  const summaryText = `${summaryLead} ${summaryValue}.`;

  return {
    solvedField: input.solveFor,
    price,
    faceValue,
    yieldPercent,
    timeToMaturityYears,
    annualCoupon,
    couponMode: input.couponMode,
    couponFrequency: input.couponFrequency,
    periodsPerYear: m,
    totalPeriods,
    couponPerPeriod: C,
    formattedPrice,
    formattedFaceValue,
    formattedYieldPercent,
    formattedTimeToMaturityYears,
    formattedAnnualCoupon,
    summaryLead,
    summaryValue,
    summaryText,
  };
}
