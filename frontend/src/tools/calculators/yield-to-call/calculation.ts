/**
 * Yield to Call Calculator — pure engine (ADR-018).
 *
 * Annual payment convention (matches screenshot “Annual interest”):
 *   P = Σ_{t=1}^{N} C/(1+y)^t + Call/(1+y)^N
 * Solved for y via bounded bisection (closed form when C = 0).
 * Not the rough [C + (Call−P)/N] / [(Call+P)/2] approximation.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  CallPriceRelation,
  YieldToCallInput,
  YieldToCallResult,
} from './types';

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

/** Clean price at the call horizon from annual yield y (decimal). */
export function callPriceFromYield(opts: {
  callPrice: number;
  yieldAnnual: number;
  yearsUntilCall: number;
  annualInterest: number;
}): number | null {
  const {
    callPrice: Call,
    yieldAnnual: y,
    yearsUntilCall: N,
    annualInterest: C,
  } = opts;
  if (![Call, y, N, C].every(Number.isFinite)) return null;
  if (!(Call > 0) || !(N > 0) || C < 0) return null;
  if (!Number.isInteger(N)) return null;
  if (y <= -1) return null;

  if (Math.abs(y) < 1e-15) {
    const flat = C * N + Call;
    return Number.isFinite(flat) ? flat : null;
  }

  const onePlus = 1 + y;
  const dfN = Math.pow(onePlus, -N);
  if (!Number.isFinite(dfN)) return null;
  const annuity = (1 - dfN) / y;
  if (!Number.isFinite(annuity)) return null;
  const price = C * annuity + Call * dfN;
  return Number.isFinite(price) ? price : null;
}

function findYieldRoot(
  Call: number,
  P: number,
  N: number,
  C: number,
): number | null {
  if (C <= 1e-15) {
    if (!(P > 0) || !(Call > 0)) return null;
    const ratio = Call / P;
    if (!(ratio > 0)) return null;
    const y = Math.pow(ratio, 1 / N) - 1;
    return Number.isFinite(y) && y > -1 ? y : null;
  }

  const f = (y: number) => {
    const px = callPriceFromYield({
      callPrice: Call,
      yieldAnnual: y,
      yearsUntilCall: N,
      annualInterest: C,
    });
    if (px === null) return null;
    return px - P;
  };

  let lo = -1 + 1e-12;
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
      if (g <= -1) continue;
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
    if (Math.abs(fm) < ROOT_TOL || hi - lo < 1e-14) {
      return Number.isFinite(mid) ? mid : null;
    }
    if (flo * fm <= 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  const mid = (lo + hi) / 2;
  return Number.isFinite(mid) ? mid : null;
}

export function resolveYears(rawYears: number): number | null {
  if (!Number.isFinite(rawYears) || !(rawYears > 0)) return null;
  const rounded = Math.round(rawYears);
  if (Math.abs(rawYears - rounded) > PERIOD_INT_TOL) return null;
  if (rounded < 1 || rounded > 100_000) return null;
  return rounded;
}

function relation(P: number, Call: number): CallPriceRelation {
  const tol = Math.max(1e-9, Math.abs(Call) * 1e-9);
  if (Math.abs(P - Call) <= tol) return 'par';
  return P < Call ? 'discount' : 'premium';
}

export function calculateYTC(opts: {
  annualInterest: number;
  callPrice: number;
  marketPrice: number;
  yearsUntilCall: number;
}): {
  yieldToCallPercent: number;
  yearsUntilCall: number;
} | null {
  const N = resolveYears(opts.yearsUntilCall);
  if (N === null) return null;
  if (!(opts.callPrice > 0) || !(opts.marketPrice > 0)) return null;
  if (!(opts.annualInterest >= 0)) return null;

  const y = findYieldRoot(
    opts.callPrice,
    opts.marketPrice,
    N,
    opts.annualInterest,
  );
  if (y === null || !Number.isFinite(y) || y <= -1) return null;
  return { yieldToCallPercent: y * 100, yearsUntilCall: N };
}

function buildResult(opts: {
  currency: YieldToCallInput['currency'];
  annualInterest: number;
  callPrice: number;
  marketPrice: number;
  yearsUntilCall: number;
  yieldToCallPercent: number;
}): YieldToCallResult {
  const {
    currency,
    annualInterest: C,
    callPrice: Call,
    marketPrice: P,
    yearsUntilCall: N,
    yieldToCallPercent,
  } = opts;
  const y = yieldToCallPercent / 100;
  const totalCoupons = C * N;
  const totalCash = totalCoupons + Call;
  const capital = Call - P;
  const currentYield = P > 0 ? (C / P) * 100 : null;
  const rel = relation(P, Call);

  const money = (n: number) => formatCurrencyValue(n, currency);

  const interpretation =
    rel === 'par'
      ? 'Market price equals the call price (at the call horizon convention). For a positive annual interest, YTC aligns with the coupon cash-flow rate relative to that call redemption amount.'
      : rel === 'discount'
        ? 'Market price is below the call price, so part of YTC comes from the expected gain to the call redemption in addition to coupon income.'
        : 'Market price is above the call price, so the capital loss to the call redemption pulls YTC below the simple current yield.';

  const explanation =
    'Yield to call is the constant annual discount rate that equates today’s market price with the present value of annual interest payments through the call date plus the call price at that date. Assumes the issuer calls on the modeled date and payments are made as scheduled. Currency is denomination only (not FX).';

  const steps = [
    `Annual interest C = ${money(C)}.`,
    `Call price = ${money(Call)}; market price P = ${money(P)}.`,
    `Whole years until call N = ${N} (annual payment convention).`,
    `Solve P = Σ C/(1+y)^t + Call/(1+y)^N for y (bisection; closed form if C = 0).`,
    `Yield to call y = ${formatPercent(yieldToCallPercent)}.`,
  ];

  return {
    currency,
    annualInterest: C,
    callPrice: Call,
    marketPrice: P,
    yearsUntilCall: N,
    yieldToCallPercent,
    currentYieldPercent: currentYield,
    totalCouponIncome: totalCoupons,
    totalCashReceived: totalCash,
    capitalGainOrLoss: capital,
    relation: rel,
    formattedAnnualInterest: money(C),
    formattedCallPrice: money(Call),
    formattedMarketPrice: money(P),
    formattedYtc: formatPercent(yieldToCallPercent),
    formattedCurrentYield:
      currentYield === null ? '—' : formatPercent(currentYield),
    formattedTotalCoupons: money(totalCoupons),
    formattedTotalCash: money(totalCash),
    formattedCapitalGainLoss: money(capital),
    formulaBreakdown: `P = Σ_{t=1}^{N} C/(1+y)^t + Call/(1+y)^N\nC=${C}, Call=${Call}, P=${P}, N=${N}, y=${y}`,
    steps,
    interpretation,
    explanation,
  };
}

export function calculateYieldToCallFromInput(
  input: YieldToCallInput,
): YieldToCallResult | null {
  const C = num(input.annualInterest);
  const Call = num(input.callPrice);
  const P = num(input.marketPrice);
  const years = num(input.yearsUntilCall);
  if (C === null || Call === null || P === null || years === null) return null;
  if (!(C >= 0) || !(Call > 0) || !(P > 0)) return null;

  const solved = calculateYTC({
    annualInterest: C,
    callPrice: Call,
    marketPrice: P,
    yearsUntilCall: years,
  });
  if (!solved) return null;

  return buildResult({
    currency: input.currency,
    annualInterest: C,
    callPrice: Call,
    marketPrice: P,
    yearsUntilCall: solved.yearsUntilCall,
    yieldToCallPercent: solved.yieldToCallPercent,
  });
}
