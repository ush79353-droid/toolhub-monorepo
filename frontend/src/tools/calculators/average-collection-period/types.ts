import type { SupportedCurrency } from '@/tools/shared/currency';

export const CALCULATION_METHODS = ['average-ar', 'turnover-ratio'] as const;
export type CalculationMethod = (typeof CALCULATION_METHODS)[number];

export interface AverageCollectionPeriodInput {
  method: CalculationMethod;
  durationDays: number;
  beginningReceivable: number;
  endingReceivable: number;
  averageReceivable: number;
  totalCreditSales: number;
  receivablesTurnoverRatio: number;
  /** Optional comparison only — not used in the collection-period formula. */
  termsOfCreditDays: number;
  currency: SupportedCurrency;
}

export interface AverageCollectionPeriodResult {
  defined: boolean;
  explanation: string | null;
  method: CalculationMethod;
  collectionPeriodDays: number | null;
  averageReceivable: number | null;
  totalCreditSales: number | null;
  receivablesTurnoverRatio: number | null;
  durationDays: number | null;
  termsOfCreditDays: number | null;
  currency: SupportedCurrency;
}

export type AverageCollectionPeriodFieldErrors = Record<string, string>;

/** Screenshot defaults: average-AR method, 365-day duration, empty money fields. */
export function createDefaultInput(): AverageCollectionPeriodInput {
  return {
    method: 'average-ar',
    durationDays: 365,
    beginningReceivable: Number.NaN,
    endingReceivable: Number.NaN,
    averageReceivable: Number.NaN,
    totalCreditSales: Number.NaN,
    receivablesTurnoverRatio: Number.NaN,
    termsOfCreditDays: Number.NaN,
    currency: 'PKR',
  };
}

export function isAverageArMethod(input: Pick<AverageCollectionPeriodInput, 'method'>): boolean {
  return input.method === 'average-ar';
}
