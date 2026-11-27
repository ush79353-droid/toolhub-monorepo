/**
 * Body frame size index — educational (ADR-018).
 *
 * Omni / Grant-style r-value:
 *   index = height / wrist   (same length unit)
 *
 * Female: >11 small · 10.1–11.0 medium · <10.1 large
 * Male:   >10.4 small · 9.6–10.4 medium · <9.6 large
 *
 * Boundaries: inclusive medium bands on Omni table wording “r = 10.1–11.0”
 * and “r = 9.6–10.4”; small is strictly above the upper medium bound;
 * large is strictly below the lower medium bound.
 */

import type {
  BodyFrameSizeInput,
  BodyFrameSizeResult,
  FrameCategory,
  HeightUnit,
  LengthUnit,
  Sex,
} from './types';

export const SOURCE_NOTE =
  'Body frame index = height ÷ wrist (same unit). Female: >11 small, 10.1–11.0 medium, <10.1 large. Male: >10.4 small, 9.6–10.4 medium, <9.6 large (Omni / Grant r-value teaching tables). Educational only.';

export const DISCLAIMER =
  'Not a diagnosis, bone-density test, or ideal-weight prescription — confirm measurements and interpretation with a clinician when needed.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return value * 100;
    case 'cm':
      return value;
    case 'in':
      return value * 2.54;
    case 'ft':
      return value * 30.48;
  }
}

export function lengthToCm(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm':
      return value;
    case 'mm':
      return value / 10;
    case 'm':
      return value * 100;
    case 'in':
      return value * 2.54;
  }
}

export function bodyFrameIndex(heightCm: number, wristCm: number): number {
  if (!(wristCm > 0)) {
    throw new Error('Wrist circumference must be positive.');
  }
  return heightCm / wristCm;
}

export function categorizeFrame(
  index: number,
  sex: Sex,
): FrameCategory {
  if (sex === 'female') {
    if (index > 11) return 'small';
    if (index >= 10.1) return 'medium';
    return 'large';
  }
  if (index > 10.4) return 'small';
  if (index >= 9.6) return 'medium';
  return 'large';
}

export function categoryLabel(category: FrameCategory): string {
  switch (category) {
    case 'small':
      return 'small frame';
    case 'medium':
      return 'medium frame';
    case 'large':
      return 'large frame';
  }
}

export function formatIndex(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateBodyFrameSize(
  input: BodyFrameSizeInput,
): BodyFrameSizeResult {
  const empty = {
    heightCm: null,
    wristCm: null,
    index: null,
    category: null,
    formattedIndex: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const heightRaw = parseNumber(input.heightText);
  const wristRaw = parseNumber(input.wristText);

  if (heightRaw === null || wristRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter height and wrist',
      statusDetail:
        'Enter height and wrist circumference to compute the body frame size index.',
    };
  }

  if (!(heightRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid height',
      statusDetail: 'Height must be greater than zero.',
    };
  }

  if (!(wristRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid wrist',
      statusDetail: 'Wrist circumference must be greater than zero.',
    };
  }

  const heightCm = heightToCm(heightRaw, input.heightUnit);
  const wristCm = lengthToCm(wristRaw, input.wristUnit);
  const index = bodyFrameIndex(heightCm, wristCm);
  const rounded = Math.round(index * 100) / 100;
  const category = categorizeFrame(rounded, input.sex);

  return {
    heightCm,
    wristCm,
    index: rounded,
    category,
    formattedIndex: formatIndex(rounded),
    statusHeadline: 'Body frame size index',
    statusDetail: `Index ≈ ${formatIndex(rounded)} → ${categoryLabel(category)} (${input.sex}).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
