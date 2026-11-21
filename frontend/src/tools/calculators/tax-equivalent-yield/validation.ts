import { calculateTaxEquivalentYieldFromInput } from './calculation';
import type {
  TaxEquivalentYieldFieldErrors,
  TaxEquivalentYieldInput,
  TaxEquivalentYieldResult,
} from './types';

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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface TaxEquivalentYieldValidation {
  isValid: boolean;
  errors: TaxEquivalentYieldFieldErrors;
  result: TaxEquivalentYieldResult | null;
}

function taxRateError(
  parsed: ReturnType<typeof parseNumber>,
): string | undefined {
  if (parsed.blank) return 'Enter the marginal tax rate (%).';
  if (parsed.invalid || parsed.value == null)
    return 'Enter a valid marginal tax rate.';
  if (parsed.value < 0) return 'Marginal tax rate cannot be negative.';
  if (parsed.value >= 100) {
    return 'Taxable equivalent yield is undefined when the marginal tax rate is 100%, because the formula\'s denominator becomes zero.';
  }
  return undefined;
}

function nonNegYield(
  parsed: ReturnType<typeof parseNumber>,
  blankMsg: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return 'Enter a valid yield (%).';
  if (parsed.value < 0) return 'Yield cannot be negative.';
  return undefined;
}

export function collectFieldErrors(
  input: TaxEquivalentYieldInput,
): TaxEquivalentYieldFieldErrors {
  const errors: TaxEquivalentYieldFieldErrors = {};
  const { solveTarget } = input;

  if (solveTarget === 'taxableEquivalentYield') {
    const eY = nonNegYield(
      parseNumber(input.bondYieldPercent),
      'Enter the tax-exempt bond yield (%).',
    );
    if (eY) errors.bondYieldPercent = eY;
    const eT = taxRateError(parseNumber(input.marginalTaxRatePercent));
    if (eT) errors.marginalTaxRatePercent = eT;
  } else if (solveTarget === 'taxExemptYield') {
    const eTey = nonNegYield(
      parseNumber(input.taxableEquivalentYieldPercent),
      'Enter the taxable equivalent yield (%).',
    );
    if (eTey) errors.taxableEquivalentYieldPercent = eTey;
    const eT = taxRateError(parseNumber(input.marginalTaxRatePercent));
    if (eT) errors.marginalTaxRatePercent = eT;
  } else {
    const eY = nonNegYield(
      parseNumber(input.bondYieldPercent),
      'Enter the tax-exempt bond yield (%).',
    );
    if (eY) errors.bondYieldPercent = eY;
    const tey = parseNumber(input.taxableEquivalentYieldPercent);
    if (tey.blank) {
      errors.taxableEquivalentYieldPercent =
        'Enter the taxable equivalent yield (%).';
    } else if (tey.invalid || tey.value == null) {
      errors.taxableEquivalentYieldPercent =
        'Enter a valid taxable equivalent yield.';
    } else if (tey.value <= 0) {
      errors.taxableEquivalentYieldPercent =
        'Implied tax rate is undefined when taxable equivalent yield is zero. Enter a positive TEY.';
    } else {
      const y = parseNumber(input.bondYieldPercent);
      if (
        y.value != null &&
        !y.blank &&
        y.value > tey.value
      ) {
        errors.bondYieldPercent =
          'Tax-exempt yield cannot exceed taxable equivalent yield for a valid implied tax rate (0%–100%).';
      }
    }
  }

  if (input.showComparison) {
    const ty = parseNumber(input.taxableInvestmentYieldPercent);
    if (!ty.blank) {
      if (ty.invalid || ty.value == null) {
        errors.taxableInvestmentYieldPercent =
          'Enter a valid taxable investment yield (%).';
      } else if (ty.value < 0) {
        errors.taxableInvestmentYieldPercent =
          'Taxable investment yield cannot be negative.';
      }
    }
  }

  return errors;
}

export function hasFieldErrors(errors: TaxEquivalentYieldFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateTaxEquivalentYieldInput(
  input: TaxEquivalentYieldInput,
): TaxEquivalentYieldValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateTaxEquivalentYieldFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
