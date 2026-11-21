import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { ApcResult } from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

/** APC = C / Yd ; APS = (Yd − C) / Yd ; APC + APS = 1 */
export function calculateAPC(
  totalConsumption: number,
  totalDisposableIncome: number,
  currency: SupportedCurrency,
): ApcResult | null {
  if (![totalConsumption, totalDisposableIncome].every(Number.isFinite)) return null;
  if (totalConsumption < 0) return null;
  if (!(totalDisposableIncome > 0)) return null;

  const apcRatio = totalConsumption / totalDisposableIncome;
  if (!Number.isFinite(apcRatio)) return null;

  const apcPercentage = apcRatio * 100;
  const impliedSavings = roundMoney(
    totalDisposableIncome - totalConsumption,
    currency,
  );
  const averagePropensityToSave =
    (totalDisposableIncome - totalConsumption) / totalDisposableIncome;
  const remainingIncomePercentage = averagePropensityToSave * 100;

  return {
    totalConsumption: roundMoney(totalConsumption, currency),
    totalDisposableIncome: roundMoney(totalDisposableIncome, currency),
    apcRatio,
    apcPercentage,
    impliedSavings,
    averagePropensityToSave,
    consumptionPercentage: apcPercentage,
    remainingIncomePercentage,
    interpretation: getAPCInterpretation(apcRatio),
    currency,
  };
}

export function calculateAveragePropensityToSave(
  totalConsumption: number,
  totalDisposableIncome: number,
): number | null {
  if (![totalConsumption, totalDisposableIncome].every(Number.isFinite)) return null;
  if (totalConsumption < 0 || !(totalDisposableIncome > 0)) return null;
  return (totalDisposableIncome - totalConsumption) / totalDisposableIncome;
}

/** Yd = Y − T */
export function calculateDisposableIncome(
  totalIncome: number,
  directTaxes: number,
): number | null {
  if (![totalIncome, directTaxes].every(Number.isFinite)) return null;
  if (totalIncome < 0 || directTaxes < 0) return null;
  return totalIncome - directTaxes;
}

export function getAPCInterpretation(apcRatio: number): string {
  if (!Number.isFinite(apcRatio) || apcRatio < 0) {
    return 'Unable to interpret the current APC value.';
  }
  const pct = formatPercent(apcRatio * 100);
  if (apcRatio < 1) {
    const savePct = formatPercent((1 - apcRatio) * 100);
    return `APC is ${formatRatio(apcRatio)} (${pct}%). About ${pct}% of disposable income is spent on consumption, and about ${savePct}% remains as implied saving under the simplified consumption–saving model.`;
  }
  if (apcRatio === 1) {
    return `APC is 1.00 (100%). Total consumption equals disposable income, so implied saving is zero in this simplified calculation.`;
  }
  return `APC is ${formatRatio(apcRatio)} (${pct}%). Consumption exceeds current disposable income. This can occur when households use existing savings, borrow, or draw on other resources: the calculator does not assume which of those applies.`;
}

export function formatRatio(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareApcText(result: ApcResult): string {
  return [
    'APC Calculator | Omega Calculators',
    `Total consumption: ${formatMoney(result.totalConsumption, result.currency)} ${result.currency}`,
    `Total disposable income: ${formatMoney(result.totalDisposableIncome, result.currency)} ${result.currency}`,
    `APC ratio: ${formatRatio(result.apcRatio)}`,
    `APC percentage: ${formatPercent(result.apcPercentage)}%`,
    `Implied savings: ${formatMoney(result.impliedSavings, result.currency)}`,
    `Average propensity to save: ${formatPercent(result.averagePropensityToSave * 100)}%`,
  ].join('\n');
}
