/**
 * Covered interest parity (BASE/QUOTE = quote units per 1 base).
 * Simple: F = S × (1+rq T)/(1+rb T)
 * Annual: F = S × (1+rq)^T / (1+rb)^T
 * Continuous: F = S × e^((rq−rb) T)
 */
import type { CompoundingConvention, DayCountBasis } from './types';

export function yearFraction(
  contractDays: number,
  dayCountBasis: DayCountBasis
): number | null {
  if (
    !Number.isFinite(contractDays) ||
    !Number.isFinite(dayCountBasis) ||
    contractDays <= 0 ||
    dayCountBasis <= 0
  ) {
    return null;
  }
  return contractDays / dayCountBasis;
}

/** Accumulation factor over T years for annual rate (decimal). */
export function accumulationFactor(
  annualRateDecimal: number,
  t: number,
  compounding: CompoundingConvention
): number | null {
  if (![annualRateDecimal, t].every(Number.isFinite) || t < 0) return null;
  if (compounding === 'simple') {
    const factor = 1 + annualRateDecimal * t;
    return factor > 0 && Number.isFinite(factor) ? factor : null;
  }
  if (compounding === 'annual') {
    if (1 + annualRateDecimal <= 0) return null;
    const factor = Math.pow(1 + annualRateDecimal, t);
    return factor > 0 && Number.isFinite(factor) ? factor : null;
  }
  // continuous
  const factor = Math.exp(annualRateDecimal * t);
  return factor > 0 && Number.isFinite(factor) ? factor : null;
}

/** Effective period return = accumulation − 1 (for display). */
export function periodRateFromAccumulation(accumulation: number): number {
  return accumulation - 1;
}

export interface CurrencyForwardMathResult {
  yearFraction: number;
  periodBaseRate: number;
  periodQuoteRate: number;
  forwardRate: number;
  forwardPoints: number;
  forwardPremiumPercent: number;
  annualizedForwardPremiumPercent: number;
}

export function calculateCurrencyForward(
  spotRate: number,
  annualBaseRateDecimal: number,
  annualQuoteRateDecimal: number,
  contractDays: number,
  dayCountBasis: DayCountBasis,
  compounding: CompoundingConvention
): CurrencyForwardMathResult | null {
  if (
    ![spotRate, annualBaseRateDecimal, annualQuoteRateDecimal, contractDays].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (spotRate <= 0) return null;

  const t = yearFraction(contractDays, dayCountBasis);
  if (t == null || t <= 0) return null;

  const aq = accumulationFactor(annualQuoteRateDecimal, t, compounding);
  const ab = accumulationFactor(annualBaseRateDecimal, t, compounding);
  if (aq == null || ab == null || ab === 0) return null;

  const forwardRate = spotRate * (aq / ab);
  if (!Number.isFinite(forwardRate) || forwardRate <= 0) return null;

  const forwardPoints = forwardRate - spotRate;
  const forwardPremiumPercent = (forwardRate / spotRate - 1) * 100;
  const annualizedForwardPremiumPercent =
    (forwardRate / spotRate - 1) * (1 / t) * 100;

  if (
    ![
      forwardPoints,
      forwardPremiumPercent,
      annualizedForwardPremiumPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    yearFraction: t,
    periodBaseRate: periodRateFromAccumulation(ab),
    periodQuoteRate: periodRateFromAccumulation(aq),
    forwardRate,
    forwardPoints,
    forwardPremiumPercent,
    annualizedForwardPremiumPercent,
  };
}

export function quoteAmount(notionalBase: number, rate: number): number | null {
  if (![notionalBase, rate].every(Number.isFinite) || notionalBase < 0 || rate <= 0) {
    return null;
  }
  const v = notionalBase * rate;
  return Number.isFinite(v) ? v : null;
}

/** Long base: payoff_quote = N × (ST − F). Short base: opposite sign. */
export function settlementPayoffQuote(
  notionalBase: number,
  forwardRate: number,
  futureSpot: number,
  longBase: boolean
): number | null {
  if (
    ![notionalBase, forwardRate, futureSpot].every(Number.isFinite) ||
    notionalBase < 0 ||
    forwardRate <= 0 ||
    futureSpot <= 0
  ) {
    return null;
  }
  const raw = notionalBase * (futureSpot - forwardRate);
  const payoff = longBase ? raw : -raw;
  return Number.isFinite(payoff) ? payoff : null;
}

export function formatFxRate(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 6),
  }).format(value);
}

export function formatPercent(value: number, digits = 4): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value))}%`;
}

export function formatMoneyAmount(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function interpretForward(
  premiumPercent: number,
  base: string,
  quote: string
): string {
  if (Math.abs(premiumPercent) < 1e-12) {
    return `Under the selected assumptions, the theoretical forward equals the spot — no forward premium or discount for ${base} in ${quote} terms.`;
  }
  if (premiumPercent > 0) {
    return `Under covered interest parity, ${base} trades at a theoretical forward premium in ${quote} terms (F > S). This is a model result, not an executable quote.`;
  }
  return `Under covered interest parity, ${base} trades at a theoretical forward discount in ${quote} terms (F < S). This is a model result, not an executable quote.`;
}

export const QUOTE_CONVENTION_NOTE =
  'Convention: BASE/QUOTE = units of quote currency per one unit of base currency (e.g. EUR/USD = 1.10 means 1 EUR = 1.10 USD). Quote-currency interest is in the CIP numerator; base-currency interest is in the denominator.';
