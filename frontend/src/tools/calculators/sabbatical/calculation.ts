import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { SabbaticalDurationUnit, SabbaticalResult } from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

/** Convert desired sabbatical length into months (weeks use 12/52). */
export function durationToMonths(
  value: number,
  unit: SabbaticalDurationUnit,
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'years':
      return value * 12;
    case 'months':
      return value;
    case 'weeks':
      return (value * 12) / 52;
    default:
      return null;
  }
}

export function calculateMonthlySavings(
  monthlyIncome: number,
  savingsPercentage: number,
): number | null {
  if (
    !Number.isFinite(monthlyIncome) ||
    !Number.isFinite(savingsPercentage) ||
    monthlyIncome < 0 ||
    savingsPercentage < 0 ||
    savingsPercentage > 100
  ) {
    return null;
  }
  return monthlyIncome * (savingsPercentage / 100);
}

export function calculateAccumulatedSavings(
  monthlySavings: number,
  yearsToSave: number,
): number | null {
  if (
    !Number.isFinite(monthlySavings) ||
    !Number.isFinite(yearsToSave) ||
    monthlySavings < 0 ||
    yearsToSave <= 0
  ) {
    return null;
  }
  return monthlySavings * yearsToSave * 12;
}

export function calculateAvailableFund(
  currentSavings: number,
  accumulatedSavings: number,
): number | null {
  if (
    !Number.isFinite(currentSavings) ||
    !Number.isFinite(accumulatedSavings) ||
    currentSavings < 0 ||
    accumulatedSavings < 0
  ) {
    return null;
  }
  return currentSavings + accumulatedSavings;
}

export function calculateRequiredFund(
  monthlyExpenses: number,
  sabbaticalMonths: number,
): number | null {
  if (
    !Number.isFinite(monthlyExpenses) ||
    !Number.isFinite(sabbaticalMonths) ||
    monthlyExpenses < 0 ||
    sabbaticalMonths <= 0
  ) {
    return null;
  }
  return monthlyExpenses * sabbaticalMonths;
}

export function calculateEmergencyBuffer(
  requiredFund: number,
  bufferPercentage: number,
): number | null {
  if (
    !Number.isFinite(requiredFund) ||
    !Number.isFinite(bufferPercentage) ||
    requiredFund < 0 ||
    bufferPercentage < 0 ||
    bufferPercentage > 100
  ) {
    return null;
  }
  return requiredFund * (bufferPercentage / 100);
}

/**
 * Affordable months = AvailableFund / (MonthlyExpenses × (1 + buffer/100)).
 * Returns null when expenses are zero (division by zero / undefined runway).
 */
export function calculateAffordableMonths(
  availableFund: number,
  monthlyExpenses: number,
  bufferPercentage: number,
): number | null {
  if (
    !Number.isFinite(availableFund) ||
    !Number.isFinite(monthlyExpenses) ||
    !Number.isFinite(bufferPercentage) ||
    availableFund < 0 ||
    monthlyExpenses < 0 ||
    bufferPercentage < 0 ||
    bufferPercentage > 100
  ) {
    return null;
  }
  const burn = monthlyExpenses * (1 + bufferPercentage / 100);
  if (!(burn > 0)) return null;
  return availableFund / burn;
}

export function formatDurationMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return '—';
  if (months < 1) {
    const weeks = Math.round(months * (52 / 12));
    return `${weeks} week${weeks === 1 ? '' : 's'} (≈${months.toFixed(2)} mo)`;
  }
  const wholeYears = Math.floor(months / 12);
  const remMonths = months - wholeYears * 12;
  const parts: string[] = [];
  if (wholeYears > 0) {
    parts.push(`${wholeYears} year${wholeYears === 1 ? '' : 's'}`);
  }
  if (remMonths >= 0.05 || wholeYears === 0) {
    const rounded = Math.round(remMonths * 10) / 10;
    if (rounded > 0 || wholeYears === 0) {
      parts.push(`${rounded.toFixed(rounded % 1 === 0 ? 0 : 1)} month${rounded === 1 ? '' : 's'}`);
    }
  }
  return parts.join(', ');
}

export function formatDesiredDuration(
  value: number,
  unit: SabbaticalDurationUnit,
): string {
  const unitLabel =
    unit === 'years' ? 'year' : unit === 'months' ? 'month' : 'week';
  const plural = value === 1 ? unitLabel : `${unitLabel}s`;
  return `${value} ${plural}`;
}

export function calculateSabbaticalResults(input: {
  savingsPercentage: number;
  yearsToSave: number;
  desiredDurationValue: number;
  durationUnit: SabbaticalDurationUnit;
  monthlyIncome: number;
  monthlySavings: number;
  currentSavings: number;
  monthlyExpenses: number;
  bufferPercentage: number;
  currency: SupportedCurrency;
}): SabbaticalResult | null {
  const desiredMonths = durationToMonths(
    input.desiredDurationValue,
    input.durationUnit,
  );
  if (desiredMonths === null) return null;

  const accumulatedRaw = calculateAccumulatedSavings(
    input.monthlySavings,
    input.yearsToSave,
  );
  if (accumulatedRaw === null) return null;

  const availableRaw = calculateAvailableFund(
    input.currentSavings,
    accumulatedRaw,
  );
  if (availableRaw === null) return null;

  const requiredRaw = calculateRequiredFund(
    input.monthlyExpenses,
    desiredMonths,
  );
  if (requiredRaw === null) return null;

  const bufferRaw = calculateEmergencyBuffer(
    requiredRaw,
    input.bufferPercentage,
  );
  if (bufferRaw === null) return null;

  const totalRequiredRaw = requiredRaw + bufferRaw;
  const surplusRaw = availableRaw - totalRequiredRaw;
  const affordableRaw = calculateAffordableMonths(
    availableRaw,
    input.monthlyExpenses,
    input.bufferPercentage,
  );

  const currency = input.currency;
  const monthlySavings = roundMoney(input.monthlySavings, currency);
  const currentSavings = roundMoney(input.currentSavings, currency);
  const monthlyIncome = roundMoney(input.monthlyIncome, currency);
  const monthlyExpenses = roundMoney(input.monthlyExpenses, currency);
  const accumulatedSavings = roundMoney(accumulatedRaw, currency);
  const totalAvailableFund = roundMoney(availableRaw, currency);
  const requiredFund = roundMoney(requiredRaw, currency);
  const emergencyBuffer = roundMoney(bufferRaw, currency);
  const totalRequired = roundMoney(totalRequiredRaw, currency);
  const savingsSurplus = roundMoney(surplusRaw, currency);
  const isAffordable = surplusRaw >= 0;

  let statusMessage: string;
  if (isAffordable) {
    statusMessage = "You're on track for your sabbatical!";
  } else {
    statusMessage = 'You need additional savings before taking your sabbatical.';
  }

  const affordableLabel =
    affordableRaw === null
      ? 'unavailable (set monthly expenses greater than zero)'
      : formatDurationMonths(affordableRaw);

  const explanation = isAffordable
    ? `After ${input.yearsToSave} year${input.yearsToSave === 1 ? '': 's'} of saving ${formatMoney(monthlySavings, currency)}/mo plus ${formatMoney(currentSavings, currency)} already saved, you would have ${formatMoney(totalAvailableFund, currency)}; enough for about ${affordableLabel} away (including a ${input.bufferPercentage}% buffer).`
    : `You would have ${formatMoney(totalAvailableFund, currency)} available but need ${formatMoney(totalRequired, currency)} for a ${formatDesiredDuration(input.desiredDurationValue, input.durationUnit)} sabbatical with a ${input.bufferPercentage}% buffer. Shortfall: ${formatMoney(Math.abs(savingsSurplus), currency)}.`;

  return {
    savingsPercentage: input.savingsPercentage,
    yearsToSave: input.yearsToSave,
    desiredDurationValue: input.desiredDurationValue,
    durationUnit: input.durationUnit,
    desiredMonths,
    monthlyIncome,
    monthlySavings,
    currentSavings,
    monthlyExpenses,
    bufferPercentage: input.bufferPercentage,
    accumulatedSavings,
    totalAvailableFund,
    requiredFund,
    emergencyBuffer,
    totalRequired,
    affordableMonths: affordableRaw,
    savingsSurplus,
    isAffordable,
    statusMessage,
    explanation,
    currency,
  };
}

export function shareSabbaticalText(result: SabbaticalResult): string {
  const affordable =
    result.affordableMonths === null
      ? 'n/a'
      : formatDurationMonths(result.affordableMonths);
  return [
    'Sabbatical Calculator | Omega Calculators',
    `Monthly income: ${formatMoney(result.monthlyIncome, result.currency)}`,
    `Savings rate: ${result.savingsPercentage}%`,
    `Monthly savings: ${formatMoney(result.monthlySavings, result.currency)}`,
    `Current savings: ${formatMoney(result.currentSavings, result.currency)}`,
    `Total available fund: ${formatMoney(result.totalAvailableFund, result.currency)}`,
    `Desired sabbatical: ${formatDesiredDuration(result.desiredDurationValue, result.durationUnit)}`,
    `Affordable time away: ${affordable}`,
    `Surplus / shortfall: ${formatMoney(result.savingsSurplus, result.currency)}`,
    result.statusMessage,
  ].join('\n');
}

export function suggestedMonthlySavingsString(
  monthlyIncomeRaw: string,
  savingsPercentageRaw: string,
): string | null {
  const income = Number(monthlyIncomeRaw.trim());
  const pct = Number(savingsPercentageRaw.trim());
  if (!Number.isFinite(income) || !Number.isFinite(pct) || income < 0) {
    return null;
  }
  if (pct < 0 || pct > 100) return null;
  const value = income * (pct / 100);
  if (!Number.isFinite(value)) return null;
  // Keep a sensible display string without forcing currency rounding here.
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 100) / 100);
}
