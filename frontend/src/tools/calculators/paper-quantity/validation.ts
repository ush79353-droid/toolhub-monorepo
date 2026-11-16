import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { toSheets } from './calculation';
import { MAX_ABS_SHEETS, type PaperUnit } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parsePaperInput(raw: string): {
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
  if (value < 0) {
    return {
      blank: false,
      incomplete: false,
      value: null,
      error: 'Paper quantities cannot be negative.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function sheetsFromUnit(
  value: number,
  unit: PaperUnit,
): { ok: true; sheets: number } | { ok: false; error: string } {
  const sheets = toSheets(value, unit);
  if (!Number.isFinite(sheets)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  if (sheets > MAX_ABS_SHEETS) {
    return { ok: false, error: 'This quantity is outside the supported range.' };
  }
  return { ok: true, sheets };
}
