import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PrivateSavingsInput {
  /** Total income (Y). */
  totalIncome: string;
  totalIncomeCurrency: SupportedCurrency;
  /** Taxes paid to government (T). */
  taxes: string;
  taxesCurrency: SupportedCurrency;
  /** Consumption expenditure (C). */
  consumption: string;
  consumptionCurrency: SupportedCurrency;
  /**
   * Screenshot checkbox. No additional fields are unlocked — project specs do
   * not define verified additional-parameter formulas for this tool.
   */
  includeAdditionalParameters: boolean;
  /** Independent display currency for private savings (Sp). */
  privateSavingsCurrency: SupportedCurrency;
}

export interface PrivateSavingsResult {
  /** Full-precision Sp in the result currency (may be negative). */
  privateSavings: number;
  /** Same value before display rounding. */
  privateSavingsCanonical: number;
  currency: SupportedCurrency;
  formattedPrivateSavings: string;
  /** True when Sp < 0 (dissaving). */
  isDissaving: boolean;
}

export type PrivateSavingsFieldErrors = {
  totalIncome?: string;
  taxes?: string;
  consumption?: string;
  form?: string;
};

export function createDefaultInput(): PrivateSavingsInput {
  return {
    totalIncome: '',
    totalIncomeCurrency: 'PKR',
    taxes: '',
    taxesCurrency: 'PKR',
    consumption: '',
    consumptionCurrency: 'PKR',
    includeAdditionalParameters: false,
    privateSavingsCurrency: 'PKR',
  };
}
