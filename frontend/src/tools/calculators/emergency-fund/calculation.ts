import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { EmergencyFundProgress, EmergencyFundResult } from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function calculateEmergencyFund(
  monthlyExpenses: number,
  monthsDesired: number,
): number | null {
  if (
    !Number.isFinite(monthlyExpenses) ||
    !Number.isFinite(monthsDesired) ||
    monthlyExpenses <= 0 ||
    monthsDesired <= 0
  ) {
    return null;
  }
  return monthlyExpenses * monthsDesired;
}

export function calculateAnnualExpenses(monthlyExpenses: number): number | null {
  if (!Number.isFinite(monthlyExpenses) || monthlyExpenses < 0) return null;
  return monthlyExpenses * 12;
}

/** Approximate daily expenses using a 30-day month. */
export function calculateDailyExpenses(monthlyExpenses: number): number | null {
  if (!Number.isFinite(monthlyExpenses) || monthlyExpenses < 0) return null;
  return monthlyExpenses / 30;
}

export function calculateEmergencyFundProgress(
  emergencyFund: number,
  currentSavings: number,
): EmergencyFundProgress | null {
  if (
    !Number.isFinite(emergencyFund) ||
    !Number.isFinite(currentSavings) ||
    emergencyFund <= 0 ||
    currentSavings < 0
  ) {
    return null;
  }
  const remainingAmount = Math.max(0, emergencyFund - currentSavings);
  const progressPercentage = Math.min(100, (currentSavings / emergencyFund) * 100);
  return {
    currentSavings,
    requiredEmergencyFund: emergencyFund,
    remainingAmount,
    progressPercentage,
    isGoalAchieved: currentSavings >= emergencyFund,
  };
}

export function calculateEmergencyFundResults(input: {
  monthlyExpenses: number;
  monthsDesired: number;
  currentSavings: number | null;
  currency: SupportedCurrency;
}): EmergencyFundResult | null {
  const fundRaw = calculateEmergencyFund(input.monthlyExpenses, input.monthsDesired);
  const annualRaw = calculateAnnualExpenses(input.monthlyExpenses);
  const dailyRaw = calculateDailyExpenses(input.monthlyExpenses);
  if (fundRaw === null || annualRaw === null || dailyRaw === null) return null;

  const emergencyFund = roundMoney(fundRaw, input.currency);
  const monthlyExpenses = roundMoney(input.monthlyExpenses, input.currency);
  const annualExpenses = roundMoney(annualRaw, input.currency);
  const dailyExpenses = roundMoney(dailyRaw, input.currency);

  let progress: EmergencyFundProgress | null = null;
  if (input.currentSavings !== null) {
    const raw = calculateEmergencyFundProgress(emergencyFund, input.currentSavings);
    if (raw) {
      progress = {
        ...raw,
        currentSavings: roundMoney(raw.currentSavings, input.currency),
        requiredEmergencyFund: emergencyFund,
        remainingAmount: roundMoney(raw.remainingAmount, input.currency),
        progressPercentage: roundMoney(raw.progressPercentage, input.currency),
      };
    }
  }

  const explanation = `Based on your average monthly expenses of ${formatMoney(monthlyExpenses, input.currency)} and your desired coverage of ${input.monthsDesired} month${input.monthsDesired === 1 ? '' : 's'}, you should aim to build an emergency fund of ${formatMoney(emergencyFund, input.currency)}.`;

  return {
    monthlyExpenses,
    monthsDesired: input.monthsDesired,
    emergencyFund,
    annualExpenses,
    dailyExpenses,
    explanation,
    progress,
    currency: input.currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareEmergencyFundText(result: EmergencyFundResult): string {
  const lines = [
    'Emergency Fund Calculator — Omega Calculators',
    `Average monthly expenses: ${formatMoney(result.monthlyExpenses, result.currency)}`,
    `Months of coverage: ${result.monthsDesired}`,
    `Emergency fund: ${formatMoney(result.emergencyFund, result.currency)}`,
    `Annual living expenses: ${formatMoney(result.annualExpenses, result.currency)}`,
    `Daily living expenses (≈30-day month): ${formatMoney(result.dailyExpenses, result.currency)}`,
  ];
  if (result.progress) {
    lines.push(
      `Current savings: ${formatMoney(result.progress.currentSavings, result.currency)}`,
      `Remaining: ${formatMoney(result.progress.remainingAmount, result.currency)}`,
      `Progress: ${result.progress.progressPercentage.toFixed(1)}%`,
    );
  }
  return lines.join('\n');
}
