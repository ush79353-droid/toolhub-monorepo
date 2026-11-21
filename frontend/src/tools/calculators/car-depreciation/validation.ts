import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { CAR_DEPRECIATION_ANNUAL_RATE } from './content';
import {
  calculateCarDepreciation,
  formatCarDepreciationMoney,
} from './calculation';
import type {
  CarDepreciationFieldErrors,
  CarDepreciationInput,
  CarDepreciationResult,
} from './types';

export interface CarDepreciationValidation {
  isValid: boolean;
  errors: CarDepreciationFieldErrors;
  result: CarDepreciationResult | null;
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
 * Validates nonnegative initial value and age, computes declining-balance
 * results in the initial-value currency, then FX-converts each money output
 * into its independent display currency. Age and rate never convert.
 */
export function validateCarDepreciationInput(
  input: CarDepreciationInput,
  rates?: CurrencyRatesSnapshot | null
): CarDepreciationValidation {
  const errors: CarDepreciationFieldErrors = {};

  const initial = parseNumber(input.initialValue);
  const age = parseNumber(input.carAgeYears);

  if (!initial.blank && (initial.invalid || initial.value === null)) {
    errors.initialValue = 'Enter a valid initial car value.';
  } else if (initial.value !== null && initial.value < 0) {
    errors.initialValue = 'Initial car value must be zero or greater.';
  }

  if (!age.blank && (age.invalid || age.value === null)) {
    errors.carAgeYears = 'Enter a valid car age in years.';
  } else if (age.value !== null && age.value < 0) {
    errors.carAgeYears = 'Car age must be zero or greater.';
  }

  const incomplete =
    initial.blank ||
    age.blank ||
    Boolean(errors.initialValue) ||
    Boolean(errors.carAgeYears);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCarDepreciation({
    initialValue: initial.value!,
    carAgeYears: age.value!,
    annualRate: CAR_DEPRECIATION_ANNUAL_RATE,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.initialValueCurrency;

  const fxPairs: Array<{
    amount: number;
    to: SupportedCurrency;
  }> = [
    { amount: computed.reducedValue, to: input.reducedValueCurrency },
    { amount: computed.after1Minute, to: input.after1MinuteCurrency },
    { amount: computed.after1Year, to: input.after1YearCurrency },
    { amount: computed.after2Years, to: input.after2YearsCurrency },
    { amount: computed.after3Years, to: input.after3YearsCurrency },
    { amount: computed.after4Years, to: input.after4YearsCurrency },
    { amount: computed.after5Years, to: input.after5YearsCurrency },
  ];

  const converted: number[] = [];
  for (const pair of fxPairs) {
    const fx = convertMoney(pair.amount, from, pair.to, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(fx.amount);
  }

  const [
    reducedValue,
    after1Minute,
    after1Year,
    after2Years,
    after3Years,
    after4Years,
    after5Years,
  ] = converted;

  const result: CarDepreciationResult = {
    reducedValueCanonical: computed.reducedValue,
    after1MinuteCanonical: computed.after1Minute,
    after1YearCanonical: computed.after1Year,
    after2YearsCanonical: computed.after2Years,
    after3YearsCanonical: computed.after3Years,
    after4YearsCanonical: computed.after4Years,
    after5YearsCanonical: computed.after5Years,
    totalDepreciationToDateCanonical: computed.totalDepreciationToDate,
    annualRatePercent: computed.annualRate * 100,
    initialValueCurrency: from,
    reducedValue,
    after1Minute,
    after1Year,
    after2Years,
    after3Years,
    after4Years,
    after5Years,
    reducedValueCurrency: input.reducedValueCurrency,
    after1MinuteCurrency: input.after1MinuteCurrency,
    after1YearCurrency: input.after1YearCurrency,
    after2YearsCurrency: input.after2YearsCurrency,
    after3YearsCurrency: input.after3YearsCurrency,
    after4YearsCurrency: input.after4YearsCurrency,
    after5YearsCurrency: input.after5YearsCurrency,
    formattedReducedValue: formatCarDepreciationMoney(
      reducedValue,
      input.reducedValueCurrency
    ),
    formattedAfter1Minute: formatCarDepreciationMoney(
      after1Minute,
      input.after1MinuteCurrency
    ),
    formattedAfter1Year: formatCarDepreciationMoney(
      after1Year,
      input.after1YearCurrency
    ),
    formattedAfter2Years: formatCarDepreciationMoney(
      after2Years,
      input.after2YearsCurrency
    ),
    formattedAfter3Years: formatCarDepreciationMoney(
      after3Years,
      input.after3YearsCurrency
    ),
    formattedAfter4Years: formatCarDepreciationMoney(
      after4Years,
      input.after4YearsCurrency
    ),
    formattedAfter5Years: formatCarDepreciationMoney(
      after5Years,
      input.after5YearsCurrency
    ),
  };

  return { isValid: true, errors, result };
}
