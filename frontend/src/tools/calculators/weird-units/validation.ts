import { isIncompleteNumber, parseOptionalNumber } from '../coordinates/validation';
import { findRegular, findWeird, isBaseInRange, toBase } from './calculation';
import type { ConversionDirection, UnitCategory } from './types';

export { isIncompleteNumber, parseOptionalNumber };

export function parseWeirdInput(raw: string): {
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
      error: 'Negative comparisons are not used for object counts or physical sizes.',
    };
  }
  return { blank: false, incomplete: false, value };
}

export function validateConversion(options: {
  category: UnitCategory;
  regularId: string;
  weirdId: string;
  direction: ConversionDirection;
  value: number;
}): { ok: true } | { ok: false; error: string } {
  const regular = findRegular(options.category, options.regularId);
  const weird = findWeird(options.category, options.weirdId);
  if (!regular) return { ok: false, error: 'Choose a regular unit for this category.' };
  if (!weird) return { ok: false, error: 'Choose a weird unit for this category.' };
  if (weird.category !== options.category) {
    return { ok: false, error: 'Weird unit does not match the selected category.' };
  }

  const base =
    options.direction === 'regular-to-weird'
      ? toBase(options.value, options.category, options.regularId)
      : options.value * weird.baseValue;

  if (base == null || !isBaseInRange(base)) {
    return { ok: false, error: 'This measurement is outside the supported range.' };
  }
  return { ok: true };
}
