import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MvaResult } from './types';

/** Current Market Value = Current Share Price × Shares Outstanding */
export function calculateCurrentMarketValue(
  currentSharePrice: number,
  sharesOutstanding: number
): number | null {
  if (!Number.isFinite(currentSharePrice) || !Number.isFinite(sharesOutstanding)) {
    return null;
  }
  if (currentSharePrice < 0 || sharesOutstanding < 0) return null;
  const value = currentSharePrice * sharesOutstanding;
  return Number.isFinite(value) ? value : null;
}

/** MVA = Current Market Value − Capital Invested */
export function calculateMva(
  currentMarketValue: number,
  capitalInvested: number
): number | null {
  if (!Number.isFinite(currentMarketValue) || !Number.isFinite(capitalInvested)) {
    return null;
  }
  if (capitalInvested < 0) return null;
  const mva = currentMarketValue - capitalInvested;
  return Number.isFinite(mva) ? mva : null;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildMvaResult(
  currentSharePrice: number,
  sharesOutstanding: number,
  capitalInvested: number,
  currency: SupportedCurrency
): MvaResult {
  const currentMarketValue = calculateCurrentMarketValue(
    currentSharePrice,
    sharesOutstanding
  );
  const mva =
    currentMarketValue === null
      ? null
      : calculateMva(currentMarketValue, capitalInvested);

  return {
    currentMarketValue,
    mva,
    currentMarketValueDisplay:
      currentMarketValue === null ? '' : formatMoney(currentMarketValue, currency),
    mvaDisplay: mva === null ? '' : formatMoney(mva, currency),
    currency,
  };
}
