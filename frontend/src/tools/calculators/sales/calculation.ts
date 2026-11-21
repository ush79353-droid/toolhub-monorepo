import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { SalesPeriod } from './types';

/** Convert an amount measured in `period` into a monthly equivalent. */
export function periodToMonthlyFactor(period: SalesPeriod): number {
  switch (period) {
    case 'day':
      return 365 / 12;
    case 'week':
      return 52 / 12;
    case 'month':
      return 1;
    case 'year':
      return 1 / 12;
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

/** Convert money/quantity totals between sales periods (via monthly). */
export function convertBetweenPeriods(
  amount: number,
  from: SalesPeriod,
  to: SalesPeriod
): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  if (from === to) return amount;
  const monthly = amount * periodToMonthlyFactor(from);
  return monthly / periodToMonthlyFactor(to);
}

export interface SalesEngineInput {
  productPrice: number;
  quantity: number;
  quantityPeriod: SalesPeriod;
  salesReturns: number;
  salesAllowances: number;
  salesDiscounts: number;
}

export interface SalesEngineResult {
  quantityPeriod: SalesPeriod;
  grossInPeriod: number;
  deductionsInPeriod: number;
  netInPeriod: number;
  monthlyGross: number;
  annualGross: number;
  monthlyNet: number;
  annualNet: number;
}

/**
 * Gross = price × quantity (for the quantity period).
 * Net = gross − (returns + allowances + discounts) in that same period.
 * Operating expenses / COGS are never deducted here.
 */
export function calculateSales(input: SalesEngineInput): SalesEngineResult | null {
  const {
    productPrice,
    quantity,
    quantityPeriod,
    salesReturns,
    salesAllowances,
    salesDiscounts,
  } = input;

  if (
    ![
      productPrice,
      quantity,
      salesReturns,
      salesAllowances,
      salesDiscounts,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (productPrice < 0 || quantity < 0) return null;
  if (salesReturns < 0 || salesAllowances < 0 || salesDiscounts < 0) return null;

  const grossInPeriod = productPrice * quantity;
  const deductionsInPeriod = salesReturns + salesAllowances + salesDiscounts;
  const netInPeriod = grossInPeriod - deductionsInPeriod;

  const monthlyGross = convertBetweenPeriods(grossInPeriod, quantityPeriod, 'month');
  const annualGross = convertBetweenPeriods(grossInPeriod, quantityPeriod, 'year');
  const monthlyNet = convertBetweenPeriods(netInPeriod, quantityPeriod, 'month');
  const annualNet = convertBetweenPeriods(netInPeriod, quantityPeriod, 'year');

  if (![monthlyGross, annualGross, monthlyNet, annualNet, netInPeriod].every(Number.isFinite)) {
    return null;
  }

  return {
    quantityPeriod,
    grossInPeriod,
    deductionsInPeriod,
    netInPeriod,
    monthlyGross,
    annualGross,
    monthlyNet,
    annualNet,
  };
}

export function formatSalesMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function periodLabel(period: SalesPeriod): string {
  switch (period) {
    case 'day':
      return '/ d';
    case 'week':
      return '/ wk';
    case 'month':
      return '/ mo';
    case 'year':
      return '/ yr';
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
}

export function shareSalesText(input: {
  title: string;
  formattedRevenue: string;
  revenueCurrency: SupportedCurrency;
  revenuePeriod: SalesPeriod;
  formattedAnnualRevenue: string;
  annualRevenueCurrency: SupportedCurrency;
  annualRevenuePeriod: SalesPeriod;
  formattedNetSales: string;
  netSalesCurrency: SupportedCurrency;
  netSalesPeriod: SalesPeriod;
  fxNote: string;
}): string {
  return [
    `${input.title} — Omega Calculators`,
    `Revenue: ${input.revenueCurrency} ${input.formattedRevenue} ${periodLabel(input.revenuePeriod)}`,
    `Annual revenue: ${input.annualRevenueCurrency} ${input.formattedAnnualRevenue} ${periodLabel(input.annualRevenuePeriod)}`,
    `Net sales: ${input.netSalesCurrency} ${input.formattedNetSales} ${periodLabel(input.netSalesPeriod)}`,
    input.fxNote,
  ].join('\n');
}
