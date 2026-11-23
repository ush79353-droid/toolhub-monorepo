import { calculateAbi, parsePressureMmHg } from './calculation';
import type { AbiFieldErrors, AbiInput, AbiResult } from './types';

export interface AbiValidation {
  isValid: boolean;
  errors: AbiFieldErrors;
  result: AbiResult;
}

function pressureError(raw: string, label: string): string | undefined {
  const cleaned = raw.trim();
  if (cleaned === '') return undefined;
  const n = parsePressureMmHg(cleaned);
  if (n == null) return `Enter a valid ${label} in mmHg.`;
  if (n <= 0) return `${label} must be greater than zero.`;
  if (n > 400) return `${label} is outside the supported range.`;
  return undefined;
}

export function validateAbiInput(input: AbiInput): AbiValidation {
  const errors: AbiFieldErrors = {};
  const armErr = pressureError(input.armMmHg, 'arm pressure');
  if (armErr) errors.armMmHg = armErr;
  const rightErr = pressureError(input.rightFootMmHg, 'right foot pressure');
  if (rightErr) errors.rightFootMmHg = rightErr;
  const leftErr = pressureError(input.leftFootMmHg, 'left foot pressure');
  if (leftErr) errors.leftFootMmHg = leftErr;

  const arm = parsePressureMmHg(input.armMmHg);
  if (
    arm === 0 ||
    (input.armMmHg.trim() !== '' && arm != null && !(arm > 0) && !armErr)
  ) {
    errors.armMmHg = 'Arm pressure must be greater than zero.';
  }

  const result = calculateAbi(input);
  const hasHardError = Boolean(
    errors.armMmHg || errors.rightFootMmHg || errors.leftFootMmHg
  );

  return {
    isValid: !hasHardError,
    errors,
    result: hasHardError ? { right: null, left: null } : result,
  };
}
