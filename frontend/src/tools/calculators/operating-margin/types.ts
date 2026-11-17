import type { SupportedCurrency } from '@/tools/shared/currency';

export interface OperatingMarginInput {
  revenue: string;
  revenueCurrency: SupportedCurrency;
  cogs: string;
  cogsCurrency: SupportedCurrency;
  operatingExpenses: string;
  operatingExpensesCurrency: SupportedCurrency;
  /** Independent display currency for operating income. */
  operatingIncomeCurrency: SupportedCurrency;
}

export interface OperatingMarginResult {
  /** Full-precision operating income in calculation (revenue) currency. */
  operatingIncome: number;
  /** Full-precision operating income in the display currency. */
  operatingIncomeDisplay: number;
  /** Full-precision margin percent. */
  marginPercent: number;
  revenueNormalized: number;
  cogsNormalized: number;
  operatingExpensesNormalized: number;
  calcCurrency: SupportedCurrency;
  operatingIncomeCurrency: SupportedCurrency;
  formattedOperatingIncome: string;
  formattedMarginPercent: string;
}

export type OperatingMarginFieldErrors = {
  revenue?: string;
  cogs?: string;
  operatingExpenses?: string;
  form?: string;
};

export function createDefaultInput(): OperatingMarginInput {
  return {
    revenue: '',
    revenueCurrency: 'PKR',
    cogs: '',
    cogsCurrency: 'PKR',
    operatingExpenses: '',
    operatingExpensesCurrency: 'PKR',
    operatingIncomeCurrency: 'PKR',
  };
}
