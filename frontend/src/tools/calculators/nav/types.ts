import type { SupportedCurrency } from '@/tools/shared/currency';

export interface NavInput {
  totalInvestmentValue: string;
  cashAndCashEquivalents: string;
  accountsReceivable: string;
  shortTermLiabilities: string;
  longTermLiabilities: string;
  outstandingShares: string;
  currency: SupportedCurrency;
}

export interface NavResult {
  fundAssets: number;
  fundLiabilities: number;
  netAssetValue: number;
  navPerShare: number | null;
  currency: SupportedCurrency;
  formattedFundAssets: string;
  formattedFundLiabilities: string;
  formattedNetAssetValue: string;
  formattedNavPerShare: string | null;
  sharesWarning: string | null;
  warningMessage: string | null;
}

export type NavFieldErrors = {
  form?: string;
  totalInvestmentValue?: string;
  cashAndCashEquivalents?: string;
  accountsReceivable?: string;
  shortTermLiabilities?: string;
  longTermLiabilities?: string;
  outstandingShares?: string;
};

/**
 * Reference:
 * IV 1,500,000 + Cash 250,000 + AR 50,000 = FA 1,800,000
 * STL 50,000 + LTL 20,000 = FL 70,000
 * NAV 1,730,000 · 100,000 shares → $17.30 / share
 */
export function createDefaultInput(): NavInput {
  return {
    totalInvestmentValue: '1500000',
    cashAndCashEquivalents: '250000',
    accountsReceivable: '50000',
    shortTermLiabilities: '50000',
    longTermLiabilities: '20000',
    outstandingShares: '100000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): NavInput {
  return {
    totalInvestmentValue: '',
    cashAndCashEquivalents: '',
    accountsReceivable: '',
    shortTermLiabilities: '',
    longTermLiabilities: '',
    outstandingShares: '',
    currency,
  };
}
