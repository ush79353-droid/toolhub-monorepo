import { calculateBpsOfAmount, conversionFromField } from './calculation';
import type {
  AmountSnapshot,
  BasisPointFieldErrors,
  BasisPointInput,
  ConversionField,
  ConversionSnapshot,
} from './types';

function parseOptionalNumber(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateConversionField(
  field: ConversionField,
  text: string
): { errors: BasisPointFieldErrors; conversion: ConversionSnapshot | null } {
  const errors: BasisPointFieldErrors = {};
  const parsed = parseOptionalNumber(text);

  if (parsed === null) {
    return { errors, conversion: null };
  }
  if (Number.isNaN(parsed)) {
    errors[field] = 'Enter a valid number';
    return { errors, conversion: null };
  }

  const conversion = conversionFromField(field, parsed);
  if (!conversion) {
    errors[field] = 'Unable to convert this value';
    return { errors, conversion: null };
  }

  return { errors, conversion };
}

export function validateAmountSection(input: BasisPointInput): {
  errors: BasisPointFieldErrors;
  amount: AmountSnapshot | null;
} {
  const errors: BasisPointFieldErrors = {};
  const xBps = parseOptionalNumber(input.xBps);
  const ofAmount = parseOptionalNumber(input.ofAmount);

  if (xBps === null || ofAmount === null) {
    return { errors, amount: null };
  }

  if (Number.isNaN(xBps)) {
    errors.xBps = 'Enter a valid basis-point amount';
  }
  if (Number.isNaN(ofAmount)) {
    errors.ofAmount = 'Enter a valid amount';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, amount: null };
  }

  const amount = calculateBpsOfAmount(xBps as number, ofAmount as number, input.currency);
  if (!amount) {
    errors.form = 'Unable to calculate amount';
    return { errors, amount: null };
  }

  return { errors, amount };
}
