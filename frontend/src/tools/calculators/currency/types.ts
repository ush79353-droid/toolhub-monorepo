import type { SupportedCurrency } from '@/tools/shared/currency';

/** Majors shown when “most popular currencies only” is checked (screenshot default). */
export const POPULAR_CURRENCY_CODES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'NZD',
  'CHF',
  'JPY',
  'CNY',
  'INR',
  'HKD',
  'SGD',
  'KRW',
  'MXN',
  'BRL',
  'SEK',
  'NOK',
  'DKK',
  'ZAR',
  'TRY',
] as const satisfies readonly SupportedCurrency[];

export interface CurrencyCalculatorInput {
  amount: string;
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  popularOnly: boolean;
}

export interface CurrencyCalculatorResult {
  amount: number;
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  convertedAmount: number;
  /** Units of `to` per 1 unit of `from` (full precision). */
  rateFromTo: number;
  /** Units of `from` per 1 unit of `to` (full precision). */
  rateToFrom: number;
  formattedAmount: string;
  formattedConvertedAmount: string;
  formattedRateFromTo: string;
  formattedRateToFrom: string;
  sameCurrency: boolean;
  fetchedAt: string | null;
  isStale: boolean;
  ratesAvailable: boolean;
}

export type CurrencyCalculatorFieldErrors = {
  amount?: string;
  fromCurrency?: string;
  toCurrency?: string;
  form?: string;
};

export function createDefaultInput(): CurrencyCalculatorInput {
  return {
    amount: '100',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    popularOnly: true,
  };
}

export function inputsEqual(
  a: CurrencyCalculatorInput,
  b: CurrencyCalculatorInput
): boolean {
  return (
    a.amount === b.amount &&
    a.fromCurrency === b.fromCurrency &&
    a.toCurrency === b.toCurrency &&
    a.popularOnly === b.popularOnly
  );
}
