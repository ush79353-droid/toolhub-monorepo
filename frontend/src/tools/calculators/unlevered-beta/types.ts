import type { SupportedCurrency } from '@/tools/shared/currency';

export type TaxRateMode = 'calculated' | 'manual';

export interface UnleveredBetaInput {
  taxRateMode: TaxRateMode;
  netIncome: string;
  preTaxIncome: string;
  manualTaxRate: string;
  totalDebt: string;
  shareholdersEquity: string;
  leveredBeta: string;
  currency: SupportedCurrency;
}

export interface UnleveredBetaResult {
  corporateTaxRatePercent: number;
  debtToEquityRatio: number;
  leveredBeta: number;
  unleveredBeta: number;
  taxRateMode: TaxRateMode;
  currency: SupportedCurrency;
  formattedTaxRate: string;
  formattedDebtToEquity: string;
  formattedLeveredBeta: string;
  formattedUnleveredBeta: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  warningMessage: string | null;
}

export type UnleveredBetaFieldErrors = {
  form?: string;
  netIncome?: string;
  preTaxIncome?: string;
  manualTaxRate?: string;
  totalDebt?: string;
  shareholdersEquity?: string;
  leveredBeta?: string;
};

/** Reference: NI 80k · PreTax 100k · Debt 2M · Equity 1M · βL 1.20 → βU ≈ 0.4615 */
export function createDefaultInput(): UnleveredBetaInput {
  return {
    taxRateMode: 'calculated',
    netIncome: '80000',
    preTaxIncome: '100000',
    manualTaxRate: '20',
    totalDebt: '2000000',
    shareholdersEquity: '1000000',
    leveredBeta: '1.20',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): UnleveredBetaInput {
  return {
    taxRateMode: 'calculated',
    netIncome: '',
    preTaxIncome: '',
    manualTaxRate: '',
    totalDebt: '',
    shareholdersEquity: '',
    leveredBeta: '',
    currency,
  };
}
