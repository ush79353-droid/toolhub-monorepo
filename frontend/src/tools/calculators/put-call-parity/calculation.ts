/**
 * Put–Call Parity — pure engine (ADR-018).
 *
 * European options (non-dividend form used with PV of strike):
 *   C + PV(K) = P + S
 *
 * Solve any one missing field:
 *   C = P + S − PV(K)
 *   P = C + PV(K) − S
 *   PV(K) = P + S − C
 *   S = C + PV(K) − P
 *
 * PV helper (continuous compounding, matching BSM strike discounting):
 *   PV(K) = K · e^(−r T)
 *
 * Money amounts are assumed already FX-normalized to one currency.
 */

import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { PutCallParitySolveTarget, PvTimeUnit } from './types';

const MAX_ABS = 1e15;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function helperTimeToYears(value: number, unit: PvTimeUnit): number {
  return unit === 'months' ? value / 12 : value;
}

/** Continuous-discount present value of strike: K e^(−rT). */
export function calculatePresentValueOfStrike(
  strike: number,
  rateDecimal: number,
  timeYears: number,
): number | null {
  if (
    !Number.isFinite(strike) ||
    !Number.isFinite(rateDecimal) ||
    !Number.isFinite(timeYears)
  ) {
    return null;
  }
  if (strike < 0 || timeYears < 0) return null;
  if (strike === 0) return 0;
  const pv = strike * Math.exp(-rateDecimal * timeYears);
  if (!Number.isFinite(pv) || pv < 0 || pv > MAX_ABS) return null;
  return pv;
}

export interface ParityAmounts {
  call: number | null;
  put: number | null;
  pvStrike: number | null;
  spot: number | null;
}

export function detectSolveTarget(
  amounts: ParityAmounts,
): PutCallParitySolveTarget | null {
  const missing: PutCallParitySolveTarget[] = [];
  if (amounts.call === null) missing.push('call');
  if (amounts.put === null) missing.push('put');
  if (amounts.pvStrike === null) missing.push('pvStrike');
  if (amounts.spot === null) missing.push('spot');
  if (missing.length !== 1) return null;
  return missing[0]!;
}

export function solvePutCallParity(
  amounts: ParityAmounts,
  target: PutCallParitySolveTarget,
): number | null {
  const { call, put, pvStrike, spot } = amounts;
  let solved: number;
  switch (target) {
    case 'call':
      if (put === null || spot === null || pvStrike === null) return null;
      solved = put + spot - pvStrike;
      break;
    case 'put':
      if (call === null || pvStrike === null || spot === null) return null;
      solved = call + pvStrike - spot;
      break;
    case 'pvStrike':
      if (put === null || spot === null || call === null) return null;
      solved = put + spot - call;
      break;
    case 'spot':
      if (call === null || pvStrike === null || put === null) return null;
      solved = call + pvStrike - put;
      break;
  }
  if (!Number.isFinite(solved) || Math.abs(solved) > MAX_ABS) return null;
  return solved;
}

export function formatParityMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  return formatCurrencyValue(amount, currency);
}

export function parityIdentityHolds(
  call: number,
  pvStrike: number,
  put: number,
  spot: number,
  eps = 1e-6,
): boolean {
  return Math.abs(call + pvStrike - (put + spot)) <= eps;
}
