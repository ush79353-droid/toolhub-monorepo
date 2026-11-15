import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TtmResult } from './types';

function formatMoney(value: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * TTM = Q0 + Q1 + Q2 + Q3 (four consecutive quarterly values, not averaged or annualized).
 */
export function calculateTtm(
  quarter0: number,
  quarter1: number,
  quarter2: number,
  quarter3: number,
  currency: SupportedCurrency
): TtmResult | null {
  if (![quarter0, quarter1, quarter2, quarter3].every(Number.isFinite)) return null;

  const trailingTwelveMonthValue = quarter0 + quarter1 + quarter2 + quarter3;
  if (!Number.isFinite(trailingTwelveMonthValue)) return null;

  return {
    trailingTwelveMonthValue,
    formattedTtm: formatMoney(trailingTwelveMonthValue, currency),
  };
}
