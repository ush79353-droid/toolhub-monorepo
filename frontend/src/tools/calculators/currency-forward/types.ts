import type { SupportedCurrency } from '@/tools/shared/currency';

export type DayCountBasis = 360 | 365;
export type CompoundingConvention = 'simple' | 'annual' | 'continuous';

export interface CurrencyForwardInput {
  baseCurrency: SupportedCurrency;
  quoteCurrency: SupportedCurrency;
  spotRate: string;
  annualBaseRatePercent: string;
  annualQuoteRatePercent: string;
  contractDays: string;
  dayCountBasis: DayCountBasis;
  compounding: CompoundingConvention;
  /** Optional notional in base currency */
  notionalBase: string;
  /** Optional future spot for settlement scenario */
  futureSpotRate: string;
  longBase: boolean;
}

export interface CurrencyForwardResult {
  yearFraction: number;
  periodBaseRate: number;
  periodQuoteRate: number;
  forwardRate: number;
  forwardPoints: number;
  forwardPremiumPercent: number;
  annualizedForwardPremiumPercent: number;
  quoteAmountAtForward: number | null;
  quoteAmountAtSpot: number | null;
  quoteAmountDifference: number | null;
  settlementPayoffQuote: number | null;
  dayCountBasis: DayCountBasis;
  compounding: CompoundingConvention;
  baseCurrency: SupportedCurrency;
  quoteCurrency: SupportedCurrency;
  formattedYearFraction: string;
  formattedPeriodBaseRate: string;
  formattedPeriodQuoteRate: string;
  formattedForwardRate: string;
  formattedSpotRate: string;
  formattedForwardPoints: string;
  formattedForwardPremium: string;
  formattedAnnualizedPremium: string;
  formattedQuoteAtForward: string | null;
  formattedQuoteAtSpot: string | null;
  formattedQuoteDifference: string | null;
  formattedSettlementPayoff: string | null;
  interpretation: string;
  explanation: string;
  quoteConventionNote: string;
  formulaBreakdown: string;
}

export type CurrencyForwardFieldErrors = {
  form?: string;
  baseCurrency?: string;
  quoteCurrency?: string;
  spotRate?: string;
  annualBaseRatePercent?: string;
  annualQuoteRatePercent?: string;
  contractDays?: string;
  notionalBase?: string;
  futureSpotRate?: string;
};

/** EUR/USD illustrative defaults from the brief. */
export function createDefaultInput(): CurrencyForwardInput {
  return {
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    spotRate: '1.1',
    annualBaseRatePercent: '3',
    annualQuoteRatePercent: '5',
    contractDays: '90',
    dayCountBasis: 365,
    compounding: 'simple',
    notionalBase: '',
    futureSpotRate: '',
    longBase: true,
  };
}

export function createEmptyInput(
  baseCurrency: SupportedCurrency = 'EUR',
  quoteCurrency: SupportedCurrency = 'USD'
): CurrencyForwardInput {
  return {
    baseCurrency,
    quoteCurrency,
    spotRate: '',
    annualBaseRatePercent: '',
    annualQuoteRatePercent: '',
    contractDays: '',
    dayCountBasis: 365,
    compounding: 'simple',
    notionalBase: '',
    futureSpotRate: '',
    longBase: true,
  };
}
