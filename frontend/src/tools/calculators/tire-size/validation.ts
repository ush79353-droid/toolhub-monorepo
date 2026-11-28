import {
  buildTireSizeResult,
  calculateTireSizeComparison,
  dimensionsFromFields,
} from './calculation';
import type {
  TireFields,
  TireSizeFieldErrors,
  TireSizeInput,
  TireSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function validateTireFields(
  fields: TireFields,
  prefix: '' | 'rep',
): TireSizeFieldErrors {
  const errors: TireSizeFieldErrors = {};
  const wKey = prefix === 'rep' ? 'repWidth' : 'width';
  const aKey = prefix === 'rep' ? 'repAspectRatio' : 'aspectRatio';
  const rKey = prefix === 'rep' ? 'repRimDiameter' : 'rimDiameter';

  const width = parseNumber(fields.width);
  if (width == null) errors[wKey] = 'Enter tire width.';
  else if (width <= 0) errors[wKey] = 'Width must be greater than zero.';
  else if (width > 1000 && fields.widthUnit === 'mm')
    errors[wKey] = 'Width looks too large for a tire section.';
  else if (width > 40 && fields.widthUnit === 'in')
    errors[wKey] = 'Width looks too large for a tire section.';

  const aspect = parseNumber(fields.aspectRatio);
  if (aspect == null) errors[aKey] = 'Enter profile ratio.';
  else if (aspect <= 0) errors[aKey] = 'Profile ratio must be greater than zero.';
  else if (aspect > 100)
    errors[aKey] = 'Profile ratio must be 100% or less.';

  const rim = parseNumber(fields.rimDiameter);
  if (rim == null) errors[rKey] = 'Enter rim diameter.';
  else if (rim <= 0) errors[rKey] = 'Rim diameter must be greater than zero.';
  else if (fields.rimUnit === 'in' && (rim < 8 || rim > 40))
    errors[rKey] = 'Rim diameter outside typical passenger range (8–40 in).';
  else if (fields.rimUnit === 'mm' && (rim < 200 || rim > 1020))
    errors[rKey] = 'Rim diameter outside typical passenger range.';

  return errors;
}

export function validateTireSizeInputs(input: TireSizeInput): {
  errors: TireSizeFieldErrors;
  result: TireSizeResult | null;
} {
  const errors: TireSizeFieldErrors = {
    ...validateTireFields(input.primary, ''),
  };

  let loadIndex: number | null = null;
  if (input.primary.loadIndex.trim() !== '') {
    const li = parseNumber(input.primary.loadIndex);
    if (li == null || !Number.isInteger(li) || li < 0 || li > 300) {
      errors.loadIndex = 'Load index must be a whole number from 0–300.';
    } else {
      loadIndex = li;
    }
  }

  if (input.compare) {
    Object.assign(errors, validateTireFields(input.replacement, 'rep'));
    const speed = parseNumber(input.indicatedSpeed);
    if (speed == null) {
      errors.indicatedSpeed = 'Enter indicated speed.';
    } else if (speed < 0) {
      errors.indicatedSpeed = 'Speed cannot be negative.';
    } else if (speed === 0) {
      errors.indicatedSpeed = 'Indicated speed must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const speedRating =
    input.primary.speedRating.trim() === ''
      ? null
      : input.primary.speedRating;

  const primary = dimensionsFromFields(
    input.primary,
    loadIndex,
    speedRating,
  );

  let comparison = null;
  if (input.compare) {
    const repLi =
      input.replacement.loadIndex.trim() === ''
        ? null
        : parseNumber(input.replacement.loadIndex);
    const repSr =
      input.replacement.speedRating.trim() === ''
        ? null
        : input.replacement.speedRating;
    const replacement = dimensionsFromFields(
      input.replacement,
      repLi,
      repSr,
    );
    const indicated = parseNumber(input.indicatedSpeed)!;
    comparison = calculateTireSizeComparison(
      primary,
      replacement,
      indicated,
      input.indicatedSpeedUnit,
    );
  }

  return { errors, result: buildTireSizeResult(primary, comparison) };
}
