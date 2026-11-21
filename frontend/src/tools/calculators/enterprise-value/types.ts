import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EnterpriseValueInput {
  marketCap: string;
  minorityInterest: string;
  preferredShares: string;
  debt: string;
  cash: string;
  currency: SupportedCurrency;
}

export interface EnterpriseValueResult {
  enterpriseValue: number;
  totalClaims: number;
  netDebt: number;
  currency: SupportedCurrency;
  formattedEv: string;
  formattedTotalClaims: string;
  formattedNetDebt: string;
  interpretation: string;
  warningMessage: string | null;
}

export type EnterpriseValueFieldErrors = {
  form?: string;
  marketCap?: string;
  minorityInterest?: string;
  preferredShares?: string;
  debt?: string;
  cash?: string;
};

/** Reference: $500M + $20M + $15M + $100M − $50M → EV $585M */
export function createDefaultInput(): EnterpriseValueInput {
  return {
    marketCap: '500000000',
    minorityInterest: '20000000',
    preferredShares: '15000000',
    debt: '100000000',
    cash: '50000000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): EnterpriseValueInput {
  return {
    marketCap: '',
    minorityInterest: '',
    preferredShares: '',
    debt: '',
    cash: '',
    currency,
  };
}
