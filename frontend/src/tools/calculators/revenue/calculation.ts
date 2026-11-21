/**
 * Bidirectional revenue: R = P × Q, P = R / Q, Q = R / P.
 * Amounts must already share one currency. Round only for display.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { RevenueSolveTarget } from './types';

export function formatRevenueMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRevenueQuantity(quantity: number): string {
  if (!Number.isFinite(quantity)) return '';
  if (Number.isInteger(quantity)) return String(quantity);
  const text = quantity.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

export interface RevenueNumericInput {
  solveFor: RevenueSolveTarget;
  price: number | null;
  quantity: number | null;
  totalRevenue: number | null;
}

export interface RevenueComputation {
  solvedField: RevenueSolveTarget;
  price: number;
  quantity: number;
  totalRevenue: number;
}

export function calculateRevenue(
  input: RevenueNumericInput
): RevenueComputation | null {
  const { solveFor } = input;
  let price = input.price;
  let quantity = input.quantity;
  let totalRevenue = input.totalRevenue;

  if (solveFor === 'totalRevenue') {
    if (price === null || quantity === null) return null;
    if (!(price >= 0) || !(quantity >= 0)) return null;
    totalRevenue = price * quantity;
  } else if (solveFor === 'price') {
    if (totalRevenue === null || quantity === null) return null;
    if (!(totalRevenue >= 0) || !(quantity >= 0)) return null;
    if (quantity === 0) return null;
    price = totalRevenue / quantity;
  } else {
    if (totalRevenue === null || price === null) return null;
    if (!(totalRevenue >= 0) || !(price >= 0)) return null;
    if (price === 0) return null;
    quantity = totalRevenue / price;
  }

  if (
    price === null ||
    quantity === null ||
    totalRevenue === null ||
    !Number.isFinite(price) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(totalRevenue) ||
    price < 0 ||
    quantity < 0 ||
    totalRevenue < 0
  ) {
    return null;
  }

  return {
    solvedField: solveFor,
    price,
    quantity,
    totalRevenue,
  };
}
