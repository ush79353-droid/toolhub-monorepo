import {
  MAX_ABS_VALUE,
  type WaterFieldErrors,
  type WaterWeightInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete. */
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export type VolumeValueState = 'blank' | 'bad' | 'negative' | 'large' | 'ok';

export function volumeValueState(value: number | null): VolumeValueState {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function volumeErrorMessage(state: VolumeValueState): string | undefined {
  if (state === 'bad') return 'Enter a valid number.';
  if (state === 'negative') return 'Volume cannot be negative.';
  if (state === 'large') return 'Enter a smaller value.';
  return undefined;
}

function numProblem(
  value: number | null,
  opts: { requirePositive?: boolean } = {}
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateWaterWeight(input: WaterWeightInput): {
  isValid: boolean;
  errors: WaterFieldErrors;
} {
  const errors: WaterFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityKgPerL, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityKgPerL = 'Density is required for water-weight conversion.';
  } else if (d === 'bad') errors.densityKgPerL = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityKgPerL = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityKgPerL = 'Enter a smaller density.';

  if (input.source === 'volume') {
    const v = numProblem(input.volume);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volume = 'Enter a valid volume.';
    else if (v === 'negative') errors.volume = 'Volume cannot be negative.';
    else if (v === 'large') errors.volume = 'Enter a smaller volume.';
  } else if (input.source === 'massKg') {
    const m = numProblem(input.massKg);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massKg = 'Enter a valid mass.';
    else if (m === 'negative') errors.massKg = 'Mass cannot be negative.';
    else if (m === 'large') errors.massKg = 'Enter a smaller mass.';
  } else {
    const m = numProblem(input.massLb);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massLb = 'Enter a valid mass.';
    else if (m === 'negative') errors.massLb = 'Mass cannot be negative.';
    else if (m === 'large') errors.massLb = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
