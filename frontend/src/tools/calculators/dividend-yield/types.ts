import type { SupportedCurrency } from '@/tools/shared/currency';

export type DividendFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly';

/** Empty string = no selection (required before results). */
export type DividendFrequencySelection = DividendFrequency | '';

export const DIVIDEND_FREQUENCY_OPTIONS: readonly {
  value: DividendFrequency;
  label: string;
  paymentsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', paymentsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', paymentsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', paymentsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', paymentsPerYear: 12 },
] as const;

export interface DividendYieldInput {
  /** Dividend paid each payment period (same share unit as share price). */
  dividendsPerPeriod: string;
  dividendsPerPeriodCurrency: SupportedCurrency;
  /** Required frequency; blank until the user selects. */
  frequency: DividendFrequencySelection;
  /** Independent display currency for the annual-dividends output. */
  annualDividendsCurrency: SupportedCurrency;
  /** Current share price (same share unit as dividends). */
  sharePrice: string;
  sharePriceCurrency: SupportedCurrency;
  annualDividendsOpen: boolean;
  dividendYieldOpen: boolean;
}

export interface DividendYieldResult {
  /** Full-precision annual dividends in the per-period currency. */
  annualDividendsInPeriodCurrency: number;
  /** Annual dividends converted into the annual-dividends display currency. */
  annualDividends: number;
  /** Full-precision yield %; null when share price is not ready. */
  dividendYieldPercent: number | null;
  dividendsPerPeriodCurrency: SupportedCurrency;
  annualDividendsCurrency: SupportedCurrency;
  sharePriceCurrency: SupportedCurrency;
  formattedAnnualDividends: string;
  formattedDividendYieldPercent: string | null;
  paymentsPerYear: number;
}

export type DividendYieldFieldErrors = {
  dividendsPerPeriod?: string;
  frequency?: string;
  sharePrice?: string;
  form?: string;
};

export function createDefaultInput(): DividendYieldInput {
  return {
    dividendsPerPeriod: '',
    dividendsPerPeriodCurrency: 'PKR',
    frequency: '',
    annualDividendsCurrency: 'PKR',
    sharePrice: '',
    sharePriceCurrency: 'PKR',
    annualDividendsOpen: true,
    dividendYieldOpen: true,
  };
}
