import type { SupportedCurrency } from '@/tools/shared/currency';

/** Sales quantity / money display period. */
export type SalesPeriod = 'day' | 'week' | 'month' | 'year';

export const SALES_PERIOD_OPTIONS: ReadonlyArray<{
  value: SalesPeriod;
  label: string;
}> = [
  { value: 'day', label: '/ d' },
  { value: 'week', label: '/ wk' },
  { value: 'month', label: '/ mo' },
  { value: 'year', label: '/ yr' },
];

export interface SalesInput {
  productPrice: string;
  productPriceCurrency: SupportedCurrency;
  quantity: string;
  quantityPeriod: SalesPeriod;
  /** Display currency for monthly revenue output. */
  revenueCurrency: SupportedCurrency;
  revenuePeriod: SalesPeriod;
  /** Display currency for annual revenue output. */
  annualRevenueCurrency: SupportedCurrency;
  annualRevenuePeriod: SalesPeriod;
  salesReturns: string;
  salesReturnsCurrency: SupportedCurrency;
  salesAllowances: string;
  salesAllowancesCurrency: SupportedCurrency;
  salesDiscounts: string;
  salesDiscountsCurrency: SupportedCurrency;
  costsOpen: boolean;
  netSalesCurrency: SupportedCurrency;
  netSalesPeriod: SalesPeriod;
}

export interface SalesResult {
  /** Canonical math currency = product price currency. */
  calcCurrency: SupportedCurrency;
  quantityPeriod: SalesPeriod;
  grossInPeriod: number;
  deductionsInPeriod: number;
  netInPeriod: number;
  monthlyGross: number;
  annualGross: number;
  revenueDisplay: number;
  revenueCurrency: SupportedCurrency;
  revenuePeriod: SalesPeriod;
  annualRevenueDisplay: number;
  annualRevenueCurrency: SupportedCurrency;
  annualRevenuePeriod: SalesPeriod;
  netSalesDisplay: number;
  netSalesCurrency: SupportedCurrency;
  netSalesPeriod: SalesPeriod;
  formattedRevenue: string;
  formattedAnnualRevenue: string;
  formattedNetSales: string;
  summaryText: string;
}

export type SalesFieldErrors = {
  productPrice?: string;
  quantity?: string;
  salesReturns?: string;
  salesAllowances?: string;
  salesDiscounts?: string;
  form?: string;
};

export function createDefaultInput(): SalesInput {
  return {
    productPrice: '',
    productPriceCurrency: 'PKR',
    quantity: '',
    quantityPeriod: 'month',
    revenueCurrency: 'PKR',
    revenuePeriod: 'month',
    annualRevenueCurrency: 'PKR',
    annualRevenuePeriod: 'year',
    salesReturns: '',
    salesReturnsCurrency: 'PKR',
    salesAllowances: '',
    salesAllowancesCurrency: 'PKR',
    salesDiscounts: '',
    salesDiscountsCurrency: 'PKR',
    costsOpen: false,
    netSalesCurrency: 'PKR',
    netSalesPeriod: 'month',
  };
}

export function inputsEqual(a: SalesInput, b: SalesInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
