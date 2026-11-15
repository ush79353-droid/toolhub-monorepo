import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MutualFundMode, MutualFundResult } from './types';

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
 * Monthly compounding mutual-fund projection.
 *
 * i = r / 12, n = years × 12 + months
 * SIP (end-of-month): P × [((1 + i)^n − 1) / i] ; if i = 0 → P × n
 * Lump sum: P × (1 + i)^n ; if i = 0 → P
 */
export function calculateMutualFund(
  mode: MutualFundMode,
  investmentAmount: number,
  expectedAnnualReturnPercent: number,
  years: number,
  months: number,
  currency: SupportedCurrency
): MutualFundResult | null {
  if (![investmentAmount, expectedAnnualReturnPercent, years, months].every(Number.isFinite)) {
    return null;
  }
  if (investmentAmount < 0) return null;
  if (years < 0 || months < 0) return null;

  const periods = years * 12 + months;
  if (!Number.isFinite(periods) || periods < 0) return null;

  const r = expectedAnnualReturnPercent / 100;
  if (!Number.isFinite(r)) return null;

  const i = r / 12;
  if (!Number.isFinite(i)) return null;

  let maturityRaw: number;
  if (mode === 'sip') {
    if (i === 0) {
      maturityRaw = investmentAmount * periods;
    } else {
      const growth = (1 + i) ** periods;
      if (!Number.isFinite(growth)) return null;
      maturityRaw = investmentAmount * ((growth - 1) / i);
    }
  } else if (i === 0) {
    maturityRaw = investmentAmount;
  } else {
    const growth = (1 + i) ** periods;
    if (!Number.isFinite(growth)) return null;
    maturityRaw = investmentAmount * growth;
  }

  if (!Number.isFinite(maturityRaw)) return null;

  const maturityValue = roundMoney(maturityRaw, currency);
  if (!Number.isFinite(maturityValue)) return null;

  return {
    mode,
    investmentAmount,
    expectedAnnualReturnPercent,
    years,
    months,
    periods,
    monthlyRate: i,
    maturityValue,
    currency,
    formattedMaturityValue: formatPlainMoney(maturityValue, currency),
  };
}
