import type { SupportedCurrency } from '@/tools/shared/currency';

export interface WaccInput {
  costOfEquity: string;
  equity: string;
  costOfDebt: string;
  debt: string;
  corporateTaxRate: string;
  currency: SupportedCurrency;
}

export interface WaccResult {
  totalCapital: number;
  equityWeight: number;
  debtWeight: number;
  afterTaxCostOfDebtPercent: number;
  equityContributionPercent: number;
  debtContributionPercent: number;
  waccPercent: number;
  currency: SupportedCurrency;
  formattedTotalCapital: string;
  formattedEquityWeight: string;
  formattedDebtWeight: string;
  formattedAfterTaxCostOfDebt: string;
  formattedEquityContribution: string;
  formattedDebtContribution: string;
  formattedWacc: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  warningMessage: string | null;
}

export type WaccFieldErrors = {
  form?: string;
  costOfEquity?: string;
  equity?: string;
  costOfDebt?: string;
  debt?: string;
  corporateTaxRate?: string;
};

/** Reference: E 700k · D 500k · Re 15% · Rd 8% · T 20% → WACC ≈ 11.42% */
export function createDefaultInput(): WaccInput {
  return {
    costOfEquity: '15',
    equity: '700000',
    costOfDebt: '8',
    debt: '500000',
    corporateTaxRate: '20',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): WaccInput {
  return {
    costOfEquity: '',
    equity: '',
    costOfDebt: '',
    debt: '',
    corporateTaxRate: '',
    currency,
  };
}
