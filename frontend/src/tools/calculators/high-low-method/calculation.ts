import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { HighLowMethodInput, HighLowMethodResult } from './types';

export function calculateVariableCostPerUnit(
  highCost: number,
  lowCost: number,
  highVolume: number,
  lowVolume: number
): number {
  if (
    !Number.isFinite(highCost) ||
    !Number.isFinite(lowCost) ||
    !Number.isFinite(highVolume) ||
    !Number.isFinite(lowVolume)
  ) {
    return Number.NaN;
  }
  if (highVolume <= lowVolume) return Number.NaN;
  const value = (highCost - lowCost) / (highVolume - lowVolume);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateTotalFixedCost(
  highCost: number,
  variableCostPerUnit: number,
  highVolume: number
): number {
  if (
    !Number.isFinite(highCost) ||
    !Number.isFinite(variableCostPerUnit) ||
    !Number.isFinite(highVolume)
  ) {
    return Number.NaN;
  }
  const value = highCost - variableCostPerUnit * highVolume;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateTotalCost(
  totalFixedCost: number,
  variableCostPerUnit: number,
  unitsX: number
): number {
  if (
    !Number.isFinite(totalFixedCost) ||
    !Number.isFinite(variableCostPerUnit) ||
    !Number.isFinite(unitsX)
  ) {
    return Number.NaN;
  }
  const value = totalFixedCost + variableCostPerUnit * unitsX;
  return Number.isFinite(value) ? value : Number.NaN;
}

function formatAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function calculateHighLowMethod(
  input: HighLowMethodInput
): HighLowMethodResult | null {
  const variableCostPerUnit = calculateVariableCostPerUnit(
    input.highCost,
    input.lowCost,
    input.highVolume,
    input.lowVolume
  );
  if (!Number.isFinite(variableCostPerUnit)) return null;

  const totalFixedCost = calculateTotalFixedCost(
    input.highCost,
    variableCostPerUnit,
    input.highVolume
  );
  if (!Number.isFinite(totalFixedCost)) return null;

  const totalCost = calculateTotalCost(
    totalFixedCost,
    variableCostPerUnit,
    input.unitsX
  );
  if (!Number.isFinite(totalCost)) return null;

  return {
    highCost: input.highCost,
    highVolume: input.highVolume,
    lowCost: input.lowCost,
    lowVolume: input.lowVolume,
    unitsX: input.unitsX,
    variableCostPerUnit,
    totalFixedCost,
    totalCost,
    currency: input.currency,
    variableDisplay: formatAmount(variableCostPerUnit, input.currency),
    fixedDisplay: formatAmount(totalFixedCost, input.currency),
    totalDisplay: formatAmount(totalCost, input.currency),
    shareVariable: formatCurrencyValue(variableCostPerUnit, input.currency),
    shareFixed: formatCurrencyValue(totalFixedCost, input.currency),
    shareTotal: formatCurrencyValue(totalCost, input.currency),
  };
}
