import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  CD_COMPOUNDING_OPTIONS,
  type CdCompounding,
  type CdResult,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function periodsPerYear(compounding: CdCompounding): number {
  const opt = CD_COMPOUNDING_OPTIONS.find((o) => o.value === compounding);
  return opt?.periodsPerYear ?? 1;
}

/**
 * Final Balance = P × (1 + r/n)^(n × t)
 * Interest Earned = Final Balance − Initial Deposit
 * t = years + months / 12
 */
export function calculateCd(
  initialDeposit: number,
  interestRatePercent: number,
  termYears: number,
  termMonths: number,
  compounding: CdCompounding,
  currency: SupportedCurrency
): CdResult | null {
  if (
    !Number.isFinite(initialDeposit) ||
    !Number.isFinite(interestRatePercent) ||
    !Number.isFinite(termYears) ||
    !Number.isFinite(termMonths)
  ) {
    return null;
  }

  const n = periodsPerYear(compounding);
  if (!Number.isFinite(n) || n <= 0) return null;

  const t = termYears + termMonths / 12;
  if (!Number.isFinite(t) || t <= 0) return null;

  const r = interestRatePercent / 100;
  if (!Number.isFinite(r) || r < 0) return null;
  if (initialDeposit < 0) return null;

  const base = 1 + r / n;
  if (!Number.isFinite(base) || base <= 0) return null;

  const exponent = n * t;
  if (!Number.isFinite(exponent)) return null;

  const factor = base ** exponent;
  if (!Number.isFinite(factor)) return null;

  const finalBalance = roundMoney(initialDeposit * factor);
  const interestEarned = roundMoney(finalBalance - initialDeposit);
  if (!Number.isFinite(finalBalance) || !Number.isFinite(interestEarned)) return null;

  return {
    initialDeposit,
    interestRatePercent,
    termYears,
    termMonths,
    years: t,
    compounding,
    periodsPerYear: n,
    finalBalance,
    interestEarned,
    currency,
    formattedFinalBalance: formatCurrencyValue(finalBalance, currency),
    formattedInterestEarned: formatCurrencyValue(interestEarned, currency),
  };
}

export function describeCdResult(result: CdResult): string {
  return [
    `Final balance: ${result.formattedFinalBalance}`,
    `Interest earned: ${result.formattedInterestEarned}`,
  ].join('\n');
}
