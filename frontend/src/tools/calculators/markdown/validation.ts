import { calculateMarkdownFromInput } from './calculation';
import type {
  MarkdownFieldErrors,
  MarkdownInput,
  MarkdownResult,
  MarkdownVariable,
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

export interface MarkdownValidation {
  isValid: boolean;
  errors: MarkdownFieldErrors;
  result: MarkdownResult | null;
}

function hasErrors(errors: MarkdownFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function fieldRaw(input: MarkdownInput, field: MarkdownVariable): string {
  switch (field) {
    case 'originalPrice':
      return input.originalPrice;
    case 'actualPrice':
      return input.actualPrice;
    case 'markdownAmount':
      return input.markdownAmount;
    case 'markdownPercentage':
      return input.markdownPercentage;
  }
}

export function collectFieldErrors(input: MarkdownInput): MarkdownFieldErrors {
  const errors: MarkdownFieldErrors = {};

  if (!input.authoritativeFields) {
    const filled = (
      ['originalPrice', 'actualPrice', 'markdownAmount', 'markdownPercentage'] as const
    ).filter((f) => fieldRaw(input, f).trim() !== '');
    if (filled.length === 0) return errors;
    if (filled.length === 1) {
      errors.form = 'Enter two compatible values to calculate the remaining fields.';
      return errors;
    }
  }

  const pair = input.authoritativeFields;
  if (!pair) {
    errors.form = 'Enter two compatible values to calculate the remaining fields.';
    return errors;
  }

  for (const field of pair) {
    const parsed = parseNumber(fieldRaw(input, field));
    if (parsed.blank) {
      errors[field] =
        field === 'originalPrice'
          ? 'Please enter a valid original selling price.'
          : field === 'actualPrice'
            ? 'Actual selling price cannot be empty.'
            : field === 'markdownAmount'
              ? 'Enter a markdown amount.'
              : 'Enter a markdown percentage.';
      continue;
    }
    if (parsed.invalid || parsed.value == null) {
      errors[field] =
        field === 'originalPrice'
          ? 'Please enter a valid original selling price.'
          : field === 'actualPrice'
            ? 'Actual selling price cannot be negative.'
            : field === 'markdownAmount'
              ? 'Enter a valid markdown amount.'
              : 'Markdown percentage must be between 0% and 100%.';
      continue;
    }
    if (parsed.value < 0) {
      errors[field] =
        field === 'markdownPercentage'
          ? 'Markdown percentage must be between 0% and 100%.'
          : field === 'actualPrice'
            ? 'Actual selling price cannot be negative.'
            : field === 'originalPrice'
              ? 'Please enter a valid original selling price.'
              : 'Markdown amount cannot be negative.';
    } else if (field === 'markdownPercentage' && parsed.value > 100) {
      errors.markdownPercentage =
        'Markdown percentage must be between 0% and 100%.';
    } else if (
      field === 'markdownPercentage' &&
      pair.includes('actualPrice') &&
      parsed.value >= 100
    ) {
      errors.markdownPercentage =
        'The original price cannot be determined from a 100% markdown and an actual price.';
    } else if (
      field === 'markdownPercentage' &&
      pair.includes('markdownAmount') &&
      parsed.value === 0
    ) {
      const md = parseNumber(input.markdownAmount);
      if (md.value !== 0) {
        errors.markdownPercentage =
          'The original price cannot be determined from these values.';
      } else {
        errors.form =
          'The original price cannot be determined from these values.';
      }
    }
  }

  // Cross-checks when both originals present in pair
  if (pair.includes('originalPrice') && pair.includes('actualPrice')) {
    const o = parseNumber(input.originalPrice);
    const a = parseNumber(input.actualPrice);
    if (
      o.value != null &&
      a.value != null &&
      !o.blank &&
      !a.blank &&
      a.value > o.value
    ) {
      errors.actualPrice =
        'Actual selling price cannot exceed the original price in markdown mode.';
    }
  }

  if (pair.includes('originalPrice') && pair.includes('markdownAmount')) {
    const o = parseNumber(input.originalPrice);
    const m = parseNumber(input.markdownAmount);
    if (
      o.value != null &&
      m.value != null &&
      !o.blank &&
      !m.blank &&
      m.value > o.value
    ) {
      errors.markdownAmount =
        'Markdown amount cannot exceed the original price.';
    }
  }

  return errors;
}

export function validateMarkdownInput(
  input: MarkdownInput,
): MarkdownValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  if (!input.authoritativeFields) {
    return {
      isValid: false,
      errors: {
        form: 'Enter two compatible values to calculate the remaining fields.',
      },
      result: null,
    };
  }
  const result = calculateMarkdownFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'The original price cannot be determined from these values.',
      },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}

/** Write solved values into derived fields only; keep authoritative strings as typed. */
export function applyResultToInput(
  input: MarkdownInput,
  result: MarkdownResult,
): MarkdownInput {
  const auth = new Set(result.authoritativeFields);
  const fmtMoney = (n: number) => String(Math.round(n * 100) / 100);
  const fmtPct = (n: number) => String(Math.round(n * 1e6) / 1e6);
  return {
    ...input,
    originalPrice: auth.has('originalPrice')
      ? input.originalPrice
      : fmtMoney(result.originalPrice),
    actualPrice: auth.has('actualPrice')
      ? input.actualPrice
      : fmtMoney(result.actualPrice),
    markdownAmount: auth.has('markdownAmount')
      ? input.markdownAmount
      : fmtMoney(result.markdownAmount),
    markdownPercentage: auth.has('markdownPercentage')
      ? input.markdownPercentage
      : fmtPct(result.markdownPercentage),
    authoritativeFields: result.authoritativeFields,
  };
}
