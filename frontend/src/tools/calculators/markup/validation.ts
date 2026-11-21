import { calculateMarkupFromInput } from './calculation';
import type {
  MarkupFieldErrors,
  MarkupInput,
  MarkupResult,
  MarkupVariable,
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

export interface MarkupValidation {
  isValid: boolean;
  errors: MarkupFieldErrors;
  result: MarkupResult | null;
}

function hasErrors(errors: MarkupFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function fieldRaw(input: MarkupInput, field: MarkupVariable): string {
  return input[field];
}

export function collectFieldErrors(input: MarkupInput): MarkupFieldErrors {
  const errors: MarkupFieldErrors = {};

  if (!input.authoritativeFields) {
    const filled = (
      ['cost', 'markupPercentage', 'revenue', 'profit'] as const
    ).filter((f) => fieldRaw(input, f).trim() !== '');
    if (filled.length === 0) return errors;
    errors.form = 'Please enter two compatible values.';
    return errors;
  }

  const pair = input.authoritativeFields;
  if (pair[0] === pair[1]) {
    errors.form = 'Please enter two compatible values.';
    return errors;
  }

  for (const field of pair) {
    const parsed = parseNumber(fieldRaw(input, field));
    if (parsed.blank || parsed.invalid || parsed.value == null) {
      errors[field] =
        field === 'cost'
          ? 'Please enter a valid cost.'
          : field === 'revenue'
            ? 'Revenue cannot be negative.'
            : field === 'markupPercentage'
              ? 'Please enter a valid markup.'
              : 'Please enter a valid profit.';
      continue;
    }

    if (field === 'cost' && parsed.value < 0) {
      errors.cost = 'Please enter a valid cost.';
    } else if (field === 'revenue' && parsed.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    } else if (field === 'markupPercentage' && parsed.value < -100) {
      errors.markupPercentage =
        'These values would produce an invalid negative selling price.';
    }
  }

  if (hasErrors(errors)) return errors;

  const C = parseNumber(input.cost);
  const M = parseNumber(input.markupPercentage);
  const R = parseNumber(input.revenue);
  const P = parseNumber(input.profit);
  const set = new Set(pair);

  if (set.has('cost') && set.has('markupPercentage') && C.value != null && M.value != null) {
    if (C.value === 0 && M.value !== 0) {
      // zero cost with nonzero markup → revenue 0, profit 0 if M any? Actually revenue = 0*(1+m)=0
      // markup % is defined as input; OK for cost+markup with cost 0
    }
    const revenue = C.value * (1 + M.value / 100);
    if (!(revenue >= 0) || !Number.isFinite(revenue)) {
      errors.form =
        'These values would produce an invalid negative selling price.';
    }
  }

  if (set.has('cost') && set.has('revenue') && C.value != null && R.value != null) {
    if (C.value <= 0) {
      errors.cost =
        'Cost must be greater than zero to calculate markup percentage.';
    }
  }

  if (set.has('cost') && set.has('profit') && C.value != null && P.value != null) {
    if (C.value <= 0) {
      errors.cost =
        'Cost must be greater than zero to calculate markup percentage.';
    } else if (C.value + P.value < 0) {
      errors.form =
        'These values would produce an invalid negative selling price.';
    }
  }

  if (
    set.has('revenue') &&
    set.has('markupPercentage') &&
    R.value != null &&
    M.value != null
  ) {
    if (M.value <= -100) {
      errors.markupPercentage =
        'These values would produce an invalid negative selling price.';
    } else {
      const cost = R.value / (1 + M.value / 100);
      if (!(cost >= 0) || !Number.isFinite(cost)) {
        errors.form = 'The selected inputs do not determine a unique result.';
      }
    }
  }

  if (set.has('revenue') && set.has('profit') && R.value != null && P.value != null) {
    const cost = R.value - P.value;
    if (cost < 0) {
      errors.form =
        'These values would produce an invalid negative selling price.';
    } else if (cost === 0) {
      errors.form =
        'Cost must be greater than zero to calculate markup percentage.';
    }
  }

  if (
    set.has('profit') &&
    set.has('markupPercentage') &&
    P.value != null &&
    M.value != null
  ) {
    if (M.value === 0) {
      errors.form = 'The selected inputs do not determine a unique result.';
    } else {
      const cost = P.value / (M.value / 100);
      if (!(cost >= 0) || !Number.isFinite(cost)) {
        errors.form =
          'These values would produce an invalid negative selling price.';
      }
    }
  }

  return errors;
}

export function validateMarkupInput(input: MarkupInput): MarkupValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  if (!input.authoritativeFields) {
    return {
      isValid: false,
      errors: { form: 'Please enter two compatible values.' },
      result: null,
    };
  }
  const result = calculateMarkupFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'The selected inputs do not determine a unique result.',
      },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}

export function hasMarkupErrors(errors: MarkupFieldErrors): boolean {
  return hasErrors(errors);
}

/** Write solved values into derived fields only; keep authoritative strings as typed. */
export function applyResultToInput(
  input: MarkupInput,
  result: MarkupResult,
): MarkupInput {
  const auth = new Set(result.authoritativeFields);
  const fmtMoney = (n: number) => String(Math.round(n * 100) / 100);
  const fmtPct = (n: number) => String(Math.round(n * 1e6) / 1e6);
  return {
    ...input,
    cost: auth.has('cost') ? input.cost : fmtMoney(result.cost),
    markupPercentage: auth.has('markupPercentage')
      ? input.markupPercentage
      : fmtPct(result.markupPercentage),
    revenue: auth.has('revenue') ? input.revenue : fmtMoney(result.revenue),
    profit: auth.has('profit') ? input.profit : fmtMoney(result.profit),
    authoritativeFields: result.authoritativeFields,
  };
}
