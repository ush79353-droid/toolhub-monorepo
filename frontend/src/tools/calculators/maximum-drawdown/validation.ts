import {
  calculateMaximumDrawdown,
  calculateRecoveryTime,
} from './calculation';
import type {
  MaximumDrawdownFieldErrors,
  MaximumDrawdownInput,
  MaximumDrawdownResult,
  RecoveryResult,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateMaximumDrawdownInput(input: MaximumDrawdownInput): {
  isValid: boolean;
  errors: MaximumDrawdownFieldErrors;
  drawdown: MaximumDrawdownResult | null;
  recovery: RecoveryResult | null;
} {
  const errors: MaximumDrawdownFieldErrors = {};

  const peak = parseNumber(input.peakValue);
  const trough = parseNumber(input.lowestValueAfterPeak);

  if (peak === null || trough === null) {
    return { isValid: false, errors, drawdown: null, recovery: null };
  }

  if (Number.isNaN(peak) || !(peak > 0)) {
    errors.peakValue = 'Enter a peak value greater than zero';
  }
  if (Number.isNaN(trough) || trough < 0) {
    errors.lowestValueAfterPeak = 'Enter a nonnegative lowest value';
  } else if (!errors.peakValue && trough > (peak as number)) {
    errors.lowestValueAfterPeak = 'Lowest value cannot exceed the peak value';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, drawdown: null, recovery: null };
  }

  const drawdown = calculateMaximumDrawdown(
    peak as number,
    trough as number,
    input.currency,
  );
  if (!drawdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate maximum drawdown with the current inputs.' },
      drawdown: null,
      recovery: null,
    };
  }

  const recovery = validateRecoverySide(input, drawdown.maximumDrawdownPercent);

  return {
    isValid: true,
    errors: recovery.errors,
    drawdown,
    recovery: recovery.result,
  };
}

export function validateRecoverySide(
  input: MaximumDrawdownInput,
  syncedDrawdownPercent?: number,
): {
  errors: MaximumDrawdownFieldErrors;
  result: RecoveryResult | null;
} {
  const errors: MaximumDrawdownFieldErrors = {};
  const growth = parseNumber(input.expectedAnnualGrowthRate);

  let drawdownPercent: number | null = null;
  if (input.recoverySynced && syncedDrawdownPercent !== undefined) {
    drawdownPercent = syncedDrawdownPercent;
  } else {
    const parsed = parseNumber(input.recoveryDrawdown);
    if (parsed === null) {
      return { errors, result: null };
    }
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      errors.recoveryDrawdown = 'Enter a drawdown between 0% and 100%';
      return { errors, result: null };
    }
    drawdownPercent = parsed;
  }

  if (growth === null) {
    return { errors, result: null };
  }
  if (Number.isNaN(growth) || growth < 0) {
    errors.expectedAnnualGrowthRate = 'Enter a nonnegative annual growth rate';
    return { errors, result: null };
  }
  if (growth > 10_000) {
    errors.expectedAnnualGrowthRate = 'Growth rate is too large';
    return { errors, result: null };
  }

  const result = calculateRecoveryTime(drawdownPercent, growth);
  return { errors, result };
}
