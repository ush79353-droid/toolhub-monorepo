import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateGrossRentMultiplier,
  formatGrossRentMultiplier,
  toAnnualRentalIncome,
} from './calculation';
import type {
  GrossRentMultiplierFieldErrors,
  GrossRentMultiplierInput,
  GrossRentMultiplierResult,
} from './types';

export interface GrossRentMultiplierValidation {
  isValid: boolean;
  errors: GrossRentMultiplierFieldErrors;
  result: GrossRentMultiplierResult | null;
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

function convertMoney(
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
 * Validates inputs, annualizes rental income, normalizes both money amounts into
 * the property-price currency, then computes GRM = price / annual income.
 */
export function validateGrossRentMultiplierInput(
  input: GrossRentMultiplierInput,
  rates?: CurrencyRatesSnapshot | null
): GrossRentMultiplierValidation {
  const errors: GrossRentMultiplierFieldErrors = {};
  const calcCurrency = input.propertyPriceCurrency;

  const price = parseNumber(input.propertyPrice);
  const income = parseNumber(input.grossRentalIncome);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.propertyPrice = 'Enter a valid property price.';
  } else if (!price.blank && price.value !== null && price.value < 0) {
    errors.propertyPrice = 'Property price cannot be negative.';
  }

  if (!income.blank && (income.invalid || income.value === null)) {
    errors.grossRentalIncome = 'Enter a valid gross rental income.';
  } else if (!income.blank && income.value !== null && !(income.value > 0)) {
    errors.grossRentalIncome = 'Gross rental income must be greater than zero.';
  }

  const incomplete =
    price.blank || income.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const annualInIncomeCurrency = toAnnualRentalIncome(
    income.value!,
    input.rentPeriod
  );
  if (annualInIncomeCurrency === null || !(annualInIncomeCurrency > 0)) {
    errors.grossRentalIncome = 'Could not annualize gross rental income.';
    return { isValid: false, errors, result: null };
  }

  const incomeFx = convertMoney(
    annualInIncomeCurrency,
    input.grossRentalIncomeCurrency,
    calcCurrency,
    rates
  );
  if (!incomeFx.ok) {
    errors.form = incomeFx.message;
    return { isValid: false, errors, result: null };
  }

  const grm = calculateGrossRentMultiplier({
    propertyPrice: price.value!,
    annualGrossRentalIncome: incomeFx.amount,
  });
  if (grm === null) {
    errors.form = 'This combination does not produce a finite gross rent multiplier.';
    return { isValid: false, errors, result: null };
  }

  const result: GrossRentMultiplierResult = {
    annualGrossRentalIncome: incomeFx.amount,
    propertyPriceNormalized: price.value!,
    grossRentMultiplier: grm,
    calcCurrency,
    formattedGrossRentMultiplier: formatGrossRentMultiplier(grm),
  };

  return { isValid: true, errors: {}, result };
}
