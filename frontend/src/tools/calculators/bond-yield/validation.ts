import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateBondYield, formatYieldPercent } from './calculation';
import {
  COUPON_FREQUENCY_OPTIONS,
  type BondYieldFieldErrors,
  type BondYieldInput,
  type BondYieldResult,
  type CouponFrequency,
} from './types';

export interface BondYieldValidation {
  isValid: boolean;
  errors: BondYieldFieldErrors;
  result: BondYieldResult | null;
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

function isCouponFrequency(value: string): value is CouponFrequency {
  return COUPON_FREQUENCY_OPTIONS.some((o) => o.value === value);
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
 * Validates inputs, normalizes face value and bond price into the face-value
 * currency, then solves YTM. Coupon %, frequency, years, and yield % are never
 * FX-converted.
 */
export function validateBondYieldInput(
  input: BondYieldInput,
  rates?: CurrencyRatesSnapshot | null
): BondYieldValidation {
  const errors: BondYieldFieldErrors = {};

  const face = parseNumber(input.faceValue);
  const price = parseNumber(input.bondPrice);
  const rate = parseNumber(input.annualCouponRatePercent);
  const years = parseNumber(input.yearsToMaturity);

  if (!face.blank && (face.invalid || face.value === null)) {
    errors.faceValue = 'Enter a valid face value.';
  } else if (!face.blank && face.value !== null && !(face.value > 0)) {
    errors.faceValue = 'Face value must be greater than zero.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.bondPrice = 'Enter a valid bond price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.bondPrice = 'Bond price must be greater than zero.';
  }

  if (!isCouponFrequency(input.couponFrequency)) {
    errors.couponFrequency = 'Select a valid coupon frequency.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualCouponRatePercent = 'Enter a valid annual coupon rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualCouponRatePercent = 'Annual coupon rate cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.yearsToMaturity = 'Enter a valid maturity in years.';
  } else if (!years.blank && years.value !== null && !(years.value > 0)) {
    errors.yearsToMaturity = 'Years to maturity must be greater than zero.';
  }

  const incomplete =
    face.blank ||
    price.blank ||
    rate.blank ||
    years.blank ||
    Boolean(errors.faceValue) ||
    Boolean(errors.bondPrice) ||
    Boolean(errors.annualCouponRatePercent) ||
    Boolean(errors.couponFrequency) ||
    Boolean(errors.yearsToMaturity);

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

  const computed = calculateBondYield({
    faceValue: face.value!,
    bondPrice: bondInFace.amount,
    annualCouponRatePercent: rate.value!,
    couponFrequency: input.couponFrequency,
    yearsToMaturity: years.value!,
  });

  if (computed === null) {
    errors.form =
      'Could not solve yield to maturity for these inputs. Check that years × frequency is a whole number of coupon periods, and that price, face value, and coupon are compatible.';
    return { isValid: false, errors, result: null };
  }

  const result: BondYieldResult = {
    bondYieldPercent: computed.bondYieldPercent,
    periodsPerYear: computed.periodsPerYear,
    totalPeriods: computed.totalPeriods,
    faceValueInCalcCurrency: face.value!,
    bondPriceInCalcCurrency: bondInFace.amount,
    faceValueCurrency: input.faceValueCurrency,
    bondPriceCurrency: input.bondPriceCurrency,
    formattedBondYieldPercent: formatYieldPercent(computed.bondYieldPercent),
  };

  return { isValid: true, errors, result };
}
