import {
  calculateFinance,
  isInputBlank,
  parseOptionalNumber,
} from './calculation';
import type {
  FinanceFieldErrors,
  FinanceInput,
  FinanceMode,
  FinanceResult,
} from './types';

const MAX_PERIODS = 100_000;
const MAX_ABS_MONEY = 1e15;
const MAX_ABS_RATE = 1_000_000;

export interface FinanceValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: FinanceFieldErrors;
  result: FinanceResult | null;
}

function requiredFields(mode: FinanceMode): (keyof FinanceFieldErrors)[] {
  switch (mode) {
    case 'FV':
      return ['n', 'iy', 'pv', 'pmt'];
    case 'PMT':
      return ['n', 'iy', 'pv', 'fv'];
    case 'IY':
      return ['n', 'pv', 'pmt', 'fv'];
    case 'N':
      return ['iy', 'pv', 'pmt', 'fv'];
    case 'PV':
      return ['n', 'iy', 'pmt', 'fv'];
  }
}

function parseMoneyField(
  raw: string,
  key: keyof FinanceFieldErrors,
  errors: FinanceFieldErrors,
  opts: { allowZero?: boolean } = {},
): number | null {
  const value = parseOptionalNumber(raw);
  if (value === null) {
    errors[key] = 'Enter a valid number.';
    return null;
  }
  if (Math.abs(value) > MAX_ABS_MONEY) {
    errors[key] = 'Amount is too large.';
    return null;
  }
  if (!opts.allowZero && value === 0 && key !== 'pv' && key !== 'fv' && key !== 'pmt') {
    // money fields allow zero; periods/rate handled separately
  }
  return value;
}

export function validateFinanceInput(input: FinanceInput): FinanceValidation {
  const errors: FinanceFieldErrors = {};

  if (isInputBlank(input)) {
    return {
      isValid: false,
      incomplete: true,
      errors: {},
      result: null,
    };
  }

  const needed = requiredFields(input.mode);
  const values: Partial<Record<'n' | 'iy' | 'pv' | 'pmt' | 'fv', number>> = {};

  for (const key of needed) {
    if (key === 'form') continue;
    const raw = String(input[key as keyof FinanceInput] ?? '');
    if (raw.trim() === '') {
      errors[key] = 'This field is required.';
      continue;
    }

    if (key === 'n') {
      const n = parseOptionalNumber(raw);
      if (n === null) {
        errors.n = 'Enter a valid number of periods.';
      } else if (n <= 0) {
        errors.n = 'Number of periods must be greater than zero.';
      } else if (n > MAX_PERIODS) {
        errors.n = `Number of periods cannot exceed ${MAX_PERIODS.toLocaleString('en-US')}.`;
      } else {
        values.n = n;
      }
      continue;
    }

    if (key === 'iy') {
      const iy = parseOptionalNumber(raw);
      if (iy === null) {
        errors.iy = 'Enter a valid interest rate.';
      } else if (iy < -99.999999) {
        errors.iy = 'Interest rate is too low for this model.';
      } else if (Math.abs(iy) > MAX_ABS_RATE) {
        errors.iy = 'Interest rate is too large.';
      } else {
        values.iy = iy;
      }
      continue;
    }

    const money = parseMoneyField(raw, key, errors);
    if (money !== null) values[key] = money;
  }

  // Fill solved-away field with a placeholder 0 for the engine (it overwrites).
  if (input.mode !== 'N' && values.n === undefined && !errors.n) {
    // already handled if required
  }
  if (input.mode === 'FV') values.fv = 0;
  if (input.mode === 'PV') values.pv = 0;
  if (input.mode === 'PMT') values.pmt = 0;
  if (input.mode === 'IY') values.iy = 0;
  if (input.mode === 'N') values.n = 1;

  // Optional: read non-required fields if provided (for display defaults)
  if (input.mode === 'FV' && input.fv.trim() !== '') {
    // ignored — calculated
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  if (
    values.n === undefined ||
    values.iy === undefined ||
    values.pv === undefined ||
    values.pmt === undefined ||
    values.fv === undefined
  ) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Enter all required values to calculate.' },
      result: null,
    };
  }

  const result = calculateFinance({
    mode: input.mode,
    n: values.n,
    iy: values.iy,
    pv: values.pv,
    pmt: values.pmt,
    fv: values.fv,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: input.compoundingFrequency,
    paymentTiming: input.paymentTiming,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: {
        form:
          input.mode === 'IY'
            ? 'Could not find a valid interest rate for these cash flows.'
            : input.mode === 'N'
              ? 'Could not find a valid number of periods for these cash flows.'
              : 'Unable to calculate with the provided values.',
      },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
