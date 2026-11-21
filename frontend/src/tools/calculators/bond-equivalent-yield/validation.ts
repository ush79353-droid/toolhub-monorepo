import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateBondEquivalentYield,
  formatBeyPercent,
} from './calculation';
import type {
  BondEquivalentYieldFieldErrors,
  BondEquivalentYieldInput,
  BondEquivalentYieldResult,
} from './types';

export interface BondEquivalentYieldValidation {
  isValid: boolean;
  errors: BondEquivalentYieldFieldErrors;
  result: BondEquivalentYieldResult | null;
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
 * Validates inputs, normalizes bond price into the face-value currency, then
 * computes investment-basis BEY at full precision. Days to maturity and BEY %
 * are never FX-converted.
 */
export function validateBondEquivalentYieldInput(
  input: BondEquivalentYieldInput,
  rates?: CurrencyRatesSnapshot | null
): BondEquivalentYieldValidation {
  const errors: BondEquivalentYieldFieldErrors = {};

  const price = parseNumber(input.bondPrice);
  const face = parseNumber(input.faceValue);
  const days = parseNumber(input.daysToMaturity);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.bondPrice = 'Enter a valid bond price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.bondPrice = 'Bond price must be greater than zero.';
  }

  if (!face.blank && (face.invalid || face.value === null)) {
    errors.faceValue = 'Enter a valid face value.';
  } else if (!face.blank && face.value !== null && !(face.value > 0)) {
    errors.faceValue = 'Face value must be greater than zero.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.daysToMaturity = 'Enter a valid number of days to maturity.';
  } else if (!days.blank && days.value !== null && !(days.value > 0)) {
    errors.daysToMaturity = 'Days to maturity must be greater than zero.';
  }

  const incomplete =
    price.blank ||
    face.blank ||
    days.blank ||
    Boolean(errors.bondPrice) ||
    Boolean(errors.faceValue) ||
    Boolean(errors.daysToMaturity);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const bondInFace = convertMoney(
    price.value!,
    input.bondPriceCurrency,
    input.faceValueCurrency,
    rates
  );
  if (!bondInFace.ok) {
    errors.form = bondInFace.message;
    return { isValid: false, errors, result: null };
  }

  if (bondInFace.amount > face.value!) {
    errors.bondPrice =
      'Bond price cannot exceed face value for this discount-instrument BEY.';
    return { isValid: false, errors, result: null };
  }

  const beyPercent = calculateBondEquivalentYield({
    bondPrice: bondInFace.amount,
    faceValue: face.value!,
    daysToMaturity: days.value!,
  });

  if (beyPercent === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: BondEquivalentYieldResult = {
    beyPercent,
    formattedBeyPercent: formatBeyPercent(beyPercent),
    faceValueCurrency: input.faceValueCurrency,
    bondPriceCurrency: input.bondPriceCurrency,
    bondPriceInFaceCurrency: bondInFace.amount,
    faceValue: face.value!,
    daysToMaturity: days.value!,
  };

  return { isValid: true, errors, result };
}
