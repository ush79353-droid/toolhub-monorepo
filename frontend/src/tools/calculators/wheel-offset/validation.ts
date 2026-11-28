import { computeWheelOffset } from './calculation';
import type {
  WheelOffsetFieldErrors,
  WheelOffsetInput,
  WheelOffsetResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateWheelOffsetInputs(input: WheelOffsetInput): {
  errors: WheelOffsetFieldErrors;
  result: WheelOffsetResult | null;
} {
  const errors: WheelOffsetFieldErrors = {};

  const cw = parseNumber(input.currentWidth);
  const nw = parseNumber(input.newWidth);
  const co = parseNumber(input.currentOffset);
  const no = parseNumber(input.newOffset);

  if (cw == null) errors.currentWidth = 'Enter current wheel width.';
  else if (cw <= 0)
    errors.currentWidth = 'Current wheel width must be greater than zero.';

  if (nw == null) errors.newWidth = 'Enter new wheel width.';
  else if (nw <= 0)
    errors.newWidth = 'New wheel width must be greater than zero.';

  if (co == null) errors.currentOffset = 'Enter current wheel offset.';
  if (no == null) errors.newOffset = 'Enter new wheel offset.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors,
    result: computeWheelOffset({
      currentWidth: cw!,
      currentWidthUnit: input.currentWidthUnit,
      currentOffset: co!,
      currentOffsetUnit: input.currentOffsetUnit,
      newWidth: nw!,
      newWidthUnit: input.newWidthUnit,
      newOffset: no!,
      newOffsetUnit: input.newOffsetUnit,
    }),
  };
}
