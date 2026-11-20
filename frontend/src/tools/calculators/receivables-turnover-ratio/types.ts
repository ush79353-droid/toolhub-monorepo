import type { SupportedCurrency } from '@/tools/shared/currency';

export type ReceivablesTurnoverStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'partial'
  | 'undefinedTurnover'
  | 'zeroTurnover';

export interface ReceivablesTurnoverInput {
  netCreditSales: string;
  openingAccountsReceivable: string;
  closingAccountsReceivable: string;
  currency: SupportedCurrency;
}

export interface ReceivablesTurnoverResult {
  netCreditSales: number | null;
  openingAccountsReceivable: number;
  closingAccountsReceivable: number;
  averageAccountsReceivable: number;
  receivablesTurnoverRatio: number | null;
  status: ReceivablesTurnoverStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedNetCreditSales: string | null;
  formattedOpeningAR: string;
  formattedClosingAR: string;
  formattedAverageAR: string;
  formattedTurnoverRatio: string | null;
}

export type ReceivablesTurnoverFieldErrors = {
  netCreditSales?: string;
  openingAccountsReceivable?: string;
  closingAccountsReceivable?: string;
  form?: string;
};

export function createDefaultInput(): ReceivablesTurnoverInput {
  return {
    netCreditSales: '',
    openingAccountsReceivable: '',
    closingAccountsReceivable: '',
    currency: 'PKR',
  };
}
