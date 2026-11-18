import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DividendPayoutRatioInput {
  /** Total dividends paid for the period. */
  totalDividends: string;
  totalDividendsCurrency: SupportedCurrency;
  /** Net income (earnings) for the same period. */
  netIncome: string;
  netIncomeCurrency: SupportedCurrency;
  /** Declared dividends per share (DPS). */
  declaredDps: string;
  declaredDpsCurrency: SupportedCurrency;
  /** Diluted earnings per share (EPS). */
  dilutedEps: string;
  dilutedEpsCurrency: SupportedCurrency;
  /** Per share calculation section open state. */
  perShareOpen: boolean;
  /**
   * Diluted earnings per share disclosure. No extra fields are unlocked —
   * sibling dividend tools do not define a verified diluted-EPS builder here.
   */
  dilutedEpsOpen: boolean;
}

export interface DividendPayoutRatioResult {
  /** Full-precision company payout % (dividends / NI × 100). Null when undefined. */
  payoutRatioPercent: number | null;
  /** Full-precision per-share payout % (DPS / diluted EPS × 100). Null when undefined. */
  payoutPerSharePercent: number | null;
  formattedPayoutRatioPercent: string | null;
  formattedPayoutPerSharePercent: string | null;
  /** True when company payout exceeds 100%. */
  isAbove100: boolean;
  /** True when per-share payout exceeds 100%. */
  isPerShareAbove100: boolean;
  /** True when company payout is negative (e.g. negative NI or dividends). */
  isNegative: boolean;
  /** True when per-share payout is negative. */
  isPerShareNegative: boolean;
}

export type DividendPayoutRatioFieldErrors = {
  totalDividends?: string;
  netIncome?: string;
  declaredDps?: string;
  dilutedEps?: string;
  form?: string;
};

export function createDefaultInput(): DividendPayoutRatioInput {
  return {
    totalDividends: '',
    totalDividendsCurrency: 'PKR',
    netIncome: '',
    netIncomeCurrency: 'PKR',
    declaredDps: '',
    declaredDpsCurrency: 'PKR',
    dilutedEps: '',
    dilutedEpsCurrency: 'PKR',
    perShareOpen: true,
    dilutedEpsOpen: false,
  };
}
