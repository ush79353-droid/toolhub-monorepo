import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateSalaryInflation,
  formatSalaryInflationMoney,
} from './calculation';
import type {
  SalaryInflationFieldErrors,
  SalaryInflationInput,
  SalaryInflationResult,
} from './types';

export interface SalaryInflationValidation {
  isValid: boolean;
  errors: SalaryInflationFieldErrors;
  result: SalaryInflationResult | null;
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
 * Validates inputs, normalizes current salary into the reference currency,
 * computes single-period adjusted salary and gain/loss at full precision,
 * then FX-converts each result into its independent display currency.
 * Inflation % is never converted.
 */
export function validateSalaryInflationInput(
  input: SalaryInflationInput,
  rates?: CurrencyRatesSnapshot | null
): SalaryInflationValidation {
  const errors: SalaryInflationFieldErrors = {};

  const reference = parseNumber(input.referenceSalary);
  const inflation = parseNumber(input.inflationPercent);
  const current = parseNumber(input.currentSalary);

  if (reference.blank || reference.invalid || reference.value === null) {
    errors.referenceSalary = 'Enter a valid reference salary.';
  } else if (!(reference.value >= 0)) {
    errors.referenceSalary = 'Reference salary must be zero or greater.';
  }

  if (inflation.blank || inflation.invalid || inflation.value === null) {
    errors.inflationPercent = 'Enter a valid inflation rate.';
  } else if (!(inflation.value > -100)) {
    errors.inflationPercent = 'Inflation must be greater than −100%.';
  }

  if (current.blank || current.invalid || current.value === null) {
    errors.currentSalary = 'Enter a valid current salary.';
  } else if (!(current.value >= 0)) {
    errors.currentSalary = 'Current salary must be zero or greater.';
  }

  if (
    Boolean(errors.referenceSalary) ||
    Boolean(errors.inflationPercent) ||
    Boolean(errors.currentSalary)
  ) {
    return { isValid: false, errors, result: null };
  }

  const baseCurrency = input.referenceSalaryCurrency;

  const currentNormalized = convertMoney(
    current.value!,
    input.currentSalaryCurrency,
    baseCurrency,
    rates
  );
  if (!currentNormalized.ok) {
    errors.form = currentNormalized.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateSalaryInflation({
    referenceSalary: reference.value!,
    inflationPercent: inflation.value!,
    currentSalary: currentNormalized.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const adjustedFx = convertMoney(
    computed.adjustedSalary,
    baseCurrency,
    input.adjustedSalaryCurrency,
    rates
  );
  if (!adjustedFx.ok) {
    errors.form = adjustedFx.message;
    return { isValid: false, errors, result: null };
  }

  const gainLossFx = convertMoney(
    computed.gainLoss,
    baseCurrency,
    input.gainLossCurrency,
    rates
  );
  if (!gainLossFx.ok) {
    errors.form = gainLossFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: SalaryInflationResult = {
    adjustedSalaryCanonical: computed.adjustedSalary,
    gainLossCanonical: computed.gainLoss,
    currentSalaryCanonical: currentNormalized.amount,
    adjustedSalary: adjustedFx.amount,
    gainLoss: gainLossFx.amount,
    referenceSalaryCurrency: baseCurrency,
    adjustedSalaryCurrency: input.adjustedSalaryCurrency,
    currentSalaryCurrency: input.currentSalaryCurrency,
    gainLossCurrency: input.gainLossCurrency,
    formattedAdjustedSalary: formatSalaryInflationMoney(
      adjustedFx.amount,
      input.adjustedSalaryCurrency
    ),
    formattedGainLoss: formatSalaryInflationMoney(
      gainLossFx.amount,
      input.gainLossCurrency
    ),
  };

  return { isValid: true, errors, result };
}
