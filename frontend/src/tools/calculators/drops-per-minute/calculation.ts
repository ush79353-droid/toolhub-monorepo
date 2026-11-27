/**
 * IV drops-per-minute (gtts/min) — educational (ADR-018).
 *
 * drops/min = (volume_mL × drop_factor_gtts_per_mL) / time_min
 * drops/h   = drops/min × 60
 * mL/h      = 60 × volume_mL / time_min
 *
 * Fixture: 100 mL / 60 min / factor 15 → 25 gtts/min, 1500 gtts/h, 100 mL/h.
 * Derived outputs use unrounded intermediate values.
 */

import type {
  DropsPerMinuteInput,
  DropsPerMinuteResult,
  TimeUnit,
  VolumeUnit,
} from './types';

export const SOURCE_NOTE =
  'Drops/min = (volume mL × drop factor gtts/mL) ÷ time minutes. Drops/h = drops/min × 60. Drip rate mL/h = 60 × volume_mL ÷ time_min. Educational IV worksheet only.';

export const DISCLAIMER =
  'Not a pump program or clinical order — verify with institutional protocols and a clinician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toMl(value: number, unit: VolumeUnit): number {
  return unit === 'L' ? value * 1000 : value;
}

export function fromMl(ml: number, unit: VolumeUnit): number {
  return unit === 'L' ? ml / 1000 : ml;
}

export function toMinutes(value: number, unit: TimeUnit): number {
  return unit === 'h' ? value * 60 : value;
}

export function fromMinutes(minutes: number, unit: TimeUnit): number {
  return unit === 'h' ? minutes / 60 : minutes;
}

export function dropsPerMinute(
  volumeMl: number,
  dropFactor: number,
  timeMin: number,
): number {
  return (volumeMl * dropFactor) / timeMin;
}

export function mlPerHour(volumeMl: number, timeMin: number): number {
  return (60 * volumeMl) / timeMin;
}

export function formatRate(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return String(Number(rounded.toFixed(4)));
}

function emptyResult(
  partial?: Partial<DropsPerMinuteResult>,
): DropsPerMinuteResult {
  return {
    dropsPerMinute: null,
    dropsPerHour: null,
    mlPerHour: null,
    formattedDropsPerMinute: '',
    formattedDropsPerHour: '',
    formattedMlPerHour: '',
    statusHeadline: 'Enter volume, time, and drop factor.',
    statusDetail: 'Results appear when time is greater than zero.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateDropsPerMinute(
  input: DropsPerMinuteInput,
): DropsPerMinuteResult {
  const volumeRaw = parseNumber(input.volumeText);
  const timeRaw = parseNumber(input.timeText);
  const factor = parseNumber(input.dropFactorText);

  if (volumeRaw === null || timeRaw === null || factor === null) {
    return emptyResult();
  }
  if (!(volumeRaw > 0) || !(factor > 0)) {
    return emptyResult({
      statusHeadline: 'Volume and drop factor must be greater than zero.',
      statusDetail: 'Check inputs and try again.',
    });
  }
  if (!(timeRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Time must be greater than zero.',
      statusDetail: 'Infusion duration cannot be zero.',
    });
  }

  const volumeMl = toMl(volumeRaw, input.volumeUnit);
  const timeMin = toMinutes(timeRaw, input.timeUnit);
  const dpm = dropsPerMinute(volumeMl, factor, timeMin);
  const dph = dpm * 60;
  const rate = mlPerHour(volumeMl, timeMin);

  if (![dpm, dph, rate].every(Number.isFinite)) {
    return emptyResult({
      statusHeadline: 'Unable to compute drip rates.',
      statusDetail: 'Result was non-finite.',
    });
  }

  return {
    dropsPerMinute: dpm,
    dropsPerHour: dph,
    mlPerHour: rate,
    formattedDropsPerMinute: formatRate(dpm),
    formattedDropsPerHour: formatRate(dph),
    formattedMlPerHour: formatRate(rate),
    statusHeadline: 'Drops per minute and drip rate computed.',
    statusDetail: 'Additional metrics use unrounded intermediate values.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
