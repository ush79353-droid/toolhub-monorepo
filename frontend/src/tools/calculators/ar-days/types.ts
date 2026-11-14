import type { SupportedCurrency } from '@/tools/shared/currency';

export const BALANCE_METHODS = ['ending', 'average'] as const;
export type BalanceMethod = (typeof BALANCE_METHODS)[number];

export interface ARDaysInput {
  balanceMethod: BalanceMethod;
  /** Ending (or manually entered) receivables. Used when balanceMethod is ending. */
  accountsReceivable: number;
  netCreditSales: number;
  periodDays: number;
  beginningReceivable: number;
  endingReceivable: number;
  currency: SupportedCurrency;
}

export interface ARDaysResult {
  defined: boolean;
  explanation: string | null;
  balanceMethod: BalanceMethod;
  arDays: number | null;
  accountsReceivableUsed: number | null;
  netCreditSales: number | null;
  periodDays: number | null;
  /** Set only when the average-balance method supplied the receivables figure. */
  averageReceivable: number | null;
  currency: SupportedCurrency;
}

export type ARDaysFieldErrors = Record<string, string>;

/** Screenshot defaults: empty money fields, 365-day period, ending-balance method. */
export function createDefaultARDaysInput(): ARDaysInput {
  return {
    balanceMethod: 'ending',
    accountsReceivable: Number.NaN,
    netCreditSales: Number.NaN,
    periodDays: 365,
    beginningReceivable: Number.NaN,
    endingReceivable: Number.NaN,
    currency: 'PKR',
  };
}

export function averageBalanceIsInput(input: Pick<ARDaysInput, 'balanceMethod'>): boolean {
  return input.balanceMethod === 'average';
}
