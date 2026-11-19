import type { SupportedCurrency } from '@/tools/shared/currency';

export interface EvToSalesInput {
  cash: string;
  cashCurrency: SupportedCurrency;
  marketCap: string;
  marketCapCurrency: SupportedCurrency;
  totalDebt: string;
  totalDebtCurrency: SupportedCurrency;
  minorityInterest: string;
  minorityInterestCurrency: SupportedCurrency;
  preferredShares: string;
  preferredSharesCurrency: SupportedCurrency;
  /** Independent display currency for enterprise value. */
  enterpriseValueCurrency: SupportedCurrency;
  sales: string;
  salesCurrency: SupportedCurrency;
  enterpriseValueOpen: boolean;
  salesRatioOpen: boolean;
}

export interface EvToSalesResult {
  /** EV in market-cap (calculation) currency — full precision. */
  enterpriseValueCanonical: number;
  /** EV converted for display. */
  enterpriseValue: number;
  /** Dimensionless EV/Sales; null when sales is zero (undefined). */
  evToSales: number | null;
  ratioUndefined: boolean;
  calculationCurrency: SupportedCurrency;
  enterpriseValueCurrency: SupportedCurrency;
  formattedEnterpriseValue: string;
  formattedEvToSales: string | null;
  negativeEvNote: string | null;
}

export type EvToSalesFieldErrors = {
  cash?: string;
  marketCap?: string;
  totalDebt?: string;
  minorityInterest?: string;
  preferredShares?: string;
  sales?: string;
  form?: string;
};

export function createDefaultInput(): EvToSalesInput {
  return {
    cash: '',
    cashCurrency: 'PKR',
    marketCap: '',
    marketCapCurrency: 'PKR',
    totalDebt: '',
    totalDebtCurrency: 'PKR',
    minorityInterest: '0.00',
    minorityInterestCurrency: 'PKR',
    preferredShares: '0.00',
    preferredSharesCurrency: 'PKR',
    enterpriseValueCurrency: 'PKR',
    sales: '',
    salesCurrency: 'PKR',
    enterpriseValueOpen: true,
    salesRatioOpen: true,
  };
}
