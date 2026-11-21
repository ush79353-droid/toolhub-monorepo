import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which field is authoritative between reserve ratio and bank reserves. */
export type ReserveSource = 'ratio' | 'reserves';

export interface MoneyMultiplierInput {
  currency: SupportedCurrency;
  checkableDeposits: string;
  reserveRatio: string;
  bankReserves: string;
  currencyInCirculation: string;
  reserveSource: ReserveSource;
}

export interface MoneyMultiplierResult {
  checkableDeposits: number;
  reserveRatioPercent: number;
  bankReserves: number;
  currencyInCirculation: number;
  monetaryBase: number;
  moneySupply: number;
  moneyMultiplier: number | null;
  currencyDepositRatioPercent: number | null;
  reserveDepositRatioPercent: number;
  simpleDepositMultiplier: number | null;
  formattedDeposits: string;
  formattedReserveRatio: string;
  formattedReserves: string;
  formattedCurrency: string;
  formattedBase: string;
  formattedSupply: string;
  formattedMultiplier: string;
  formattedC: string;
  formattedR: string;
  formattedSimpleMd: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
}

export type MoneyMultiplierFieldErrors = {
  form?: string;
  checkableDeposits?: string;
  reserveRatio?: string;
  bankReserves?: string;
  currencyInCirculation?: string;
};

export function createDefaultInput(): MoneyMultiplierInput {
  return {
    currency: 'USD',
    checkableDeposits: '',
    reserveRatio: '10',
    bankReserves: '',
    currencyInCirculation: '',
    reserveSource: 'ratio',
  };
}

export function createEmptyInput(): MoneyMultiplierInput {
  return {
    currency: 'USD',
    checkableDeposits: '',
    reserveRatio: '',
    bankReserves: '',
    currencyInCirculation: '',
    reserveSource: 'ratio',
  };
}

/** Teaching example from the brief (not a national statistic). */
export function createExampleInput(): MoneyMultiplierInput {
  return {
    currency: 'USD',
    checkableDeposits: '1000000',
    reserveRatio: '10',
    bankReserves: '100000',
    currencyInCirculation: '200000',
    reserveSource: 'ratio',
  };
}
