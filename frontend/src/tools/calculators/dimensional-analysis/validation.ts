import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { getQuantity } from './catalog';
import { toKelvin } from './calculation';

export { isIncompleteNumber, parseOptionalNumber };

export function parseNumericInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  value: number | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, value: null };
  if (isIncompleteNumber(trimmed)) return { blank: false, incomplete: true, value: null };
  const value = parseOptionalNumber(trimmed);
  if (value === null || !Number.isFinite(value)) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Enter a valid finite number.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function validateTemperatureAbsolute(
  quantityId: string,
  value: number,
  unitId: string,
): string | undefined {
  const q = getQuantity(quantityId);
  if (!q || q.conversionKind !== 'temperature') return undefined;
  try {
    const k = toKelvin(value, unitId);
    if (k < 0) return 'Absolute temperature cannot be below 0 K.';
  } catch {
    return 'Select a valid temperature unit.';
  }
  return undefined;
}
