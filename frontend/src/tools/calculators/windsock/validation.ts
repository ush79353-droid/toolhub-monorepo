import {
  calculateWindSpeedFromSegments,
  computeWindsockFromKnots,
  computeWindsockFromSegments,
  convertImperialToKnots,
  convertMetricToKnots,
  syncInputFromKnots,
} from './calculation';
import type {
  WindsockFieldErrors,
  WindsockInput,
  WindsockResult,
} from './types';
import { MAX_SEGMENTS } from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseInteger(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  if (!/^-?\d+$/.test(t)) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateWindsockInputs(input: WindsockInput): {
  errors: WindsockFieldErrors;
  result: WindsockResult | null;
  synced?: Partial<WindsockInput>;
} {
  const errors: WindsockFieldErrors = {};
  const source = input.calculationSource;

  if (source === 'segments') {
    const seg = parseInteger(input.segments);
    if (input.segments.trim() === '') {
      return { errors: { segments: 'Enter number of extended segments.' }, result: null };
    }
    if (seg == null) {
      errors.segments = 'Segment count must be a whole number.';
      return { errors, result: null };
    }
    if (seg < 0) {
      errors.segments = 'Segment count cannot be negative.';
      return { errors, result: null };
    }
    if (seg > MAX_SEGMENTS) {
      errors.segments = `Standard model supports at most ${MAX_SEGMENTS} segments.`;
      return { errors, result: null };
    }
    // Reject decimals that slipped past (e.g. "2.0" with parseInteger fails already)
    const result = computeWindsockFromSegments(seg);
    const knots = calculateWindSpeedFromSegments(seg);
    const synced = syncInputFromKnots(knots, {
      ...input,
      calculationSource: 'segments',
      segments: input.segments,
    });
    return { errors, result, synced };
  }

  let knots: number | null = null;

  if (source === 'knots') {
    knots = parseNumber(input.speedKnots);
    if (knots == null) {
      errors.speedKnots = 'Enter wind speed in knots.';
      return { errors, result: null };
    }
    if (knots < 0) {
      errors.speedKnots = 'Wind speed cannot be negative.';
      return { errors, result: null };
    }
  } else if (source === 'imperial') {
    const v = parseNumber(input.imperialSpeed);
    if (v == null) {
      errors.imperialSpeed = 'Enter imperial wind speed.';
      return { errors, result: null };
    }
    if (v < 0) {
      errors.imperialSpeed = 'Wind speed cannot be negative.';
      return { errors, result: null };
    }
    knots = convertImperialToKnots(v, input.imperialUnit);
  } else {
    const v = parseNumber(input.metricSpeed);
    if (v == null) {
      errors.metricSpeed = 'Enter metric wind speed.';
      return { errors, result: null };
    }
    if (v < 0) {
      errors.metricSpeed = 'Wind speed cannot be negative.';
      return { errors, result: null };
    }
    knots = convertMetricToKnots(v, input.metricUnit);
  }

  const result = computeWindsockFromKnots(knots);
  const synced = syncInputFromKnots(knots, {
    ...input,
    calculationSource: source,
    speedKnots: source === 'knots' ? input.speedKnots : undefined,
    imperialSpeed: source === 'imperial' ? input.imperialSpeed : undefined,
    metricSpeed: source === 'metric' ? input.metricSpeed : undefined,
  });

  return { errors, result, synced };
}
