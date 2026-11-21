import { calculateUkCapitalGainsTaxFromInput } from './calculation';
import type {
  CapitalGainsTaxUkFieldErrors,
  CapitalGainsTaxUkInput,
  CapitalGainsTaxUkResult,
} from './types';

function parseMoney(raw: string): {
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

function moneyError(
  parsed: ReturnType<typeof parseMoney>,
  blankMsg: string,
  label: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return `Enter a valid ${label}.`;
  if (parsed.value < 0) return `${label} cannot be negative.`;
  return undefined;
}

export interface CapitalGainsTaxUkValidation {
  isValid: boolean;
  errors: CapitalGainsTaxUkFieldErrors;
  result: CapitalGainsTaxUkResult | null;
}

export function collectFieldErrors(
  input: CapitalGainsTaxUkInput,
): CapitalGainsTaxUkFieldErrors {
  const errors: CapitalGainsTaxUkFieldErrors = {};

  const eG = moneyError(
    parseMoney(input.capitalGains),
    'Enter capital gains (£).',
    'Capital gains',
  );
  if (eG) errors.capitalGains = eG;

  const eA = moneyError(
    parseMoney(input.annualIncome),
    'Enter annual income (£).',
    'Annual income',
  );
  if (eA) errors.annualIncome = eA;

  const eO = moneyError(
    parseMoney(input.otherIncome),
    'Enter other income (£).',
    'Other income',
  );
  if (eO) errors.otherIncome = eO;

  return errors;
}

export function hasFieldErrors(errors: CapitalGainsTaxUkFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCapitalGainsTaxUkInput(
  input: CapitalGainsTaxUkInput,
): CapitalGainsTaxUkValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateUkCapitalGainsTaxFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
