/**
 * Karvonen target heart rate — educational (ADR-018).
 *
 * Heart rate reserve:
 *   HRR = MHR − RHR
 *
 * Target heart rate (Karvonen):
 *   THR = RHR + (intensity/100) × HRR
 *
 * When maximum HR is unknown (Fox / classic teaching estimate used by Omni):
 *   MHR = 220 − age
 *
 * Fixture: RHR 60, MHR 180, intensity 70% → HRR 120, THR 144.
 */

import type { KarvonenInput, KarvonenResult } from './types';

export const SOURCE_NOTE =
  'THR = RHR + (intensity/100) × (MHR − RHR). HRR = MHR − RHR. Unknown MHR uses Fox estimate MHR = 220 − age. Educational only.';

export const DISCLAIMER =
  'Not an exercise prescription, stress-test result, or medical device — interpret intensity targets with a qualified clinician or coach.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Fox age-predicted maximum heart rate (bpm). */
export function foxMaximumHr(ageYears: number): number {
  return 220 - ageYears;
}

export function heartRateReserve(maximumHr: number, restingHr: number): number {
  return maximumHr - restingHr;
}

export function karvonenTargetHr(
  restingHr: number,
  maximumHr: number,
  intensityPercent: number,
): number {
  const reserve = heartRateReserve(maximumHr, restingHr);
  return restingHr + (intensityPercent / 100) * reserve;
}

/** Round bpm for display — one decimal when needed, else integer-looking. */
export function formatBpm(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function emptyResult(partial?: Partial<KarvonenResult>): KarvonenResult {
  return {
    targetHrBpm: null,
    heartRateReserveBpm: null,
    maximumHrBpm: null,
    formattedTargetHr: '',
    formattedReserve: '',
    formattedMaximumHr: '',
    statusHeadline: 'Enter resting HR, maximum HR (or age), and intensity.',
    statusDetail:
      'Target heart rate uses the Karvonen formula on heart rate reserve.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateKarvonen(input: KarvonenInput): KarvonenResult {
  const resting = parseNumber(input.restingHrText);
  const intensity = parseNumber(input.intensityText);

  let maximum: number | null = null;
  if (input.knowMaxHr === 'yes') {
    maximum = parseNumber(input.maximumHrText);
  } else {
    const age = parseNumber(input.ageText);
    if (age !== null) {
      maximum = foxMaximumHr(age);
    }
  }

  if (resting === null || maximum === null || intensity === null) {
    return emptyResult({
      maximumHrBpm: maximum,
      formattedMaximumHr: maximum !== null ? formatBpm(maximum) : '',
      statusHeadline:
        input.knowMaxHr === 'no'
          ? 'Enter resting HR, age, and intensity.'
          : 'Enter resting HR, maximum HR, and intensity.',
      statusDetail:
        'Results appear when all required fields are valid and maximum HR is greater than resting HR.',
    });
  }

  if (!(maximum > resting)) {
    return emptyResult({
      maximumHrBpm: maximum,
      formattedMaximumHr: formatBpm(maximum),
      statusHeadline: 'Maximum HR must be greater than resting HR.',
      statusDetail: 'Heart rate reserve would otherwise be zero or negative.',
    });
  }

  const reserve = heartRateReserve(maximum, resting);
  const target = karvonenTargetHr(resting, maximum, intensity);

  if (!Number.isFinite(reserve) || !Number.isFinite(target)) {
    return emptyResult({
      maximumHrBpm: maximum,
      formattedMaximumHr: formatBpm(maximum),
      statusHeadline: 'Unable to compute Karvonen results.',
      statusDetail: 'Check that all heart-rate and intensity values are finite.',
    });
  }

  return {
    targetHrBpm: target,
    heartRateReserveBpm: reserve,
    maximumHrBpm: maximum,
    formattedTargetHr: formatBpm(target),
    formattedReserve: formatBpm(reserve),
    formattedMaximumHr: formatBpm(maximum),
    statusHeadline: 'Target heart rate and reserve computed.',
    statusDetail:
      input.knowMaxHr === 'no'
        ? 'Maximum HR estimated with Fox formula 220 − age.'
        : 'Maximum HR taken from your entered value.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
