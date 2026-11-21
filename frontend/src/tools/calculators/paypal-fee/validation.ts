import { calculatePayPalFeeFromInput, resolveConfigFromInput } from './calculation';
import type {
  PayPalFeeFieldErrors,
  PayPalFeeInput,
  PayPalFeeResult,
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

export interface PayPalFeeValidation {
  isValid: boolean;
  errors: PayPalFeeFieldErrors;
  result: PayPalFeeResult | null;
}

function hasErrors(errors: PayPalFeeFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: PayPalFeeInput): PayPalFeeFieldErrors {
  const errors: PayPalFeeFieldErrors = {};
  const isCustom =
    input.region === 'CUSTOM' ||
    input.transactionType === 'custom' ||
    input.presetId === 'custom';

  if (isCustom) {
    const p = parseNumber(input.customPercentage);
    const f = parseNumber(input.customFixed);
    const a = parseNumber(input.customAdditional);
    if (p.blank || p.invalid || p.value == null) {
      errors.customPercentage = 'Please enter a valid percentage fee.';
    } else if (p.value < 0) {
      errors.customPercentage = 'Percentage fee cannot be negative.';
    } else if (input.solveMode === 'fromNet' && p.value >= 100) {
      errors.customPercentage =
        'Percentage fee must be below 100% for reverse calculation.';
    }
    if (f.blank || f.invalid || f.value == null) {
      errors.customFixed = 'Please enter a valid fixed fee.';
    } else if (f.value < 0) {
      errors.customFixed = 'Fixed fee cannot be negative.';
    }
    if (input.location === 'international') {
      if (a.blank || a.invalid || a.value == null) {
        errors.customAdditional = 'Please enter a valid additional fee.';
      } else if (a.value < 0) {
        errors.customAdditional = 'Additional fee cannot be negative.';
      }
    }
    const totalPct =
      (p.value ?? 0) +
      (input.location === 'international' ? (a.value ?? 0) : 0);
    if (
      input.solveMode === 'fromNet' &&
      !errors.customPercentage &&
      !errors.customAdditional &&
      totalPct >= 100
    ) {
      errors.customPercentage =
        'Percentage fee must be below 100% for reverse calculation.';
    }
  } else if (!input.presetId) {
    errors.form = 'Please select a supported fee schedule.';
  }

  if (input.solveMode === 'fromGross') {
    const g = parseNumber(input.grossAmount);
    if (g.blank) {
      // empty is ok — no result yet
    } else if (g.invalid || g.value == null) {
      errors.grossAmount = 'Please enter a valid payment amount.';
    } else if (g.value < 0) {
      errors.grossAmount = 'Payment amount cannot be negative.';
    }
  } else {
    const n = parseNumber(input.desiredNet);
    if (n.blank) {
      // empty ok
    } else if (n.invalid || n.value == null) {
      errors.desiredNet = 'Please enter a valid desired net amount.';
    } else if (n.value < 0) {
      errors.desiredNet = 'Desired net amount cannot be negative.';
    }
  }

  return errors;
}

export function validatePayPalFeeInput(
  input: PayPalFeeInput,
): PayPalFeeValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const amountBlank =
    input.solveMode === 'fromGross'
      ? input.grossAmount.trim() === ''
      : input.desiredNet.trim() === '';

  if (amountBlank) {
    return { isValid: false, errors: {}, result: null };
  }

  const resolved = resolveConfigFromInput(input);
  if (!resolved) {
    return {
      isValid: false,
      errors: { form: 'Please select a supported fee schedule.' },
      result: null,
    };
  }

  const totalPct =
    resolved.config.percentageFee + resolved.config.additionalPercentageFee;
  if (input.solveMode === 'fromNet' && totalPct >= 100) {
    return {
      isValid: false,
      errors: {
        form: 'Percentage fee must be below 100% for reverse calculation.',
      },
      result: null,
    };
  }

  const result = calculatePayPalFeeFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form:
          input.solveMode === 'fromNet'
            ? 'The desired net amount cannot be achieved with the selected fee settings.'
            : 'Please enter a valid payment amount.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
