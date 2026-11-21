import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ResidualIncomeInput {
  equityCapital: string;
  costOfEquity: string;
  netIncome: string;
  currency: SupportedCurrency;
}

export interface ResidualIncomeResult {
  equityCharge: number;
  residualIncome: number;
  currency: SupportedCurrency;
  formattedEquityCharge: string;
  formattedResidualIncome: string;
  interpretation: string;
  warningMessage: string;
}

export type ResidualIncomeFieldErrors = {
  form?: string;
  equityCapital?: string;
  costOfEquity?: string;
  netIncome?: string;
};

/** Reference: EC 800,000 · r 10% · NI 140,000 → charge 80,000 · RI 60,000 */
export function createDefaultInput(): ResidualIncomeInput {
  return {
    equityCapital: '800000',
    costOfEquity: '10',
    netIncome: '140000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): ResidualIncomeInput {
  return {
    equityCapital: '',
    costOfEquity: '',
    netIncome: '',
    currency,
  };
}
