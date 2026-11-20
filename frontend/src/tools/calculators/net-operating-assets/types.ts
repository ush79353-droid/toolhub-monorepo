import type { SupportedCurrency } from '@/tools/shared/currency';

export type NetOperatingAssetsStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'zeroNoa'
  | 'negativeNoa';

export interface NetOperatingAssetsInput {
  cash: string;
  accountsReceivable: string;
  inventory: string;
  prepaidExpenses: string;
  fixedAssets: string;
  accountsPayable: string;
  accruedOperatingExpenses: string;
  currency: SupportedCurrency;
}

export interface NetOperatingAssetsResult {
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  fixedAssets: number;
  accountsPayable: number;
  accruedOperatingExpenses: number;
  operatingAssets: number;
  operatingLiabilities: number;
  netOperatingAssets: number;
  status: NetOperatingAssetsStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedCash: string;
  formattedAccountsReceivable: string;
  formattedInventory: string;
  formattedPrepaidExpenses: string;
  formattedFixedAssets: string;
  formattedAccountsPayable: string;
  formattedAccruedOperatingExpenses: string;
  formattedOperatingAssets: string;
  formattedOperatingLiabilities: string;
  formattedNetOperatingAssets: string;
}

export type NetOperatingAssetsFieldErrors = {
  cash?: string;
  accountsReceivable?: string;
  inventory?: string;
  prepaidExpenses?: string;
  fixedAssets?: string;
  accountsPayable?: string;
  accruedOperatingExpenses?: string;
  form?: string;
};

export function createDefaultInput(): NetOperatingAssetsInput {
  return {
    cash: '',
    accountsReceivable: '',
    inventory: '',
    prepaidExpenses: '',
    fixedAssets: '',
    accountsPayable: '',
    accruedOperatingExpenses: '',
    currency: 'PKR',
  };
}
