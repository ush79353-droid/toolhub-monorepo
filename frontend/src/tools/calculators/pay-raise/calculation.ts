import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PayRaisePeriodField } from './types';

export const WEEKS_PER_YEAR = 52;
export const MAX_HOURS_PER_WEEK = 168;

/**
 * Period conversion (52 weeks/year; monthly = annual/12 — not 4×weekly).
 *
 * Annual = Hourly × H × 52
 * Weekly = Annual / 52
 * Monthly = Annual / 12
 * Hourly = Annual / (H × 52)
 */
export function annualFromPeriod(
  field: PayRaisePeriodField,
  amount: number,
  hoursPerWeek: number
): number | null {
  if (![amount, hoursPerWeek].every(Number.isFinite)) return null;
  if (hoursPerWeek <= 0 || hoursPerWeek > MAX_HOURS_PER_WEEK) return null;
  if (amount < 0) return null;
  const annualHours = hoursPerWeek * WEEKS_PER_YEAR;
  if (!(annualHours > 0)) return null;

  switch (field) {
    case 'hourly':
      return amount * annualHours;
    case 'weekly':
      return amount * WEEKS_PER_YEAR;
    case 'monthly':
      return amount * 12;
    case 'annual':
      return amount;
  }
}

export function periodsFromAnnual(
  annual: number,
  hoursPerWeek: number
): {
  hourly: number;
  weekly: number;
  monthly: number;
  annual: number;
} | null {
  if (![annual, hoursPerWeek].every(Number.isFinite)) return null;
  if (hoursPerWeek <= 0 || hoursPerWeek > MAX_HOURS_PER_WEEK) return null;
  if (annual < 0) return null;
  const annualHours = hoursPerWeek * WEEKS_PER_YEAR;
  if (!(annualHours > 0)) return null;

  const weekly = annual / WEEKS_PER_YEAR;
  const monthly = annual / 12;
  const hourly = annual / annualHours;
  if (![hourly, weekly, monthly, annual].every(Number.isFinite)) return null;
  if ([hourly, weekly, monthly].some((v) => v < 0)) return null;

  return { hourly, weekly, monthly, annual };
}

export interface PayRaiseMathInput {
  hoursPerWeek: number;
  beforeAnnual: number;
  /** When mode is percentage. */
  raisePercent?: number;
  /** When mode is monetary (already annualized in canonical currency). */
  raiseAnnual?: number;
  mode: 'percentage' | 'monetary';
}

export interface PayRaiseMathResult {
  before: { hourly: number; weekly: number; monthly: number; annual: number };
  raise: { hourly: number; weekly: number; monthly: number; annual: number };
  after: { hourly: number; weekly: number; monthly: number; annual: number };
  raisePercentage: number | null;
  percentageUndefined: boolean;
}

/**
 * Pure raise math in one currency. Raises must be nonnegative.
 * Zero before + positive raise → percentage undefined (not Infinity / 0%).
 */
export function calculatePayRaise(
  input: PayRaiseMathInput
): PayRaiseMathResult | null {
  const { hoursPerWeek, beforeAnnual, mode } = input;
  if (![hoursPerWeek, beforeAnnual].every(Number.isFinite)) return null;
  if (beforeAnnual < 0) return null;

  const before = periodsFromAnnual(beforeAnnual, hoursPerWeek);
  if (!before) return null;

  let raiseAnnual: number;
  let raisePercentage: number | null;
  let percentageUndefined = false;

  if (mode === 'percentage') {
    const r = input.raisePercent;
    if (r === undefined || !Number.isFinite(r) || r < 0) return null;
    raiseAnnual = beforeAnnual * (r / 100);
    raisePercentage = r;
  } else {
    const a = input.raiseAnnual;
    if (a === undefined || !Number.isFinite(a) || a < 0) return null;
    raiseAnnual = a;
    if (beforeAnnual > 0) {
      raisePercentage = (raiseAnnual / beforeAnnual) * 100;
    } else if (raiseAnnual === 0) {
      raisePercentage = 0;
    } else {
      raisePercentage = null;
      percentageUndefined = true;
    }
  }

  if (!Number.isFinite(raiseAnnual) || raiseAnnual < 0) return null;

  const raise = periodsFromAnnual(raiseAnnual, hoursPerWeek);
  if (!raise) return null;

  const afterAnnual = beforeAnnual + raiseAnnual;
  if (!Number.isFinite(afterAnnual) || afterAnnual < 0) return null;
  const after = periodsFromAnnual(afterAnnual, hoursPerWeek);
  if (!after) return null;

  return {
    before,
    raise,
    after,
    raisePercentage,
    percentageUndefined,
  };
}

/** Display rounding only — never used inside formulas. */
export function formatPayRaiseMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPayRaisePercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}
