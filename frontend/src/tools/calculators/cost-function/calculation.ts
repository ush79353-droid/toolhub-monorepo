import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CalculationMethod, CostFunctionResult } from './types';

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

function formatAmount(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatCoeff(amount: number, currency: SupportedCurrency): string {
  return formatAmount(amount, currency);
}

export function formatCostFunction(
  fixedCost: number,
  variableCostPerUnit: number,
  currency: SupportedCurrency
): string {
  const fc = formatCoeff(fixedCost, currency);
  const vc = formatCoeff(variableCostPerUnit, currency);
  return `TC(Q) = ${fc} + ${vc} × Q`;
}

/** Method 1: TC = FC + VC × Q */
export function calculateFromFixedVariable(
  fixedCost: number,
  variableCostPerUnit: number,
  quantity: number,
  currency: SupportedCurrency
): CostFunctionResult {
  const fc = roundMoney(fixedCost, currency);
  const vc = roundMoney(variableCostPerUnit, currency);
  const total = roundMoney(fc + vc * quantity, currency);
  const costFunction = formatCostFunction(fc, vc, currency);

  return {
    method: 'fixed-variable',
    fixedCost: fc,
    variableCostPerUnit: vc,
    quantity,
    totalCost: total,
    costFunction,
    currency,
    formattedFixedCost: formatAmount(fc, currency),
    formattedVariableCost: formatAmount(vc, currency),
    formattedTotalCost: formatAmount(total, currency),
    shareFixedCost: formatCurrencyValue(fc, currency),
    shareVariableCost: formatCurrencyValue(vc, currency),
    shareTotalCost: formatCurrencyValue(total, currency),
  };
}

/**
 * Method 2: two-point linear cost function.
 * VC = (C2 − C1) / (Q2 − Q1); FC = C1 − VC × Q1
 * Caller must ensure Q2 ≠ Q1.
 */
export function calculateFromTwoPoints(
  quantity1: number,
  totalCost1: number,
  quantity2: number,
  totalCost2: number,
  currency: SupportedCurrency
): CostFunctionResult {
  const vcRaw = (totalCost2 - totalCost1) / (quantity2 - quantity1);
  const fcRaw = totalCost1 - vcRaw * quantity1;
  const vc = roundMoney(vcRaw, currency);
  const fc = roundMoney(fcRaw, currency);
  const costFunction = formatCostFunction(fc, vc, currency);

  return {
    method: 'two-points',
    fixedCost: fc,
    variableCostPerUnit: vc,
    quantity: null,
    totalCost: null,
    costFunction,
    currency,
    formattedFixedCost: formatAmount(fc, currency),
    formattedVariableCost: formatAmount(vc, currency),
    formattedTotalCost: '',
    shareFixedCost: formatCurrencyValue(fc, currency),
    shareVariableCost: formatCurrencyValue(vc, currency),
    shareTotalCost: '',
  };
}

export function describeResult(result: CostFunctionResult): string {
  if (result.method === 'fixed-variable' && result.totalCost !== null) {
    return `Total cost is ${result.shareTotalCost}. ${result.costFunction}.`;
  }
  return `Fixed cost ${result.shareFixedCost}; variable cost ${result.shareVariableCost} per unit. ${result.costFunction}.`;
}

export type { CalculationMethod };
