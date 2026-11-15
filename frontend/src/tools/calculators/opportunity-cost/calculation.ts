import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { OpportunityCostResult } from './types';

function formatPlainMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

/**
 * Opportunity cost of spending today instead of investing.
 *
 * Net Return = r × (1 − tax)
 * FV = P × (1 + Net Return)^t
 * Real FV = FV / (1 + inflation)^t
 * Opportunity Cost = Real FV − P  (inflation-adjusted forgone real gain)
 */
export function calculateOpportunityCost(
  moneyToSpend: number,
  annualReturnPercent: number,
  years: number,
  months: number,
  incomeTaxPercent: number,
  inflationPercent: number,
  currency: SupportedCurrency
): OpportunityCostResult | null {
  if (
    ![moneyToSpend, annualReturnPercent, years, months, incomeTaxPercent, inflationPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (moneyToSpend < 0) return null;
  if (years < 0 || months < 0) return null;
  if (incomeTaxPercent < 0 || incomeTaxPercent > 100) return null;

  const t = years + months / 12;
  if (!Number.isFinite(t) || t < 0) return null;

  const r = annualReturnPercent / 100;
  const tax = incomeTaxPercent / 100;
  const inflation = inflationPercent / 100;
  if (![r, tax, inflation].every(Number.isFinite)) return null;

  const netReturn = r * (1 - tax);
  if (!Number.isFinite(netReturn) || netReturn <= -1) return null;
  if (inflation <= -1) return null;

  const growth = (1 + netReturn) ** t;
  const inflationFactor = (1 + inflation) ** t;
  if (!Number.isFinite(growth) || !Number.isFinite(inflationFactor) || inflationFactor === 0) {
    return null;
  }

  const fvRaw = moneyToSpend * growth;
  const realRaw = fvRaw / inflationFactor;
  if (![fvRaw, realRaw].every(Number.isFinite)) return null;

  const totalSavingsAfterTax = roundMoney(fvRaw, currency);
  const realSavings = roundMoney(realRaw, currency);
  const opportunityCost = roundMoney(realSavings - moneyToSpend, currency);
  const nominalGain = roundMoney(totalSavingsAfterTax - moneyToSpend, currency);

  return {
    moneyToSpend,
    annualReturnPercent,
    years,
    months,
    yearsExact: t,
    incomeTaxPercent,
    inflationPercent,
    netReturn,
    totalSavingsAfterTax,
    realSavings,
    opportunityCost,
    nominalGain,
    currency,
    formattedTotalSavings: formatPlainMoney(totalSavingsAfterTax, currency),
    formattedRealSavings: formatPlainMoney(realSavings, currency),
    formattedOpportunityCost: formatPlainMoney(opportunityCost, currency),
    formattedNominalGain: formatPlainMoney(nominalGain, currency),
  };
}
