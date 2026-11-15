import { calculateMoneyFactor } from './calculation';
import type {
  MoneyFactorFieldErrors,
  MoneyFactorInput,
  MoneyFactorResult,
  MoneyFactorSourceField,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateMoneyFactorInput(input: MoneyFactorInput): {
  isValid: boolean;
  errors: MoneyFactorFieldErrors;
  result: MoneyFactorResult | null;
} {
  const errors: MoneyFactorFieldErrors = {};
  const source: MoneyFactorSourceField = input.sourceField;
  const raw = source === 'interestRate' ? input.interestRate : input.moneyFactor;
  const parsed = parseField(raw);

  if (parsed === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(parsed)) {
    errors[source] = 'Enter a valid number.';
    return { isValid: false, errors, result: null };
  }

  if (parsed < 0) {
    errors[source] =
      source === 'interestRate'
        ? 'Interest rate cannot be negative.'
        : 'Money factor cannot be negative.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateMoneyFactor(source, parsed);
  if (!result) {
    errors.form = 'Unable to convert these values.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
