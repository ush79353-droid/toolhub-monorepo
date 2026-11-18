/**
 * UI-wiring validation (same-currency path).
 * Commit 2 replaces this with Phase 2 FX normalization.
 */
import type {
  PrivateSavingsFieldErrors,
  PrivateSavingsInput,
  PrivateSavingsResult,
} from './types';

export interface PrivateSavingsValidation {
  isValid: boolean;
  errors: PrivateSavingsFieldErrors;
  result: PrivateSavingsResult | null;
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

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Same-currency Sp = Y − T − C for UI commit. FX lands in the engine commit. */
export function validatePrivateSavingsInput(
  input: PrivateSavingsInput
): PrivateSavingsValidation {
  const errors: PrivateSavingsFieldErrors = {};
  const income = parseNumber(input.totalIncome);
  const taxes = parseNumber(input.taxes);
  const consumption = parseNumber(input.consumption);

  if (!income.blank && (income.invalid || income.value === null)) {
    errors.totalIncome = 'Enter a valid total income.';
  }
  if (!taxes.blank && (taxes.invalid || taxes.value === null)) {
    errors.taxes = 'Enter a valid tax amount.';
  }
  if (!consumption.blank && (consumption.invalid || consumption.value === null)) {
    errors.consumption = 'Enter a valid consumption amount.';
  }

  const incomplete =
    income.blank ||
    taxes.blank ||
    consumption.blank ||
    Boolean(errors.totalIncome) ||
    Boolean(errors.taxes) ||
    Boolean(errors.consumption);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  // UI commit: require matching currencies; mixed FX is handled in the engine commit.
  if (
    input.totalIncomeCurrency !== input.privateSavingsCurrency ||
    input.taxesCurrency !== input.privateSavingsCurrency ||
    input.consumptionCurrency !== input.privateSavingsCurrency
  ) {
    errors.form =
      'Use the same currency on all fields, or wait for FX rates to normalize mixed currencies.';
    return { isValid: false, errors, result: null };
  }

  const privateSavings =
    income.value! - taxes.value! - consumption.value!;
  if (!Number.isFinite(privateSavings)) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: PrivateSavingsResult = {
    privateSavings,
    privateSavingsCanonical: privateSavings,
    currency: input.privateSavingsCurrency,
    formattedPrivateSavings: formatMoney(privateSavings),
    isDissaving: privateSavings < 0,
  };

  return { isValid: true, errors, result };
}
