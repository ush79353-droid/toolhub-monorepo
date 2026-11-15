import type { SupportedCurrency } from '@/tools/shared/currency';

export type NopatFormulaMode = 'simple' | 'precise';

export interface NopatInput {
  mode: NopatFormulaMode;
  /** Simple mode */
  operatingProfit: number;
  /** Shared tax rate (%) */
  taxRatePercent: number;
  /** Precise mode */
  netIncome: number;
  nonOperatingIncomeLoss: number;
  nonOperatingIncomeGain: number;
  interestExpense: number;
  tax: number;
  currency: SupportedCurrency;
}

export interface NopatResult {
  nopat: number | null;
  nopatDisplay: string;
  currency: SupportedCurrency;
  mode: NopatFormulaMode;
}

export type NopatFieldErrors = Record<string, string>;

export function createDefaultInput(): NopatInput {
  return {
    mode: 'simple',
    operatingProfit: 500_000,
    taxRatePercent: 30,
    netIncome: Number.NaN,
    nonOperatingIncomeLoss: Number.NaN,
    nonOperatingIncomeGain: Number.NaN,
    interestExpense: Number.NaN,
    tax: Number.NaN,
    currency: 'PKR',
  };
}
