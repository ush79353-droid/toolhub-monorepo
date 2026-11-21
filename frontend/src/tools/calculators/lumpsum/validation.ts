import { calculateLumpsumFromInput, termToYears } from './calculation';
import type { LumpsumFieldErrors, LumpsumInput, LumpsumResult } from './types';

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

export interface LumpsumValidation {
  isValid: boolean;
  errors: LumpsumFieldErrors;
  result: LumpsumResult | null;
}

function hasErrors(errors: LumpsumFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: LumpsumInput): LumpsumFieldErrors {
  const errors: LumpsumFieldErrors = {};
  const mode = input.mode;

  const needsPv =
    mode === 'final-balance' ||
    mode === 'expected-return' ||
    mode === 'investment-term';
  const needsFv =
    mode === 'initial-lumpsum' ||
    mode === 'expected-return' ||
    mode === 'investment-term';
  const needsRate =
    mode === 'initial-lumpsum' ||
    mode === 'final-balance' ||
    mode === 'investment-term';
  const needsTerm =
    mode === 'initial-lumpsum' ||
    mode === 'final-balance' ||
    mode === 'expected-return';

  if (needsPv) {
    const pv = parseNumber(input.initialInvestment);
    if (!pv.blank) {
      if (pv.invalid || pv.value == null) {
        errors.initialInvestment = 'Please enter a valid initial investment.';
      } else if (pv.value < 0) {
        errors.initialInvestment = 'Initial investment cannot be negative.';
      } else if (
        (mode === 'expected-return' || mode === 'investment-term') &&
        pv.value <= 0
      ) {
        errors.initialInvestment =
          'Initial investment must be greater than zero for this mode.';
      }
    }
  }

  if (needsFv) {
    const fv = parseNumber(input.targetAmount);
    if (!fv.blank) {
      if (fv.invalid || fv.value == null) {
        errors.targetAmount = 'Please enter a valid goal / final balance.';
      } else if (fv.value < 0) {
        errors.targetAmount = 'Goal amount cannot be negative.';
      } else if (
        (mode === 'expected-return' || mode === 'investment-term') &&
        fv.value <= 0
      ) {
        errors.targetAmount = 'Goal must be greater than zero for this mode.';
      }
    }
  }

  if (needsRate) {
    const r = parseNumber(input.annualReturn);
    if (!r.blank) {
      if (r.invalid || r.value == null) {
        errors.annualReturn = 'Please enter a valid expected return.';
      } else if (
        input.compoundingFrequency !== 'continuously' &&
        r.value <= -100 * (1) // period rate domain handled in calc; flag extreme
      ) {
        // allow negatives; domain checked when solving
      }
    }
  }

  if (needsTerm) {
    const t = parseNumber(input.termValue);
    if (!t.blank) {
      if (t.invalid || t.value == null) {
        errors.termValue = 'Please enter a valid investment term.';
      } else if (t.value <= 0) {
        errors.termValue = 'Investment term must be greater than zero.';
      } else {
        const years = termToYears(t.value, input.termUnit);
        if (years == null || years > 100) {
          errors.termValue = 'Term cannot exceed 100 years.';
        }
      }
    }
  }

  const inflation = parseNumber(input.inflationRate);
  if (!inflation.blank) {
    if (inflation.invalid || inflation.value == null) {
      errors.inflationRate = 'Please enter a valid inflation rate.';
    } else if (inflation.value <= -100) {
      errors.inflationRate = 'Inflation rate must be greater than −100%.';
    }
  }

  if (input.startDate.trim() !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) {
    errors.startDate = 'Please enter a valid start date.';
  }

  return errors;
}

function requiredFilled(input: LumpsumInput): boolean {
  const mode = input.mode;
  const filled = (s: string) => s.trim() !== '';
  if (!filled(input.inflationRate) || !filled(input.startDate)) return false;
  if (mode === 'initial-lumpsum') {
    return (
      filled(input.targetAmount) &&
      filled(input.annualReturn) &&
      filled(input.termValue)
    );
  }
  if (mode === 'final-balance') {
    return (
      filled(input.initialInvestment) &&
      filled(input.annualReturn) &&
      filled(input.termValue)
    );
  }
  if (mode === 'expected-return') {
    return (
      filled(input.initialInvestment) &&
      filled(input.targetAmount) &&
      filled(input.termValue)
    );
  }
  return (
    filled(input.initialInvestment) &&
    filled(input.targetAmount) &&
    filled(input.annualReturn)
  );
}

export function validateLumpsumInput(input: LumpsumInput): LumpsumValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  if (!requiredFilled(input)) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculateLumpsumFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form:
          'Unable to calculate with these inputs. The goal may be unreachable under the selected return, or a value is outside the mathematical domain.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
