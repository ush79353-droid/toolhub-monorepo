/**
 * Speed Calculator — SI core: meters, seconds, m/s.
 * v = d/t · d = v×t · t = d/v
 */

import type {
  DistanceUnit,
  SpeedComparisonRow,
  SpeedInput,
  SpeedResult,
  SpeedUnit,
  TimeUnit,
} from './types';
import {
  DISTANCE_UNIT_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
} from './types';

export const DISTANCE_TO_METERS: Record<DistanceUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
  nmi: 1852,
};

export const TIME_TO_SECONDS: Record<TimeUnit, number> = {
  ms: 0.001,
  s: 1,
  min: 60,
  h: 3600,
  d: 86400,
  wk: 604800,
};

export const SPEED_TO_METERS_PER_SECOND: Record<SpeedUnit, number> = {
  'm/s': 1,
  'km/h': 1 / 3.6,
  mph: 0.44704,
  'ft/s': 0.3048,
  kn: 1852 / 3600,
  'cm/s': 0.01,
  'm/min': 1 / 60,
  'km/s': 1000,
};

/** Approximate reference speeds (km/h) for comparison — illustrative only */
export const SPEED_REFERENCES: ReadonlyArray<{
  label: string;
  kmh: number;
  note?: string;
}> = [
  { label: 'Walking person', kmh: 5, note: 'approx.' },
  { label: 'Running person', kmh: 12, note: 'approx.' },
  { label: 'Cycling', kmh: 20, note: 'approx.' },
  { label: 'City car', kmh: 50, note: 'approx.' },
  { label: 'Highway car', kmh: 100, note: 'approx.' },
  { label: 'High-speed train', kmh: 300, note: 'approx.' },
  { label: 'Commercial airplane', kmh: 900, note: 'approx. cruise' },
  {
    label: 'Speed of sound (air ≈20°C)',
    kmh: 1235,
    note: 'approx.; depends on medium/temp',
  },
  {
    label: 'Speed of light (vacuum)',
    kmh: 1_079_252_848.8,
    note: 'c = 299,792,458 m/s',
  },
];

export function fmt(n: number, digits = 4): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  return (value * DISTANCE_TO_METERS[from]) / DISTANCE_TO_METERS[to];
}

export function convertTime(
  value: number,
  from: TimeUnit,
  to: TimeUnit,
): number {
  if (from === to) return value;
  return (value * TIME_TO_SECONDS[from]) / TIME_TO_SECONDS[to];
}

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  if (from === to) return value;
  const mps = value * SPEED_TO_METERS_PER_SECOND[from];
  return mps / SPEED_TO_METERS_PER_SECOND[to];
}

export function toMeters(value: number, unit: DistanceUnit): number {
  return value * DISTANCE_TO_METERS[unit];
}

export function fromMeters(meters: number, unit: DistanceUnit): number {
  return meters / DISTANCE_TO_METERS[unit];
}

export function toSeconds(value: number, unit: TimeUnit): number {
  return value * TIME_TO_SECONDS[unit];
}

export function fromSeconds(seconds: number, unit: TimeUnit): number {
  return seconds / TIME_TO_SECONDS[unit];
}

export function toMps(value: number, unit: SpeedUnit): number {
  return value * SPEED_TO_METERS_PER_SECOND[unit];
}

export function fromMps(mps: number, unit: SpeedUnit): number {
  return mps / SPEED_TO_METERS_PER_SECOND[unit];
}

export function calculateSpeed(distanceMeters: number, timeSeconds: number): number {
  return distanceMeters / timeSeconds;
}

export function calculateDistance(speedMps: number, timeSeconds: number): number {
  return speedMps * timeSeconds;
}

export function calculateTime(distanceMeters: number, speedMps: number): number {
  return distanceMeters / speedMps;
}

export function calculateAverageSpeed(
  totalDistanceMeters: number,
  totalTimeSeconds: number,
): number {
  return totalDistanceMeters / totalTimeSeconds;
}

export function calculateSpeedComparison(
  speedMps: number,
): SpeedComparisonRow[] {
  const speedKmh = fromMps(speedMps, 'km/h');
  return SPEED_REFERENCES.map((ref) => {
    if (ref.kmh === 0) {
      return {
        label: ref.label,
        referenceKmh: ref.kmh,
        ratio: null,
        ratioDisplay: '—',
        note: ref.note,
      };
    }
    const ratio = speedKmh / ref.kmh;
    let ratioDisplay: string;
    if (speedKmh === 0) {
      ratioDisplay = '0× (stationary)';
    } else if (ratio >= 1) {
      ratioDisplay = `${fmt(ratio, 2)}× faster`;
    } else {
      ratioDisplay = `${fmt(1 / ratio, 2)}× slower`;
    }
    return {
      label: ref.label,
      referenceKmh: ref.kmh,
      ratio,
      ratioDisplay,
      note: ref.note,
    };
  });
}

export function solveSpeedCalculator(input: {
  mode: 'speed' | 'distance' | 'time';
  distanceMeters: number | null;
  timeSeconds: number | null;
  speedMps: number | null;
}): {
  distanceMeters: number | null;
  timeSeconds: number | null;
  speedMps: number | null;
  undefinedReason: string | null;
} {
  const { mode } = input;
  let { distanceMeters: d, timeSeconds: t, speedMps: v } = input;
  let undefinedReason: string | null = null;

  if (mode === 'speed') {
    if (d != null && t != null) {
      if (t === 0) {
        if (d === 0) undefinedReason = 'Speed is indeterminate when distance and time are both zero.';
        else undefinedReason = 'Elapsed time must be greater than zero to calculate speed.';
        v = null;
      } else {
        v = calculateSpeed(d, t);
      }
    }
  } else if (mode === 'distance') {
    if (v != null && t != null) {
      d = calculateDistance(v, t);
    }
  } else if (mode === 'time') {
    if (d != null && v != null) {
      if (v === 0) {
        if (d === 0) undefinedReason = 'Time is indeterminate when distance and speed are both zero.';
        else undefinedReason = 'Speed must be greater than zero to calculate travel time for a positive distance.';
        t = null;
      } else {
        t = calculateTime(d, v);
      }
    }
  }

  return { distanceMeters: d, timeSeconds: t, speedMps: v, undefinedReason };
}

export function calculateSpeedFromInput(
  input: SpeedInput,
  parsed: {
    distance: number | null;
    time: number | null;
    speed: number | null;
  },
): SpeedResult {
  const dM =
    parsed.distance != null
      ? toMeters(parsed.distance, input.distanceUnit)
      : null;
  const tS =
    parsed.time != null ? toSeconds(parsed.time, input.timeUnit) : null;
  const vMps =
    parsed.speed != null ? toMps(parsed.speed, input.speedUnit) : null;

  const solved = solveSpeedCalculator({
    mode: input.calculationMode,
    distanceMeters: dM,
    timeSeconds: tS,
    speedMps: vMps,
  });

  const distVal =
    solved.distanceMeters != null
      ? fromMeters(solved.distanceMeters, input.distanceUnit)
      : null;
  const timeVal =
    solved.timeSeconds != null
      ? fromSeconds(solved.timeSeconds, input.timeUnit)
      : null;
  const speedVal =
    solved.speedMps != null
      ? fromMps(solved.speedMps, input.speedUnit)
      : null;

  const hasCore =
    distVal != null &&
    timeVal != null &&
    speedVal != null &&
    !solved.undefinedReason;

  const formulaSteps: string[] = [];
  if (hasCore) {
    if (input.calculationMode === 'speed') {
      formulaSteps.push(
        `Speed = Distance / Time = ${fmt(distVal!, 4)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]} / ${fmt(timeVal!, 4)} ${TIME_UNIT_LABELS[input.timeUnit]} = ${fmt(speedVal!, 4)} ${SPEED_UNIT_LABELS[input.speedUnit]}`,
      );
    } else if (input.calculationMode === 'distance') {
      formulaSteps.push(
        `Distance = Speed × Time = ${fmt(speedVal!, 4)} × ${fmt(timeVal!, 4)} = ${fmt(distVal!, 4)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`,
      );
    } else {
      formulaSteps.push(
        `Time = Distance / Speed = ${fmt(distVal!, 4)} / ${fmt(speedVal!, 4)} = ${fmt(timeVal!, 4)} ${TIME_UNIT_LABELS[input.timeUnit]}`,
      );
    }
  }

  let comparisons: SpeedComparisonRow[] | null = null;
  if (input.showCompare && solved.speedMps != null && Number.isFinite(solved.speedMps)) {
    comparisons = calculateSpeedComparison(solved.speedMps);
  }

  let averageSpeedMps: number | null = null;
  let averageSpeedDisplay: string | null = null;
  let totalDistanceDisplay: string | null = null;
  let totalTimeDisplay: string | null = null;

  if (input.showAverage) {
    let totalD = 0;
    let totalT = 0;
    let ok = true;
    for (const seg of input.segments) {
      const sd = Number(seg.distance.replace(/,/g, ''));
      const st = Number(seg.time.replace(/,/g, ''));
      if (
        !Number.isFinite(sd) ||
        !Number.isFinite(st) ||
        sd < 0 ||
        st <= 0 ||
        seg.distance.trim() === '' ||
        seg.time.trim() === ''
      ) {
        ok = false;
        break;
      }
      totalD += toMeters(sd, seg.distanceUnit);
      totalT += toSeconds(st, seg.timeUnit);
    }
    if (ok && totalT > 0 && input.segments.length > 0) {
      averageSpeedMps = calculateAverageSpeed(totalD, totalT);
      averageSpeedDisplay = `${fmt(fromMps(averageSpeedMps, input.speedUnit), 2)} ${SPEED_UNIT_LABELS[input.speedUnit]}`;
      totalDistanceDisplay = `${fmt(fromMeters(totalD, input.distanceUnit), 2)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`;
      totalTimeDisplay = `${fmt(fromSeconds(totalT, input.timeUnit), 2)} ${TIME_UNIT_LABELS[input.timeUnit]}`;
      formulaSteps.push(
        `Average speed = total distance / total time = ${averageSpeedDisplay}`,
      );
    }
  }

  let interpretation =
    'Average speed over the entered duration (scalar). Not velocity (no direction) and not instantaneous speed.';
  if (solved.undefinedReason) {
    interpretation = solved.undefinedReason;
  } else if (!hasCore && !averageSpeedDisplay) {
    interpretation =
      'Enter two known values and choose what to calculate (speed, distance, or time).';
  }

  return {
    calculationMode: input.calculationMode,
    distanceMeters: solved.distanceMeters,
    timeSeconds: solved.timeSeconds,
    speedMps: solved.speedMps,
    distanceValue: distVal,
    timeValue: timeVal,
    speedValue: speedVal,
    distanceDisplay:
      distVal != null
        ? `${fmt(distVal, 4)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`
        : null,
    timeDisplay:
      timeVal != null
        ? `${fmt(timeVal, 4)} ${TIME_UNIT_LABELS[input.timeUnit]}`
        : null,
    speedDisplay:
      speedVal != null
        ? `${fmt(speedVal, 4)} ${SPEED_UNIT_LABELS[input.speedUnit]}`
        : null,
    comparisons,
    averageSpeedMps,
    averageSpeedDisplay,
    totalDistanceDisplay,
    totalTimeDisplay,
    formulaSteps,
    interpretation,
  };
}
