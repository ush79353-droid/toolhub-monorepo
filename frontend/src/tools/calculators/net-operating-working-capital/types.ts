import type { SupportedCurrency } from '@/tools/shared/currency';

export type NowcStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroNowc'
  | 'negativeNowc';

export interface NetOperatingWorkingCapitalInput {
  cash: string;
  accountsReceivable: string;
  inventories: string;
  accountsPayable: string;
  accruedExpenses: string;
  currency: SupportedCurrency;
}

export interface NetOperatingWorkingCapitalResult {
  cash: number;
  accountsReceivable: number;
  inventories: number;
  accountsPayable: number;
  accruedExpenses: number;
  currentOperatingAssets: number;
  currentOperatingLiabilities: number;
  netOperatingWorkingCapital: number;
  status: NowcStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedCash: string;
  formattedAccountsReceivable: string;
  formattedInventories: string;
  formattedAccountsPayable: string;
  formattedAccruedExpenses: string;
  formattedCurrentOperatingAssets: string;
  formattedCurrentOperatingLiabilities: string;
  formattedNetOperatingWorkingCapital: string;
}

export type NetOperatingWorkingCapitalFieldErrors = {
  cash?: string;
  accountsReceivable?: string;
  inventories?: string;
  accountsPayable?: string;
  accruedExpenses?: string;
  form?: string;
};

export function createDefaultInput(): NetOperatingWorkingCapitalInput {
  return {
    cash: '',
    accountsReceivable: '',
    inventories: '',
    accountsPayable: '',
    accruedExpenses: '',
    currency: 'PKR',
  };
}
