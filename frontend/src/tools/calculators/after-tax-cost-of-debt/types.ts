import type { SupportedCurrency } from '@/tools/shared/currency';

/** Tracks which side last drove the tax-rate field (avoids circular updates). */
export type TaxRateSource = 'incomes' | 'manual';

export interface AfterTaxCostOfDebtInput {
  netIncome: string;
  netIncomeCurrency: SupportedCurrency;
  pretaxIncome: string;
  pretaxIncomeCurrency: SupportedCurrency;
  /** Marginal corporate tax rate % (derived from incomes or edited manually). */
  taxRatePercent: string;
  taxRateSource: TaxRateSource;
  /** Before-tax cost of debt / YTM %. */
  costOfDebtPercent: string;
}

export interface AfterTaxCostOfDebtResult {
  taxRatePercent: number;
  afterTaxCostOfDebtPercent: number;
  costOfDebtPercent: number;
  /** Incomes normalized into this currency for the tax-rate ratio. */
  normalizeCurrency: SupportedCurrency;
  netIncomeNormalized: number;
  pretaxIncomeNormalized: number;
  formattedTaxRate: string;
  formattedAfterTaxCostOfDebt: string;
  formattedCostOfDebt: string;
}

export type AfterTaxCostOfDebtFieldErrors = {
  netIncome?: string;
  pretaxIncome?: string;
  taxRatePercent?: string;
  costOfDebtPercent?: string;
  form?: string;
};

export function createDefaultInput(): AfterTaxCostOfDebtInput {
  return {
    netIncome: '',
    netIncomeCurrency: 'PKR',
    pretaxIncome: '',
    pretaxIncomeCurrency: 'PKR',
    taxRatePercent: '',
    taxRateSource: 'incomes',
    costOfDebtPercent: '',
  };
}
