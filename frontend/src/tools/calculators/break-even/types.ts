import type { SupportedCurrency } from '@/tools/shared/currency';

export interface BreakEvenInput {
  revenuePerUnit: string;
  costPerUnit: string;
  fixedCosts: string;
  currency: SupportedCurrency;
}

export interface BreakEvenResult {
  revenuePerUnit: number;
  costPerUnit: number;
  fixedCosts: number;
  contributionPerUnit: number;
  marginPercent: number | null;
  markupPercent: number | null;
  unitsToSell: number | null;
  breakEvenRevenue: number | null;
  currency: SupportedCurrency;
  formattedMargin: string;
  formattedMarkup: string;
  formattedUnits: string;
  formattedRevenue: string;
  shareRevenue: string;
  breakEvenDefined: boolean;
  explanation: string | null;
}

export type BreakEvenFieldErrors = {
  revenuePerUnit?: string;
  costPerUnit?: string;
  fixedCosts?: string;
  currency?: string;
  form?: string;
};

export const EXAMPLE_UNITS: BreakEvenInput = {
  revenuePerUnit: '100',
  costPerUnit: '60',
  fixedCosts: '2000',
  currency: 'PKR',
};

/** Same price structure, different fixed cost — focuses on break-even revenue. */
export const EXAMPLE_REVENUE: BreakEvenInput = {
  revenuePerUnit: '80',
  costPerUnit: '50',
  fixedCosts: '1500',
  currency: 'PKR',
};

export function createDefaultInput(): BreakEvenInput {
  return {
    revenuePerUnit: '',
    costPerUnit: '',
    fixedCosts: '',
    currency: 'PKR',
  };
}
