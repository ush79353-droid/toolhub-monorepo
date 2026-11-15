import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { RoceMethod, RoceResult } from './types';

function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Assets method: Capital Employed = Total Assets − Current Liabilities
 * Equity method: Capital Employed = Total Equity + Non-current Liabilities
 * ROCE (%) = (EBIT / Capital Employed) × 100
 */
export function calculateRoce(input: {
  method: RoceMethod;
  ebit: number;
  totalAssets: number;
  currentLiabilities: number;
  totalEquity: number;
  nonCurrentLiabilities: number;
  currency: SupportedCurrency;
}): RoceResult | null {
  const {
    method,
    ebit,
    totalAssets,
    currentLiabilities,
    totalEquity,
    nonCurrentLiabilities,
    currency,
  } = input;

  if (!Number.isFinite(ebit)) return null;

  let capitalEmployed: number;
  if (method === 'assets') {
    if (![totalAssets, currentLiabilities].every(Number.isFinite)) return null;
    capitalEmployed = totalAssets - currentLiabilities;
  } else {
    if (![totalEquity, nonCurrentLiabilities].every(Number.isFinite)) return null;
    capitalEmployed = totalEquity + nonCurrentLiabilities;
  }

  if (!Number.isFinite(capitalEmployed)) return null;
  if (!(capitalEmployed > 0)) return null;

  const rocePercent = (ebit / capitalEmployed) * 100;
  if (!Number.isFinite(rocePercent)) return null;

  return {
    method,
    capitalEmployed,
    rocePercent,
    currency,
    formattedCapitalEmployed: formatMoney(capitalEmployed, currency),
    formattedRoce: formatPercent(rocePercent),
  };
}
