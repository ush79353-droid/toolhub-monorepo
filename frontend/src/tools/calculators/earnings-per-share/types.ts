import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EpsInput {
  netIncome: string;
  preferredDividends: string;
  commonShares: string;
  currency: SupportedCurrency;
}

export interface EpsResult {
  earningsAvailableToCommon: number;
  earningsPerShare: number;
  currency: SupportedCurrency;
  formattedEarningsAvailable: string;
  formattedEps: string;
  formattedShares: string;
  interpretation: string;
  warningMessage: string | null;
}

export type EpsFieldErrors = {
  form?: string;
  netIncome?: string;
  preferredDividends?: string;
  commonShares?: string;
};

/** Screenshot reference: NI $13.12B · pref $200M · shares 333.4M → EPS ≈ $38.75 */
export function createDefaultInput(): EpsInput {
  return {
    netIncome: '13120000000',
    preferredDividends: '200000000',
    commonShares: '333400000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): EpsInput {
  return {
    netIncome: '',
    preferredDividends: '0',
    commonShares: '',
    currency,
  };
}
