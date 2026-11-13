import type { SupportedCurrency } from '@/tools/shared/currency';

export const SOLVE_TARGETS = ['arDays', 'receivables', 'creditSales', 'periodDays'] as const;
export type SolveFor = (typeof SOLVE_TARGETS)[number];

export const BALANCE_METHODS = ['ending', 'average'] as const;
export type BalanceMethod = (typeof BALANCE_METHODS)[number];

export interface ARDaysInput {
  solveFor: SolveFor;
  balanceMethod: BalanceMethod;
  /** Ending balance. Used when the method is ending and receivables are an input. */
  accountsReceivable: number;
  netCreditSales: number;
  periodDays: number;
  arDays: number;
  beginningReceivable: number;
  endingReceivable: number;
  currency: SupportedCurrency;
}

export interface ARDaysFormula {
  receivables: number;
  netCreditSales: number;
  periodDays: number;
  arDays: number;
}

export interface ARDaysResult {
  defined: boolean;
  explanation: string | null;
  solveFor: SolveFor;
  balanceMethod: BalanceMethod;
  arDays: number | null;
  accountsReceivableUsed: number | null;
  netCreditSales: number | null;
  periodDays: number | null;
  /** Set only when the average-balance method supplied the receivables figure. */
  averageReceivable: number | null;
  /** Net credit sales divided by the receivables used. Null when receivables are zero. */
  receivablesTurnover: number | null;
  formula: ARDaysFormula | null;
  currency: SupportedCurrency;
}

export type ARDaysFieldErrors = Record<string, string>;

export function createDefaultARDaysInput(): ARDaysInput {
  return {
    solveFor: 'arDays',
    balanceMethod: 'ending',
    accountsReceivable: 50000,
    netCreditSales: 100000,
    periodDays: 365,
    arDays: 182.5,
    beginningReceivable: 40000,
    endingReceivable: 60000,
    currency: 'PKR',
  };
}

/** Average balances are an input only when that method is selected and receivables are not the unknown. */
export function averageBalanceIsInput(input: Pick<ARDaysInput, 'solveFor' | 'balanceMethod'>): boolean {
  return input.balanceMethod === 'average' && input.solveFor !== 'receivables';
}
