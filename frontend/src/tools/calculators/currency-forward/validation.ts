import {
  calculateCurrencyForward,
  formatFxRate,
  formatMoneyAmount,
  formatPercent,
  interpretForward,
  quoteAmount,
  QUOTE_CONVENTION_NOTE,
  settlementPayoffQuote,
} from './calculation';
import type {
  CompoundingConvention,
  CurrencyForwardFieldErrors,
  CurrencyForwardInput,
  CurrencyForwardResult,
  DayCountBasis,
} from './types';

export interface CurrencyForwardValidation {
  isValid: boolean;
  errors: CurrencyForwardFieldErrors;
  result: CurrencyForwardResult | null;
}

function parseFinite(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateCurrencyForwardInput(
  input: CurrencyForwardInput
): CurrencyForwardValidation {
  const errors: CurrencyForwardFieldErrors = {};
  let hasError = false;

  if (input.baseCurrency === input.quoteCurrency) {
    errors.quoteCurrency =
      'Base and quote currencies must differ (identity rate of 1 is not supported here).';
    hasError = true;
  }

  const spot = parseFinite(input.spotRate);
  if (spot.blank) {
    errors.spotRate = 'Enter the spot exchange rate.';
    hasError = true;
  } else if (spot.invalid || spot.value === null) {
    errors.spotRate = 'Enter a valid spot exchange rate.';
    hasError = true;
  } else if (spot.value <= 0) {
    errors.spotRate = 'Spot exchange rate must be greater than zero.';
    hasError = true;
  }

  const rb = parseFinite(input.annualBaseRatePercent);
  if (rb.blank) {
    errors.annualBaseRatePercent = 'Enter the annualized base currency interest rate.';
    hasError = true;
  } else if (rb.invalid || rb.value === null) {
    errors.annualBaseRatePercent = 'Enter a valid base currency interest rate.';
    hasError = true;
  }

  const rq = parseFinite(input.annualQuoteRatePercent);
  if (rq.blank) {
    errors.annualQuoteRatePercent =
      'Enter the annualized quote currency interest rate.';
    hasError = true;
  } else if (rq.invalid || rq.value === null) {
    errors.annualQuoteRatePercent = 'Enter a valid quote currency interest rate.';
    hasError = true;
  }

  const days = parseFinite(input.contractDays);
  if (days.blank) {
    errors.contractDays = 'Enter the number of days in the forward contract.';
    hasError = true;
  } else if (days.invalid || days.value === null) {
    errors.contractDays = 'Enter a valid number of contract days.';
    hasError = true;
  } else if (days.value <= 0) {
    errors.contractDays = 'Contract duration must be greater than zero.';
    hasError = true;
  }

  const basis: DayCountBasis =
    input.dayCountBasis === 360 || input.dayCountBasis === 365
      ? input.dayCountBasis
      : 365;
  const compounding: CompoundingConvention =
    input.compounding === 'annual' ||
    input.compounding === 'continuous' ||
    input.compounding === 'simple'
      ? input.compounding
      : 'simple';

  const notional = parseFinite(input.notionalBase);
  if (!notional.blank && (notional.invalid || notional.value === null)) {
    errors.notionalBase = 'Enter a valid base-currency notional.';
    hasError = true;
  } else if (notional.value != null && notional.value < 0) {
    errors.notionalBase = 'Notional cannot be negative.';
    hasError = true;
  }

  const futureSpot = parseFinite(input.futureSpotRate);
  if (!futureSpot.blank && (futureSpot.invalid || futureSpot.value === null)) {
    errors.futureSpotRate = 'Enter a valid future spot rate.';
    hasError = true;
  } else if (futureSpot.value != null && futureSpot.value <= 0) {
    errors.futureSpotRate = 'Future spot rate must be greater than zero.';
    hasError = true;
  }

  if (
    hasError ||
    spot.value === null ||
    rb.value === null ||
    rq.value === null ||
    days.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateCurrencyForward(
    spot.value,
    rb.value / 100,
    rq.value / 100,
    days.value,
    basis,
    compounding
  );
  if (!math) {
    errors.form =
      'Unable to calculate a theoretical forward under the selected rates and compounding (check accumulation factors).';
    return { isValid: false, errors, result: null };
  }

  const base = input.baseCurrency;
  const quote = input.quoteCurrency;
  const pairLabel = `${base}/${quote}`;

  let quoteAtForward: number | null = null;
  let quoteAtSpot: number | null = null;
  let quoteDiff: number | null = null;
  let settlement: number | null = null;

  if (notional.value != null && notional.value >= 0 && !notional.blank) {
    quoteAtForward = quoteAmount(notional.value, math.forwardRate);
    quoteAtSpot = quoteAmount(notional.value, spot.value);
    if (quoteAtForward != null && quoteAtSpot != null) {
      quoteDiff = quoteAtForward - quoteAtSpot;
    }
    if (futureSpot.value != null && !futureSpot.blank) {
      settlement = settlementPayoffQuote(
        notional.value,
        math.forwardRate,
        futureSpot.value,
        input.longBase
      );
    }
  }

  const result: CurrencyForwardResult = {
    yearFraction: math.yearFraction,
    periodBaseRate: math.periodBaseRate,
    periodQuoteRate: math.periodQuoteRate,
    forwardRate: math.forwardRate,
    forwardPoints: math.forwardPoints,
    forwardPremiumPercent: math.forwardPremiumPercent,
    annualizedForwardPremiumPercent: math.annualizedForwardPremiumPercent,
    quoteAmountAtForward: quoteAtForward,
    quoteAmountAtSpot: quoteAtSpot,
    quoteAmountDifference: quoteDiff,
    settlementPayoffQuote: settlement,
    dayCountBasis: basis,
    compounding,
    baseCurrency: base,
    quoteCurrency: quote,
    formattedYearFraction: formatFxRate(math.yearFraction, 6),
    formattedPeriodBaseRate: formatPercent(math.periodBaseRate * 100),
    formattedPeriodQuoteRate: formatPercent(math.periodQuoteRate * 100),
    formattedForwardRate: `${formatFxRate(math.forwardRate)} ${quote} per ${base}`,
    formattedSpotRate: `${formatFxRate(spot.value)} ${quote} per ${base}`,
    formattedForwardPoints: formatFxRate(math.forwardPoints, 6),
    formattedForwardPremium: formatPercent(math.forwardPremiumPercent),
    formattedAnnualizedPremium: formatPercent(
      math.annualizedForwardPremiumPercent
    ),
    formattedQuoteAtForward:
      quoteAtForward == null
        ? null
        : `${formatMoneyAmount(quoteAtForward)} ${quote}`,
    formattedQuoteAtSpot:
      quoteAtSpot == null ? null : `${formatMoneyAmount(quoteAtSpot)} ${quote}`,
    formattedQuoteDifference:
      quoteDiff == null
        ? null
        : `${quoteDiff >= 0 ? '+' : '−'}${formatMoneyAmount(Math.abs(quoteDiff))} ${quote}`,
    formattedSettlementPayoff:
      settlement == null
        ? null
        : `${settlement >= 0 ? '+' : '−'}${formatMoneyAmount(Math.abs(settlement))} ${quote}`,
    interpretation: interpretForward(
      math.forwardPremiumPercent,
      base,
      quote
    ),
    explanation: `Theoretical ${pairLabel} forward is ${formatFxRate(math.forwardRate)} ${quote} per ${base} under covered interest parity (${compounding}, Actual/${basis}). Not an executable dealer quote; basis, spreads, and funding can differ.`,
    quoteConventionNote: QUOTE_CONVENTION_NOTE,
    formulaBreakdown: [
      `T = ${days.value}/${basis} ≈ ${formatFxRate(math.yearFraction, 6)}`,
      `Aq/Ab → F ≈ ${formatFxRate(math.forwardRate)}`,
      `Points ≈ ${formatFxRate(math.forwardPoints, 6)}`,
      `Premium ≈ ${formatPercent(math.forwardPremiumPercent)}`,
    ].join(' · '),
  };

  return { isValid: true, errors, result };
}
