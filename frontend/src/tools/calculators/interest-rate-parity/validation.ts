import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  annualisedToPeriodicPercent,
  calculateForwardQuote,
  formatIrpQuote,
  periodicToAnnualisedPercent,
} from './calculation';
import type {
  InterestRateParityFieldErrors,
  InterestRateParityInput,
  InterestRateParityResult,
} from './types';

export interface InterestRateParityValidation {
  isValid: boolean;
  errors: InterestRateParityFieldErrors;
  result: InterestRateParityResult | null;
}

function parseNumber(raw: string): {
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function convertQuote(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Resolves period rates from the last-edited annualised/periodic fields,
 * computes the forward (or expected future spot) in the spot quote currency,
 * then optionally re-expresses that quote into forwardCurrency once.
 *
 * Spot/forward selectors are quote (price) currencies for an FX rate
 * (price units per one base unit) — not a second money conversion of a cash amount.
 */
export function validateInterestRateParityInput(
  input: InterestRateParityInput,
  rates?: CurrencyRatesSnapshot | null
): InterestRateParityValidation {
  const errors: InterestRateParityFieldErrors = {};

  const days = parseNumber(input.contractDays);
  const annPrice = parseNumber(input.annualisedPriceRatePercent);
  const perPrice = parseNumber(input.priceRatePercent);
  const annBase = parseNumber(input.annualisedBaseRatePercent);
  const perBase = parseNumber(input.baseRatePercent);
  const spot = parseNumber(input.spotPrice);

  if (days.blank) {
    errors.contractDays = 'Enter the number of days in the forward contract.';
  } else if (days.invalid || days.value === null) {
    errors.contractDays = 'Enter a valid number of days.';
  } else if (!(days.value > 0)) {
    errors.contractDays = 'Contract days must be greater than zero.';
  } else if (!Number.isInteger(days.value)) {
    errors.contractDays = 'Contract days must be a whole number.';
  }

  if (input.priceRateSource === 'annualised') {
    if (annPrice.blank) {
      errors.annualisedPriceRatePercent =
        'Enter an annualised price currency interest rate.';
    } else if (annPrice.invalid || annPrice.value === null) {
      errors.annualisedPriceRatePercent = 'Enter a valid annualised rate.';
    }
  } else if (perPrice.blank) {
    errors.priceRatePercent = 'Enter a price currency interest rate.';
  } else if (perPrice.invalid || perPrice.value === null) {
    errors.priceRatePercent = 'Enter a valid price currency interest rate.';
  }

  if (input.baseRateSource === 'annualised') {
    if (annBase.blank) {
      errors.annualisedBaseRatePercent =
        'Enter an annualised base currency interest rate.';
    } else if (annBase.invalid || annBase.value === null) {
      errors.annualisedBaseRatePercent = 'Enter a valid annualised rate.';
    }
  } else if (perBase.blank) {
    errors.baseRatePercent = 'Enter a base currency interest rate.';
  } else if (perBase.invalid || perBase.value === null) {
    errors.baseRatePercent = 'Enter a valid base currency interest rate.';
  }

  if (spot.blank) {
    errors.spotPrice = 'Enter the spot price.';
  } else if (spot.invalid || spot.value === null) {
    errors.spotPrice = 'Enter a valid spot price.';
  } else if (!(spot.value > 0)) {
    errors.spotPrice = 'Spot price must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const daysValue = days.value!;

  let pricePeriodic: number;
  let priceAnnualised: number;
  if (input.priceRateSource === 'annualised') {
    priceAnnualised = annPrice.value!;
    const derived = annualisedToPeriodicPercent(priceAnnualised, daysValue);
    if (derived === null) {
      errors.form = 'Unable to derive the price currency period rate.';
      return { isValid: false, errors, result: null };
    }
    pricePeriodic = derived;
  } else {
    pricePeriodic = perPrice.value!;
    const derived = periodicToAnnualisedPercent(pricePeriodic, daysValue);
    if (derived === null) {
      errors.form = 'Unable to derive the annualised price currency rate.';
      return { isValid: false, errors, result: null };
    }
    priceAnnualised = derived;
  }

  let basePeriodic: number;
  let baseAnnualised: number;
  if (input.baseRateSource === 'annualised') {
    baseAnnualised = annBase.value!;
    const derived = annualisedToPeriodicPercent(baseAnnualised, daysValue);
    if (derived === null) {
      errors.form = 'Unable to derive the base currency period rate.';
      return { isValid: false, errors, result: null };
    }
    basePeriodic = derived;
  } else {
    basePeriodic = perBase.value!;
    const derived = periodicToAnnualisedPercent(basePeriodic, daysValue);
    if (derived === null) {
      errors.form = 'Unable to derive the annualised base currency rate.';
      return { isValid: false, errors, result: null };
    }
    baseAnnualised = derived;
  }

  const forwardInSpot = calculateForwardQuote({
    spot: spot.value!,
    priceRatePercent: pricePeriodic,
    baseRatePercent: basePeriodic,
    version: input.version,
  });
  if (forwardInSpot === null) {
    errors.form =
      input.version === 'covered'
        ? 'Unable to calculate a finite forward rate (check the base rate denominator).'
        : 'Unable to calculate a finite expected future spot rate.';
    return { isValid: false, errors, result: null };
  }

  const forwardDisplay = convertQuote(
    forwardInSpot,
    input.spotCurrency,
    input.forwardCurrency,
    rates
  );
  if (!forwardDisplay.ok) {
    errors.form = forwardDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: InterestRateParityResult = {
    priceRatePercent: pricePeriodic,
    baseRatePercent: basePeriodic,
    annualisedPriceRatePercent: priceAnnualised,
    annualisedBaseRatePercent: baseAnnualised,
    forwardInSpotCurrency: forwardInSpot,
    forwardDisplay: forwardDisplay.amount,
    spotCurrency: input.spotCurrency,
    forwardCurrency: input.forwardCurrency,
    version: input.version,
    formattedForward: formatIrpQuote(
      forwardDisplay.amount,
      input.forwardCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
