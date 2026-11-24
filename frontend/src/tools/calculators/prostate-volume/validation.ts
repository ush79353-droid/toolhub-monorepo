import {
  bulletVolumeMl,
  ellipsoidVolumeMl,
  formatDensity,
  formatVolume,
  psaDensity,
  toCm,
} from './calculation';
import type {
  ProstateVolumeFieldErrors,
  ProstateVolumeInput,
  ProstateVolumeResult,
} from './types';

function parsePositive(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function validateProstateVolumeInput(input: ProstateVolumeInput): {
  errors: ProstateVolumeFieldErrors;
  result: ProstateVolumeResult | null;
} {
  const errors: ProstateVolumeFieldErrors = {};

  const lRaw = parsePositive(input.length);
  const hRaw = parsePositive(input.height);
  const wRaw = parsePositive(input.width);

  if (input.length.trim() && lRaw == null) errors.length = 'Enter a positive length.';
  if (input.height.trim() && hRaw == null) errors.height = 'Enter a positive height.';
  if (input.width.trim() && wRaw == null) errors.width = 'Enter a positive width.';

  let psaVal: number | null = null;
  if (input.psaDensityOpen && input.psa.trim()) {
    const p = Number(input.psa.trim());
    if (!Number.isFinite(p) || p < 0) errors.psa = 'Enter a non-negative PSA.';
    else psaVal = p;
  }

  const incomplete =
    !input.length.trim() || !input.height.trim() || !input.width.trim();
  if (incomplete || errors.length || errors.height || errors.width) {
    return { errors, result: null };
  }

  const l = toCm(lRaw!, input.lengthUnit);
  const h = toCm(hRaw!, input.heightUnit);
  const w = toCm(wRaw!, input.widthUnit);

  const ellipsoidMl = ellipsoidVolumeMl(l, h, w);
  const bulletMl = bulletVolumeMl(l, h, w);

  let primaryMl: number | null = null;
  if (input.model === 'ellipsoid') primaryMl = ellipsoidMl;
  else if (input.model === 'bullet') primaryMl = bulletMl;
  else primaryMl = ellipsoidMl;

  const densityVolume =
    input.model === 'bullet'
      ? bulletMl
      : input.model === 'compare'
        ? input.psaVolumeSource === 'bullet'
          ? bulletMl
          : ellipsoidMl
        : ellipsoidMl;

  let density: number | null = null;
  if (input.psaDensityOpen && psaVal != null && !errors.psa) {
    density = psaDensity(psaVal, densityVolume);
  }

  return {
    errors,
    result: {
      ellipsoidMl,
      bulletMl,
      primaryMl,
      formattedPrimary: formatVolume(primaryMl, input.volumeUnit),
      formattedEllipsoid: formatVolume(ellipsoidMl, input.volumeUnit),
      formattedBullet: formatVolume(bulletMl, input.volumeUnit),
      psaDensity: density,
      formattedPsaDensity: density == null ? null : formatDensity(density),
      disclaimer:
        'Educational ultrasound/MRI prostate volume worksheet — not a diagnosis.',
    },
  };
}
