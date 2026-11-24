/**
 * UI stub — validation rules land in the engine commit.
 */
import type { McgToIuFieldErrors, McgToIuInput, McgToIuResult } from './types';
import { calculateMcgToIu } from './calculation';

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

export function validateMcgToIu(input: McgToIuInput): {
  isValid: boolean;
  errors: McgToIuFieldErrors;
  result: McgToIuResult | null;
} {
  return {
    isValid: false,
    errors: {},
    result: calculateMcgToIu(input),
  };
}
