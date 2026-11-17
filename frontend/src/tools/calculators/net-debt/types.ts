import type { SupportedCurrency } from '@/tools/shared/currency';

export type MoneyFieldKey =
  | 'cash'
  | 'cashEquivalents'
  | 'accountsPayable'
  | 'currentLongTermDebt'
  | 'currentLeases'
  | 'otherShortTerm'
  | 'nonCurrentLongTermDebt'
  | 'nonCurrentLeases'
  | 'otherLongTerm';

export type DisplayCurrencyKey =
  | 'cashTotalCurrency'
  | 'shortTermDebtCurrency'
  | 'longTermDebtCurrency'
  | 'netDebtCurrency';

export interface NetDebtInput {
  cash: string;
  cashCurrency: SupportedCurrency;
  cashEquivalents: string;
  cashEquivalentsCurrency: SupportedCurrency;
  cashTotalCurrency: SupportedCurrency;

  accountsPayable: string;
  accountsPayableCurrency: SupportedCurrency;
  currentLongTermDebt: string;
  currentLongTermDebtCurrency: SupportedCurrency;
  currentLeases: string;
  currentLeasesCurrency: SupportedCurrency;
  otherShortTerm: string;
  otherShortTermCurrency: SupportedCurrency;
  shortTermDebtCurrency: SupportedCurrency;

  nonCurrentLongTermDebt: string;
  nonCurrentLongTermDebtCurrency: SupportedCurrency;
  nonCurrentLeases: string;
  nonCurrentLeasesCurrency: SupportedCurrency;
  otherLongTerm: string;
  otherLongTermCurrency: SupportedCurrency;
  longTermDebtCurrency: SupportedCurrency;

  netDebtCurrency: SupportedCurrency;
}

export interface NetDebtResult {
  cashTotalCalc: number;
  cashTotalDisplay: number;
  shortTermDebtCalc: number;
  shortTermDebtDisplay: number;
  longTermDebtCalc: number;
  longTermDebtDisplay: number;
  netDebtCalc: number;
  netDebtDisplay: number;
  calcCurrency: SupportedCurrency;
  formattedCashTotal: string;
  formattedShortTermDebt: string;
  formattedLongTermDebt: string;
  formattedNetDebt: string;
}

export type NetDebtFieldErrors = {
  cash?: string;
  cashEquivalents?: string;
  accountsPayable?: string;
  currentLongTermDebt?: string;
  currentLeases?: string;
  otherShortTerm?: string;
  nonCurrentLongTermDebt?: string;
  nonCurrentLeases?: string;
  otherLongTerm?: string;
  form?: string;
};

export function createDefaultInput(): NetDebtInput {
  return {
    cash: '',
    cashCurrency: 'PKR',
    cashEquivalents: '',
    cashEquivalentsCurrency: 'PKR',
    cashTotalCurrency: 'PKR',

    accountsPayable: '',
    accountsPayableCurrency: 'PKR',
    currentLongTermDebt: '',
    currentLongTermDebtCurrency: 'PKR',
    currentLeases: '',
    currentLeasesCurrency: 'PKR',
    otherShortTerm: '',
    otherShortTermCurrency: 'PKR',
    shortTermDebtCurrency: 'PKR',

    nonCurrentLongTermDebt: '',
    nonCurrentLongTermDebtCurrency: 'PKR',
    nonCurrentLeases: '',
    nonCurrentLeasesCurrency: 'PKR',
    otherLongTerm: '',
    otherLongTermCurrency: 'PKR',
    longTermDebtCurrency: 'PKR',

    netDebtCurrency: 'PKR',
  };
}
