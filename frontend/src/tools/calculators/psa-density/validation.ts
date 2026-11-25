import {
  ellipsoidVolumeMl,
  formatDensity,
  formatVolumeMl,
  psaDensity,
  toCm,
  volumeMlFromUnit,
} from './calculation';
import { DISCLAIMER } from './content';
import type {
  PsaDensityFieldErrors,
  PsaDensityInput,
  PsaDensityResult,
} from './types';

function parsePositive(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function parseNonNegative(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function dimensionsComplete(input: PsaDensityInput): boolean {
  return (
    input.length.trim() !== '' &&
    input.width.trim() !== '' &&
    input.height.trim() !== ''
  );
}

function computedVolumeMl(input: PsaDensityInput): number | null {
  if (!dimensionsComplete(input)) return null;
  const l = parsePositive(input.length);
  const w = parsePositive(input.width);
  const h = parsePositive(input.height);
  if (l == null || w == null || h == null) return null;
  return ellipsoidVolumeMl(
    toCm(l, input.lengthUnit),
    toCm(w, input.widthUnit),
    toCm(h, input.heightUnit),
  );
}

export function resolveVolumeMl(input: PsaDensityInput): {
  volumeMl: number | null;
  fromDimensions: boolean;
} {
  const computed = computedVolumeMl(input);
  if (input.volumeManual && input.prostateVolume.trim()) {
    const v = parsePositive(input.prostateVolume);
    if (v == null) return { volumeMl: null, fromDimensions: false };
    return {
      volumeMl: volumeMlFromUnit(v, input.volumeUnit),
      fromDimensions: false,
    };
  }
  if (computed != null) {
    return { volumeMl: computed, fromDimensions: true };
  }
  if (input.prostateVolume.trim()) {
    const v = parsePositive(input.prostateVolume);
    if (v == null) return { volumeMl: null, fromDimensions: false };
    return {
      volumeMl: volumeMlFromUnit(v, input.volumeUnit),
      fromDimensions: false,
    };
  }
  return { volumeMl: null, fromDimensions: false };
}

export function validatePsaDensityInput(input: PsaDensityInput): {
  errors: PsaDensityFieldErrors;
  result: PsaDensityResult | null;
} {
  const errors: PsaDensityFieldErrors = {};

  const anyField =
    input.length.trim() ||
    input.width.trim() ||
    input.height.trim() ||
    input.prostateVolume.trim() ||
    input.psa.trim();

  if (!anyField) {
    return { errors, result: null };
  }

  if (input.length.trim() && parsePositive(input.length) == null) {
    errors.length = 'Enter a positive length.';
  }
  if (input.width.trim() && parsePositive(input.width) == null) {
    errors.width = 'Enter a positive width.';
  }
  if (input.height.trim() && parsePositive(input.height) == null) {
    errors.height = 'Enter a positive height.';
  }
  if (input.prostateVolume.trim() && parsePositive(input.prostateVolume) == null) {
    errors.prostateVolume = 'Enter a positive prostate volume.';
  }

  let psaVal: number | null = null;
  if (input.psa.trim()) {
    const p = parseNonNegative(input.psa);
    if (p == null) errors.psa = 'Enter a non-negative PSA.';
    else psaVal = p;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const { volumeMl, fromDimensions } = resolveVolumeMl(input);

  if (psaVal != null && volumeMl == null) {
    errors.form =
      'Enter length, width, and height, or a prostate volume, to compute PSA density.';
    return { errors, result: null };
  }

  if (volumeMl == null && psaVal == null) {
    return { errors, result: null };
  }

  let density: number | null = null;
  if (psaVal != null && volumeMl != null) {
    density = psaDensity(psaVal, volumeMl);
  }

  return {
    errors,
    result: {
      volumeMl,
      formattedVolume: volumeMl == null ? null : formatVolumeMl(volumeMl),
      volumeFromDimensions: fromDimensions,
      psaDensity: density,
      formattedPsaDensity: density == null ? null : formatDensity(density),
      disclaimer: DISCLAIMER,
    },
  };
}

/** Fill prostate volume from ellipsoid when dimensions drive volume. */
export function withSyncedVolume(input: PsaDensityInput): PsaDensityInput {
  if (input.volumeManual) return input;
  const computed = computedVolumeMl(input);
  if (computed == null) return input;
  return {
    ...input,
    prostateVolume: formatVolumeMl(computed),
    volumeManual: false,
  };
}