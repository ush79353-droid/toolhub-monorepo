import type { SupportedCurrency } from '@/tools/shared/currency';

export type YesNo = 'yes' | 'no';

export interface RmdInput {
  /** Spouse >10 years younger and sole IRA beneficiary. */
  spouseYoungerSoleBeneficiary: YesNo;
  /** Owner age as of birthday in the distribution year (default 72). */
  age: string;
  accountBalance: string;
  accountBalanceCurrency: SupportedCurrency;
  rmdCurrency: SupportedCurrency;
}

export interface RmdResult {
  age: number;
  lifeExpectancyFactor: number | null;
  factorLabel: string;
  accountBalanceCanonical: number;
  rmdCanonical: number | null;
  rmd: number | null;
  formattedFactor: string;
  formattedRmd: string;
  accountBalanceCurrency: SupportedCurrency;
  rmdCurrency: SupportedCurrency;
  jointLifeUnavailable: boolean;
  unavailableNote: string | null;
}

export type RmdFieldErrors = {
  age?: string;
  accountBalance?: string;
  form?: string;
};

export function createDefaultInput(): RmdInput {
  return {
    spouseYoungerSoleBeneficiary: 'no',
    age: '72',
    accountBalance: '',
    accountBalanceCurrency: 'PKR',
    rmdCurrency: 'PKR',
  };
}
