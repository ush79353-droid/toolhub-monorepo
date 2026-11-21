import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BiweeklyPaySourceField } from './types';

/** Paid weeks per year (disclosed). */
export const WEEKS_PER_YEAR = 52;

/** Biweekly periods per year (every two weeks — not semi-monthly). */
export const BIWEEKLY_PERIODS_PER_YEAR = 26;

/**
 * Convert one authoritative wage into biweekly pay.
 *
 *   Annual  → Biweekly = Annual / 26
 *   Monthly → Biweekly = Monthly × 12 / 26
 *   Weekly  → Biweekly = Weekly × 2
 *   Daily   → Biweekly = Daily × DaysPerWeek × 2
 *   Hourly  → Biweekly = Hourly × HoursPerWeek × 2
 *
 * Full precision; no display rounding inside the formulas.
 */
export function calculateBiweeklyPay(input: {
  sourceField: BiweeklyPaySourceField;
  sourceAmount: number;
  hoursPerWeek: number;
  daysPerWeek: number;
}): { biweekly: number } | null {
  const { sourceField, sourceAmount, hoursPerWeek, daysPerWeek } = input;
  if (![sourceAmount, hoursPerWeek, daysPerWeek].every(Number.isFinite)) {
    return null;
  }
  if (sourceAmount < 0) return null;

  if (sourceField === 'hourly' || sourceField === 'daily') {
    if (!(hoursPerWeek > 0) || !(daysPerWeek > 0)) return null;
  } else if (!(hoursPerWeek > 0) || !(daysPerWeek > 0)) {
    // Schedule still validated for UI consistency even when unused.
    return null;
  }

  let biweekly: number;
  switch (sourceField) {
    case 'annual':
      biweekly = sourceAmount / BIWEEKLY_PERIODS_PER_YEAR;
      break;
    case 'monthly':
      biweekly = (sourceAmount * 12) / BIWEEKLY_PERIODS_PER_YEAR;
      break;
    case 'weekly':
      biweekly = sourceAmount * 2;
      break;
    case 'daily':
      biweekly = sourceAmount * daysPerWeek * 2;
      break;
    case 'hourly':
      biweekly = sourceAmount * hoursPerWeek * 2;
      break;
    default:
      return null;
  }

  if (!Number.isFinite(biweekly) || biweekly < 0) return null;
  return { biweekly };
}

/** Display rounding only — never used inside the formulas. */
export function formatBiweeklyMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
