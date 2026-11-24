/**
 * Input validation for mmol/L ↔ mg/dL converter.
 * Rejects non-finite / out-of-range concentrations and non-positive custom molar mass.
 */
import { calculateMmollToMgdl, isPositiveMolarMass } from './calculation';
import { MAX_ABS_VALUE, type MmollToMgdlFieldErrors, type MmollToMgdlInput, type MmollToMgdlResult } from './types';

export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function concentrationError(value: number | null, label: string): string | undefined {
  if (value === null) return undefined;
  if (!Number.isFinite(value)) return `${label} must be a finite number.`;
  if (value < 0) return `${label} cannot be negative.`;
  if (Math.abs(value) > MAX_ABS_VALUE) return `${label} is too large.`;
  return undefined;
}

export function validateMmollToMgdl(input: MmollToMgdlInput): {
  isValid: boolean;
  errors: MmollToMgdlFieldErrors;
  result: MmollToMgdlResult | null;
} {
  const errors: MmollToMgdlFieldErrors = {};

  const presetMmolErr = concentrationError(input.preset.mmolL, 'mmol/L');
  const presetMgErr = concentrationError(input.preset.mgDl, 'mg/dL');
  if (input.preset.source === 'mmolL' && presetMmolErr) errors.presetMmolL = presetMmolErr;
  if (input.preset.source === 'mgDl' && presetMgErr) errors.presetMgDl = presetMgErr;

  if (input.customOpen) {
    if (input.customMolarMass !== null) {
      if (!Number.isFinite(input.customMolarMass)) {
        errors.customMolarMass = 'Molar mass must be a finite number.';
      } else if (input.customMolarMass <= 0) {
        errors.customMolarMass = 'Molar mass must be positive (g/mol).';
      } else if (input.customMolarMass > MAX_ABS_VALUE) {
        errors.customMolarMass = 'Molar mass is too large.';
      }
    }

    const hasCustomConcentration =
      (input.custom.source === 'mmolL' && input.custom.mmolL !== null) ||
      (input.custom.source === 'mgDl' && input.custom.mgDl !== null);

    if (hasCustomConcentration && input.customMolarMass === null) {
      errors.customMolarMass = 'Enter a positive molar mass (g/mol) to convert.';
    } else if (
      hasCustomConcentration &&
      input.customMolarMass !== null &&
      !isPositiveMolarMass(input.customMolarMass) &&
      !errors.customMolarMass
    ) {
      errors.customMolarMass = 'Molar mass must be positive (g/mol).';
    }

    const customMmolErr = concentrationError(input.custom.mmolL, 'mmol/L');
    const customMgErr = concentrationError(input.custom.mgDl, 'mg/dL');
    if (input.custom.source === 'mmolL' && customMmolErr) errors.customMmolL = customMmolErr;
    if (input.custom.source === 'mgDl' && customMgErr) errors.customMgDl = customMgErr;
  }

  const hasErrors = Object.keys(errors).length > 0;
  const result = hasErrors ? null : calculateMmollToMgdl(input);

  return {
    isValid: !hasErrors,
    errors,
    result,
  };
}
