import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CreditLineBreakdown } from './types';

export interface ValidCreditLine {
  id: string;
  moneyUsed: number;
  creditLimit: number;
}

export interface CreditUtilizationMathResult {
  totalCreditUsed: number;
  totalCreditLimit: number;
  overallUtilization: number;
  remainingAvailableCredit: number;
  overLimitAmount: number;
  creditLineCount: number;
  targetUtilization: number;
  targetBalance: number;
  requiredBalanceReduction: number;
  additionalCreditLimitNeeded: number | null;
  additionalLimitUnavailableReason: string | null;
  creditLineResults: CreditLineBreakdown[];
  interpretationBand: string;
}

/**
 * Overall utilization = total used / total limit × 100.
 * Do not average per-card percentages.
 */
export function calculateCreditUtilization(
  creditLines: ValidCreditLine[],
  targetUtilization: number
): CreditUtilizationMathResult | null {
  if (!Array.isArray(creditLines) || creditLines.length === 0) return null;
  if (!Number.isFinite(targetUtilization) || targetUtilization < 0 || targetUtilization > 100) {
    return null;
  }

  let totalCreditUsed = 0;
  let totalCreditLimit = 0;

  for (const line of creditLines) {
    if (
      !Number.isFinite(line.moneyUsed) ||
      line.moneyUsed < 0 ||
      !Number.isFinite(line.creditLimit) ||
      line.creditLimit <= 0
    ) {
      return null;
    }
    totalCreditUsed += line.moneyUsed;
    totalCreditLimit += line.creditLimit;
  }

  if (!(totalCreditLimit > 0)) return null;

  const overallUtilization = (totalCreditUsed / totalCreditLimit) * 100;
  if (!Number.isFinite(overallUtilization)) return null;

  const remainingAvailableCredit = totalCreditLimit - totalCreditUsed;
  const overLimitAmount = Math.max(0, totalCreditUsed - totalCreditLimit);
  const targetBalance = totalCreditLimit * (targetUtilization / 100);
  const requiredBalanceReduction = Math.max(0, totalCreditUsed - targetBalance);

  let additionalCreditLimitNeeded: number | null = 0;
  let additionalLimitUnavailableReason: string | null = null;

  if (targetUtilization === 0) {
    if (totalCreditUsed === 0) {
      additionalCreditLimitNeeded = 0;
    } else {
      additionalCreditLimitNeeded = null;
      additionalLimitUnavailableReason =
        'No finite credit-limit increase can reduce utilization to exactly 0% while a positive balance remains. Pay down the balance instead.';
    }
  } else {
    const requiredLimit = totalCreditUsed / (targetUtilization / 100);
    additionalCreditLimitNeeded = Math.max(0, requiredLimit - totalCreditLimit);
  }

  const creditLineResults: CreditLineBreakdown[] = creditLines.map(
    (line, index) => ({
      id: line.id,
      index: index + 1,
      moneyUsed: line.moneyUsed,
      creditLimit: line.creditLimit,
      utilizationPercentage: (line.moneyUsed / line.creditLimit) * 100,
      availableCredit: line.creditLimit - line.moneyUsed,
    })
  );

  return {
    totalCreditUsed,
    totalCreditLimit,
    overallUtilization,
    remainingAvailableCredit,
    overLimitAmount,
    creditLineCount: creditLines.length,
    targetUtilization,
    targetBalance,
    requiredBalanceReduction,
    additionalCreditLimitNeeded,
    additionalLimitUnavailableReason,
    creditLineResults,
    interpretationBand: interpretUtilizationBand(overallUtilization),
  };
}

export function interpretUtilizationBand(utilization: number): string {
  if (!(utilization > 0)) return 'No reported revolving balance used';
  if (utilization < 10) return 'Very low utilization';
  if (utilization < 30) return 'Lower utilization';
  if (utilization < 50) return 'Moderate utilization';
  if (utilization < 75) return 'High utilization';
  if (utilization <= 100) return 'Very high utilization';
  return 'Over-limit utilization';
}

export function formatCuMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCuPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretCreditUtilization(
  overallUtilization: number,
  band: string,
  creditLineCount: number
): string {
  return `Overall credit utilization is ${formatCuPercent(overallUtilization)}% across ${creditLineCount} credit line${creditLineCount === 1 ? '': 's'} (${band}). This is total revolving balances divided by total revolving limits; not an average of per-card percentages, and not a credit score.`;
}
